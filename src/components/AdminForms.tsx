import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, DashboardMetrics, WidgetContent } from '@/types/dashboard';

// Data Forms
import { BugReportForm } from './forms/BugReportForm';
import { CustomerSupportForm } from './forms/CustomerSupportForm';
import { DevelopmentTicketForm } from './forms/DevelopmentTicketForm';
import { DashboardMetricsForm } from './forms/DashboardMetricsForm';
import { ContentManager } from './ContentManager';

// Admin Forms
import { AddUserForm } from './forms/AddUserForm';
import { CreateDashboardForm } from './forms/CreateDashboardForm';

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
  widgetContent,
  dashboardMetrics
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  
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

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Data & Admin Management
        </CardTitle>
        <CardDescription>
          Manage data, users, and dashboards from one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-7 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bug">Bugs</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="dev">Dev</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-8">
            <BugReportForm onDataUpdate={onDataUpdate} />
            <CustomerSupportForm onDataUpdate={onDataUpdate} />
            <DevelopmentTicketForm onDataUpdate={onDataUpdate} />
            {dashboardMetrics && <DashboardMetricsForm initialMetrics={dashboardMetrics} onDataUpdate={onDataUpdate} />}
            <ContentManager onContentUpdate={onDataUpdate} widgetContent={widgetContent} />
            <AddUserForm />
            <CreateDashboardForm onDashboardCreated={onDataUpdate} />
          </TabsContent>

          <TabsContent value="bug" className="mt-6">
            <BugReportForm onDataUpdate={onDataUpdate} />
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <CustomerSupportForm onDataUpdate={onDataUpdate} />
          </TabsContent>

          <TabsContent value="dev" className="mt-6">
            <DevelopmentTicketForm onDataUpdate={onDataUpdate} />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            {dashboardMetrics && <DashboardMetricsForm initialMetrics={dashboardMetrics} onDataUpdate={onDataUpdate} />}
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentManager onContentUpdate={onDataUpdate} widgetContent={widgetContent} />
          </TabsContent>

          <TabsContent value="admin" className="mt-6 space-y-8">
            <AddUserForm />
            <CreateDashboardForm onDashboardCreated={onDataUpdate} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};