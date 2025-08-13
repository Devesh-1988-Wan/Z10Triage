import React from 'react';
import { MetricCard } from './MetricCard';
import { BugChart } from './BugChart';
import { CustomerSupportTable } from './CustomerSupportTable';
import { DevelopmentPipeline } from './DevelopmentPipeline';
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

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config, data }) => {
  const { component, title, description, props } = config;

  // Render a generic card wrapper for all widgets to maintain consistent styling
  // and provide a title/description from the widget config.
  const renderWidgetContent = () => {
    switch (component) {
      case 'MetricCard':
        // MetricCard requires specific data from dashboardMetrics
        const metricValue = data.dashboardMetrics ? data.dashboardMetrics[props.valueKey as keyof DashboardMetrics] : props.value;
        const IconComponent = props.icon ? LucideIcons[props.icon as keyof typeof LucideIcons] : undefined;
        return (
          <MetricCard
            title={title}
            value={metricValue || 0} // Use fetched value or default to 0
            change={props.change}
            icon={IconComponent}
            description={description}
            priority={props.priority}
          />
        );
      case 'BugChart':
        return <BugChart bugReports={data.bugReports} />;
      case 'CustomerSupportTable':
        return <CustomerSupportTable customerTickets={data.customerTickets} />;
      case 'DevelopmentPipeline':
        return <DevelopmentPipeline developmentTickets={data.developmentTickets} />;
      default:
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
  };

  // For MetricCard, we render it directly as it's already a Card component.
  // For other widgets, we wrap them in a Card to ensure consistent styling.
  if (component === 'MetricCard') {
    return renderWidgetContent();
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};
