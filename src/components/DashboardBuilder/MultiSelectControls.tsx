import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlignLeft, AlignCenter, AlignRight, AlignHorizontalJustifyCenter, AlignEndVertical, Trash2, Palette, Move, Square } from 'lucide-react';
import { MultiSelectState } from '@/types/dashboardBuilder';

interface MultiSelectControlsProps {
  multiSelectState: MultiSelectState;
  onAlign: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onResize: (size: 'small' | 'medium' | 'large' | 'custom') => void;
  onStyleGroup: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export const MultiSelectControls: React.FC<MultiSelectControlsProps> = ({
  multiSelectState,
  onAlign,
  onResize,
  onStyleGroup,
  onDelete,
  onClearSelection
}) => {
  if (!multiSelectState.isActive || multiSelectState.selectedWidgets.length === 0) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="font-medium">
            {multiSelectState.selectedWidgets.length} widgets selected
          </Badge>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Align:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAlign('left')}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAlign('center')}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAlign('right')}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Vertical:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAlign('top')}
              title="Align Top"
            >
              <AlignHorizontalJustifyCenter className="w-4 h-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAlign('middle')}
              title="Align Middle"
            >
              <AlignEndVertical className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAlign('bottom')}
              title="Align Bottom"
            >
              <AlignHorizontalJustifyCenter className="w-4 h-4 rotate-90" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Size:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResize('small')}
              title="Small Size"
            >
              <Square className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResize('medium')}
              title="Medium Size"
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResize('large')}
              title="Large Size"
            >
              <Square className="w-5 h-5" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onStyleGroup}
            title="Style Selected"
          >
            <Palette className="w-4 h-4" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            title="Delete Selected"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            title="Clear Selection"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};