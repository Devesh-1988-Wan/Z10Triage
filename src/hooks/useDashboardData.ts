// src/hooks/useDashboardData.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, SecurityFix, DashboardMetrics, DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { WidgetContent } from '@/types/widgetContent';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = {
  widgets: [
    {
      id: 'metric-bugs-fixed',
      component: 'MetricCard',
      title: 'Bugs Fixed This Week',
      description: 'Marked as Dev Done',
      props: {
        valueKey: 'totalBugsFixed',
        icon: 'Bug',
        change: { value: '+18%', trend: 'up' },
      },
      layout: { x: 0, y: 0, w: 1, h: 1, i: 'metric-bugs-fixed' },
    },
    {
      id: 'metric-tickets-resolved',
      component: 'MetricCard',
      title: 'Total Tickets Resolved',
      description: 'Including Tasks/Stories/Bugs',
      props: {
        valueKey: 'totalTicketsResolved',
        icon: 'TrendingUp',
        change: { value: '+12%', trend: 'up' },
      },
      layout: { x: 1, y: 0, w: 1, h: 1, i: 'metric-tickets-resolved' },
    },
    {
      id: 'bug-chart',
      component: 'BugChart',
      title: 'Bug Priority Distribution',
      description: 'Current open bugs by priority level',
      props: {},
      layout: { x: 0, y: 1, w: 3, h: 2, i: 'bug-chart' },
    },
  ],
};

export const useDashboardData = (dashboardId?: string) => {
  const { user, isInitialized } = useAuth();
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [customerTickets, setCustomerTickets] = useState<CustomerSupportTicket[]>([]);
  const [developmentTickets, setDevelopmentTickets] = useState<DevelopmentTicket[]>([]);
  const [securityFixes, setSecurityFixes] = useState<SecurityFix[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout | null>(null);
  const [widgetContent, setWidgetContent] = useState<WidgetContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 20),
    to: new Date(),
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let currentLayout: DashboardLayout | null = null;
      let layoutQuery = supabase.from('dashboard_layout').select('layout, dashboard_name, dashboard_description');

      if (dashboardId && dashboardId !== 'new') {
        layoutQuery = layoutQuery.eq('id', dashboardId);
      } else if (user?.id) {
        layoutQuery = layoutQuery.eq('user_id', user.id);
      } else {
        layoutQuery = layoutQuery.eq('is_default', true);
      }

      const { data: layoutData, error: layoutError } = await layoutQuery.limit(1).single();

      if (layoutError && layoutError.code !== 'PGRST116') throw layoutError;
      
      if (layoutData) {
        const layoutJson = layoutData.layout as unknown as { widgets: WidgetConfig[] };
        currentLayout = {
            name: layoutData.dashboard_name || 'My Dashboard',
            description: layoutData.dashboard_description || '',
            widgets: (layoutJson.widgets || []).map(w => ({...w, layout: {...w.layout, i: w.id}}))
        };
      } else if (dashboardId === 'new') {
        currentLayout = { name: 'New Dashboard', description: '', widgets: [] };
      } else if (!layoutData && dashboardId) {
        setError("Dashboard not found.");
        setIsLoading(false);
        return;
      } else {
        currentLayout = {
          name: 'Default Dashboard',
          description: 'This is the default system dashboard.',
          ...DEFAULT_DASHBOARD_LAYOUT
      };
      }

      setDashboardLayout(currentLayout);

      const fromDate = dateRange?.from?.toISOString();
      const toDate = dateRange?.to?.toISOString();

      const [
        bugReportsRes,
        customerTicketsRes,
        developmentTicketsRes,
        securityFixesRes,
        metricsRes,
        widgetContentRes
      ] = await Promise.all([
        supabase.from('bug_reports').select('*').gte('created_at', fromDate).lte('created_at', toDate).order('created_at', { ascending: false }),
        supabase.from('customer_support_tickets').select('*').gte('created_at', fromDate).lte('created_at', toDate).order('created_at', { ascending: false }),
        supabase.from('development_tickets').select('*').gte('created_at', fromDate).lte('created_at', toDate).order('created_at', { ascending: false }),
        supabase.from('security_fixes').select('*').gte('created_at', fromDate).lte('created_at', toDate).order('created_at', { ascending: false }),
        supabase.from('dashboard_metrics').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('widget_content').select('*').order('created_at', { ascending: false })
      ]);

      if (bugReportsRes.error) throw bugReportsRes.error;
      if (customerTicketsRes.error) throw customerTicketsRes.error;
      if (developmentTicketsRes.error) throw developmentTicketsRes.error;
      if (securityFixesRes.error) throw securityFixesRes.error;
      if (metricsRes.error) throw metricsRes.error;
      if (widgetContentRes.error) throw widgetContentRes.error;

      setBugReports(bugReportsRes.data.map(bug => ({ ...bug, createdAt: new Date(bug.created_at), updatedAt: new Date(bug.updated_at) } as BugReport)));
      setCustomerTickets(customerTicketsRes.data.map(ticket => ({ ...ticket, customerName: ticket.customer_name, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at) } as CustomerSupportTicket)));
      setDevelopmentTickets(developmentTicketsRes.data.map(ticket => ({ ...ticket, requestedBy: ticket.requested_by, ticketId: ticket.ticket_id, estimatedHours: ticket.estimated_hours, actualHours: ticket.actual_hours, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at) } as DevelopmentTicket)));
      setSecurityFixes(securityFixesRes.data.map(fix => ({ ...fix, affectedSystems: fix.affected_systems, fixDescription: fix.fix_description, estimatedCompletion: fix.estimated_completion ? new Date(fix.estimated_completion) : undefined, createdAt: new Date(fix.created_at), updatedAt: new Date(fix.updated_at) } as SecurityFix)));
      setWidgetContent(widgetContentRes.data.map(content => ({ ...content, imageUrl: content.image_url, widgetType: content.widget_type, createdAt: new Date(content.created_at), updatedAt: new Date(content.updated_at) } as WidgetContent)));

      if (metricsRes.data.length > 0) {
        const metrics = metricsRes.data[0];
        setDashboardMetrics({
          id: metrics.id,
          totalBugsFixed: metrics.total_bugs_fixed,
          totalTicketsResolved: metrics.total_tickets_resolved,
          blockerBugs: metrics.blocker_bugs,
          criticalBugs: metrics.critical_bugs,
          highPriorityBugs: metrics.high_priority_bugs,
          activeCustomerSupport: metrics.active_customer_support,
          developmentProgress: metrics.development_progress
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, dashboardId, dateRange]);

  useEffect(() => {
    if (isInitialized) {
      fetchData();
    }
  }, [isInitialized, fetchData]);

  return {
    dashboardLayout,
    setDashboardLayout,
    bugReports,
    customerTickets,
    developmentTickets,
    securityFixes,
    dashboardMetrics,
    widgetContent,
    isLoading,
    error,
    refetch: fetchData,
    dateRange,
    setDateRange,
  };
};