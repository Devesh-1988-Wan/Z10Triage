// src/components/widgets/DashboardGrid.tsx
import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { WidgetConfig } from '@/types/dashboard';
import { WidgetRenderer } from '../WidgetRenderer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ErrorBoundary } from './ErrorBoundary'; // Import the new ErrorBoundary component

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  layout: WidgetConfig[];
  onLayoutChange: (layout: Layout[]) => void;
  isDraggable: boolean;
  data: any;
  isLoading: boolean;
  onWidgetClick: (widget: WidgetConfig) => void;
  onUpdateWidget: (widget: WidgetConfig) => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  layout,
  onLayoutChange,
  isDraggable,
  data,
  isLoading,
  onWidgetClick,
  onUpdateWidget
}) => {
  const layouts = {
    lg: layout.map(w => ({ ...w.layout, i: w.id })),
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 6, md: 5, sm: 4, xs: 2, xxs: 1 }}
      rowHeight={150}
      onLayoutChange={(_, allLayouts) => onLayoutChange(allLayouts.lg)}
      isDraggable={isDraggable}
      isResizable={isDraggable}
    >
      {layout.map((widget) => (
        <div key={widget.id}>
          <ErrorBoundary>
            <WidgetRenderer
              config={widget}
              data={data}
              isLoading={isLoading}
              onClick={() => onWidgetClick(widget)}
              onUpdate={onUpdateWidget}
              isEditable={isDraggable}
            />
          </ErrorBoundary>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};