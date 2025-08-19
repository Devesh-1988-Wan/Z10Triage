import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { generatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { Link } from 'react-router-dom';
import { AdminForms } from '@/components/AdminForms';
import { cn } from '@/lib/utils';

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

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {dashboardLayout?.widgets.map((widgetConfig) => (
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
                onDataUpdate={refetch}
              />
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};