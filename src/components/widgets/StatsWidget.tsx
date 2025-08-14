import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

interface StatsWidgetProps {
  title?: string;
  description?: string;
  statsData?: {
    period: string;
    resolved: number;
    created: number;
    efficiency: number;
  }[];
}

const pieData = [
  { name: 'Completed', value: 68, color: '#10b981' },
  { name: 'In Progress', value: 24, color: '#f59e0b' },
  { name: 'Pending', value: 8, color: '#6b7280' }
];

export const StatsWidget: React.FC<StatsWidgetProps> = ({ 
  title = "Performance Analytics", 
  description = "Detailed insights and metrics",
  statsData = [] 
}) => {
  const totalResolved = statsData.reduce((sum, week) => sum + week.resolved, 0);
  const totalCreated = statsData.reduce((sum, week) => sum + week.created, 0);
  const avgEfficiency = statsData.length > 0 ? Math.round(statsData.reduce((sum, week) => sum + week.efficiency, 0) / statsData.length) : 0;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-success">{totalResolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{totalCreated}</div>
              <div className="text-xs text-muted-foreground">Created</div>
            </div>
            <div className="text-center p-3 bg-warning/10 rounded-lg">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-warning">{avgEfficiency}%</div>
              <div className="text-xs text-muted-foreground">Efficiency</div>
            </div>
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <Zap className="w-6 h-6 mx-auto mb-2 text-accent-foreground" />
              <div className="text-2xl font-bold text-accent-foreground">{totalCreated > 0 ? Math.round((totalResolved / totalCreated) * 100) : 0}%</div>
              <div className="text-xs text-muted-foreground">Resolution Rate</div>
            </div>
          </div>

          {/* Weekly Trends */}
          <div>
            <h4 className="font-semibold mb-3">Weekly Trends</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData}>
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Bar dataKey="resolved" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="created" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-3">Status Distribution</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold mb-3">Legend</h4>
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {entry.value}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};