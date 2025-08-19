import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig } from '@/types/dashboardBuilder';

interface PieChartWidgetProps {
  title: string;
  description?: string;
  data: any[];
  config: ChartConfig;
}

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({
  title,
  description,
  data,
  config
}) => {
  const processData = () => {
    if (!data || data.length === 0) return [];
    
    const groupField = config.xAxis || 'status';
    const grouped = data.reduce((acc, item) => {
      const key = item[groupField] || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const getColors = () => {
    const baseColors = {
      primary: ['hsl(var(--primary))', 'hsl(214 85% 65%)', 'hsl(214 70% 50%)', 'hsl(214 85% 75%)'],
      success: ['hsl(var(--success))', 'hsl(142 69% 58%)', 'hsl(142 69% 78%)', 'hsl(142 50% 40%)'],
      warning: ['hsl(var(--warning))', 'hsl(38 92% 70%)', 'hsl(38 92% 85%)', 'hsl(38 80% 60%)'],
      critical: ['hsl(var(--critical))', 'hsl(0 84% 70%)', 'hsl(0 84% 85%)', 'hsl(0 70% 50%)']
    };
    return baseColors[config.colorPalette] || baseColors.primary;
  };

  const chartData = processData();
  const colors = getColors();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};