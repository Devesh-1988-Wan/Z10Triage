import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

interface LoginFormProps {
  onSwitchToReset?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToReset }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome to Z10 Dashboard",
      });
    }
  };

  return (
    <Card className="shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Z10 Dashboard</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@z10.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {onSwitchToReset && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onSwitchToReset}
                className="text-sm text-primary hover:text-primary-glow transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>Demo Accounts:</strong></div>
              <div>Super Admin: superadmin@z10.com</div>
              <div>Admin: admin@z10.com</div>
              <div>Viewer: viewer@z10.com</div>
              <div>Password: password123</div>
            </div>
          </div>
        </CardContent>
    </Card>
  );
};