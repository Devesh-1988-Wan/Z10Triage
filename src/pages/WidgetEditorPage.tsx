// src/pages/WidgetEditorPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DashboardGrid } from '@/components/widgets/DashboardGrid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Layout } from 'react-grid-layout';
import { WidgetConfig } from '@/types/dashboard';

export const WidgetEditorPage: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const {
    dashboardLayout,
    setDashboardLayout,
    isLoading,
    error,
    refetch,
    ...data
  } = useDashboardData(dashboardId);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleLayoutChange = (newGridLayout: Layout[]) => {
    if (dashboardLayout) {
      const updatedWidgets = dashboardLayout.widgets.map(widget => {
        const layoutItem = newGridLayout.find(l => l.i === widget.id);
        return layoutItem ? { ...widget, layout: { ...widget.layout, ...layoutItem } } : widget;
      });
      setDashboardLayout({ ...dashboardLayout, widgets: updatedWidgets });
    }
  };

  const handleUpdateWidget = (updatedWidget: WidgetConfig) => {
    if (dashboardLayout) {
      const updatedWidgets = dashboardLayout.widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w);
      setDashboardLayout({ ...dashboardLayout, widgets: updatedWidgets });
    }
  };

  const handleSaveLayout = async () => {
    if (!dashboardLayout) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('dashboard_layout')
        .update({ layout: { widgets: dashboardLayout.widgets } })
        .eq('id', dashboardId);

      if (error) throw error;
      toast({ title: "Layout Saved", description: "Your dashboard layout has been updated." });
      refetch();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save layout.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayoutComponent onExportPdf={() => {}}>
        <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>
      </DashboardLayoutComponent>
    );
  }

  if (error) {
    return (
      <DashboardLayoutComponent onExportPdf={() => {}}>
        <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      </DashboardLayoutComponent>
    );
  }

  return (
    <DashboardLayoutComponent onExportPdf={() => {}}>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Dashboard Editor</h1>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link to={`/dashboard/${dashboardId}`}><ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard</Link>
            </Button>
            <Button onClick={handleSaveLayout} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Layout
            </Button>
          </div>
        </div>
        {dashboardLayout && (
          <DashboardGrid
            layout={dashboardLayout.widgets}
            onLayoutChange={handleLayoutChange}
            isDraggable={true}
            data={data}
            onWidgetClick={() => {}}
            onUpdateWidget={handleUpdateWidget}
          />
        )}
      </div>
    </DashboardLayoutComponent>
  );
};