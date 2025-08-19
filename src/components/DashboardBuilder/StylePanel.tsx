// src/components/DashboardBuilder/StylePanel.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WidgetStyle, ThresholdConfig } from '@/types/dashboardBuilder';
import { Plus, X } from 'lucide-react';

interface StylePanelProps {
  widgetId: string;
  currentStyle: WidgetStyle;
  onStyleChange: (style: WidgetStyle) => void;
  thresholds: ThresholdConfig[];
  onThresholdsChange: (thresholds: ThresholdConfig[]) => void;
}

export const StylePanel: React.FC<StylePanelProps> = ({
  widgetId,
  currentStyle,
  onStyleChange,
  thresholds,
  onThresholdsChange
}) => {
  const [localStyle, setLocalStyle] = useState<WidgetStyle>(currentStyle);
  const [localThresholds, setLocalThresholds] = useState<ThresholdConfig[]>(thresholds);

  const handleStyleUpdate = (key: keyof WidgetStyle, value: any) => {
    const newStyle = { ...localStyle, [key]: value };
    setLocalStyle(newStyle);
    onStyleChange(newStyle);
  };

  const addThreshold = () => {
    const newThreshold: ThresholdConfig = {
      value: 0,
      color: 'hsl(var(--warning))',
      operator: '>',
      condition: 'value > 0'
    };
    const newThresholds = [...localThresholds, newThreshold];
    setLocalThresholds(newThresholds);
    onThresholdsChange(newThresholds);
  };

  const removeThreshold = (index: number) => {
    const newThresholds = localThresholds.filter((_, i) => i !== index);
    setLocalThresholds(newThresholds);
    onThresholdsChange(newThresholds);
  };

  const updateThreshold = (index: number, field: keyof ThresholdConfig, value: any) => {
    const newThresholds = localThresholds.map((threshold, i) => 
      i === index ? { ...threshold, [field]: value } : threshold
    );
    setLocalThresholds(newThresholds);
    onThresholdsChange(newThresholds);
  };

  const colorPalettes = [
    { name: 'Default', colors: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'] },
    { name: 'Success', colors: ['hsl(var(--success))', 'hsl(142 69% 58%)', 'hsl(142 69% 78%)'] },
    { name: 'Warning', colors: ['hsl(var(--warning))', 'hsl(38 92% 70%)', 'hsl(38 92% 85%)'] },
    { name: 'Critical', colors: ['hsl(var(--critical))', 'hsl(0 84% 70%)', 'hsl(0 84% 85%)'] }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Widget Styling</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select 
                value={localStyle.fontFamily || 'inherit'} 
                onValueChange={(value) => handleStyleUpdate('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inherit">Default</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size: {localStyle.fontSize || 14}px</Label>
              <Slider
                value={[localStyle.fontSize || 14]}
                onValueChange={([value]) => handleStyleUpdate('fontSize', value)}
                min={10}
                max={32}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select 
                value={localStyle.fontWeight || 'normal'} 
                onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semi Bold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Border Radius: {localStyle.borderRadius || 8}px</Label>
              <Slider
                value={[localStyle.borderRadius || 8]}
                onValueChange={([value]) => handleStyleUpdate('borderRadius', value)}
                min={0}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Width: {localStyle.borderWidth || 1}px</Label>
              <Slider
                value={[localStyle.borderWidth || 1]}
                onValueChange={([value]) => handleStyleUpdate('borderWidth', value)}
                min={0}
                max={5}
                step={1}
              />
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-2">
              <Label>Color Palette</Label>
              <div className="grid grid-cols-2 gap-2">
                {colorPalettes.map((palette) => (
                  <div key={palette.name} className="p-2 border rounded-lg cursor-pointer hover:bg-accent">
                    <div className="font-medium text-sm mb-2">{palette.name}</div>
                    <div className="flex gap-1">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={localStyle.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                value={localStyle.textColor || '#000000'}
                onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Color</Label>
              <Input
                type="color"
                value={localStyle.borderColor || '#e2e8f0'}
                onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select 
                value={localStyle.theme || 'auto'} 
                onValueChange={(value) => handleStyleUpdate('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="thresholds" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Conditional Formatting</Label>
              <Button variant="outline" size="sm" onClick={addThreshold}>
                <Plus className="w-4 h-4 mr-2" />
                Add Threshold
              </Button>
            </div>

            {localThresholds.map((threshold, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Rule {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeThreshold(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={threshold.operator}
                    onValueChange={(value) => updateThreshold(index, 'operator', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">Greater than</SelectItem>
                      <SelectItem value="<">Less than</SelectItem>
                      <SelectItem value=">=">Greater or equal</SelectItem>
                      <SelectItem value="<=">Less or equal</SelectItem>
                      <SelectItem value="==">Equal to</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    value={threshold.value}
                    onChange={(e) => updateThreshold(index, 'value', parseFloat(e.target.value))}
                    placeholder="Value"
                  />
                  
                  <Input
                    type="color"
                    value={threshold.color}
                    onChange={(e) => updateThreshold(index, 'color', e.target.value)}
                  />
                </div>
                
                <Input
                  value={threshold.condition}
                  onChange={(e) => updateThreshold(index, 'condition', e.target.value)}
                  placeholder="Condition description"
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};