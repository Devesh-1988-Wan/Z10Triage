import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WidgetLibrary } from './WidgetLibrary';
import { MultiSelectControls } from './MultiSelectControls';
import { StylePanel } from './StylePanel';
import { VersionManager } from './VersionManager';
import { PublishingPanel } from './PublishingPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardBuilderState, EnhancedWidgetConfig } from '@/types/dashboardBuilder';

interface EnhancedDashboardBuilderProps {
  dashboardId: string;
  onSave: (layout: any) => void;
  onExport: () => void;
}

export const EnhancedDashboardBuilder: React.FC<EnhancedDashboardBuilderProps> = ({
  dashboardId,
  onSave,
  onExport
}) => {
  const [builderState, setBuilderState] = useState<DashboardBuilderState>({
    currentDashboard: null,
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

  return (
    <DashboardLayout onExportPdf={onExport}>
      <div className="grid grid-cols-4 gap-6 h-full">
        <div className="col-span-1 space-y-4">
          <Tabs defaultValue="widgets" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="widgets">Library</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
            </TabsList>
            
            <TabsContent value="widgets" className="h-full">
              <WidgetLibrary
                onWidgetSelect={(template) => {/* Add widget */}}
                selectedCategory="all"
                onCategoryChange={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="style">
              <StylePanel
                widgetId=""
                currentStyle={{}}
                onStyleChange={() => {}}
                thresholds={[]}
                onThresholdsChange={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="versions">
              <VersionManager
                currentVersion={1}
                versions={[]}
                onSaveVersion={() => {}}
                onLoadVersion={() => {}}
                onPreviewVersion={() => {}}
                onDeleteVersion={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="publish">
              <PublishingPanel
                dashboardId={dashboardId}
                config={builderState.publishingConfig}
                onConfigChange={() => {}}
                onExportPDF={onExport}
                onExportPowerPoint={onExport}
                onGenerateEmbedCode={() => ''}
                onGeneratePublicLink={() => ''}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-3">
          {/* Dashboard canvas will go here */}
          <div className="h-full border-2 border-dashed border-border rounded-lg p-4">
            <p className="text-center text-muted-foreground">Dashboard Canvas</p>
          </div>
        </div>
      </div>
      
      <MultiSelectControls
        multiSelectState={{ selectedWidgets: [], isActive: false }}
        onAlign={() => {}}
        onResize={() => {}}
        onStyleGroup={() => {}}
        onDelete={() => {}}
        onClearSelection={() => {}}
      />
    </DashboardLayout>
  );
};