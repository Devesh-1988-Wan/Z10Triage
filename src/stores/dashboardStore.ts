// src/stores/dashboardStore.ts
import create from 'zustand';
import { WidgetConfig } from '@/types/dashboard';

interface DashboardState {
  selectedWidgets: string[];
  multiSelectMode: boolean;
  toggleWidgetSelection: (widgetId: string) => void;
  clearWidgetSelection: () => void;
  updateWidget: (widget: WidgetConfig) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedWidgets: [],
  multiSelectMode: false,
  toggleWidgetSelection: (widgetId) =>
    set((state) => ({
      selectedWidgets: state.selectedWidgets.includes(widgetId)
        ? state.selectedWidgets.filter((id) => id !== widgetId)
        : [...state.selectedWidgets, widgetId],
    })),
  clearWidgetSelection: () => set({ selectedWidgets: [] }),
  updateWidget: (widget) =>
    set((state) => ({
      // This is a placeholder. In a real application, you would have a more robust
      // way of updating the layout in the store or through a dedicated function.
    })),
}));