// src/components/WidgetDetailModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { WidgetConfig } from '@/types/dashboard';

interface WidgetDetailModalProps {
  widget: WidgetConfig | null;
  onOpenChange: (open: boolean) => void;
  data: any;
}

export const WidgetDetailModal: React.FC<WidgetDetailModalProps> = ({
  widget,
  onOpenChange,
  data,
}) => {
  if (!widget) return null;

  // This is a placeholder for detailed content.
  // In a real application, you would fetch more detailed data based on the widget type.
  const renderDetailContent = () => {
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  return (
    <Dialog open={!!widget} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{widget.title}</DialogTitle>
          <DialogDescription>{widget.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {renderDetailContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};