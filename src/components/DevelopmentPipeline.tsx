import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DevelopmentTicket } from '@/types/dashboard';

const mockDevelopmentTickets: DevelopmentTicket[] = [
  {
    id: '1',
    title: 'Returns Implementation',
    type: 'feature',
    requestedBy: 'KleenRite',
    ticketId: 'Z10-16467',
    status: 'dev_inprogress',
    priority: 'high',
    estimatedHours: 40,
    actualHours: 24,
    assignee: 'Dev Team A',
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-13')
  },
  {
    id: '2',
    title: 'Refunds (Including Vouchers)',
    type: 'feature',
    requestedBy: 'KleenRite',
    ticketId: 'Z10-16467',
    status: 'dev_inprogress',
    priority: 'high',
    estimatedHours: 35,
    actualHours: 18,
    assignee: 'Dev Team B',
    createdAt: new Date('2024-08-02'),
    updatedAt: new Date('2024-08-12')
  },
  {
    id: '3',
    title: 'Recent Web Purchase Feature',
    type: 'feature',
    requestedBy: 'KleenRite',
    ticketId: 'Z10-19193',
    status: 'dev_inprogress',
    priority: 'medium',
    estimatedHours: 20,
    actualHours: 8,
    assignee: 'Dev Team C',
    createdAt: new Date('2024-08-03'),
    updatedAt: new Date('2024-08-11')
  },
  {
    id: '4',
    title: 'GraphQL Phase 3',
    type: 'enhancement',
    requestedBy: 'Internal',
    ticketId: 'Z10-GQL-03',
    status: 'code_review',
    priority: 'high',
    estimatedHours: 80,
    actualHours: 68,
    assignee: 'GraphQL Team',
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-08-10')
  }
];

const statusColors = {
  not_started: 'bg-muted text-muted-foreground',
  dev_inprogress: 'bg-warning text-warning-foreground',
  code_review: 'bg-primary text-primary-foreground',
  testing: 'bg-accent text-accent-foreground',
  completed: 'bg-success text-success-foreground'
};

const typeColors = {
  feature: 'bg-primary text-primary-foreground',
  bug: 'bg-destructive text-destructive-foreground',
  enhancement: 'bg-accent text-accent-foreground',
  task: 'bg-muted text-muted-foreground'
};

export const DevelopmentPipeline: React.FC = () => {
  const getProgressPercentage = (actual: number, estimated: number) => {
    return Math.min((actual / estimated) * 100, 100);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Development Pipeline - August Priorities</CardTitle>
        <CardDescription>38 tickets currently in development pipeline</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockDevelopmentTickets.map((ticket) => (
            <div key={ticket.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">{ticket.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Requested by: {ticket.requestedBy}</span>
                    <span>•</span>
                    <span>Ticket ID: {ticket.ticketId}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge className={typeColors[ticket.type]}>
                    {ticket.type.toUpperCase()}
                  </Badge>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              {ticket.estimatedHours && ticket.actualHours && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {ticket.actualHours}h / {ticket.estimatedHours}h</span>
                    <span>{Math.round(getProgressPercentage(ticket.actualHours, ticket.estimatedHours))}%</span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(ticket.actualHours, ticket.estimatedHours)} 
                    className="h-2"
                  />
                </div>
              )}
              
              {ticket.assignee && (
                <div className="text-sm text-muted-foreground">
                  Assignee: {ticket.assignee}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};