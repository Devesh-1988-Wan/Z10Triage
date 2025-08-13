import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
// Remove specific widget imports:
// import { MetricCard } from '@/components/MetricCard';
// import { BugChart } from '@/components/BugChart';
// ... other imports

import { generatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AdminForms } from '@/components/AdminForms';
import { WidgetRenderer } from '@/components/WidgetRenderer'; // New Component

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    dashboardLayout, // Use the new layout data
    bugReports,
    customerTickets,
    developmentTickets,
    dashboardMetrics,
    isLoading,
    error,
    refetch
  } = useDashboardData();
  const { toast } = useToast();

  const handleExportPdf = async () => {
    // ... existing function
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (isLoading) {
    // ... existing loading state
  }

  if (error) {
    // ... existing error state
  }

  return (
    <DashboardLayout onExportPdf={handleExportPdf}>
      <div id="dashboard-content" className="space-y-6">
        {/* Header Section */}
        {/* ... existing header */}

        {/* Dynamic Widget Rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {dashboardLayout?.widgets.map((widgetConfig) => (
            <WidgetRenderer key={widgetConfig.id} config={widgetConfig} data={{
              bugReports,
              customerTickets,
              developmentTickets,
              dashboardMetrics
            }} />
          ))}
        </div>

        {/* ... existing sections */}

        {isAdmin && bugReports && customerTickets && developmentTickets && (
          <AdminForms
            onDataUpdate={refetch}
            bugReports={bugReports}
            customerTickets={customerTickets}
            developmentTickets={developmentTickets}
          />
        )}

        {/* Footer Information */}
        {/* ... existing footer */}
      </div>
    </DashboardLayout>
  );
};