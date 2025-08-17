import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, LayoutDashboard, AlertTriangle } from 'lucide-react';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardRecord {
  id: string;
  dashboard_name: string;
  dashboard_description: string | null;
  updated_at: string | null;
}

export const DashboardHub: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchDashboards = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('dashboard_layout')
      .select('id, dashboard_name, dashboard_description, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data ?? [];
  };

  const { data: dashboards = [], isLoading, error } = useQuery<DashboardRecord[], Error>({
    queryKey: ['dashboards', user?.id],
    queryFn: fetchDashboards,
    enabled: !!user,
  });

  const deleteDashboardMutation = useMutation({
    mutationFn: async (dashboardId: string) => {
      const { error } = await supabase.from('dashboard_layout').delete().eq('id', dashboardId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards', user?.id] });
      toast({
        title: "Dashboard Deleted",
        description: "The dashboard has been successfully removed.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error Deleting Dashboard",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCreateNewDashboard = () => {
    navigate('/dashboard/editor/new');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-2 text-lg font-medium">Failed to load dashboards</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        </div>
      );
    }
    
    if (dashboards.length > 0) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboards.map((dashboard) => (
            <Card key={dashboard.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{dashboard.dashboard_name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {dashboard.dashboard_description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground">
                    Last updated: {dashboard.updated_at
                      ? new Date(dashboard.updated_at).toLocaleDateString()
                      : "Unknown"}
                 </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button asChild>
                  <Link to={`/dashboard/${dashboard.id}`}>View Dashboard</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your dashboard.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteDashboardMutation.mutate(dashboard.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }
    
    return (
       <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
          <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Dashboards Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new dashboard.</p>
          <div className="mt-6">
            <Button onClick={handleCreateNewDashboard}>
              <Plus className="w-4 h-4 mr-2" />
              Create Dashboard
            </Button>
          </div>
        </div>
    );
  };
  
  return (
    <DashboardLayoutComponent title="Dashboard Hub" onExportPdf={() => {}}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Dashboards</h1>
          <p className="text-muted-foreground">
            Select a dashboard to view or create a new one to get started.
          </p>
        </div>
        <Button onClick={handleCreateNewDashboard}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Dashboard
        </Button>
      </div>
      {renderContent()}
    </DashboardLayoutComponent>
  );
};