// src/hooks/useDashboardData.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, SecurityFix, DashboardMetrics, DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { WidgetContent } from '@/types/widgetContent';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

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

const fetchData = async (user, dashboardId, dateRange) => {
  let currentLayout: DashboardLayout | null = null;
  let layoutError: Error | null = null;

  try {
    let layoutQuery = supabase.from('dashboard_layout').select('layout, dashboard_name, dashboard_description');

    if (dashboardId && dashboardId !== 'new') {
      layoutQuery = layoutQuery.eq('id', dashboardId);
    } else if (user?.id) {
      layoutQuery = layoutQuery.eq('user_id', user.id);
    } else {
      layoutQuery = layoutQuery.eq('is_default', true);
    }

    const { data: layoutData, error } = await layoutQuery.limit(1).single();

    if (error && error.code !== 'PGRST116') throw error;
    
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
      layoutError = new Error("Dashboard not found.");
    } else {
      currentLayout = {
        name: 'Default Dashboard',
        description: 'This is the default system dashboard.',
        ...DEFAULT_DASHBOARD_LAYOUT
      };
    }
  } catch (err) {
    layoutError = err instanceof Error ? err : new Error('Failed to fetch layout');
  }
  
  if(layoutError) throw layoutError;

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
  
  const dashboardMetrics = metricsRes.data.length > 0 ? {
      id: metricsRes.data[0].id,
      totalBugsFixed: metricsRes.data[0].total_bugs_fixed,
      totalTicketsResolved: metricsRes.data[0].total_tickets_resolved,
      blockerBugs: metricsRes.data[0].blocker_bugs,
      criticalBugs: metricsRes.data[0].critical_bugs,
      highPriorityBugs: metricsRes.data[0].high_priority_bugs,
      activeCustomerSupport: metricsRes.data[0].active_customer_support,
      developmentProgress: metricsRes.data[0].development_progress
    } : null;

  return {
    dashboardLayout: currentLayout,
    bugReports: bugReportsRes.data.map(bug => ({ ...bug, createdAt: new Date(bug.created_at), updatedAt: new Date(bug.updated_at) } as BugReport)),
    customerTickets: customerTicketsRes.data.map(ticket => ({ ...ticket, customerName: ticket.customer_name, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at) } as CustomerSupportTicket)),
    developmentTickets: developmentTicketsRes.data.map(ticket => ({ ...ticket, requestedBy: ticket.requested_by, ticketId: ticket.ticket_id, estimatedHours: ticket.estimated_hours, actualHours: ticket.actual_hours, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at) } as DevelopmentTicket)),
    securityFixes: securityFixesRes.data.map(fix => ({ ...fix, affectedSystems: fix.affected_systems, fixDescription: fix.fix_description, estimatedCompletion: fix.estimated_completion ? new Date(fix.estimated_completion) : undefined, createdAt: new Date(fix.created_at), updatedAt: new Date(fix.updated_at) } as SecurityFix)),
    widgetContent: widgetContentRes.data.map(content => ({ ...content, imageUrl: content.image_url, widgetType: content.widget_type, createdAt: new Date(content.created_at), updatedAt: new Date(content.updated_at) } as WidgetContent)),
    dashboardMetrics,
  };
};

export const useDashboardData = (dashboardId?: string) => {
  const { user, isInitialized } = useAuth();
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 20),
    to: new Date(),
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardData', user?.id, dashboardId, dateRange],
    queryFn: () => fetchData(user, dashboardId, dateRange),
    enabled: isInitialized,
    onSuccess: (data) => {
      setDashboardLayout(data.dashboardLayout);
    }
  });

  return {
    dashboardLayout,
    setDashboardLayout,
    bugReports: data?.bugReports || [],
    customerTickets: data?.customerTickets || [],
    developmentTickets: data?.developmentTickets || [],
    securityFixes: data?.securityFixes || [],
    dashboardMetrics: data?.dashboardMetrics || null,
    widgetContent: data?.widgetContent || [],
    isLoading,
    error: error?.message || null,
    refetch,
    dateRange,
    setDateRange,
  };
};