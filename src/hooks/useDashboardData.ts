import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, SecurityFix, DashboardMetrics } from '@/types/dashboard';

export const useDashboardData = () => {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [customerTickets, setCustomerTickets] = useState<CustomerSupportTicket[]>([]);
  const [developmentTickets, setDevelopmentTickets] = useState<DevelopmentTicket[]>([]);
  const [securityFixes, setSecurityFixes] = useState<SecurityFix[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
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
    fetchData();
  }, []);

  return {
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