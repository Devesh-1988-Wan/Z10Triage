import React from 'react';
import { MetricCard } from './MetricCard';
import { BugChart } from './BugChart';
import { CustomerSupportTable } from './CustomerSupportTable';
import { DevelopmentPipeline } from './DevelopmentPipeline';
import { WidgetConfig } from '@/types/dashboard';

interface WidgetRendererProps {
  config: WidgetConfig;
  data: any; // You can define a more specific type if needed
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config, data }) => {
  switch (config.component) {
    case 'MetricCard':
      return <MetricCard {...config.props} />;
    case 'BugChart':
      // Pass the relevant data down
      return <BugChart bugReports={data.bugReports} {...config.props} />;
    case 'CustomerSupportTable':
      return <CustomerSupportTable customerTickets={data.customerTickets} {...config.props} />;
    case 'DevelopmentPipeline':
      return <DevelopmentPipeline developmentTickets={data.developmentTickets} {...config.props} />;
    default:
      return null;
  }
};