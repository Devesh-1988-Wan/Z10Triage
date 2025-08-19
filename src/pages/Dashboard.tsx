// src/pages/dashboard.tsx

import { useDashboardData } from '@/hooks/useDashboardData';
import { DevelopmentPipeline } from '@/components/dashboard/DevelopmentPipeline';
import { BugChart } from '@/components/dashboard/BugChart'; // Placeholder
import { CustomerSupportTable } from '@/components/dashboard/CustomerSupportTable'; // Placeholder
import { MetricCard } from '@/components/dashboard/MetricCard'; // Placeholder
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// A mapping from the layout config to the actual React components
const widgetComponentMap = {
  DevelopmentPipeline,
  BugChart,
  CustomerSupportTable,
  MetricCard,
};

const DashboardPage = () => {
  const { dashboardLayout, isLoading, error, ...data } = useDashboardData();

  if (error) {
    return <div className="text-destructive text-center p-8">{error}</div>;
  }

  // Use the layout to render a skeleton grid while data is loading.
  // This provides an excellent perceived performance.
  if (isLoading || !dashboardLayout) {
    // You might want a different loading state if dashboardLayout is null
    const layout = dashboardLayout ?? { widgets: Array(10).fill({ id: Math.random() }) };
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
    <main className="dashboard-grid p-4">
      {dashboardLayout.widgets.map((widgetConfig) => {
        const WidgetComponent = widgetComponentMap[widgetConfig.component];
        if (!WidgetComponent) {
          return <div key={widgetConfig.id}>Unknown widget type</div>;
        }
        
        // Pass the relevant data to each component
        const componentProps = {
            developmentTickets: data.developmentTickets,
            bugReports: data.bugReports,
            customerTickets: data.customerTickets,
            metrics: data.dashboardMetrics,
            ...widgetConfig.props // Pass props from layout config
        };

        return (
          <div key={widgetConfig.id} style={{ gridColumn: `span ${widgetConfig.layout.w}`, gridRow: `span ${widgetConfig.layout.h}` }}>
             <WidgetComponent {...componentProps} />
          </div>
        );
      })}
    </main>
  );
};

export default DashboardPage;