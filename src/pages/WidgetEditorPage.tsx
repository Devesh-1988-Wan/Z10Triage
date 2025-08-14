// src/pages/WidgetEditorPage.tsx

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { WidgetEditor } from '@/components/Admin/WidgetEditor';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AdminForms } from '@/components/AdminForms';

export const WidgetEditorPage: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const {
    dashboardLayout,
    bugReports,
    customerTickets,
    developmentTickets,
    widgetContent,
    isLoading,
    error,
    refetch
  } = useDashboardData(dashboardId);

  const handleExportPdf = () => {
    // PDF export is handled on the main dashboard page
    alert("Please go to the main dashboard page to export to PDF.");
  };

  if (isLoading) {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard Editor
          </h1>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard Hub
            </Link>
          </Button>
        </div>
        <WidgetEditor
          currentLayout={dashboardLayout}
          onLayoutSave={refetch}
        />
        <div className="mt-8">
          <AdminForms
            onDataUpdate={refetch}
            bugReports={bugReports}
            customerTickets={customerTickets}
            developmentTickets={developmentTickets}
            widgetContent={widgetContent}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
