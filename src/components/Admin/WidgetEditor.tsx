// src/components/Admin/WidgetEditor.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, LayoutGrid, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate } from 'react-router-dom';


// Define available widget types and their default props
const AVAILABLE_WIDGET_TYPES = [
  { value: 'MetricCard', label: 'Metric Card', defaultProps: { valueKey: 'totalBugsFixed', icon: 'Bug', change: { value: '+0%', trend: 'neutral' } } },
  { value: 'BugChart', label: 'Bug Chart', defaultProps: {} },
  { value: 'CustomerSupportTable', label: 'Customer Support Table', defaultProps: {} },
  { value: 'DevelopmentPipeline', label: 'Development Pipeline', defaultProps: {} },
  { value: 'ImageWidget', label: 'Image Gallery', defaultProps: {} },
  { value: 'ProgressWidget', label: 'Progress Tracker', defaultProps: {} },
  { value: 'AnnouncementWidget', label: 'Announcements', defaultProps: {} },
  { value: 'StatsWidget', label: 'Analytics Dashboard', defaultProps: {} },
  { value: 'SecurityUpdatesWidget', label: 'Security & Infra Updates', defaultProps: {} },
  { value: 'SalesChart', label: 'Sales Chart', defaultProps: {} },
];

// Map string icon names to LucideReact components for display in the editor
import { Bug, TrendingUp, Users, Clock, Shield, Zap } from 'lucide-react';
const LucideIcons = { Bug, TrendingUp, Users, Clock, Shield, Zap };
const METRIC_CARD_ICON_OPTIONS = Object.keys(LucideIcons).map(key => ({ value: key, label: key }));
const METRIC_CARD_VALUE_KEYS = [
  { value: 'totalBugsFixed', label: 'Total Bugs Fixed' },
  { value: 'totalTicketsResolved', label: 'Total Tickets Resolved' },
  { value: 'blockerBugs', label: 'Blocker Bugs' },
  { value: 'criticalBugs', label: 'Critical Bugs' },
  { value: 'highPriorityBugs', label: 'High Priority Bugs' },
  { value: 'activeCustomerSupport', label: 'Active Customer Support' },
  { value: 'developmentProgress', label: 'Development Progress' },
];
const METRIC_CARD_PRIORITY_OPTIONS = [
  { value: 'blocker', label: 'Blocker' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];
const METRIC_CARD_TREND_OPTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'neutral', label: 'Neutral' },
];


interface WidgetEditorProps {
  currentLayout: DashboardLayout | null;
  onLayoutSave: () => void; // Callback to refresh dashboard data after saving
  dashboardName?: string;
  onDashboardNameChange?: (name: string) => void;
  dashboardDescription?: string;
  onDashboardDescriptionChange?: (description: string) => void;
}

