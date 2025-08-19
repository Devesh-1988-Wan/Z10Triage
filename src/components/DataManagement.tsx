import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminForms } from '@/components/AdminForms';
import { BugReport, CustomerSupportTicket, DevelopmentTicket } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

interface DataManagementProps {
  bugReports: BugReport[];
  customerTickets: CustomerSupportTicket[];
  developmentTickets: DevelopmentTicket[];
  onDataUpdate: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  bugReports,
  customerTickets,
  developmentTickets,
  onDataUpdate
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (!isAdmin) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Administrative access required
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          Data Management
        </CardTitle>
        <CardDescription>
          Create and manage bug reports, customer support tickets, and development tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminForms
          onDataUpdate={onDataUpdate}
          bugReports={bugReports}
          customerTickets={customerTickets}
          developmentTickets={developmentTickets}
        />
      </CardContent>
    </Card>
  );
};