// Add new type definitions in src/types/dashboard.ts
// for the dynamic widget configuration
export interface WidgetConfig {
  id: string;
  component: 'MetricCard' | 'BugChart' | 'CustomerSupportTable' | 'DevelopmentPipeline';
  props: Record<string, any>;
  layout: { x: number; y: number; w: number; h: number }; // Example layout props
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
}

// In src/hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, SecurityFix, DashboardMetrics, DashboardLayout } from '@/types/dashboard';

export const useDashboardData = () => {
  // Add state for the dynamic layout
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout | null>(null);

  const fetchData = async () => {
    // ... existing loading and error states

    try {
      // Fetch dynamic layout
      const { data: layoutData, error: layoutError } = await supabase
        .from('dashboard_layout')
        .select('layout')
        .or(`user_id.eq.${userId},is_default.eq.true`)
        .order('is_default', { ascending: false }) // Prioritize user-specific layout
        .limit(1)
        .single();

      if (layoutError) throw layoutError;

      setDashboardLayout(layoutData.layout as unknown as DashboardLayout);

      // ... existing data fetching for bugReports, customerTickets, etc.
    } catch (err) {
      // ... error handling
    } finally {
      // ... finally block
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    // Return the new layout state
    dashboardLayout,
    bugReports,
    customerTickets,
    developmentTickets,
    securityFixes,
    dashboardMetrics,
    isLoading,
    error,
    refetch: fetchData
  };
};