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
<<<<<<< HEAD
        );
      })}
    </main>
=======
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
>>>>>>> parent of 73404c4 (update)
  );
};

export default DashboardPage;