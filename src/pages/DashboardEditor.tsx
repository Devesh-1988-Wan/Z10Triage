import React from 'react';
import { DashboardEditor as DashboardEditorComponent } from '@/components/DashboardBuilder/DashboardEditor';
import { Header } from '@/components/Header';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Loader2 } from 'lucide-react';

/**
 * Page component for the dashboard editor.
 * This component handles authentication checks and renders the main editor component.
 */
export const DashboardEditor: React.FC = () => {
  const { user, isLoading } = useRequireAuth();

  // Display a loading spinner while checking authentication state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is not authenticated, useRequireAuth will handle the redirect.
  // Returning null here prevents a flash of content before redirection.
  if (!user) {
    return null;
  }

  // Render the dashboard editor once the user is authenticated
  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard Editor" />
      <DashboardEditorComponent />
    </div>
  );
};