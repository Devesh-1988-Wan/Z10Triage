import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig } from '@/types/dashboardBuilder';
import { format, parseISO } from 'date-fns';

interface LineChartWidgetProps {
  title: string;
  description?: string;
  data: any[];
  config: ChartConfig;
}

export const LineChartWidget: React.FC<LineChartWidgetProps> = ({
  title,
  description,
  data,
  config
}) => {
  const processData = () => {
    if (!data || data.length === 0) return [];
    
    const timeField = config.xAxis || 'createdAt';
    const grouped = data.reduce((acc, item) => {
      const date = format(new Date(item[timeField]), 'MMM dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getLineColor = () => {
    switch (config.colorPalette) {
      case 'success': return 'hsl(var(--success))';
      case 'warning': return 'hsl(var(--warning))';
      case 'critical': return 'hsl(var(--critical))';
      default: return 'hsl(var(--primary))';
    }
  };

  const chartData = processData();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke={getLineColor()}
              strokeWidth={3}
              dot={{ fill: getLineColor(), strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: getLineColor(), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};