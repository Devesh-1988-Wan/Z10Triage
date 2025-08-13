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
import { BugReport, CustomerSupportTicket, DevelopmentTicket } from '@/types/dashboard';

interface AdminFormsProps {
  onDataUpdate: () => void;
  bugReports: BugReport[];
  customerTickets: CustomerSupportTicket[];
  developmentTickets: DevelopmentTicket[];
}

export const AdminForms: React.FC<AdminFormsProps> = ({ 
  onDataUpdate, 
  bugReports, 
  customerTickets, 
  developmentTickets 
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
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="bug">Bug Reports</TabsTrigger>
            <TabsTrigger value="support">Customer Support</TabsTrigger>
            <TabsTrigger value="dev">Development</TabsTrigger>
          </TabsList>

          <TabsContent value="bug" className="mt-6">
            <form onSubmit={handleBugSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bug-title">Title</Label>
                  <Input
                    id="bug-title"
                    value={bugForm.title}
                    onChange={(e) => setBugForm({...bugForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bug-reporter">Reporter</Label>
                  <Input
                    id="bug-reporter"
                    value={bugForm.reporter}
                    onChange={(e) => setBugForm({...bugForm, reporter: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bug-description">Description</Label>
                <Textarea
                  id="bug-description"
                  value={bugForm.description}
                  onChange={(e) => setBugForm({...bugForm, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={bugForm.priority} onValueChange={(value) => setBugForm({...bugForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blocker">Blocker</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={bugForm.status} onValueChange={(value) => setBugForm({...bugForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="dev_done">Dev Done</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={bugForm.category} onValueChange={(value) => setBugForm({...bugForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="functional">Functional</SelectItem>
                      <SelectItem value="usability">Usability</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bug-assignee">Assignee (optional)</Label>
                  <Input
                    id="bug-assignee"
                    value={bugForm.assignee}
                    onChange={(e) => setBugForm({...bugForm, assignee: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Bug Report
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="support-customer">Customer Name</Label>
                  <Input
                    id="support-customer"
                    value={supportForm.customerName}
                    onChange={(e) => setSupportForm({...supportForm, customerName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-area">Support Area</Label>
                  <Input
                    id="support-area"
                    value={supportForm.area}
                    onChange={(e) => setSupportForm({...supportForm, area: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-description">Description</Label>
                <Textarea
                  id="support-description"
                  value={supportForm.description}
                  onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={supportForm.priority} onValueChange={(value) => setSupportForm({...supportForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blocker">Blocker</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={supportForm.status} onValueChange={(value) => setSupportForm({...supportForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="wip">WIP</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-eta">ETA</Label>
                  <Input
                    id="support-eta"
                    value={supportForm.eta}
                    onChange={(e) => setSupportForm({...supportForm, eta: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-assignee">Assignee (optional)</Label>
                <Input
                  id="support-assignee"
                  value={supportForm.assignee}
                  onChange={(e) => setSupportForm({...supportForm, assignee: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Support Ticket
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="dev" className="mt-6">
            <form onSubmit={handleDevSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dev-title">Title</Label>
                  <Input
                    id="dev-title"
                    value={devForm.title}
                    onChange={(e) => setDevForm({...devForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dev-ticket-id">Ticket ID</Label>
                  <Input
                    id="dev-ticket-id"
                    value={devForm.ticketId}
                    onChange={(e) => setDevForm({...devForm, ticketId: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={devForm.type} onValueChange={(value) => setDevForm({...devForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="enhancement">Enhancement</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dev-requested-by">Requested By</Label>
                  <Input
                    id="dev-requested-by"
                    value={devForm.requestedBy}
                    onChange={(e) => setDevForm({...devForm, requestedBy: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={devForm.priority} onValueChange={(value) => setDevForm({...devForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blocker">Blocker</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={devForm.status} onValueChange={(value) => setDevForm({...devForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="dev_inprogress">Dev In Progress</SelectItem>
                      <SelectItem value="code_review">Code Review</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dev-estimated">Estimated Hours</Label>
                  <Input
                    id="dev-estimated"
                    type="number"
                    value={devForm.estimatedHours}
                    onChange={(e) => setDevForm({...devForm, estimatedHours: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dev-actual">Actual Hours</Label>
                  <Input
                    id="dev-actual"
                    type="number"
                    value={devForm.actualHours}
                    onChange={(e) => setDevForm({...devForm, actualHours: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dev-assignee">Assignee</Label>
                  <Input
                    id="dev-assignee"
                    value={devForm.assignee}
                    onChange={(e) => setDevForm({...devForm, assignee: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Development Ticket
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};