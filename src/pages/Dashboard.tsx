import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/DashboardLayout';
import { DashboardGrid } from '@/components/widgets/DashboardGrid';
import { Button } from '@/components/ui/button';
import { Edit, Play, StopCircle, Maximize, Calendar as CalendarIcon, ChevronsUpDown } from 'lucide-react';
import { DateRangePicker } from '@/components/DateRangePicker';
import { WidgetDetailModal } from '@/components/WidgetDetailModal';
import { WidgetConfig } from '@/types/dashboard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const {
    dashboardLayout,
    setDashboardLayout,
    isLoading,
    error,
    refetch,
    dateRange,
    setDateRange,
    ...data
  } = useDashboardData(dashboardId);

  const [presentationMode, setPresentationMode] = useState<'slideshow' | 'default'>('default');
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);

  const handleUpdateWidget = (updatedWidget: WidgetConfig) => {
    if (dashboardLayout) {
      const updatedWidgets = dashboardLayout.widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w);
      setDashboardLayout({ ...dashboardLayout, widgets: updatedWidgets });
    }
  };

  const dashboardName = useMemo(() => dashboardLayout?.name || 'Dashboard', [dashboardLayout]);
  const dashboardDescription = useMemo(() => dashboardLayout?.description, [dashboardLayout]);

  if (isLoading) {
    return (
      <DashboardLayoutComponent onExportPdf={() => {}}>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-6 w-1/2" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full col-span-2" />
            <Skeleton className="h-64 w-full col-span-2" />
          </div>
        </div>
      </DashboardLayoutComponent>
    );
  }

  if (error) {
    return (
       <DashboardLayoutComponent onExportPdf={() => {}}>
        <div className="container mx-auto p-6">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
              <Button onClick={() => navigate('/dashboard')} variant="link" className="p-0 h-auto mt-2">Go to Dashboard Hub</Button>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayoutComponent>
    );
  }

  return (
    <DashboardLayoutComponent onExportPdf={() => console.log('Exporting PDF...')}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">{dashboardName}</h1>
          {dashboardDescription && <p className="text-muted-foreground">{dashboardDescription}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <DateRangePicker dateRange={dateRange} onDateChange={setDateRange} />
          {presentationMode === 'default' ? (
            <Button variant="outline" onClick={() => setPresentationMode('slideshow')}>
              <Play className="w-4 h-4 mr-2" />
              Slideshow
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setPresentationMode('default')}>
              <StopCircle className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
          <Button asChild>
            <Link to={`/dashboard/editor/${dashboardId}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Dashboard
            </Link>
          </Button>
        </div>
      </div>
      
      {presentationMode === 'slideshow' ? (
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="h-[calc(100vh-200px)]"
        >
          {dashboardLayout?.widgets.map(widget => (
            <SwiperSlide key={widget.id} className="p-10">
               <div className="h-full w-full">
                <DashboardGrid
                  layout={[widget]}
                  onLayoutChange={() => {}}
                  isDraggable={false}
                  isResizable={false}
                  data={data}
                  isLoading={isLoading}
                  onWidgetClick={() => {}}
                  onUpdateWidget={handleUpdateWidget}
                  isPresentationMode
                />
               </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        dashboardLayout && (
          <DashboardGrid
            layout={dashboardLayout.widgets}
            onLayoutChange={() => {}} // Layout changes are handled in the editor
            isDraggable={false}
            isResizable={false}
            data={data}
            isLoading={isLoading}
            onWidgetClick={(widget) => setSelectedWidget(widget)}
            onUpdateWidget={handleUpdateWidget}
          />
        )
      )}

      {selectedWidget && (
        <WidgetDetailModal
          widget={selectedWidget}
          data={data}
          isLoading={isLoading}
          isOpen={!!selectedWidget}
          onClose={() => setSelectedWidget(null)}
        />
      )}
    </DashboardLayoutComponent>
  );
};