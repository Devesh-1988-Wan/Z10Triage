import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { generatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Settings, Plus, LayoutTemplate } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData, DEFAULT_DASHBOARD_LAYOUT } from '@/hooks/useDashboardData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { Link, useNavigate } from 'react-router-dom';
import { AdminForms } from '@/components/AdminForms';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

export const Dashboard: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    dashboardLayout,
    bugReports,
    customerTickets,
    developmentTickets,
    dashboardMetrics,
    isLoading: isDataLoading,
    error,
    refetch,
  } = useDashboardData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSavingDefault, setIsSavingDefault] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const hasWidgets = dashboardLayout && dashboardLayout.widgets.length > 0;

  const handleExportPdf = async () => {
    try {
      await generatePDF('dashboard-content', 'z10-dashboard-report');
      toast({
        title: 'PDF Generated',
        description: 'Dashboard report has been downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLoadDefaultLayout = async () => {
    if (!user) return;
    setIsSavingDefault(true);
    try {
      const { data: existingLayout, error: fetchError } = await supabase
        .from('dashboard_layout')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows found
        throw fetchError;
      }

      if (existingLayout) {
        const { error: updateError } = await supabase
          .from('dashboard_layout')
          .update({ layout: DEFAULT_DASHBOARD_LAYOUT })
          .eq('id', existingLayout.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('dashboard_layout')
          .insert({ user_id: user.id, layout: DEFAULT_DASHBOARD_LAYOUT, is_default: false });
        if (insertError) throw insertError;
      }

      toast({
        title: "Default Layout Loaded",
        description: "The default widget layout has been applied to your dashboard.",
      });
      refetch(); // Refresh dashboard data to show the new layout
    } catch (error) {
      console.error("Error saving default layout:", error);
      toast({
        title: "Error",
        description: `Failed to load default layout: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsSavingDefault(false);
    }
  };

  if (isAuthLoading || isDataLoading) {
    return (
      <DashboardLayout onExportPdf={handleExportPdf}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout onExportPdf={handleExportPdf}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert variant="destructive" className="w-full max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load dashboard data. Please try again later.
              <br />
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onExportPdf={handleExportPdf}>
      <div id="dashboard-content" className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Z10 Updates - August 13, 2025
            </h1>
            <p className="text-muted-foreground">
              Development progress, bug tracking, and customer support overview
            </p>
          </div>
          {isAdmin && (
            <Button asChild variant="outline">
              <Link to="/dashboard/editor">
                <Settings className="w-4 h-4 mr-2" />
                Customize Dashboard
              </Link>
            </Button>
          )}
        </div>

        {/* Dynamic Widget Rendering */}
        {hasWidgets ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {dashboardLayout.widgets.map((widgetConfig) => (
              <div
                key={widgetConfig.id}
                className={cn(`col-span-${widgetConfig.layout.w}`)}
              >
                <WidgetRenderer
                  config={widgetConfig}
                  data={{
                    bugReports,
                    customerTickets,
                    developmentTickets,
                    dashboardMetrics,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="pt-6 text-center">
              {isAdmin ? (
                <div className="space-y-4 max-w-lg mx-auto py-8">
                  <LayoutTemplate className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h2 className="text-2xl font-semibold">Your Dashboard is Empty</h2>
                  <p className="text-muted-foreground">
                    You can start by creating a custom layout from scratch or by loading our recommended default layout.
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <Button asChild>
                      <Link to="/dashboard/editor">
                        <Plus className="w-4 h-4 mr-2" />
                        Start with a Blank Canvas
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={handleLoadDefaultLayout} disabled={isSavingDefault}>
                      {isSavingDefault ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Load Default Layout
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No widgets have been configured for this dashboard. Please contact an administrator.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Forms - Only show for admins */}
        {isAdmin && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Data Management
              </CardTitle>
              <CardDescription>
                Create and manage bug reports, customer support tickets, and development tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminForms
                onDataUpdate={refetch}
                bugReports={bugReports}
                customerTickets={customerTickets}
                developmentTickets={developmentTickets}
              />
            </CardContent>
          </Card>
        )}

        {/* Footer Information */}
        <div className="bg-gradient-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-3">Security & Infrastructure Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Security Fixes - In Progress</h4>
              <p className="text-muted-foreground">
                Customer reported vulnerabilities are being addressed with priority fixes.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Commerce Connector 2.0 - 96% Complete</h4>
              <p className="text-muted-foreground">
                CC2.0 integration completed with additional requirements implementation.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">GraphQL Phase III</h4>
              <p className="text-muted-foreground">
                Development on hold due to bandwidth. Training sessions continue (last session: Aug 20th).
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Hotfix Version 10.2.1.2</h4>
              <p className="text-muted-foreground">
                Planned for critical priority tenant tickets across multiple customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};