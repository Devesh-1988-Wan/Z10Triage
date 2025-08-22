import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User as DashboardUser } from '@/types/dashboard';

interface AuthContextType {
  isLoading: boolean; // Changed from 'Loading' to 'isLoading' for consistency
  user: DashboardUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleUserSession = async (session: Session | null) => {
      if (!mounted) return;
      
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (mounted) {
            if (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
            } else {
              setUser({
                id: session.user.id,
                email: profile.email,
                role: profile.role as 'super_admin' | 'admin' | 'viewer',
                name: profile.name
              });
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          if (mounted) setUser(null);
        }
      } else {
        if (mounted) setUser(null);
      }
      
      if (mounted) setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.id);
      
      // Handle specific auth events
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
        setIsLoading(true);
      }
      
      await handleUserSession(session);
    });
    
    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          // If there's an error getting the session, try to refresh
          if (error.message.includes('refresh_token_not_found')) {
            console.log('Refresh token not found, clearing auth state');
            await supabase.auth.signOut();
          }
        }
        await handleUserSession(session);
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { name } }
    });
    setIsLoading(false);
    return { success: !error, error: error?.message };
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    return { success: !error, error: error?.message };
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};