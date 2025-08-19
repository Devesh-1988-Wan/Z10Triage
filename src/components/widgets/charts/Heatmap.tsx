import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig } from '@/types/dashboardBuilder';

interface HeatmapProps {
  title: string;
  description?: string;
  data: any[];
  config: ChartConfig;
}

export const HeatmapWidget: React.FC<HeatmapProps> = ({
  title,
  description,
  data,
  config
}) => {
  const processData = () => {
    if (!data || data.length === 0) return [];
    
    // Create a 7x24 grid (days of week x hours)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmapData = [];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        heatmapData.push({
          day: days[day],
          hour,
          value: 0,
          dayIndex: day,
          hourIndex: hour
        });
      }
    }

    // Count occurrences per day/hour
    data.forEach(item => {
      const date = new Date(item.createdAt || item.created_at);
      const day = date.getDay();
      const hour = date.getHours();
      
      const index = day * 24 + hour;
      if (heatmapData[index]) {
        heatmapData[index].value++;
      }
    });

    return heatmapData;
  };

  const getIntensityColor = (value: number, maxValue: number) => {
    const intensity = maxValue > 0 ? value / maxValue : 0;
    
    switch (config.colorPalette) {
      case 'success':
        return `hsla(142, 76%, 36%, ${intensity})`;
      case 'warning':
        return `hsla(38, 92%, 50%, ${intensity})`;
      case 'critical':
        return `hsla(0, 84%, 60%, ${intensity})`;
      default:
        return `hsla(214, 98%, 48%, ${intensity})`;
    }
  };

  const heatmapData = processData();
  const maxValue = Math.max(...heatmapData.map(d => d.value));
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Activity by day and hour</div>
          
          {/* Hour labels */}
          <div className="flex">
            <div className="w-8"></div>
            {hours.filter((_, i) => i % 4 === 0).map(hour => (
              <div key={hour} className="flex-1 text-xs text-center text-muted-foreground">
                {hour}:00
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-1">
              <div className="w-8 text-xs text-muted-foreground">{day}</div>
              <div className="flex gap-px">
                {hours.map(hour => {
                  const dataPoint = heatmapData.find(
                    d => d.dayIndex === dayIndex && d.hourIndex === hour
                  );
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="w-3 h-3 rounded-sm border border-border hover:border-foreground transition-colors cursor-pointer"
                      style={{
                        backgroundColor: dataPoint 
                          ? getIntensityColor(dataPoint.value, maxValue)
                          : 'hsl(var(--muted))'
                      }}
                      title={`${day} ${hour}:00 - ${dataPoint?.value || 0} items`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <span>Less</span>
            <div className="flex gap-px">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map(intensity => (
                <div
                  key={intensity}
                  className="w-3 h-3 rounded-sm border border-border"
                  style={{
                    backgroundColor: getIntensityColor(intensity * maxValue, maxValue)
                  }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};