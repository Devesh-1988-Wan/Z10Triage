// src/components/WidgetRenderer.tsx
import React from 'react';
import { MetricCard } from './MetricCard';
import { BugChart } from './BugChart';
import { CustomerSupportTable } from './CustomerSupportTable';
import { DevelopmentPipeline } from './DevelopmentPipeline';
import { ImageWidget } from './widgets/ImageWidget';
import { ProgressWidget } from './widgets/ProgressWidget';
import { AnnouncementWidget } from './widgets/AnnouncementWidget';
import { StatsWidget } from './widgets/StatsWidget';
import { SecurityUpdatesWidget } from './widgets/SecurityUpdatesWidget';
import { SalesChart } from './widgets/SalesChart';
import { WidgetConfig, BugReport, CustomerSupportTicket, DevelopmentTicket, DashboardMetrics } from '@/types/dashboard';
import { WidgetContent } from '@/types/widgetContent';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EditableText } from './EditableText';
import { Skeleton } from '@/components/ui/skeleton';

// Map string icon names to LucideReact components
import { Bug, TrendingUp, Users, Clock, Shield, Zap } from 'lucide-react';
const LucideIcons = { Bug, TrendingUp, Users, Clock, Shield, Zap };

interface WidgetRendererProps {
  config: WidgetConfig;
  data: {
    bugReports: BugReport[];
    customerTickets: CustomerSupportTicket[];
    developmentTickets: DevelopmentTicket[];
    dashboardMetrics: DashboardMetrics | null;
    widgetContent: WidgetContent[];
  };
  isLoading: boolean;
  onClick: () => void;
  onUpdate: (widget: WidgetConfig) => void;
  isEditable: boolean;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config, data, isLoading, onClick, onUpdate, isEditable }) => {
  const { component, title, description, props } = config;

  const handleTitleSave = (newTitle: string) => {
    onUpdate({ ...config, title: newTitle });
  };

  const handleDescriptionSave = (newDescription: string) => {
    onUpdate({ ...config, description: newDescription });
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  const renderWidgetContent = () => {
    switch (component) {
      case 'MetricCard':
        const metricValue = data.dashboardMetrics ? data.dashboardMetrics[props.valueKey as keyof DashboardMetrics] : "N/A";
        const IconComponent = props.icon ? LucideIcons[props.icon as keyof typeof LucideIcons] : undefined;
        return (
          <div onClick={onClick} className="cursor-pointer">
            <MetricCard
              title={title}
              value={metricValue || 0}
              change={props.change}
              icon={IconComponent}
              description={description}
              priority={props.priority}
            />
          </div>
        );
      case 'BugChart':
        return <div onClick={onClick} className="cursor-pointer h-full"><BugChart bugReports={data.bugReports} /></div>;
      case 'CustomerSupportTable':
        return <div onClick={onClick} className="cursor-pointer"><CustomerSupportTable customerTickets={data.customerTickets} /></div>;
      case 'DevelopmentPipeline':
        return <div onClick={onClick} className="cursor-pointer"><DevelopmentPipeline developmentTickets={data.developmentTickets} /></div>;
      case 'ImageWidget':
        return <div onClick={onClick} className="cursor-pointer"><ImageWidget title={title} description={description} content={data.widgetContent} /></div>;
      case 'ProgressWidget':
        return <div onClick={onClick} className="cursor-pointer"><ProgressWidget title={title} description={description} /></div>;
      case 'AnnouncementWidget':
        return <div onClick={onClick} className="cursor-pointer"><AnnouncementWidget title={title} description={description} /></div>;
      case 'StatsWidget':
        return <div onClick={onClick} className="cursor-pointer"><StatsWidget title={title} description={description} /></div>;
      case 'SecurityUpdatesWidget':
        return <div onClick={onClick} className="cursor-pointer"><SecurityUpdatesWidget /></div>;
      case 'SalesChart':
        return <SalesChart />;
      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Unknown widget type: {component}</AlertDescription>
          </Alert>
        );
    }
  };

  if (component === 'MetricCard') {
    return renderWidgetContent();
  }

  return (
    <Card className="shadow-card h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <EditableText initialValue={title} onSave={handleTitleSave} isEditing={isEditable} />
        </CardTitle>
        {description && (
          <CardDescription>
            <EditableText initialValue={description} onSave={handleDescriptionSave} isEditing={isEditable} as="textarea" />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};