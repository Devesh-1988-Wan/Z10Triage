import React from 'react';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/DashboardLayout';
import { WidgetLibrary, WidgetTemplate } from './WidgetLibrary';
import { MultiSelectControls } from './MultiSelectControls';
import { StylePanel } from './StylePanel';
import { VersionManager } from './VersionManager';
import { PublishingPanel } from './PublishingPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStore } from '@/stores/dashboardStore';
import { WidgetConfig } from '@/types/dashboard';
import { Button } from '../ui/button';
import { Save, Eye } from 'lucide-react';

/**
 * An enhanced dashboard builder component that provides a comprehensive UI for
 * creating, customizing, and managing dashboards.
 */
export const EnhancedDashboardBuilder: React.FC = () => {
  const {
    dashboardLayout,
    setDashboardLayout,
    selectedWidgets,
    multiSelectMode,
    alignWidgets,
    deleteWidgets,
    clearWidgetSelection,
    updateWidget,
  } = useDashboardStore();

  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    alignWidgets(alignment);
  };

  const handleDelete = () => {
    deleteWidgets(selectedWidgets);
    clearWidgetSelection();
  };
  
  const handleWidgetSelect = (template: WidgetTemplate) => {
    const newWidget: WidgetConfig = {
        id: `widget-${Date.now()}`,
        component: template.component as any,
        title: template.name,
        description: template.description,
        props: template.defaultProps,
        layout: { x: 0, y: 0, w: 2, h: 2 }
    };

    if (dashboardLayout) {
        setDashboardLayout({ widgets: [...dashboardLayout.widgets, newWidget] });
    }
  };

  const handleSaveLayout = () => {
    // Implement save logic, possibly using an API call
    console.log("Saving layout:", dashboardLayout);
  };

  const selectedWidgetConfig = dashboardLayout?.widgets.find(w => w.id === selectedWidgets[0]);

  return (
    <DashboardLayoutComponent onExportPdf={() => {}}>
        <div className="flex h-[calc(100vh-8rem)]">
            {/* Left Sidebar */}
            <aside className="w-80 border-r bg-background p-4">
                <Tabs defaultValue="widgets" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="widgets">Add Widgets</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                    </TabsList>
                    <TabsContent value="widgets" className="flex-grow overflow-auto">
                        <WidgetLibrary 
                            onWidgetSelect={handleWidgetSelect} 
                            selectedCategory="all" 
                            onCategoryChange={() => {}} 
                        />
                    </TabsContent>
                    <TabsContent value="style" className="flex-grow overflow-auto">
                        {selectedWidgetConfig ? (
                            <StylePanel
                                widgetId={selectedWidgetConfig.id}
                                currentStyle={selectedWidgetConfig.props.style || {}}
                                onStyleChange={(style) => updateWidget({ ...selectedWidgetConfig, props: { ...selectedWidgetConfig.props, style }})}
                                thresholds={selectedWidgetConfig.props.thresholds || []}
                                onThresholdsChange={(thresholds) => updateWidget({ ...selectedWidgetConfig, props: { ...selectedWidgetConfig.props, thresholds }})}
                            />
                        ) : (
                            <div className="text-center text-muted-foreground p-8">
                                Select a widget to see styling options.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </aside>
            
            {/* Main Canvas */}
            <main className="flex-1 p-4 overflow-auto">
                {/* Placeholder for dashboard canvas where widgets are rendered */}
                <div className="grid grid-cols-12 gap-4 h-full">
                    {dashboardLayout?.widgets.map(widget => (
                        <div key={widget.id} className={`col-span-${widget.layout.w} row-span-${widget.layout.h} bg-card rounded-lg p-4`}>
                            <h3 className="font-semibold">{widget.title}</h3>
                            <p className="text-sm text-muted-foreground">{widget.description}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 border-l bg-background p-4 space-y-4">
                <div className="flex justify-between">
                    <Button onClick={handleSaveLayout}>
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                </div>
                <VersionManager 
                    currentVersion={1}
                    versions={[]}
                    onSaveVersion={() => {}}
                    onLoadVersion={() => {}}
                    onPreviewVersion={() => {}}
                    onDeleteVersion={() => {}}
                />
                <PublishingPanel 
                    dashboardId="123"
                    config={{ internal: { shareWithTeam: false, roleBasedAccess: [], departments: [] }, external: { pdfExport: false, powerPointExport: false, embedUrl: false, publicLink: false }}}
                    onConfigChange={() => {}}
                    onExportPDF={() => {}}
                    onExportPowerPoint={() => {}}
                    onGenerateEmbedCode={() => ""}
                    onGeneratePublicLink={() => ""}
                />
            </aside>
        </div>
      <MultiSelectControls
        multiSelectState={{ selectedWidgets, isActive: multiSelectMode, groupAction: undefined }}
        onAlign={handleAlign}
        onResize={() => {}}
        onStyleGroup={() => {}}
        onDelete={handleDelete}
        onClearSelection={clearWidgetSelection}
      />
    </DashboardLayoutComponent>
  );
};