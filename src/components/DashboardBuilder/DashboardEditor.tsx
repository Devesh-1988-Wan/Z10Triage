import React, { useState } from 'react';
import { DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  { id: 'MetricCard', name: 'Metric Card', icon: '📊' },
  { id: 'BugChart', name: 'Bug Chart', icon: '🐛' },
  { id: 'CustomerSupportTable', name: 'Support Table', icon: '👥' },
  { id: 'DevelopmentPipeline', name: 'Dev Pipeline', icon: '🚀' },
  { id: 'DataManagement', name: 'Data Management', icon: '💾' },
  { id: 'SecurityInfrastructureUpdates', name: 'Security Updates', icon: '🔐' },
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
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);
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
    setSelectedWidget(updatedWidget);
  };

  const deleteWidget = (widgetId: string) => {
    setLayout(prev => ({
      widgets: prev.widgets.filter(w => w.id !== widgetId)
    }));
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null);
    }
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

  const publishDashboard = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to publish.", variant: "destructive" });
      return;
    }

    try {
      // Save dashboard first
      const { data: dashboardData, error: dashboardError } = await supabase
        .from('dashboard_layout')
        .upsert({
          user_id: user.id,
          layout: layout,
          dashboard_name: 'Published Dashboard',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dashboardError) throw dashboardError;

      // Create public share link
      const shareKey = `${user.id}-${Date.now()}`;
      const { error: shareError } = await supabase
        .from('shared_dashboards')
        .insert({
          dashboard_id: dashboardData.id,
          public_url_key: shareKey,
          is_public: true
        });

      if (shareError) throw shareError;

      toast({ 
        title: "Success", 
        description: `Dashboard published! Share link: ${window.location.origin}/public/${shareKey}` 
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background">
        <Tabs defaultValue="widgets" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="widgets" className="p-4 space-y-4">
            <h3 className="font-semibold">Available Widgets</h3>
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
          </TabsContent>

          <TabsContent value="edit" className="p-4 space-y-4">
            {selectedWidget ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Edit Widget</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={selectedWidget.title}
                    onChange={(e) => updateWidget({
                      ...selectedWidget,
                      title: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={selectedWidget.description || ''}
                    onChange={(e) => updateWidget({
                      ...selectedWidget,
                      description: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={selectedWidget.layout.w}
                    onChange={(e) => updateWidget({
                      ...selectedWidget,
                      layout: {
                        ...selectedWidget.layout,
                        w: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={selectedWidget.layout.h}
                    onChange={(e) => updateWidget({
                      ...selectedWidget,
                      layout: {
                        ...selectedWidget.layout,
                        h: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteWidget(selectedWidget.id)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Widget
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a widget to edit</p>
            )}
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-4">
              <Button onClick={saveDashboard} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Dashboard
              </Button>
              <Button onClick={publishDashboard} variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Publish Dashboard
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-6 gap-4 min-h-[600px]">
          {layout.widgets.map((widget) => (
            <div
              key={widget.id}
              className={`col-span-${widget.layout.w} row-span-${widget.layout.h} relative group`}
              style={{ gridRowEnd: `span ${widget.layout.h}` }}
            >
              {!isPreviewMode && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedWidget(widget)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteWidget(widget.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              <div className={selectedWidget?.id === widget.id ? 'ring-2 ring-primary' : ''}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};