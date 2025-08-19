// src/hooks/useDashboardData.ts

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, SecurityFix, DashboardMetrics, DashboardLayout } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { DEFAULT_DASHBOARD_LAYOUT } from '@/config/dashboard'; // Moved default layout to a separate file for clarity

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
      
      // ... (all your data mapping logic remains the same)
      // For brevity, I'm omitting the large mapping blocks as they don't change.
      setBugReports(bugReportsRes.data.map(/* ... */));
      setCustomerTickets(customerTicketsRes.data.map(/* ... */));
      setDevelopmentTickets(developmentTicketsRes.data.map(/* ... */));
      setSecurityFixes(securityFixesRes.data.map(/* ... */));
      setDashboardMetrics(metricsRes.data /* map your metrics here */);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]); // ✅ CHANGED: Dependency is now user?.id. This is stable and prevents refetching on window focus.

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