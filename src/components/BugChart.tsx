import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const bugPriorityData = [
  { name: 'Blocker', value: 28, color: 'hsl(var(--critical))' },
  { name: 'Critical', value: 157, color: 'hsl(var(--destructive))' },
  { name: 'High', value: 466, color: 'hsl(var(--warning))' },
  { name: 'Medium', value: 234, color: 'hsl(var(--primary))' },
  { name: 'Low', value: 89, color: 'hsl(var(--muted))' }
];

const weeklyProgressData = [
  { week: 'Week 1', bugsFixed: 98, newBugs: 45 },
  { week: 'Week 2', bugsFixed: 125, newBugs: 67 },
  { week: 'Week 3', bugsFixed: 156, newBugs: 34 },
  { week: 'Week 4', bugsFixed: 189, newBugs: 89 },
  { week: 'Current', bugsFixed: 286, newBugs: 52 }
];

interface BugChartProps {
  bugReports?: any[];
}

export const BugChart: React.FC<BugChartProps> = ({ bugReports = [] }) => {
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