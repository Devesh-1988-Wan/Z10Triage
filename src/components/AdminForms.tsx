import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BugReport, CustomerSupportTicket, DevelopmentTicket, DashboardMetrics, WidgetContent } from '@/types/dashboard';

import { BugReportForm } from './forms/BugReportForm';
import { CustomerSupportForm } from './forms/CustomerSupportForm';
import { DevelopmentTicketForm } from './forms/DevelopmentTicketForm';
import { DashboardMetricsForm } from './forms/DashboardMetricsForm';
import { ContentManager } from './ContentManager';

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
  const [activeTab, setActiveTab] = useState('bug');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(dashboardMetrics);

  useEffect(() => {
    setMetrics(dashboardMetrics);
  }, [dashboardMetrics]);
  
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
          Data Management
        </CardTitle>
        <CardDescription>
          Create and manage bug reports, customer support tickets, and development tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="bug">Bug Reports</TabsTrigger>
            <TabsTrigger value="support">Customer Support</TabsTrigger>
            <TabsTrigger value="dev">Development</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="content">Content & Media</TabsTrigger>
          </TabsList>

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
            {metrics && (
              <DashboardMetricsForm 
                initialMetrics={metrics} 
                onDataUpdate={onDataUpdate} 
              />
            )}
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentManager onContentUpdate={onDataUpdate} widgetContent={widgetContent} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};