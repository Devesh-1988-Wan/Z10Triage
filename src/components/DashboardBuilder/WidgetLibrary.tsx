import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart, PieChart, TrendingUp, Grid, Type, Image, FileText, Calendar, Users, Bug, Shield, Activity } from 'lucide-react';

export interface WidgetTemplate {
  id: string;
  name: string;
  category: 'charts' | 'content' | 'metrics' | 'tables' | 'specialized';
  icon: React.ComponentType<any>;
  description: string;
  defaultProps: any;
  component: string;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  // Charts
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    category: 'charts',
    icon: BarChart3,
    description: 'Compare values across categories',
    component: 'BarChart',
    defaultProps: { chartType: 'bar', dataSource: 'bugReports', groupBy: 'priority' }
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    category: 'charts',
    icon: LineChart,
    description: 'Show trends over time',
    component: 'LineChart',
    defaultProps: { chartType: 'line', dataSource: 'bugReports', timeField: 'createdAt' }
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    category: 'charts',
    icon: PieChart,
    description: 'Show proportional distribution',
    component: 'PieChart',
    defaultProps: { chartType: 'pie', dataSource: 'customerTickets', groupBy: 'status' }
  },
  {
    id: 'trend-chart',
    name: 'Trend Chart',
    category: 'charts',
    icon: TrendingUp,
    description: 'Display trending data with indicators',
    component: 'TrendChart',
    defaultProps: { chartType: 'trend', dataSource: 'dashboardMetrics' }
  },
  {
    id: 'heatmap',
    name: 'Heatmap',
    category: 'charts',
    icon: Grid,
    description: 'Visualize data density and patterns',
    component: 'Heatmap',
    defaultProps: { chartType: 'heatmap', dataSource: 'bugReports' }
  },
  
  // Content Widgets
  {
    id: 'text-block',
    name: 'Text Block',
    category: 'content',
    icon: Type,
    description: 'Rich text content with formatting',
    component: 'TextWidget',
    defaultProps: { content: 'Enter your text here...', allowRichText: true }
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    category: 'content',
    icon: Image,
    description: 'Display images with captions',
    component: 'ImageWidget',
    defaultProps: { layout: 'gallery', allowUpload: true }
  },
  {
    id: 'notes',
    name: 'Rich Notes',
    category: 'content',
    icon: FileText,
    description: 'Collaborative notes with markdown',
    component: 'NotesWidget',
    defaultProps: { markdown: true, collaborative: true }
  },
  
  // Metrics & Tables
  {
    id: 'counter',
    name: 'Counter',
    category: 'metrics',
    icon: Activity,
    description: 'Large number display with trends',
    component: 'CounterWidget',
    defaultProps: { valueKey: 'totalBugsFixed', showTrend: true }
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'tables',
    icon: Grid,
    description: 'Filterable and sortable data table',
    component: 'DataTable',
    defaultProps: { dataSource: 'bugReports', pagination: true, filtering: true }
  },
  {
    id: 'defect-summary',
    name: 'Defect Summary',
    category: 'specialized',
    icon: Bug,
    description: 'Bug tracking and priority overview',
    component: 'DefectSummary',
    defaultProps: { dataSource: 'bugReports', groupBy: 'priority' }
  },
  
  // Existing widgets
  {
    id: 'metric-card',
    name: 'Metric Card',
    category: 'metrics',
    icon: Activity,
    description: 'Key performance indicator display',
    component: 'MetricCard',
    defaultProps: { valueKey: 'totalBugsFixed', icon: 'Bug' }
  },
  {
    id: 'customer-support',
    name: 'Support Tickets',
    category: 'tables',
    icon: Users,
    description: 'Customer support ticket overview',
    component: 'CustomerSupportTable',
    defaultProps: {}
  },
  {
    id: 'security-updates',
    name: 'Security Updates',
    category: 'specialized',
    icon: Shield,
    description: 'Security fixes and updates tracking',
    component: 'SecurityUpdatesWidget',
    defaultProps: {}
  }
];

interface WidgetLibraryProps {
  onWidgetSelect: (template: WidgetTemplate) => void;
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({
  onWidgetSelect,
  selectedCategory = 'all',
  onCategoryChange
}) => {
  const categories = ['all', 'charts', 'content', 'metrics', 'tables', 'specialized'];
  const filteredWidgets = selectedCategory === 'all' 
    ? WIDGET_TEMPLATES 
    : WIDGET_TEMPLATES.filter(w => w.category === selectedCategory);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Widget Library</CardTitle>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredWidgets.map(widget => {
          const IconComponent = widget.icon;
          return (
            <div
              key={widget.id}
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onWidgetSelect(widget)}
            >
              <IconComponent className="w-8 h-8 mr-3 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium">{widget.name}</h4>
                <p className="text-sm text-muted-foreground">{widget.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
