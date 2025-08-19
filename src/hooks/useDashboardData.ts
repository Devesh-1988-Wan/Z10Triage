// src/hooks/useDashboardData.ts

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
        valueKey: 'totalBugsFixed',
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
        valueKey: 'totalTicketsResolved',
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
        valueKey: 'blockerBugs',
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
        valueKey: 'criticalBugs',
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
        valueKey: 'highPriorityBugs',
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
        valueKey: 'activeCustomerSupport',
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
      description: 'Webstore, DAM, Tenant issues',
      props: {
        valueKey: 'developmentProgress',
        icon: 'Zap',
        change: { value: '+2%', trend: 'up' },
      },
      layout: { x: 0, y: 7, w: 1, h: 1 },
    },
    {
      id: 'metric-performance',
      component: 'MetricCard',
      title: 'Performance',
      description: 'Cart checkout slowness',
      props: {
        valueKey: 'developmentProgress',
        icon: 'TrendingUp',
        priority: 'critical',
      },
      layout: { x: 1, y: 7, w: 1, h: 1 },
    },
    {
      id: 'metric-queries',
      component: 'MetricCard',
      title: 'Queries',
      description: 'Checkout & font issues',
      props: {
        valueKey: 'developmentProgress',
        icon: 'Bug',
        priority: 'medium',
      },
      layout: { x: 2, y: 7, w: 1, h: 1 },
    },
    {
      id: 'metric-look-feel',
      component: 'MetricCard',
      title: 'Look & Feel',
      description: 'UI & display issues',
      props: {
        valueKey: 'developmentProgress',
        icon: 'Shield',
        priority: 'low',
      },
      layout: { x: 3, y: 7, w: 1, h: 1 },
    },
    {
      id: 'data-management',
      component: 'DataManagement',
      title: 'Data Management',
      description: 'Create and manage bug reports, customer support tickets, and development tasks',
      props: {},
      layout: { x: 0, y: 8, w: 6, h: 2 },
    },
    {
      id: 'security-infrastructure-updates',
      component: 'SecurityInfrastructureUpdates',
      title: 'Security & Infrastructure Updates',
      description: 'Current security fixes and infrastructure progress',
      props: {},
      layout: { x: 0, y: 10, w: 6, h: 2 },
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
    // Prevent fetching if there's no user ID
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetches layout first to enable skeleton loading
      const { data: userLayout } = await supabase
        .from('dashboard_layout')
        .select('layout')
        .eq('user_id', user.id)
        .single();
      
      const currentLayout = (userLayout?.layout as unknown as DashboardLayout) ?? DEFAULT_DASHBOARD_LAYOUT;
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
        supabase.from('dashboard_metrics').select('*').order('created_at', { ascending: false }).limit(1).single()
      ]);

      if (bugReportsRes.error) throw bugReportsRes.error;
      if (customerTicketsRes.error) throw customerTicketsRes.error;
      if (developmentTicketsRes.error) throw developmentTicketsRes.error;
      if (securityFixesRes.error) throw securityFixesRes.error;
      if (metricsRes.error) throw metricsRes.error;
      
      setBugReports(bugReportsRes.data.map((report: any) => ({ ...report, createdAt: new Date(report.created_at), updatedAt: new Date(report.updated_at) })));
      setCustomerTickets(customerTicketsRes.data.map((ticket: any) => ({ ...ticket, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at) })));
      setDevelopmentTickets(developmentTicketsRes.data.map((ticket: any) => ({ ...ticket, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at) })));
      setSecurityFixes(securityFixesRes.data.map((fix: any) => ({ ...fix, createdAt: new Date(fix.created_at), updatedAt: new Date(fix.updated_at) })));
      setDashboardMetrics(metricsRes.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

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