import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ThresholdConfig } from '@/types/dashboardBuilder';

interface BarChartWidgetProps {
  title: string;
  description?: string;
  data: any[];
  config: ChartConfig;
  thresholds?: ThresholdConfig[];
}

export const BarChartWidget: React.FC<BarChartWidgetProps> = ({
  title,
  description,
  data,
  config,
  thresholds = []
}) => {
  const processData = () => {
    if (!data || data.length === 0) return [];
    
    const groupedData = data.reduce((acc, item) => {
      const key = config.xAxis ? item[config.xAxis] : item.priority || item.status || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([name, value]) => ({ name, value }));
  };

  const getBarColor = (value: number) => {
    for (const threshold of thresholds) {
      let condition = false;
      switch (threshold.operator) {
        case '>': condition = value > threshold.value; break;
        case '<': condition = value < threshold.value; break;
        case '>=': condition = value >= threshold.value; break;
        case '<=': condition = value <= threshold.value; break;
        case '==': condition = value === threshold.value; break;
      }
      if (condition) return threshold.color;
    }
    
    // Default colors based on palette
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
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(Number(entry.value))} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};