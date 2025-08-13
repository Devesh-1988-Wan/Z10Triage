import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CustomerSupportTicket } from '@/types/dashboard';

const mockSupportTickets: CustomerSupportTicket[] = [
  {
    id: '1',
    customerName: 'Etna',
    area: 'Hotfixes, Bugs & Features',
    priority: 'critical',
    status: 'live',
    eta: 'Live',
    description: 'Priority bug fixes are being done',
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-13')
  },
  {
    id: '2',
    customerName: 'Knox',
    area: 'Vulnerability Fixes & Performance',
    priority: 'critical',
    status: 'live',
    eta: 'Live',
    description: 'Priority 1 fixes & performance tickets',
    createdAt: new Date('2024-08-02'),
    updatedAt: new Date('2024-08-13')
  },
  {
    id: '3',
    customerName: 'KleenRite',
    area: 'Features & Bug Support',
    priority: 'high',
    status: 'wip',
    eta: 'WIP',
    description: 'Feature requests and priority tickets',
    createdAt: new Date('2024-08-03'),
    updatedAt: new Date('2024-08-12')
  },
  {
    id: '4',
    customerName: 'Luminos Labs',
    area: 'Hotfixes & Support',
    priority: 'high',
    status: 'wip',
    eta: 'WIP',
    description: 'Hotfixes for priority tickets',
    createdAt: new Date('2024-08-04'),
    updatedAt: new Date('2024-08-11')
  }
];

const priorityColors = {
  blocker: 'bg-critical text-critical-foreground',
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-warning text-warning-foreground',
  medium: 'bg-primary text-primary-foreground',
  low: 'bg-muted text-muted-foreground'
};

const statusColors = {
  live: 'bg-success text-success-foreground',
  wip: 'bg-warning text-warning-foreground',
  pending: 'bg-muted text-muted-foreground',
  closed: 'bg-muted text-muted-foreground'
};

interface CustomerSupportTableProps {
  customerTickets?: any[];
}

export const CustomerSupportTable: React.FC<CustomerSupportTableProps> = ({ customerTickets = [] }) => {
  const tickets = customerTickets.length > 0 ? customerTickets : mockSupportTickets;
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Customer Support - In Progress</CardTitle>
        <CardDescription>Active customer support tickets and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Support Area</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.customerName}</TableCell>
                <TableCell>{ticket.area}</TableCell>
                <TableCell>
                  <Badge className={priorityColors[ticket.priority]}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.eta}</TableCell>
                <TableCell className="max-w-xs truncate">{ticket.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};