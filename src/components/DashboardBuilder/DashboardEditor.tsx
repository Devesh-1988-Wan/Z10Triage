import React, 'react';
import GridLayout from 'react-grid-layout';
import { DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Edit3, Plus, Save, Eye, Settings } from 'lucide-react';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { useDashboardData } from '@/hooks/useDashboardData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface DashboardEditorProps {
  initialLayout?: DashboardLayout;
  onSave?: (layout: DashboardLayout) => void;
}

// Added new widgets to the available list
const AVAILABLE_WIDGETS = [
    { id: 'MetricCard', name: 'Metric Card', icon: '📊' },
    { id: 'BugChart', name: 'Bug Chart', icon: '🐞' },
    { id: 'CustomerSupportTable', name: 'Support Table', icon: '👥' },
    { id: 'DevelopmentPipeline', name: 'Dev Pipeline', icon: '🚀' },
    { id: 'DataManagement', name: 'Data Management', icon: '💾' },
    { id: 'SecurityInfrastructureUpdates', name: 'Security Updates', icon: '🛡️' },
    { id: 'HeaderWidget', name: 'Header', icon: 'T' },
    { id: 'InfoCardWidget', name: 'Info Card', icon: 'ℹ️' },
];

// Default configurations for widgets that need them
const DEFAULT_PROPS = {
    BugChart: { chartType: 'bar' },
    CustomerSupportTable: { visibleColumns: ['customerName', 'priority', 'status', 'assignee'] },
    DevelopmentPipeline: { stages: ['Not Started', 'In Progress', 'Code Review', 'Testing', 'Completed'] }
};


