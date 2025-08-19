// src/pages/dashboard.tsx

import { useDashboardData } from '@/hooks/useDashboardData';
import { DevelopmentPipeline } from '@/components/DevelopmentPipeline';
import { BugChart } from '@/components/BugChart';
import { CustomerSupportTable } from '@/components/CustomerSupportTable';
import { MetricCard } from '@/components/MetricCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';


// A mapping from the layout config to the actual React components
const widgetComponentMap = {
  DevelopmentPipeline,
  BugChart,
  CustomerSupportTable,
  MetricCard,
};

const DashboardPage = () => {
  const { dashboardLayout, isLoading, error, refetch, bugReports, customerTickets, developmentTickets, dashboardMetrics } = useDashboardData();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (error) {
    return <div className="text-destructive text-center p-8">{error}</div>;
  }

  // Use the layout to render a skeleton grid while data is loading.
  // This provides an excellent perceived performance.
  if (isLoading || !dashboardLayout) {
    // You might want a different loading state if dashboardLayout is null
    const layout = dashboardLayout ?? { widgets: Array(10).fill({ id: Math.random(), layout: { w: 1, h: 1 } }) };
    return (
      <div className="dashboard-grid p-4">
        {layout.widgets.map((widget) => (
          <Card key={widget.id} className="p-4" style={{ gridColumn: `span ${widget.layout.w}`, gridRow: `span ${widget.layout.h}` }}>
            <Skeleton className="w-1/3 h-6 mb-2" />
            <Skeleton className="w-1/2 h-4 mb-4" />
            <Skeleton className="w-full h-32" />
          </Card>
        ))}
      </div>
    );
  }

  // Render the actual widgets with data once loading is complete
  return (
    <DashboardLayout onExportPdf={() => {}}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
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

export default DashboardPage;