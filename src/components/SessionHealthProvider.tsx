import React, { useEffect } from 'react';
import { useSessionHealth } from '@/hooks/useSessionHealth';
import { useToast } from '@/hooks/use-toast';

interface SessionHealthProviderProps {
  children: React.ReactNode;
}

export const SessionHealthProvider: React.FC<SessionHealthProviderProps> = ({ children }) => {
  const { toast } = useToast();
  useSessionHealth();
  
  // Add global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Only show toast for auth-related errors to avoid spam
      if (event.reason?.message?.includes('auth') || event.reason?.message?.includes('session')) {
        toast({
          title: "Session Error",
          description: "There was an issue with your session. Please refresh the page.",
          variant: "destructive"
        });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, [toast]);
  
  return <>{children}</>;
};