export const DashboardEditor: React.FC<DashboardEditorProps> = ({
  initialLayout,
  onSave,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const dashboardData = useDashboardData();
  const [layout, setLayout] = React.useState<DashboardLayout>(
    initialLayout || { widgets: [] }
  );
  const [editingWidget, setEditingWidget] = React.useState<WidgetConfig | null>(
    null
  );
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);

  const addWidget = (componentType: keyof typeof DEFAULT_PROPS | string) => {
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      component: componentType as any,
      title: `New ${componentType}`,
      description: '',
      props: DEFAULT_PROPS[componentType as keyof typeof DEFAULT_PROPS] || {},
      layout: { x: 0, y: 0, w: 4, h: 4 }, // Default size
    };

    setLayout((prev) => ({
      widgets: [...prev.widgets, newWidget],
    }));
  };

  const updateWidget = (updatedWidget: Partial<WidgetConfig>) => {
    if (!editingWidget) return;

    const newWidget = { ...editingWidget, ...updatedWidget };
    setLayout((prev) => ({
      widgets: prev.widgets.map((w) =>
        w.id === newWidget.id ? newWidget : w
      ),
    }));
    setEditingWidget(newWidget);
  };

  const updateWidgetProp = (prop: string, value: any) => {
    if (!editingWidget) return;
    updateWidget({
        props: {
            ...editingWidget.props,
            [prop]: value
        }
    });
  };

  const deleteWidget = (widgetId: string) => {
    setLayout((prev) => ({
      widgets: prev.widgets.filter((w) => w.id !== widgetId),
    }));
    if (editingWidget?.id === widgetId) {
      setEditingWidget(null);
    }
  };

  const onLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
    const updatedWidgets = layout.widgets.map((widget) => {
      const layoutItem = newLayout.find((item) => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          layout: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
        };
      }
      return widget;
    });

    setLayout({ widgets: updatedWidgets });
  };

  const saveDashboard = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('dashboard_layout').upsert({
        user_id: user.id,
        layout: layout,
        dashboard_name: 'Custom Dashboard',
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Dashboard saved successfully!' });
      if (onSave) onSave(layout);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const renderEditForm = () => {
    if (!editingWidget) return null;

    const commonFields = (
      <>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={editingWidget.title}
            onChange={(e) => updateWidget({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={editingWidget.description || ''}
            onChange={(e) => updateWidget({ description: e.target.value })}
          />
        </div>
      </>
    );

    switch (editingWidget.component) {
        case 'BugChart':
            return (
                <>
                    {commonFields}
                    <div className="space-y-2">
                        <Label>Chart Type</Label>
                        <Select value={editingWidget.props.chartType || 'bar'} onValueChange={(val) => updateWidgetProp('chartType', val)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="pie">Pie Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            );
        case 'CustomerSupportTable':
            const allColumns = ['customerName', 'area', 'priority', 'status', 'eta', 'assignee'];
            const visibleColumns = editingWidget.props.visibleColumns || [];
            return (
                <>
                    {commonFields}
                    <div className="space-y-2">
                        <Label>Visible Columns</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {allColumns.map(col => (
                                <div key={col} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={col}
                                        checked={visibleColumns.includes(col)}
                                        onCheckedChange={(checked) => {
                                            const newCols = checked ? [...visibleColumns, col] : visibleColumns.filter((c: string) => c !== col);
                                            updateWidgetProp('visibleColumns', newCols);
                                        }}
                                    />
                                    <Label htmlFor={col} className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            );
        case 'DevelopmentPipeline':
            return (
                <>
                    {commonFields}
                    <div className="space-y-2">
                        <Label>Pipeline Stages (comma-separated)</Label>
                        <Textarea
                            value={(editingWidget.props.stages || []).join(', ')}
                            onChange={(e) => updateWidgetProp('stages', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="e.g. Not Started, In Progress, Done"
                        />
                    </div>
                </>
            );
      case 'HeaderWidget':
        return (
          <div className="space-y-2">
            <Label>Header Text</Label>
            <Input
              value={editingWidget.title}
              onChange={(e) => updateWidget({ title: e.target.value })}
            />
          </div>
        );
      case 'InfoCardWidget':
        return (
          <>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={editingWidget.props.heading || ''}
                onChange={(e) => updateWidgetProp('heading', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Textarea
                value={editingWidget.props.text || ''}
                onChange={(e) => updateWidgetProp('text', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon Name (e.g., Bug, Users, Shield)</Label>
              <Input
                value={editingWidget.props.iconName || ''}
                onChange={(e) => updateWidgetProp('iconName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={editingWidget.props.imageUrl || ''}
                onChange={(e) => updateWidgetProp('imageUrl', e.target.value)}
              />
            </div>
          </>
        );
      default:
        return commonFields;
    }
  };

  return (
    <div className="h-full flex bg-muted/40">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-background p-4 flex flex-col">
        <h3 className="font-semibold mb-4">Available Widgets</h3>
        <div className="grid grid-cols-1 gap-2 overflow-y-auto">
          {AVAILABLE_WIDGETS.map((widget) => (
            <Card
              key={widget.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => addWidget(widget.id)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-xl">{widget.icon}</span>
                <span className="text-sm font-medium">{widget.name}</span>
                <Plus className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-auto space-y-2 pt-4">
          <Button onClick={saveDashboard} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Dashboard
          </Button>
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            variant="outline"
            className="w-full"
          >
            {isPreviewMode ? <Settings className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isPreviewMode ? 'Back to Edit' : 'Preview'}
          </Button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 p-4 overflow-auto">
        <GridLayout
          className="layout"
          layout={layout.widgets.map((w) => ({ ...w.layout, i: w.id }))}
          cols={12}
          rowHeight={50}
          width={1200}
          onLayoutChange={onLayoutChange}
          isDraggable={!isPreviewMode}
          isResizable={!isPreviewMode}
        >
          {layout.widgets.map((widget) => (
            <div key={widget.id} className="relative group bg-background rounded-lg shadow-sm">
              {!isPreviewMode && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center space-x-1">
                  <Dialog onOpenChange={(open) => !open && setEditingWidget(null)}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setEditingWidget(widget)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {editingWidget && editingWidget.id === widget.id && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit: {editingWidget.title}</DialogTitle>
                                <DialogDescription>
                                Customize your widget content and settings.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">{renderEditForm()}</div>
                            <DialogFooter>
                                <Button onClick={() => setEditingWidget(null)}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                  </Dialog>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => deleteWidget(widget.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="w-full h-full overflow-hidden">
                <WidgetRenderer
                  config={widget}
                  data={dashboardData}
                />
              </div>
            </div>
          ))}
        </GridLayout>
      </main>
    </div>
  );
};