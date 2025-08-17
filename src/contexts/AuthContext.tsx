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

  useEffect(() => {
    const fetchAndSetUserProfile = async (supabaseUser: SupabaseUser | null) => {
      if (!supabaseUser) {
        setUser(null);
        setIsLoading(false);
        if (!isInitialized) setIsInitialized(true);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is not a fatal error
          console.error('Error fetching user profile:', error);
          setUser(null);
        } else if (profile) {
          setUser({
            id: profile.user_id,
            email: profile.email,
            role: profile.role as 'super_admin' | 'admin' | 'viewer',
            name: profile.name,
          });
        } else {
          // This case handles a logged-in user that doesn't have a profile yet.
          // You might want to redirect them to a profile creation page.
          console.warn('User is logged in but has no profile.');
          setUser(null);
        }
      } catch (err) {
        console.error('Unhandled error in fetchAndSetUserProfile:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
        if (!isInitialized) setIsInitialized(true);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      await fetchAndSetUserProfile(session?.user ?? null);
    });

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
        fetchAndSetUserProfile(session?.user ?? null);
    });


    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { name } },
    });
    setIsLoading(false);
    return { success: !error, error: error?.message };
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
    setIsLoading(false);
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