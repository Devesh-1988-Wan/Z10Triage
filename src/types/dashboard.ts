export interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'viewer';
  name: string;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  priority: 'blocker' | 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'dev_done' | 'closed';
  category: 'functional' | 'usability' | 'performance' | 'security' | 'other';
  assignee?: string;
  reporter: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerSupportTicket {
  id: string;
  customerName: string;
  area: string;
  priority: 'blocker' | 'critical' | 'high' | 'medium' | 'low';
  status: 'live' | 'wip' | 'pending' | 'closed';
  eta?: string;
  description: string;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DevelopmentTicket {
  id: string;
  title: string;
  type: 'feature' | 'bug' | 'enhancement' | 'task';
  requestedBy: string;
  ticketId: string;
  status: 'not_started' | 'dev_inprogress' | 'code_review' | 'testing' | 'completed';
  priority: 'blocker' | 'critical' | 'high' | 'medium' | 'low';
  estimatedHours?: number;
  actualHours?: number;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalBugsFixed: number;
  totalTicketsResolved: number;
  blockerBugs: number;
  criticalBugs: number;
  highPriorityBugs: number;
  activeCustomerSupport: number;
  developmentProgress: number;
}

export interface SecurityFix {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'identified' | 'in_progress' | 'testing' | 'deployed';
  affectedSystems: string[];
  fixDescription: string;
  estimatedCompletion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// NEW: Define a type for a single widget's configuration
export interface WidgetConfig {
  id: string; // Unique ID for the widget instance
  component: 'MetricCard' | 'BugChart' | 'CustomerSupportTable' | 'DevelopmentPipeline'; // The React component name
  title: string; // Title for the widget
  description?: string; // Optional description
  props: Record<string, any>; // Props specific to the component
  layout: { x: number; y: number; w: number; h: number }; // Grid layout properties (x, y, width, height)
}

// NEW: Define the overall dashboard layout structure
export interface DashboardLayout {
  widgets: WidgetConfig[];
}
