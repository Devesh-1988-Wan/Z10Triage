// src/pages/Auth.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/LoginForm';
import { ResetPasswordForm } from '@/components/ResetPasswordForm';
import { SignupForm } from '@/components/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (user) {
      const fetchDashboards = async () => {
        const { data } = await supabase
          .from('dashboard_layout')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1);

        if (data && data.length > 0) {
          navigate(`/dashboard/${data[0].id}`);
        } else {
          navigate('/dashboard/');
        }
      };
      fetchDashboards();
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check for mode parameter (for password reset)
    const mode = searchParams.get('mode');
    if (mode === 'reset') {
      setActiveTab('reset');
    }
  }, [searchParams]);

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">Z10</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome to Z10 Dashboard</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Access your development progress dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onSwitchToReset={() => setActiveTab('reset')} />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
              <TabsContent value="reset">
                <ResetPasswordForm onBackToLogin={() => setActiveTab('login')} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;