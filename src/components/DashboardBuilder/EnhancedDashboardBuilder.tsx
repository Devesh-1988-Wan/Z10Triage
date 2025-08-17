// src/components/DashboardBuilder/EnhancedDashboardBuilder.tsx
import React from 'react';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/DashboardLayout';
import { WidgetLibrary, WidgetTemplate } from './WidgetLibrary';
import { MultiSelectControls } from './MultiSelectControls';
import { StylePanel } from './StylePanel';
import { VersionManager } from './VersionManager';
import { PublishingPanel } from './PublishingPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardBuilderState, EnhancedWidgetConfig } from '@/types/dashboardBuilder';
import { DashboardGrid } from '../widgets/DashboardGrid';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/button';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EnhancedDashboardBuilder: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    dashboardLayout,
    setDashboardLayout,
    isLoading,
    error,
    refetch,
    ...data
  } = useDashboardData(dashboardId);

  const [builderState, setBuilderState] = React.useState<DashboardBuilderState>({
    currentDashboard: dashboardLayout,
    selectedWidgets: [],
    multiSelectMode: false,
    dragMode: 'none',
    snapToGrid: true,
    gridSize: 20,
    publishingConfig: {
      internal: { shareWithTeam: false, roleBasedAccess: [], departments: [] },
      external: { pdfExport: true, powerPointExport: true, embedUrl: false, publicLink: false }
    },
    versions: [],
    currentVersion: 1,
    liveUpdates: { enabled: true, interval: 30, dataSources: [] }
  });

  React.useEffect(() => {
    setBuilderState(prev => ({ ...prev, currentDashboard: dashboardLayout }));
  }, [dashboardLayout]);

  const handleWidgetSelect = (template: WidgetTemplate) => {
    const newWidget: EnhancedWidgetConfig = {
      id: uuidv4(),
      component: template.component as any,
      title: template.name,
      description: template.description,
      props: template.defaultProps,
      layout: { x: 0, y: 0, w: 2, h: 2, i: uuidv4() },
    };

    setDashboardLayout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        widgets: [...(prev.widgets || []), newWidget]
      };
    });
  };

  const handleLayoutChange = (newLayout: any[]) => {
    if (dashboardLayout) {
      const updatedWidgets = dashboardLayout.widgets.map(widget => {
        const layoutItem = newLayout.find(l => l.i === widget.id);
        return layoutItem ? { ...widget, layout: { ...widget.layout, ...layoutItem } } : widget;
      });
      setDashboardLayout({ ...dashboardLayout, widgets: updatedWidgets });
    }
  };
  
  const handleUpdateWidget = (updatedWidget: EnhancedWidgetConfig) => {
    if (dashboardLayout) {
      const updatedWidgets = dashboardLayout.widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w);
      setDashboardLayout({ ...dashboardLayout, widgets: updatedWidgets });
    }
  };

  const handleSaveLayout = async () => {
    if (!dashboardLayout) return;
    try {
        const payload = {
            layout: { widgets: dashboardLayout.widgets },
            dashboard_name: dashboardLayout.name,
            dashboard_description: dashboardLayout.description,
        };

        if (dashboardId === 'new') {
            const { data, error } = await supabase
              .from('dashboard_layout')
              .insert({ ...payload, user_id: (await supabase.auth.getUser()).data.user?.id })
              .select('id')
              .single();

            if (error) throw error;
            toast({ title: "Layout Saved", description: "Your new dashboard has been created." });
            navigate(`/dashboard/editor/${data.id}`, { replace: true });
        } else {
            const { error } = await supabase
              .from('dashboard_layout')
              .update(payload)
              .eq('id', dashboardId);

            if (error) throw error;
            toast({ title: "Layout Saved", description: "Your dashboard layout has been updated." });
        }
        refetch();
    } catch (err: any) {
      toast({ title: "Error", description: `Failed to save layout: ${err.message}`, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DashboardLayoutComponent onExportPdf={() => {}}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard Editor</h1>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link to={dashboardId === 'new' ? '/dashboard' : `/dashboard/${dashboardId}`}><ArrowLeft className="w-4 h-4 mr-2" />Back</Link>
          </Button>
          <Button onClick={handleSaveLayout}>
            <Save className="w-4 h-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-150px)]">
        <div className="col-span-3 space-y-4 h-full overflow-y-auto">
          <Tabs defaultValue="widgets" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="widgets">Library</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
            </TabsList>
            
            <TabsContent value="widgets" className="h-full">
              <WidgetLibrary
                onWidgetSelect={handleWidgetSelect}
                selectedCategory="all"
                onCategoryChange={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="style">
              <StylePanel
                widgetId={builderState.selectedWidgets[0]}
                currentStyle={{}}
                onStyleChange={() => {}}
                thresholds={[]}
                onThresholdsChange={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="versions">
              <VersionManager
                currentVersion={builderState.currentVersion}
                versions={builderState.versions}
                onSaveVersion={() => {}}
                onLoadVersion={() => {}}
                onPreviewVersion={() => {}}
                onDeleteVersion={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="publish">
              <PublishingPanel
                dashboardId={dashboardId!}
                config={builderState.publishingConfig}
                onConfigChange={() => {}}
                onExportPDF={() => {}}
                onExportPowerPoint={() => {}}
                onGenerateEmbedCode={() => ''}
                onGeneratePublicLink={() => ''}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-9">
          <div className="h-full border-2 border-dashed border-border rounded-lg p-4 overflow-y-auto">
            {dashboardLayout && (
              <DashboardGrid
                layout={dashboardLayout.widgets}
                onLayoutChange={handleLayoutChange}
                isDraggable={true}
                isResizable={true}
                data={data}
                isLoading={isLoading}
                onWidgetClick={(widget) => setBuilderState(prev => ({...prev, selectedWidgets: [widget.id]}))}
                onUpdateWidget={handleUpdateWidget}
              />
            )}
          </div>
        </div>
      </div>
      
      <MultiSelectControls
        multiSelectState={{ selectedWidgets: builderState.selectedWidgets, isActive: builderState.multiSelectMode }}
        onAlign={() => {}}
        onResize={() => {}}
        onStyleGroup={() => {}}
        onDelete={() => {}}
        onClearSelection={() => setBuilderState(prev => ({...prev, selectedWidgets: [], multiSelectMode: false}))}
      />
    </DashboardLayoutComponent>
  );
};