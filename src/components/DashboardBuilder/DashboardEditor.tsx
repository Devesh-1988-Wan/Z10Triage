import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import { DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit3, Plus, Save, Eye, Settings } from 'lucide-react';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { useDashboardData } from '@/hooks/useDashboardData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardEditorProps {
  initialLayout?: DashboardLayout;
  onSave?: (layout: DashboardLayout) => void;
}

const AVAILABLE_WIDGETS = [
  { id: 'MetricCard', name: 'Metric Card', icon: '投' },
  { id: 'BugChart', name: 'Bug Chart', icon: '菅' },
  { id: 'CustomerSupportTable', name: 'Support Table', icon: '則' },
  { id: 'DevelopmentPipeline', name: 'Dev Pipeline', icon: '噫' },
  { id: 'DataManagement', name: 'Data Management', icon: '沈' },
  { id: 'SecurityInfrastructureUpdates', name: 'Security Updates', icon: '柏' },
];

export const DashboardEditor: React.FC<DashboardEditorProps> = ({
  initialLayout,
  onSave
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const dashboardData = useDashboardData();
  const [layout, setLayout] = useState<DashboardLayout>(
    initialLayout || { widgets: [] }
  );
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const addWidget = (componentType: string) => {
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      component: componentType as any,
      title: `New ${componentType}`,
      description: 'Widget description',
      props: {},
      layout: { x: 0, y: 0, w: 2, h: 2 }
    };

    setLayout(prev => ({
      widgets: [...prev.widgets, newWidget]
    }));
  };

  const updateWidget = (updatedWidget: WidgetConfig) => {
    setLayout(prev => ({
      widgets: prev.widgets.map(w =>
        w.id === updatedWidget.id ? updatedWidget : w
      )
    }));
    setEditingWidget(updatedWidget);
  };

  const deleteWidget = (widgetId: string) => {
    setLayout(prev => ({
      widgets: prev.widgets.filter(w => w.id !== widgetId)
    }));
    if (editingWidget?.id === widgetId) {
      setEditingWidget(null);
    }
  };

  const onLayoutChange = (newLayout) => {
    const updatedWidgets = layout.widgets.map(widget => {
      const layoutItem = newLayout.find(item => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          layout: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h
          }
        };
      }
      return widget;
    });

    setLayout({ widgets: updatedWidgets });
  };


  const saveDashboard = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('dashboard_layout')
        .upsert({
          user_id: user.id,
          layout: layout,
          dashboard_name: 'Custom Dashboard',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({ title: "Success", description: "Dashboard saved successfully!" });
      onSave?.(layout);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-background p-4">
        <h3 className="font-semibold mb-4">Available Widgets</h3>
        <div className="grid grid-cols-1 gap-2">
          {AVAILABLE_WIDGETS.map((widget) => (
            <Card key={widget.id} className="cursor-pointer hover:bg-accent"
              onClick={() => addWidget(widget.id)}>
              <CardContent className="p-3 flex items-center gap-2">
                <span className="text-lg">{widget.icon}</span>
                <span className="text-sm font-medium">{widget.name}</span>
                <Plus className="h-4 w-4 ml-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <Button onClick={saveDashboard} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Dashboard
          </Button>
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            variant="secondary"
            className="w-full"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Exit Preview' : 'Preview Mode'}
          </Button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 p-4 overflow-auto">
        <GridLayout
          className="layout"
          layout={layout.widgets.map(w => ({ ...w.layout, i: w.id }))}
          cols={12}
          rowHeight={30}
          width={1200}
          onLayoutChange={onLayoutChange}
        >
          {layout.widgets.map((widget) => (
            <div key={widget.id} className="relative group">
              {!isPreviewMode && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingWidget(widget)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Widget</DialogTitle>
                        <DialogDescription>
                          Make changes to your widget here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={editingWidget?.title}
                            onChange={(e) => updateWidget({
                              ...editingWidget,
                              title: e.target.value
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={editingWidget?.description || ''}
                            onChange={(e) => updateWidget({
                              ...editingWidget,
                              description: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => setEditingWidget(null)}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteWidget(widget.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <WidgetRenderer
                config={widget}
                data={{
                  bugReports: dashboardData.bugReports,
                  customerTickets: dashboardData.customerTickets,
                  developmentTickets: dashboardData.developmentTickets,
                  dashboardMetrics: dashboardData.dashboardMetrics,
                }}
              />
            </div>
          ))}
        </GridLayout>
      </main>
    </div>
  );
};