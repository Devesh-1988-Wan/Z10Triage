// src/types/dashboardBuilder.ts
import { DashboardLayout, WidgetConfig } from './dashboard';

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'trend' | 'heatmap';
  dataSource: string;
  xAxis?: string;
  yAxis?: string;
  colorPalette: 'default' | 'primary' | 'success' | 'warning' | 'critical';
  thresholds?: ThresholdConfig[];
}

export interface ThresholdConfig {
  value: number;
  color: string;
  operator: '>' | '<' | '>=' | '<=' | '==';
  condition: string;
}

export interface WidgetStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textColor?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export interface InteractivityConfig {
  filtering: boolean;
  drillDown: boolean;
  dynamicGrouping: boolean;
  clickActions?: ClickAction[];
}

export interface ClickAction {
  type: 'navigate' | 'filter' | 'modal' | 'custom';
  target?: string;
  parameters?: Record<string, any>;
}

export interface WidgetComment {
  id: string;
  widgetId: string;
  authorId: string;
  authorName: string;
  content: string;
  position: { x: number; y: number };
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardVersion {
  id: string;
  dashboardId: string;
  version: number;
  name: string;
  description?: string;
  layout: DashboardLayout;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface PublishingConfig {
  internal: {
    shareWithTeam: boolean;
    roleBasedAccess: string[];
    departments: string[];
  };
  external: {
    pdfExport: boolean;
    powerPointExport: boolean;
    embedUrl: boolean;
    publicLink: boolean;
  };
}

export interface LiveUpdateConfig {
  enabled: boolean;
  interval: number; // in seconds
  dataSources: string[];
  lastRefresh?: Date;
}

export interface EnhancedWidgetConfig extends WidgetConfig {
  chartConfig?: ChartConfig;
  style?: WidgetStyle;
  interactivity?: InteractivityConfig;
  comments?: WidgetComment[];
  liveUpdate?: LiveUpdateConfig;
}

export interface MultiSelectState {
  selectedWidgets: string[];
  isActive: boolean;
  groupAction?: 'align' | 'resize' | 'style' | 'delete';
}

export interface DashboardBuilderState {
  currentDashboard: DashboardLayout | null;
  selectedWidgets: string[];
  multiSelectMode: boolean;
  dragMode: 'move' | 'resize' | 'none';
  snapToGrid: boolean;
  gridSize: number;
  publishingConfig: PublishingConfig;
  versions: DashboardVersion[];
  currentVersion: number;
  liveUpdates: LiveUpdateConfig;
}