import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BugReport } from '@/types/dashboard';

const mockBugReports: BugReport[] = [
  {
    id: '1',
    title: 'Login form validation issue',
    description: 'Users can submit empty login forms',
    priority: 'high',
    status: 'open',
    category: 'functional',
    reporter: 'QA Team',
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-08-10')
  },
  {
    id: '2',
    title: 'Performance lag on dashboard',
    description: 'Dashboard takes too long to load with large datasets',
    priority: 'medium',
    status: 'in_progress',
    category: 'performance',
    reporter: 'Dev Team',
    createdAt: new Date('2024-08-09'),
    updatedAt: new Date('2024-08-12')
  },
  {
    id: '3',
    title: 'Security vulnerability in API',
    description: 'Potential SQL injection in user endpoints',
    priority: 'critical',
    status: 'dev_done',
    category: 'security',
    reporter: 'Security Team',
    createdAt: new Date('2024-08-08'),
    updatedAt: new Date('2024-08-11')
  }
];

interface BugChartProps {
  bugReports?: BugReport[];
}

export const BugChart: React.FC<BugChartProps> = ({ bugReports = [] }) => {
  const data = bugReports.length > 0 ? bugReports : mockBugReports;
  
  const bugPriorityData = Object.entries(
    data.reduce((acc, report) => {
      acc[report.priority] = (acc[report.priority] || 0) + 1;
      return acc;
    }, {} as Record<BugReport['priority'], number>)
  ).map(([name, value]) => ({
    name,
    value,
    color: (() => {
      switch (name) {
        case 'blocker': return 'hsl(var(--critical))';
        case 'critical': return 'hsl(var(--destructive))';
        case 'high': return 'hsl(var(--warning))';
        case 'medium': return 'hsl(var(--primary))';
        case 'low': return 'hsl(var(--muted))';
        default: return 'hsl(var(--muted))';
      }
    })(),
  }));

  const weeklyProgressData = [
    { week: 'Week 1', bugsFixed: 98, newBugs: 45 },
    { week: 'Week 2', bugsFixed: 125, newBugs: 67 },
    { week: 'Week 3', bugsFixed: 156, newBugs: 34 },
    { week: 'Week 4', bugsFixed: 189, newBugs: 89 },
    { week: 'Current', bugsFixed: 286, newBugs: 52 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Bug Priority Distribution</CardTitle>
          <CardDescription>Current open bugs by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bugPriorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bugPriorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Weekly Bug Resolution Trend</CardTitle>
          <CardDescription>Bugs fixed vs new bugs reported</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bugsFixed" fill="hsl(var(--success))" name="Bugs Fixed" />
              <Bar dataKey="newBugs" fill="hsl(var(--warning))" name="New Bugs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};