// src/components/WidgetRenderer.tsx
import React, { lazy, Suspense, useState } from 'react';
import { WidgetConfig } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { WidgetDetailModal } from './WidgetDetailModal';
import { EditableText } from './EditableText';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Button } from '@/components/ui/button';
import { WidgetComments } from './WidgetComments';

// (Lazy-loaded components remain the same)

interface WidgetRendererProps {
  config: WidgetConfig;
  data: any;
  isLoading: boolean;
  isEditable: boolean;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config, data, isLoading, isEditable }) => {
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const { updateWidget } = useDashboardStore();

  const handleTitleSave = (newTitle: string) => {
    updateWidget({ ...config, title: newTitle });
  };

  const handleDescriptionSave = (newDescription: string) => {
    updateWidget({ ...config, description: newDescription });
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  const renderWidgetContent = () => {
    // ... (rest of the switch statement for rendering widgets)
  };

  return (
    <Card className="shadow-card h-full flex flex-col group/widget">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>
            <EditableText initialValue={config.title} onSave={handleTitleSave} isEditable={isEditable} />
          </CardTitle>
          {config.description && (
            <CardDescription>
              <EditableText initialValue={config.description} onSave={handleDescriptionSave} isEditable={isEditable} as="textarea" />
            </CardDescription>
          )}
        </div>
        <div className="opacity-0 group-hover/widget:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => setCommentsOpen(true)}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow" onClick={() => !isEditable && setDetailModalOpen(true)}>
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          {renderWidgetContent()}
        </Suspense>
      </CardContent>
      <WidgetDetailModal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)} widget={config} data={data} />
      <WidgetComments isOpen={isCommentsOpen} onClose={() => setCommentsOpen(false)} widgetId={config.id} />
    </Card>
  );
};