import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// This interface would need to be added to your types/dashboard.ts file
interface DashboardListItem {
  id: string;
  dashboard_name: string;
  updated_at: string;
}

export const DashboardHub: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchDashboards = async () => {
        setIsLoading(true);
        setError(null);

        // This query assumes you have updated the schema to allow multiple dashboards per user
        // and added a 'dashboard_name' column.
        const { data, error } = await supabase
          .from('dashboard_layout')
          .select('id, dashboard_name, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else if (data) {
          setDashboards(data as DashboardListItem[]);
        }
        setIsLoading(false);
      };
      fetchDashboards();
    }
  }, [user]);

  const handleExportPdf = () => {
    alert("Please select a dashboard to export.");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="w-full max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboards</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.id} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle>{dashboard.dashboard_name}</CardTitle>
              <CardDescription>
                Last updated: {new Date(dashboard.updated_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to={`/dashboard/${dashboard.id}`}>View</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to={`/dashboard/editor/${dashboard.id}`}>Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout onExportPdf={handleExportPdf}>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Your Dashboards
          </h1>
          <Button asChild>
            <Link to="/dashboard/editor/new">
              <Plus className="w-4 h-4 mr-2" />
              Create New Dashboard
            </Link>
          </Button>
        </div>
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};