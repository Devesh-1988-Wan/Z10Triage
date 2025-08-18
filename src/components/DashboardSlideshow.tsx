// src/components/DashboardSlideshow.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { WidgetRenderer } from './WidgetRenderer';
import { DashboardLayout } from '@/types/dashboard';

interface DashboardSlideshowProps {
  layout: DashboardLayout;
  data: any; // The data for the widgets
}

export const DashboardSlideshow: React.FC<DashboardSlideshowProps> = ({ layout, data }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      {layout.widgets.map((widgetConfig) => (
        <SwiperSlide key={widgetConfig.id}>
          <div className="p-4">
            <WidgetRenderer config={widgetConfig} data={data} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};