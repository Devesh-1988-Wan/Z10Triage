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
    // --- Refactor #1: Extracted profile fetching logic into its own function ---
    const fetchAndSetUserProfile = async (supabaseUser: SupabaseUser) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setUser(null); // Clear user state on profile fetch error
        } else if (profile) {
          setUser({
            id: profile.user_id,
            email: profile.email,
            role: profile.role as 'super_admin' | 'admin' | 'viewer',
            name: profile.name,
          });
        }
      } catch (err) {
        console.error('Unhandled error fetching user profile:', err);
        setUser(null);
      }
    };

    const handleUserSession = async (session: Session | null) => {
      if (session?.user) {
        await fetchAndSetUserProfile(session.user);
      } else {
        setUser(null);
      }
      // This should run only once after the initial check is complete
      if (!isInitialized) {
        setIsInitialized(true);
      }
      setIsLoading(false);
    };

    // Check for an existing session on initial render
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    // Set up the listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsLoading(true);
        await handleUserSession(session);
      } else if (event === 'SIGNED_OUT') {
        setIsLoading(true);
        // handleUserSession will set user to null and isLoading to false
        await handleUserSession(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Refresh profile data without a loading spinner for a seamless experience
        await fetchAndSetUserProfile(session.user);
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Correctly using an empty dependency array

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    // isLoading will be set to false by the onAuthStateChange listener
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
    // isLoading will be set to false by the onAuthStateChange listener on error, or on success after email confirmation.
    if(error) setIsLoading(false);
    return { success: !error, error: error?.message };
  };

  // --- Refactor #2: Simplified logout to rely on the auth listener ---
  const logout = async (): Promise<void> => {
    setIsLoading(true); // Set loading for immediate UI feedback
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Ensure loading is turned off if the sign-out process fails
      setIsLoading(false);
    }
    // The 'SIGNED_OUT' event in onAuthStateChange will handle resetting user state.
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