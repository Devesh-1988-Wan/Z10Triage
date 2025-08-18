// src/pages/DashboardHub.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, AlertCircle, Share2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface DashboardListItem {
  id: string;
  dashboard_name: string;
  updated_at: string;
}

export const DashboardHub: React.FC = () => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const fetchDashboards = async () => {
        setIsLoading(true);
        setError(null);

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

  const handleShare = async (dashboardId: string) => {
    try {
      let { data: existingShare, error: fetchError } = await supabase
        .from('shared_dashboards')
        .select('public_url_key')
        .eq('dashboard_id', dashboardId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows found
        throw fetchError;
      }

      let shareKey = existingShare?.public_url_key;

      if (!shareKey) {
        shareKey = uuidv4();
        const { error: insertError } = await supabase
          .from('shared_dashboards')
          .insert({
            dashboard_id: dashboardId,
            public_url_key: shareKey,
            is_public: true,
          });
        if (insertError) throw insertError;
      }

      const shareUrl = `${window.location.origin}/public/dashboard/${shareKey}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share Link Copied!",
        description: "The public link to your dashboard has been copied to your clipboard.",
      });

    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Error",
        description: "Could not generate a share link for this dashboard.",
        variant: "destructive",
      });
    }
  };

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
              <Button variant="outline" size="icon" onClick={() => handleShare(dashboard.id)}>
                <Share2 className="h-4 w-4" />
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