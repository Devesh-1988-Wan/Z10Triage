// src/pages/PublicDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/types/dashboard';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useDashboardData } from '@/hooks/useDashboardData';

export const PublicDashboard: React.FC = () => {
  const { shareKey } = useParams<{ shareKey: string }>();
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    bugReports,
    customerTickets,
    developmentTickets,
    dashboardMetrics,
    widgetContent,
  } = useDashboardData();

  useEffect(() => {
    const fetchSharedDashboard = async () => {
      if (!shareKey) {
        setError("No share key provided.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('shared_dashboards')
        .select('dashboard_layout(layout)')
        .eq('public_url_key', shareKey)
        .single();

      if (error || !data) {
        setError('Dashboard not found or access denied.');
      } else {
        setLayout(data.dashboard_layout.layout as DashboardLayout);
      }
      setLoading(false);
    };

    fetchSharedDashboard();
  }, [shareKey]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (error || !layout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {layout.widgets.map((widgetConfig) => (
          <div key={widgetConfig.id} className={`col-span-${widgetConfig.layout.w}`}>
            <WidgetRenderer
              config={widgetConfig}
              data={{
                bugReports,
                customerTickets,
                developmentTickets,
                dashboardMetrics,
                widgetContent,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};