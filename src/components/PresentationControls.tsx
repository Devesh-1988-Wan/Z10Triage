// src/components/PresentationControls.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Expand, Shrink, SkipForward, Timer } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PresentationControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  interval: number;
  onIntervalChange: (interval: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  interval,
  onIntervalChange,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={onPlayPause}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button variant="outline" size="icon" onClick={onNext}>
        <SkipForward className="h-4 w-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Timer className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Autoplay Speed</h4>
              <p className="text-sm text-muted-foreground">
                Set the delay in seconds.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interval">Interval (seconds)</Label>
              <Input
                id="interval"
                type="number"
                value={interval}
                onChange={(e) => onIntervalChange(Number(e.target.value))}
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon" onClick={onToggleFullscreen}>
        {isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
      </Button>
    </div>
  );
};