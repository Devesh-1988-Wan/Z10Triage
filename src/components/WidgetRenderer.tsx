import React from 'react';
import { MetricCard } from './MetricCard';
import { BugChart } from './BugChart';
import { CustomerSupportTable } from './CustomerSupportTable';
import { DevelopmentPipeline } from './DevelopmentPipeline';
import { DataManagement } from './DataManagement';
import { SecurityInfrastructureUpdates } from './SecurityInfrastructureUpdates';
import { HeaderWidget } from './widgets/HeaderWidget';
import { InfoCardWidget } from './widgets/InfoCardWidget';
import { WidgetConfig, BugReport, CustomerSupportTicket, DevelopmentTicket, DashboardMetrics } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  };
}

const widgetRegistry = {
  MetricCard,
  BugChart,
  CustomerSupportTable,
  DevelopmentPipeline,
  DataManagement,
  SecurityInfrastructureUpdates,
  HeaderWidget,
  InfoCardWidget,
};

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config, data }) => {
  const { component, title, description, props, dataSource } = config;

  const Component = widgetRegistry[component];

  if (!Component) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Unknown widget type: {component}
        </AlertDescription>
      </Alert>
    );
  }

  // Pass the correct data to the widget based on the dataSource prop
  const widgetDataProps = dataSource ? { [dataSource]: data[dataSource] } : {};

  // For MetricCard, we render it directly as it's already a Card component.
  if (component === 'MetricCard' || component === 'HeaderWidget') {
    const metricValue = data.dashboardMetrics ? data.dashboardMetrics[props.valueKey as keyof DashboardMetrics] : props.value;
    const IconComponent = props.icon ? LucideIcons[props.icon as keyof typeof LucideIcons] : undefined;
    return (
      <Component
        title={title}
        value={metricValue || 0}
        change={props.change}
        icon={IconComponent}
        description={description}
        priority={props.priority}
        {...props}
      />
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Component {...props} {...widgetDataProps} />
      </CardContent>
    </Card>
  );
};