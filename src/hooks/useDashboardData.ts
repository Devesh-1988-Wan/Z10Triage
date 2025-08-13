import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, SecurityFix, DashboardMetrics, DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth to get user ID

// Default dashboard layout if no custom layout is found
export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = {
  widgets: [
    {
      id: 'metric-bugs-fixed',
      component: 'MetricCard',
      title: 'Bugs Fixed This Week',
      description: 'Marked as Dev Done',
      props: {
        icon: 'Bug',
        change: { value: '+18%', trend: 'up' },
      },
      layout: { x: 0, y: 0, w: 1, h: 1 },
    },
    {
      id: 'metric-tickets-resolved',
      component: 'MetricCard',
      title: 'Total Tickets Resolved',
      description: 'Including Tasks/Stories/Bugs',
      props: {
        icon: 'TrendingUp',
        change: { value: '+12%', trend: 'up' },
      },
      layout: { x: 1, y: 0, w: 1, h: 1 },
    },
    {
      id: 'metric-blocker-bugs',
      component: 'MetricCard',
      title: 'Blocker Bugs',
      description: 'Highest priority issues',
      props: {
        icon: 'Shield',
        priority: 'blocker',
      },
      layout: { x: 2, y: 0, w: 1, h: 1 },
    },
    {
      id: 'metric-critical-bugs',
      component: 'MetricCard',
      title: 'Critical Bugs',
      description: 'Requires immediate attention',
      props: {
        icon: 'Bug',
        priority: 'critical',
      },
      layout: { x: 3, y: 0, w: 1, h: 1 },
    },
    {
      id: 'metric-high-priority-bugs',
      component: 'MetricCard',
      title: 'High Priority Bugs',
      description: 'Important but not critical',
      props: {
        icon: 'Clock',
        priority: 'high',
      },
      layout: { x: 4, y: 0, w: 1, h: 1 },
    },
    {
      id: 'metric-active-customer-support',
      component: 'MetricCard',
      title: 'Active Customer Support',
      description: 'Live & WIP tickets',
      props: {
        icon: 'Users',
      },
      layout: { x: 5, y: 0, w: 1, h: 1 },
    },
    {
      id: 'bug-chart',
      component: 'BugChart',
      title: 'Bug Priority Distribution',
      description: 'Current open bugs by priority level',
      props: {},
      layout: { x: 0, y: 1, w: 3, h: 2 },
    },
    {
      id: 'customer-support-table',
      component: 'CustomerSupportTable',
      title: 'Customer Support - In Progress',
      description: 'Active customer support tickets and their status',
      props: {},
      layout: { x: 0, y: 3, w: 6, h: 2 },
    },
    {
      id: 'development-pipeline',
      component: 'DevelopmentPipeline',
      title: 'Development Pipeline - August Priorities',
      description: '38 tickets currently in development pipeline',
      props: {},
      layout: { x: 0, y: 5, w: 6, h: 2 },
    },
    {
      id: 'metric-functional-stability',
      component: 'MetricCard',
      title: 'Functional Stability',
      value: '91%',
      description: 'Webstore, DAM, Tenant issues',
      props: {
        icon: 'Zap',
        change: { value: '+2%', trend: 'up' },
      },
      layout: { x: 0, y: 7, w: 1, h: 1 },
    },
    {
      id: 'metric-performance',
      component: 'MetricCard',
      title: 'Performance',
      value: '4%',
      description: 'Cart checkout slowness',
      props: {
        icon: 'TrendingUp',
        priority: 'critical',
      },
      layout: { x: 1, y: 7, w: 1, h: 1 },
    },
    {
      id: 'metric-queries',
      component: 'MetricCard',
      title: 'Queries',
      value: '3%',
      description: 'Checkout & font issues',
      props: {
        icon: 'Bug',
        priority: 'medium',
      },
      layout: { x: 2, y: 7, w: 1, h: 1 },
    },
    {
      id: 'metric-look-feel',
      component: 'MetricCard',
      title: 'Look & Feel',
      value: '2%',
      description: 'UI & display issues',
      props: {
        icon: 'Shield',
        priority: 'low',
      },
      layout: { x: 3, y: 7, w: 1, h: 1 },
    },
  ],
};


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

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let currentLayout: DashboardLayout | null = null;
      let userLayoutFound = false;

      if (user?.id) {
        const { data: userLayout, error: userLayoutError } = await supabase
          .from('dashboard_layout')
          .select('layout')
          .eq('user_id', user.id)
          .limit(1);

        if (userLayout && userLayout.length > 0) {
          currentLayout = userLayout[0].layout as unknown as DashboardLayout;
          userLayoutFound = true;
        }
      }

      if (!userLayoutFound) {
        const { data: defaultLayout, error: defaultLayoutError } = await supabase
          .from('dashboard_layout')
          .select('layout')
          .eq('is_default', true)
          .limit(1);

        if (defaultLayout && defaultLayout.length > 0) {
          currentLayout = defaultLayout[0].layout as unknown as DashboardLayout;
        } else {
          // If no user-specific and no default layout in DB, we'll return an empty layout.
          // The Dashboard component will handle showing the options to the admin.
          currentLayout = { widgets: [] };
        }
      }
      
      setDashboardLayout(currentLayout);

      const [
        bugReportsRes,
        customerTicketsRes,
        developmentTicketsRes,
        securityFixesRes,
        metricsRes
      ] = await Promise.all([
        supabase.from('bug_reports').select('*').order('created_at', { ascending: false }),
        supabase.from('customer_support_tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('development_tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('security_fixes').select('*').order('created_at', { ascending: false }),
        supabase.from('dashboard_metrics').select('*').order('created_at', { ascending: false }).limit(1)
      ]);

      if (bugReportsRes.error) throw bugReportsRes.error;
      if (customerTicketsRes.error) throw customerTicketsRes.error;
      if (developmentTicketsRes.error) throw developmentTicketsRes.error;
      if (securityFixesRes.error) throw securityFixesRes.error;
      if (metricsRes.error) throw metricsRes.error;

      setBugReports(bugReportsRes.data.map(bug => ({
        id: bug.id,
        title: bug.title,
        description: bug.description,
        priority: bug.priority as 'blocker' | 'critical' | 'high' | 'medium' | 'low',
        status: bug.status as 'open' | 'in_progress' | 'dev_done' | 'closed',
        category: bug.category as 'functional' | 'usability' | 'performance' | 'security' | 'other',
        assignee: bug.assignee,
        reporter: bug.reporter,
        createdAt: new Date(bug.created_at),
        updatedAt: new Date(bug.updated_at)
      })));

      setCustomerTickets(customerTicketsRes.data.map(ticket => ({
        id: ticket.id,
        customerName: ticket.customer_name,
        area: ticket.area,
        priority: ticket.priority as 'blocker' | 'critical' | 'high' | 'medium' | 'low',
        status: ticket.status as 'live' | 'wip' | 'pending' | 'closed',
        eta: ticket.eta,
        description: ticket.description,
        assignee: ticket.assignee,
        createdAt: new Date(ticket.created_at),
        updatedAt: new Date(ticket.updated_at)
      })));

      setDevelopmentTickets(developmentTicketsRes.data.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        type: ticket.type as 'feature' | 'bug' | 'enhancement' | 'task',
        requestedBy: ticket.requested_by,
        ticketId: ticket.ticket_id,
        status: ticket.status as 'not_started' | 'dev_inprogress' | 'code_review' | 'testing' | 'completed',
        priority: ticket.priority as 'blocker' | 'critical' | 'high' | 'medium' | 'low',
        estimatedHours: ticket.estimated_hours,
        actualHours: ticket.actual_hours,
        assignee: ticket.assignee,
        createdAt: new Date(ticket.created_at),
        updatedAt: new Date(ticket.updated_at)
      })));

      setSecurityFixes(securityFixesRes.data.map(fix => ({
        id: fix.id,
        title: fix.title,
        severity: fix.severity as 'critical' | 'high' | 'medium' | 'low',
        status: fix.status as 'identified' | 'in_progress' | 'testing' | 'deployed',
        affectedSystems: fix.affected_systems,
        fixDescription: fix.fix_description,
        estimatedCompletion: fix.estimated_completion ? new Date(fix.estimated_completion) : undefined,
        createdAt: new Date(fix.created_at),
        updatedAt: new Date(fix.updated_at)
      })));

      if (metricsRes.data.length > 0) {
        const metrics = metricsRes.data[0];
        setDashboardMetrics({
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
  };

  useEffect(() => {
    if (user !== undefined) {
      fetchData();
    }
  }, [user]);

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