export const WidgetEditor: React.FC<WidgetEditorProps> = ({
  currentLayout,
  onLayoutSave,
  dashboardName,
  onDashboardNameChange,
  dashboardDescription,
  onDashboardDescriptionChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const [layoutToEdit, setLayoutToEdit] = useState<DashboardLayout>(currentLayout && currentLayout.widgets ? currentLayout : { widgets: [] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [newWidgetForm, setNewWidgetForm] = useState<Partial<WidgetConfig>>({
    component: 'MetricCard',
    title: '',
    description: '',
    props: {},
    layout: { x: 0, y: 0, w: 1, h: 1, i: '' },
  });

  useEffect(() => {
    if (currentLayout) {
      setLayoutToEdit(currentLayout);
    }
  }, [currentLayout]);

  const handleSaveLayout = async () => {
    if (!user?.id) {
        toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
        return;
    }
    if (!dashboardId) {
        toast({ title: "Error", description: "Dashboard ID is missing.", variant: "destructive" });
        return;
    }

    const payload = {
        layout: { widgets: layoutToEdit.widgets },
        dashboard_name: dashboardName,
        dashboard_description: dashboardDescription,
        user_id: user.id
    };

    try {
        if (dashboardId === 'new') {
            const { data, error } = await supabase
              .from('dashboard_layout')
              .insert(payload)
              .select('id')
              .single();

            if (error) throw error;

            toast({ title: "Success", description: "Dashboard created successfully!" });
            navigate(`/dashboard/editor/${data.id}`, { replace: true });
            onLayoutSave();

        } else {
            const { error } = await supabase
              .from('dashboard_layout')
              .update(payload)
              .eq('id', dashboardId);

            if (error) throw error;
            toast({ title: "Success", description: "Dashboard layout saved successfully!" });
            onLayoutSave();
        }
    } catch (error) {
        console.error("Error saving layout:", error);
        toast({ title: "Error", description: `Failed to save layout: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
    }
  };


  const handleAddWidget = () => {
    const newWidget: WidgetConfig = {
      id: uuidv4(),
      component: newWidgetForm.component as any,
      title: newWidgetForm.title || 'New Widget',
      description: newWidgetForm.description,
      props: newWidgetForm.props || {},
      layout: { ...newWidgetForm.layout, i: uuidv4() } as { x: number; y: number; w: number; h: number; i: string },
    };
    setLayoutToEdit(prev => ({
      ...prev,
      widgets: [...(prev.widgets || []), newWidget]
    }));
    setNewWidgetForm({
      component: 'MetricCard',
      title: '',
      description: '',
      props: {},
      layout: { x: 0, y: 0, w: 1, h: 1, i: '' },
    });
    setIsDialogOpen(false); // Close dialog after adding
  };

  const handleEditWidget = () => {
    if (!editingWidget) return;

    setLayoutToEdit(prev => ({
      ...prev,
      widgets: prev.widgets.map(w =>
        w.id === editingWidget.id ? editingWidget : w
      )
    }));
    setEditingWidget(null);
    setIsDialogOpen(false); // Close dialog after editing
  };

  const handleDeleteWidget = (id: string) => {
    setLayoutToEdit(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== id)
    }));
    toast({
      title: "Widget Deleted",
      description: "Remember to save changes to apply.",
    });
  };

  const openEditDialog = (widget: WidgetConfig) => {
    setEditingWidget(widget);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingWidget(null);
    setNewWidgetForm({
      component: 'MetricCard',
      title: '',
      description: '',
      props: AVAILABLE_WIDGET_TYPES.find(w => w.value === 'MetricCard')?.defaultProps || {},
      layout: { x: 0, y: 0, w: 1, h: 1, i: '' },
    });
    setIsDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (editingWidget) {
      if (id.startsWith('props.change.')) {
        const propKey = id.split('.')[2];
        setEditingWidget(prev => ({
          ...prev!,
          props: {
            ...prev!.props,
            change: { ...prev!.props?.change, [propKey]: value },
          },
        }));
      } else if (id.startsWith('layout.')) {
        const layoutKey = id.split('.')[1];
        setEditingWidget(prev => ({
          ...prev!,
          layout: { ...prev!.layout, [layoutKey]: parseInt(value) },
        }));
      } else {
        setEditingWidget(prev => ({ ...prev!, [id]: value }));
      }
    } else {
      if (id.startsWith('props.change.')) {
        const propKey = id.split('.')[2];
        setNewWidgetForm(prev => ({
          ...prev!,
          props: {
            ...prev!.props,
            change: { ...prev!.props?.change, [propKey]: value },
          },
        }));
      } else if (id.startsWith('layout.')) {
        const layoutKey = id.split('.')[1];
        setNewWidgetForm(prev => ({
          ...prev!,
          layout: { ...prev!.layout, [layoutKey]: parseInt(value) },
        }));
      } else {
        setNewWidgetForm(prev => ({ ...prev!, [id]: value }));
      }
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    const stateSetter = editingWidget ? setEditingWidget : setNewWidgetForm;

    stateSetter(prev => {
        const newFormState = { ...prev! };
        if (id === 'component') {
            const newComponentType = AVAILABLE_WIDGET_TYPES.find(w => w.value === value);
            newFormState.component = value as any;
            newFormState.props = newComponentType?.defaultProps || {};
        } else if (id.startsWith('props.')) {
            const propKey = id.split('.')[1];
            newFormState.props = { ...newFormState.props, [propKey]: value };
        } else if (id.startsWith('layout.')) {
            const layoutKey = id.split('.')[1];
            newFormState.layout = { ...newFormState.layout, [layoutKey]: parseInt(value) };
        } else {
            (newFormState as any)[id] = value;
        }
        return newFormState;
    });
};

  const currentFormState = editingWidget || newWidgetForm;
  const isMetricCard = currentFormState.component === 'MetricCard';

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5" />
          Manage Dashboard Widgets
        </CardTitle>
        <CardDescription>
          Add, edit, or remove widgets from your dashboard. Changes are applied after saving.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dashboardName">Dashboard Title</Label>
            <Input
              id="dashboardName"
              value={dashboardName}
              onChange={(e) => onDashboardNameChange?.(e.target.value)}
              placeholder="Enter dashboard title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dashboardDescription">Dashboard Subtitle</Label>
            <Input
              id="dashboardDescription"
              value={dashboardDescription}
              onChange={(e) => onDashboardDescriptionChange?.(e.target.value)}
              placeholder="Enter dashboard subtitle (optional)"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={openAddDialog} variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Add New Widget
            </Button>
            <Button onClick={handleSaveLayout}>
              <Save className="w-4 h-4 mr-2" /> Save Layout
            </Button>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Current Widgets</h3>
          <div className="space-y-3">
            {layoutToEdit.widgets.length === 0 ? (
              <p className="text-muted-foreground text-center">No widgets added yet. Click "Add New Widget" to start.</p>
            ) : (
              layoutToEdit.widgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{widget.title} ({widget.component})</p>
                    <p className="text-sm text-muted-foreground">ID: {widget.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(widget)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteWidget(widget.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingWidget ? 'Edit Widget' : 'Add New Widget'}</DialogTitle>
              <DialogDescription>
                {editingWidget ? 'Modify the properties of this widget.' : 'Configure a new widget for your dashboard.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={currentFormState.title}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={currentFormState.description || ''}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="component">Widget Type</Label>
                <Select
                  value={currentFormState.component}
                  onValueChange={(value) => handleSelectChange('component', value)}
                  disabled={!!editingWidget} // Prevent changing component type for existing widgets
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a widget type" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_WIDGET_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Props based on Widget Type */}
              {isMetricCard && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="props.valueKey">Metric Value (Data Key)</Label>
                    <Select
                      value={currentFormState.props?.valueKey || ''}
                      onValueChange={(value) => handleSelectChange('props.valueKey', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data key" />
                      </SelectTrigger>
                      <SelectContent>
                        {METRIC_CARD_VALUE_KEYS.map(key => (
                          <SelectItem key={key.value} value={key.value}>
                            {key.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="props.icon">Icon</Label>
                    <Select
                      value={currentFormState.props?.icon || ''}
                      onValueChange={(value) => handleSelectChange('props.icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {METRIC_CARD_ICON_OPTIONS.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="props.priority">Priority (Optional)</Label>
                    <Select
                      value={currentFormState.props?.priority || ''}
                      onValueChange={(value) => handleSelectChange('props.priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {METRIC_CARD_PRIORITY_OPTIONS.map(p => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="props.change.value">Change Value (e.g., +10%)</Label>
                    <Input
                      id="props.change.value"
                      value={currentFormState.props?.change?.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editingWidget) {
                          setEditingWidget(prev => ({
                            ...prev!,
                            props: {
                              ...prev!.props,
                              change: { ...prev!.props?.change, value },
                            },
                          }));
                        } else {
                          setNewWidgetForm(prev => ({
                            ...prev!,
                            props: {
                              ...prev!.props,
                              change: { ...prev!.props?.change, value },
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="props.change.trend">Change Trend</Label>
                    <Select
                      value={currentFormState.props?.change?.trend || 'neutral'}
                      onValueChange={(value) => {
                        if (editingWidget) {
                          setEditingWidget(prev => ({
                            ...prev!,
                            props: {
                              ...prev!.props,
                              change: { ...prev!.props?.change, trend: value },
                            },
                          }));
                        } else {
                          setNewWidgetForm(prev => ({
                            ...prev!,
                            props: {
                              ...prev!.props,
                              change: { ...prev!.props?.change, trend: value },
                            },
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trend" />
                      </SelectTrigger>
                      <SelectContent>
                        {METRIC_CARD_TREND_OPTIONS.map(trend => (
                          <SelectItem key={trend.value} value={trend.value}>
                            {trend.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Layout Properties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="layout.w">Width (Grid Units)</Label>
                  <Input
                    id="layout.w"
                    type="number"
                    value={currentFormState.layout?.w || 1}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="layout.h">Height (Grid Units)</Label>
                  <Input
                    id="layout.h"
                    type="number"
                    value={currentFormState.layout?.h || 1}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              {editingWidget ? (
                <Button onClick={handleEditWidget}>Save Changes</Button>
              ) : (
                <Button onClick={handleAddWidget}>Add Widget</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};