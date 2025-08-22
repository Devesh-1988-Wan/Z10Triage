import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSessionHealth = () => {
  const { user, logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!user) return;

    const checkSessionHealth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session health check failed:', error.message);
          
          // If refresh token is not found, increment retry count
          if (error.message.includes('refresh_token_not_found')) {
            retryCountRef.current += 1;
            
            // After 3 failed attempts, log out the user
            if (retryCountRef.current >= 3) {
              console.log('Multiple session failures, logging out user');
              await logout();
              return;
            }
          }
        } else if (session) {
          // Reset retry count on successful session check
          retryCountRef.current = 0;
        }
      } catch (err) {
        console.error('Session health check error:', err);
      }
    };

    // Check session health every 5 minutes when user is active
    const startHealthCheck = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(checkSessionHealth, 5 * 60 * 1000); // 5 minutes
    };

    // Start health checks
    startHealthCheck();

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When tab becomes visible, check session immediately
        checkSessionHealth();
        startHealthCheck();
      } else {
        // Clear interval when tab is hidden to save resources
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    // Listen for focus events to ensure session is valid when user returns
    const handleFocus = () => {
      checkSessionHealth();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, logout]);
};