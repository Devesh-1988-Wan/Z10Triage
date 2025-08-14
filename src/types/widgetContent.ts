export interface WidgetContent {
  id: string;
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  widgetType: 'content' | 'image' | 'announcement' | 'progress' | 'stats';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}