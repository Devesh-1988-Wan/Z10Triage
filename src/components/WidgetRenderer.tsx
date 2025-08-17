// src/components/WidgetRenderer.tsx
import React, { lazy, Suspense } from 'react';
import { WidgetConfig, BugReport, CustomerSupportTicket, DevelopmentTicket, DashboardMetrics } from '@/types/dashboard';
import { WidgetContent } from '@/types/widgetContent';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EditableText } from './EditableText';
import { Skeleton } from '@/components/ui/skeleton';
import { Bug, TrendingUp, Users, Clock, Shield, Zap } from 'lucide-react';

// Map string icon names to LucideReact components
const LucideIcons = { Bug, TrendingUp, Users, Clock, Shield, Zap };

// Lazy-loaded widget components
const MetricCard = lazy(() => import('./MetricCard').then(module => ({ default: module.MetricCard })));
const BugChart = lazy(() => import('./BugChart').then(module => ({ default: module.BugChart })));
const CustomerSupportTable = lazy(() => import('./CustomerSupportTable').then(module => ({ default: module.CustomerSupportTable })));
const DevelopmentPipeline = lazy(() => import('./DevelopmentPipeline').then(module => ({ default: module.DevelopmentPipeline })));
const ImageWidget = lazy(() => import('./widgets/ImageWidget').then(module => ({ default: module.ImageWidget })));
const ProgressWidget = lazy(() => import('./widgets/ProgressWidget').then(module => ({ default: module.ProgressWidget })));
const AnnouncementWidget = lazy(() => import('./widgets/AnnouncementWidget').then(module => ({ default: module.AnnouncementWidget })));
const StatsWidget = lazy(() => import('./widgets/StatsWidget').then(module => ({ default: module.StatsWidget })));
const SecurityUpdatesWidget = lazy(() => import('./widgets/SecurityUpdatesWidget').then(module => ({ default: module.SecurityUpdatesWidget })));
const SalesChart = lazy(() => import('./widgets/SalesChart').then(module => ({ default: module.SalesChart })));
const BarChartWidget = lazy(() => import('./widgets/charts/BarChart').then(module => ({ default: module.BarChartWidget })));
const LineChartWidget = lazy(() => import('./widgets/charts/LineChart').then(module => ({ default: module.LineChartWidget })));
const PieChartWidget = lazy(() => import('./widgets/charts/PieChart').then(module => ({ default: module.PieChartWidget })));
const HeatmapWidget = lazy(() => import('./widgets/charts/Heatmap').then(module => ({ default: module.HeatmapWidget })));
const TextWidget = lazy(() => import('./widgets/content/TextWidget').then(module => ({ default: module.TextWidget })));
const CounterWidget = lazy(() => import('./widgets/CounterWidget').then(module => ({ default: module.CounterWidget })));

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
    const widgetProps = {
      // Common props for many widgets
      title,
      description,
      ...props,
      // Data props
      data: data,
      bugReports: data.bugReports,
      customerTickets: data.customerTickets,
      developmentTickets: data.developmentTickets,
      dashboardMetrics: data.dashboardMetrics,
      widgetContent: data.widgetContent,
      // Chart-specific data props
      config: props.chartConfig,
    };

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
        return <div onClick={onClick} className="cursor-pointer h-full"><BugChart {...widgetProps} /></div>;
      case 'CustomerSupportTable':
        return <div onClick={onClick} className="cursor-pointer"><CustomerSupportTable {...widgetProps} /></div>;
      case 'DevelopmentPipeline':
        return <div onClick={onClick} className="cursor-pointer"><DevelopmentPipeline {...widgetProps} /></div>;
      case 'ImageWidget':
        return <div onClick={onClick} className="cursor-pointer"><ImageWidget {...widgetProps} /></div>;
      case 'ProgressWidget':
        return <div onClick={onClick} className="cursor-pointer"><ProgressWidget {...widgetProps} /></div>;
      case 'AnnouncementWidget':
        return <div onClick={onClick} className="cursor-pointer"><AnnouncementWidget {...widgetProps} /></div>;
      case 'StatsWidget':
        return <div onClick={onClick} className="cursor-pointer"><StatsWidget {...widgetProps} /></div>;
      case 'SecurityUpdatesWidget':
        return <div onClick={onClick} className="cursor-pointer"><SecurityUpdatesWidget /></div>;
      case 'SalesChart':
        return <SalesChart />;
      case 'BarChart':
        return <BarChartWidget {...widgetProps} />;
      case 'LineChart':
        return <LineChartWidget {...widgetProps} />;
      case 'PieChart':
        return <PieChartWidget {...widgetProps} />;
      case 'Heatmap':
        return <HeatmapWidget {...widgetProps} />;
      case 'TextWidget':
        return <TextWidget {...widgetProps} />;
      case 'CounterWidget':
        return <CounterWidget {...widgetProps} />;
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
    return (
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
            {renderWidgetContent()}
        </Suspense>
    );
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
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          {renderWidgetContent()}
        </Suspense>
      </CardContent>
    </Card>
  );
};