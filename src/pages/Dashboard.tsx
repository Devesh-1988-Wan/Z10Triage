// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DashboardGrid } from '@/components/widgets/DashboardGrid';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Settings, Edit, Plus, Share2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/DateRangePicker'; // Corrected import path and component name
import { AdminForms } from '@/components/AdminForms';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from 'react-grid-layout';

const Dashboard: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    dashboardLayout,
    setDashboardLayout,
    bugReports,
    customerTickets,
    developmentTickets,
    dashboardMetrics,
    widgetContent,
    isLoading,
    error,
    refetch,
    dateRange,
    setDateRange,
  } = useDashboardData(dashboardId);

  const [isEditable, setIsEditable] = useState(false);
  
  const handleLayoutChange = (newLayout: Layout[]) => {
    if (dashboardLayout) {
      const updatedWidgets = dashboardLayout.widgets.map(widget => {
        const layoutItem = newLayout.find(l => l.i === widget.id);
        return layoutItem ? { ...widget, layout: { ...widget.layout, ...layoutItem } } : widget;
      });
      setDashboardLayout({ ...dashboardLayout, widgets: updatedWidgets });
    }
  };

  const handleSaveLayout = async () => {
    if (!dashboardLayout) return;
    try {
        const { error } = await supabase
            .from('dashboard_layout')
            .update({ layout: { widgets: dashboardLayout.widgets } })
            .eq('id', dashboardId);
        if (error) throw error;
        toast({ title: "Success", description: "Dashboard layout saved successfully" });
        setIsEditable(false);
    } catch (err) {
        toast({ title: "Error", description: "Failed to save layout", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-destructive text-center p-4">{error}</div>;
  }
  
  const canEdit = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <DashboardLayout 
      title={dashboardLayout?.name || 'Dashboard'}
      description={dashboardLayout?.description}
      onExportPdf={() => { /* Implement PDF export */ }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {canEdit && (
            <>
              <Button variant="outline" onClick={() => navigate('/dashboard/editor/new')}>
                <Plus className="w-4 h-4 mr-2" /> New
              </Button>
              <Button variant="outline" onClick={() => navigate(`/dashboard/editor/${dashboardId}`)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            </>
          )}
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <DateRangePicker // Corrected component name
            dateRange={dateRange}
            onDateChange={(range) => setDateRange(range)}
          />
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          {isEditable && (
            <Button onClick={handleSaveLayout}>Save Layout</Button>
          )}
        </div>
      </div>

      {canEdit && <AdminForms 
        onDataUpdate={refetch}
        bugReports={bugReports}
        customerTickets={customerTickets}
        developmentTickets={developmentTickets}
        widgetContent={widgetContent}
        dashboardMetrics={dashboardMetrics}
      />}
      
      {dashboardLayout && (
        <DashboardGrid
          layout={dashboardLayout.widgets}
          onLayoutChange={handleLayoutChange}
          isEditable={isEditable}
          data={{ bugReports, customerTickets, developmentTickets, dashboardMetrics, widgetContent }}
          isLoading={isLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;