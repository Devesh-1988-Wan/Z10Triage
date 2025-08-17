import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User as DashboardUser } from '@/types/dashboard';

interface AuthContextType {
  user: DashboardUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Debug log to monitor state changes from outside the useEffect
  console.log('[AuthProvider State]', { isLoading, isInitialized, user });

  useEffect(() => {
    const fetchAndSetUserProfile = async (supabaseUser: SupabaseUser) => {
      console.log('[Auth] Fetching profile for user:', supabaseUser.id);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();

        // This is the most important log for debugging the blank page issue
        console.log('[Auth] Profile fetch result:', { profile, error });

        if (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        } else if (profile) {
          console.log('[Auth] Profile found, setting user state.');
          setUser({
            id: profile.user_id,
            email: profile.email,
            role: profile.role as 'super_admin' | 'admin' | 'viewer',
            name: profile.name,
          });
        } else {
            console.warn('[Auth] Profile not found for user:', supabaseUser.id);
            setUser(null); // Explicitly set user to null if no profile found
        }
      } catch (err) {
        console.error('Unhandled error in fetchAndSetUserProfile:', err);
        setUser(null);
      }
    };

    const handleUserSession = async (session: Session | null) => {
      console.log('[Auth] Handling user session:', session ? 'Session exists' : 'No session');
      if (session?.user) {
        await fetchAndSetUserProfile(session.user);
      } else {
        setUser(null);
      }
      if (!isInitialized) {
        console.log('[Auth] Initializing app.');
        setIsInitialized(true);
      }
      console.log('[Auth] Setting isLoading to false.');
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[Auth] onAuthStateChange event: ${event}`);
      if (['SIGNED_IN', 'SIGNED_OUT'].includes(event)) {
        setIsLoading(true);
        await handleUserSession(session);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        await fetchAndSetUserProfile(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setIsLoading(false); // Turn off loading on error
    return { success: !error, error: error?.message };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { name } },
    });
    if (error) setIsLoading(false);
    return { success: !error, error: error?.message };
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
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
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, isLoading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};