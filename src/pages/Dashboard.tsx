// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Settings, Plus, LayoutTemplate, Download, Play, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData, DEFAULT_DASHBOARD_LAYOUT } from '@/hooks/useDashboardData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DashboardGrid } from '@/components/widgets/DashboardGrid';
import { WidgetConfig } from '@/types/dashboard';
import { WidgetDetailModal } from '@/components/WidgetDetailModal';
import { GlobalFilters } from '@/components/GlobalFilters';
import { PresentationControls } from '@/components/PresentationControls';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { WidgetRenderer } from '@/components/WidgetRenderer';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const {
    dashboardLayout,
    setDashboardLayout,
    bugReports,
    customerTickets,
    developmentTickets,
    dashboardMetrics,
    widgetContent,
    isLoading: isDataLoading,
    error,
    refetch,
    dateRange,
    setDateRange,
  } = useDashboardData(dashboardId);
  const { toast } = useToast();
  const [isSavingDefault, setIsSavingDefault] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);
  const [presentationMode, setPresentationMode] = useState<'none' | 'slideshow' | 'focus'>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setInterval] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const hasWidgets = dashboardLayout && dashboardLayout.widgets.length > 0;

  const handleLayoutChange = (newLayout: any[]) => {
    if (dashboardLayout) {
      const updatedWidgets = dashboardLayout.widgets.map(widget => {
        const layoutItem = newLayout.find(l => l.i === widget.id);
        return layoutItem ? { ...widget, layout: layoutItem } : widget;
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

  const handleLoadDefaultLayout = async () => {
    if (!user || !dashboardId) return;
    setIsSavingDefault(true);
    try {
      const { error } = await supabase
        .from('dashboard_layout')
        .update({ layout: DEFAULT_DASHBOARD_LAYOUT })
        .eq('id', dashboardId);

      if (error) throw error;
      toast({ title: "Default Layout Loaded" });
      refetch();
    } catch (error) {
      toast({ title: "Error", description: `Failed to load default layout: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
    } finally {
      setIsSavingDefault(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePlayPause = () => {
    if(swiperInstance) {
      if(isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isDataLoading) {
    return (
      <DashboardLayoutComponent onExportPdf={() => {}}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
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
  
  const renderDashboardContent = () => {
    if (presentationMode === 'slideshow') {
      return (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: interval * 1000, disableOnInteraction: false }}
          onSwiper={setSwiperInstance}
        >
          {dashboardLayout?.widgets.map((widgetConfig) => (
            <SwiperSlide key={widgetConfig.id}>
              <div className="p-4 h-[70vh] flex items-center justify-center">
                <WidgetRenderer 
                  config={widgetConfig} 
                  data={{ bugReports, customerTickets, developmentTickets, dashboardMetrics, widgetContent }} 
                  isLoading={false}
                  isEditable={false} 
                  onUpdate={() => {}} 
                  onClick={() => {}} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    if (hasWidgets) {
      return (
        <DashboardGrid
          layout={dashboardLayout.widgets}
          onLayoutChange={handleLayoutChange}
          isDraggable={false}
          data={{ bugReports, customerTickets, developmentTickets, dashboardMetrics, widgetContent }}
          isLoading={false}
          onWidgetClick={setSelectedWidget}
          onUpdateWidget={handleUpdateWidget}
        />
      );
    }

    return (
      <Card className="shadow-card">
        <CardContent className="pt-6 text-center">
          {isAdmin ? (
            <div className="space-y-4 max-w-lg mx-auto py-8">
              <LayoutTemplate className="w-16 h-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-semibold">Your Dashboard is Empty</h2>
              <p className="text-muted-foreground">
                You can start by creating a custom layout from scratch or by loading our recommended default layout.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button asChild><Link to={`/dashboard/editor/${dashboardId}`}><Plus className="w-4 h-4 mr-2" />Start with a Blank Canvas</Link></Button>
                <Button variant="outline" onClick={handleLoadDefaultLayout} disabled={isSavingDefault}>
                  {isSavingDefault ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  Load Default Layout
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No widgets have been configured for this dashboard. Please contact an administrator.</p>
          )}
        </CardContent>
      </Card>
    );
  };


  return (
    <DashboardLayoutComponent onExportPdf={() => {}}>
      <div id="dashboard-content" className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{dashboardLayout?.name || 'Dashboard'}</h1>
            <p className="text-muted-foreground">{dashboardLayout?.description || 'Overview'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <GlobalFilters dateRange={dateRange} setDateRange={setDateRange} />
            {hasWidgets && (
              <>
                <Button variant="outline" onClick={() => setPresentationMode(presentationMode === 'slideshow' ? 'none' : 'slideshow')}>
                  <Play className="w-4 h-4 mr-2" />
                  {presentationMode === 'slideshow' ? 'Exit Slideshow' : 'Slideshow'}
                </Button>
                {presentationMode === 'slideshow' && (
                  <PresentationControls
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onNext={() => swiperInstance?.slideNext()}
                    interval={interval}
                    onIntervalChange={setInterval}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                  />
                )}
              </>
            )}
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to={`/dashboard/editor/${dashboardId}`}><Settings className="w-4 h-4 mr-2" />Customize</Link>
              </Button>
            )}
          </div>
        </div>
        {renderDashboardContent()}
      </div>
      <WidgetDetailModal
        widget={selectedWidget}
        onOpenChange={(open) => !open && setSelectedWidget(null)}
        data={{ bugReports, customerTickets, developmentTickets, dashboardMetrics, widgetContent }}
      />
    </DashboardLayoutComponent>
  );
};