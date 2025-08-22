import React from 'react';
import { DashboardEditor as DashboardEditorComponent } from '@/components/DashboardBuilder/DashboardEditor';
import { Header } from '@/components/Header';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Loader2 } from 'lucide-react';

export const DashboardEditor: React.FC = () => {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // useRequireAuth will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard Editor" />
      <DashboardEditorComponent />
    </div>
  );
};