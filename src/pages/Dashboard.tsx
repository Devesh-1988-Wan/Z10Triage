// src/pages/Dashboard.tsx

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { generatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { Link } from 'react-router-dom';
import { EditableText } from '@/components/EditableText'; // Import EditableText
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { cn } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    dashboardId,
    dashboardName,
    dashboardDescription,
    dashboardLayout,
    bugReports,
    customerTickets,
    developmentTickets,
    dashboardMetrics,
    isLoading: isDataLoading,
    error,
    refetch,
  } = useDashboardData();
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const handleSaveTitle = async (newName: string, newDescription: string) => {
    if (!dashboardId) return;
    
    const { error } = await supabase
      .from('dashboard_layout')
      .update({ dashboard_name: newName, dashboard_description: newDescription })
      .eq('id', dashboardId);

    if (error) {
      toast({ title: "Error", description: "Failed to update dashboard details.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Dashboard updated successfully." });
      refetch();
    }
  };
  
  // ... (handleExportPdf and loading/error states)

  return (
    <DashboardLayout onExportPdf={handleExportPdf}>
      <div id="dashboard-content" className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <EditableText
              initialValue={dashboardName}
              onSave={(value) => handleSaveTitle(value, dashboardDescription)}
              isEditing={isAdmin}
              className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent"
              inputClassName="text-3xl font-bold"
            />
            <EditableText
              initialValue={dashboardDescription}
              onSave={(value) => handleSaveTitle(dashboardName, value)}
              isEditing={isAdmin}
              as="textarea"
              className="text-muted-foreground"
              inputClassName="text-muted-foreground mt-1"
            />
          </div>
          {isAdmin && (
            <Button asChild variant="outline">
              <Link to="/dashboard/editor">
                <Settings className="w-4 h-4 mr-2" />
                Customize Dashboard
              </Link>
            </Button>
          )}
        </div>

        {/* Dynamic Widget Rendering */}
        {/* ... (rest of the component) */}
      </div>
    </DashboardLayout>
  );
};