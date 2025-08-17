import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AuthenticatedRoutes: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '100px auto' }}>
      <h1>Welcome to the Dashboard, {user.name}!</h1>
      <p>Your email is: {user.email}</p>
      <p>Your role is: {user.role}</p>
      <button onClick={logout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
};

export default AuthenticatedRoutes;