import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CounterWidgetProps {
  title: string;
  value: number | string;
  previousValue?: number;
  showTrend?: boolean;
  format?: 'number' | 'percentage' | 'currency';
  prefix?: string;
  suffix?: string;
  size?: 'small' | 'medium' | 'large';
}

export const CounterWidget: React.FC<CounterWidgetProps> = ({
  title,
  value,
  previousValue,
  showTrend = true,
  format = 'number',
  prefix = '',
  suffix = '',
  size = 'large'
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  const calculateTrend = () => {
    if (!showTrend || !previousValue || typeof value !== 'number') return null;
    
    const change = value - previousValue;
    const percentChange = (change / previousValue) * 100;
    
    return {
      change,
      percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const trend = calculateTrend();
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-critical" />;
      default:
        return <Minus className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-foreground';
    
    switch (trend.trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-critical';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className="h-full flex flex-col justify-center">
      <CardContent className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
        
        <div className={`font-bold ${sizeClasses[size]} ${getTrendColor()}`}>
          {prefix}{formatValue(value)}{suffix}
        </div>
        
        {trend && (
          <div className="flex items-center justify-center gap-2">
            {getTrendIcon()}
            <Badge 
              variant={trend.trend === 'up' ? 'default' : trend.trend === 'down' ? 'destructive' : 'secondary'}
              className="text-sm"
            >
              {trend.percentChange > 0 ? '+' : ''}{trend.percentChange.toFixed(1)}%
            </Badge>
          </div>
        )}
        
        {trend && (
          <p className="text-sm text-muted-foreground">
            {trend.change > 0 ? '+' : ''}{trend.change.toLocaleString()} from previous period
          </p>
        )}
      </CardContent>
    </Card>
  );
};