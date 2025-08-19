import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, DashboardMetrics } from '@/types/dashboard';
import { WidgetContent } from '@/types/widgetContent';
import { ContentManager } from '@/components/ContentManager';

interface AdminFormsProps {
  onDataUpdate: () => void;
  bugReports: BugReport[];
  customerTickets: CustomerSupportTicket[];
  developmentTickets: DevelopmentTicket[];
  widgetContent: WidgetContent[];
  dashboardMetrics: DashboardMetrics | null;
}

export const AdminForms: React.FC<AdminFormsProps> = ({ 
  onDataUpdate, 
  bugReports, 
  customerTickets, 
  developmentTickets,
  widgetContent,
  dashboardMetrics
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeForm, setActiveForm] = useState('bug');

  // Bug Report Form State
  const [bugForm, setBugForm] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    category: '',
    assignee: '',
    reporter: user?.name || ''
  });

  // Customer Support Form State
  const [supportForm, setSupportForm] = useState({
    customerName: '',
    area: '',
    priority: '',
    status: '',
    eta: '',
    description: '',
    assignee: ''
  });

  // Development Ticket Form State
  const [devForm, setDevForm] = useState({
    title: '',
    type: '',
    requestedBy: user?.name || '',
    ticketId: '',
    status: '',
    priority: '',
    estimatedHours: '',
    actualHours: '',
    assignee: ''
  });
  
  // Dashboard Metrics Form State
  const [metricsForm, setMetricsForm] = useState<DashboardMetrics | null>(dashboardMetrics);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Only administrators can access data management forms.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('bug_reports')
        .insert({
          title: bugForm.title,
          description: bugForm.description,
          priority: bugForm.priority,
          status: bugForm.status,
          category: bugForm.category,
          assignee: bugForm.assignee || null,
          reporter: bugForm.reporter
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bug report created successfully",
      });

      setBugForm({
        title: '',
        description: '',
        priority: '',
        status: '',
        category: '',
        assignee: '',
        reporter: user?.name || ''
      });

      onDataUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bug report",
        variant: "destructive"
      });
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('customer_support_tickets')
        .insert({
          customer_name: supportForm.customerName,
          area: supportForm.area,
          priority: supportForm.priority,
          status: supportForm.status,
          eta: supportForm.eta || null,
          description: supportForm.description,
          assignee: supportForm.assignee || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer support ticket created successfully",
      });

      setSupportForm({
        customerName: '',
        area: '',
        priority: '',
        status: '',
        eta: '',
        description: '',
        assignee: ''
      });

      onDataUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive"
      });
    }
  };

  const handleDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('development_tickets')
        .insert({
          title: devForm.title,
          type: devForm.type,
          requested_by: devForm.requestedBy,
          ticket_id: devForm.ticketId,
          status: devForm.status,
          priority: devForm.priority,
          estimated_hours: devForm.estimatedHours ? parseInt(devForm.estimatedHours) : null,
          actual_hours: devForm.actualHours ? parseInt(devForm.actualHours) : null,
          assignee: devForm.assignee || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Development ticket created successfully",
      });

      setDevForm({
        title: '',
        type: '',
        requestedBy: user?.name || '',
        ticketId: '',
        status: '',
        priority: '',
        estimatedHours: '',
        actualHours: '',
        assignee: ''
      });

      onDataUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create development ticket",
        variant: "destructive"
      });
    }
  };

  const handleMetricsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricsForm) return;

    try {
      const { error } = await supabase
        .from('dashboard_metrics')
        .update({
          total_bugs_fixed: metricsForm.totalBugsFixed,
          total_tickets_resolved: metricsForm.totalTicketsResolved,
          blocker_bugs: metricsForm.blockerBugs,
          critical_bugs: metricsForm.criticalBugs,
          high_priority_bugs: metricsForm.highPriorityBugs,
          active_customer_support: metricsForm.activeCustomerSupport,
          development_progress: metricsForm.developmentProgress
        })
        .eq('id', metricsForm.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dashboard metrics updated successfully",
      });

      onDataUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update dashboard metrics",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Create and manage bug reports, customer support tickets, and development tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeForm} onValueChange={setActiveForm}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="bug">Bug Reports</TabsTrigger>
            <TabsTrigger value="support">Customer Support</TabsTrigger>
            <TabsTrigger value="dev">Development</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="content">Content & Media</TabsTrigger>
          </TabsList>

          {/* Bug Report Form */}
          <TabsContent value="bug" className="mt-6">
            <form onSubmit={handleBugSubmit} className="space-y-4">
              {/* ... bug form fields ... */}
            </form>
          </TabsContent>

          {/* Customer Support Form */}
          <TabsContent value="support" className="mt-6">
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              {/* ... support form fields ... */}
            </form>
          </TabsContent>

          {/* Development Ticket Form */}
          <TabsContent value="dev" className="mt-6">
            <form onSubmit={handleDevSubmit} className="space-y-4">
              {/* ... dev form fields ... */}
            </form>
          </TabsContent>

          {/* Dashboard Metrics Form */}
          <TabsContent value="metrics" className="mt-6">
            {metricsForm && (
              <form onSubmit={handleMetricsSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalBugsFixed">Total Bugs Fixed</Label>
                    <Input
                      id="totalBugsFixed"
                      type="number"
                      value={metricsForm.totalBugsFixed}
                      onChange={(e) => setMetricsForm({ ...metricsForm, totalBugsFixed: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalTicketsResolved">Total Tickets Resolved</Label>
                    <Input
                      id="totalTicketsResolved"
                      type="number"
                      value={metricsForm.totalTicketsResolved}
                      onChange={(e) => setMetricsForm({ ...metricsForm, totalTicketsResolved: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blockerBugs">Blocker Bugs</Label>
                    <Input
                      id="blockerBugs"
                      type="number"
                      value={metricsForm.blockerBugs}
                      onChange={(e) => setMetricsForm({ ...metricsForm, blockerBugs: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="criticalBugs">Critical Bugs</Label>
                    <Input
                      id="criticalBugs"
                      type="number"
                      value={metricsForm.criticalBugs}
                      onChange={(e) => setMetricsForm({ ...metricsForm, criticalBugs: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highPriorityBugs">High Priority Bugs</Label>
                    <Input
                      id="highPriorityBugs"
                      type="number"
                      value={metricsForm.highPriorityBugs}
                      onChange={(e) => setMetricsForm({ ...metricsForm, highPriorityBugs: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activeCustomerSupport">Active Customer Support</Label>
                    <Input
                      id="activeCustomerSupport"
                      type="number"
                      value={metricsForm.activeCustomerSupport}
                      onChange={(e) => setMetricsForm({ ...metricsForm, activeCustomerSupport: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="developmentProgress">Development Progress (%)</Label>
                    <Input
                      id="developmentProgress"
                      type="number"
                      value={metricsForm.developmentProgress}
                      onChange={(e) => setMetricsForm({ ...metricsForm, developmentProgress: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Update Metrics
                </Button>
              </form>
            )}
          </TabsContent>

          {/* Content & Media Form */}
          <TabsContent value="content" className="mt-6">
            <ContentManager onContentUpdate={onDataUpdate} widgetContent={widgetContent} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};