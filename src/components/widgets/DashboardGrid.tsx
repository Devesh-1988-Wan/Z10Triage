// src/components/widgets/DashboardGrid.tsx
import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { WidgetConfig } from '@/types/dashboard';
import { WidgetRenderer } from '../WidgetRenderer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ErrorBoundary } from './ErrorBoundary';
import { useDashboardStore } from '@/stores/dashboardStore';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  layout: WidgetConfig[];
  onLayoutChange: (layout: Layout[]) => void;
  isEditable: boolean;
  data: any;
  isLoading: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  layout,
  onLayoutChange,
  isEditable,
  data,
  isLoading,
}) => {
  const { selectedWidgets, toggleWidgetSelection } = useDashboardStore();

  const layouts = {
    lg: layout.map(w => ({ ...w.layout, i: w.id })),
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={(_, allLayouts) => onLayoutChange(allLayouts.lg)}
      isDraggable={isEditable}
      isResizable={isEditable}
    >
      {layout.map((widget) => (
        <div
          key={widget.id}
          className={`group ${selectedWidgets.includes(widget.id) ? 'outline-2 outline-dashed outline-primary' : ''}`}
          onClick={(e) => {
            if (isEditable && e.ctrlKey) {
              toggleWidgetSelection(widget.id);
            }
          }}
        >
          <ErrorBoundary>
            <WidgetRenderer
              config={widget}
              data={data}
              isLoading={isLoading}
              isEditable={isEditable}
            />
          </ErrorBoundary>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};