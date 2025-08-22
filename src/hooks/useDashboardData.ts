import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, SecurityFix, DashboardMetrics, DashboardLayout } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

// Default dashboard layout if no custom layout is found
export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = {
  widgets: [
    {
      id: 'metric-bugs-fixed',
      component: 'MetricCard',
      title: 'Bugs Fixed This Week',
      description: 'Marked as Dev Done',
      props: { valueKey: 'totalBugsFixed', icon: 'Bug', change: { value: '+18%', trend: 'up' } },
      layout: { x: 0, y: 0, w: 1, h: 1 },
    },
    {
      id: 'metric-tickets-resolved',
      component: 'MetricCard',
      title: 'Total Tickets Resolved',
      description: 'Including Tasks/Stories/Bugs',
      props: { valueKey: 'totalTicketsResolved', icon: 'TrendingUp', change: { value: '+12%', trend: 'up' } },
      layout: { x: 1, y: 0, w: 1, h: 1 },
    },
    {
      id: 'metric-blocker-bugs',
      component: 'MetricCard',
      title: 'Blocker Bugs',
      description: 'Highest priority issues',
      props: { valueKey: 'blockerBugs', icon: 'Shield', priority: 'blocker' },
      layout: { x: 2, y: 0, w: 1, h: 1 },
    },
    // ... other default widgets
  ],
};

const DATA_FETCH_LIMIT = 100; // Limit for paginated queries

export const useDashboardData = () => {
  const { user } = useAuth();
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [customerTickets, setCustomerTickets] = useState<CustomerSupportTicket[]>([]);
  const [developmentTickets, setDevelopmentTickets] = useState<DevelopmentTicket[]>([]);
  const [securityFixes, setSecurityFixes] = useState<SecurityFix[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch layout first
      try {
        let currentLayout: DashboardLayout | null = null;
        if (user?.id) {
          const { data: userLayout } = await supabase
            .from('dashboard_layout')
            .select('layout')
            .eq('user_id', user.id)
            .single();
          if (userLayout) {
            currentLayout = userLayout.layout as unknown as DashboardLayout;
          }
        }
        if (!currentLayout) {
          const { data: defaultLayout } = await supabase
            .from('dashboard_layout')
            .select('layout')
            .eq('is_default', true)
            .single();
          currentLayout = defaultLayout?.layout as unknown as DashboardLayout || DEFAULT_DASHBOARD_LAYOUT;
        }
        setDashboardLayout(currentLayout);
      } catch (layoutError) {
        console.error("Failed to fetch dashboard layout, falling back to default:", layoutError);
        setDashboardLayout(DEFAULT_DASHBOARD_LAYOUT);
      }
      
      // Fetch data with pagination
      const [
        bugReportsRes,
        customerTicketsRes,
        developmentTicketsRes,
        securityFixesRes,
        metricsRes
      ] = await Promise.all([
        supabase.from('bug_reports').select('*').order('created_at', { ascending: false }).limit(DATA_FETCH_LIMIT),
        supabase.from('customer_support_tickets').select('*').order('created_at', { ascending: false }).limit(DATA_FETCH_LIMIT),
        supabase.from('development_tickets').select('*').order('created_at', { ascending: false }).limit(DATA_FETCH_LIMIT),
        supabase.from('security_fixes').select('*').order('created_at', { ascending: false }).limit(DATA_FETCH_LIMIT),
        supabase.from('dashboard_metrics').select('*').order('created_at', { ascending: false }).limit(1).single()
      ]);

      if (bugReportsRes.error) throw bugReportsRes.error;
      if (customerTicketsRes.error) throw customerTicketsRes.error;
      if (developmentTicketsRes.error) throw developmentTicketsRes.error;
      if (securityFixesRes.error) throw securityFixesRes.error;
      if (metricsRes.error) throw metricsRes.error;

      setBugReports(bugReportsRes.data as BugReport[]);
      setCustomerTickets(customerTicketsRes.data as CustomerSupportTicket[]);
      setDevelopmentTickets(developmentTicketsRes.data as DevelopmentTicket[]);
      setSecurityFixes(securityFixesRes.data as SecurityFix[]);
      setDashboardMetrics(metricsRes.data as DashboardMetrics);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user !== undefined) {
      fetchData();
    }
  }, [user, fetchData]);

  return {
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