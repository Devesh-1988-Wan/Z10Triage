import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon;
  description?: string;
  priority?: 'blocker' | 'critical' | 'high' | 'medium' | 'low';
}

const priorityColors = {
  blocker: 'bg-critical text-critical-foreground',
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-warning text-warning-foreground',
  medium: 'bg-primary text-primary-foreground',
  low: 'bg-muted text-muted-foreground'
};

const trendColors = {
  up: 'text-success',
  down: 'text-destructive',
  neutral: 'text-muted-foreground'
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  priority
}) => {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-primary" />
        )}
        {priority && (
          <Badge className={priorityColors[priority]}>
            {priority.toUpperCase()}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">
            {description}
          </p>
        )}
        {change && (
          <p className={`text-xs font-medium ${trendColors[change.trend]}`}>
            {change.trend === 'up' ? '↗' : change.trend === 'down' ? '↘' : '→'} {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};