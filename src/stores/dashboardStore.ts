import { create } from 'zustand';
import { WidgetConfig, DashboardLayout } from '@/types/dashboard';

interface DashboardState {
  dashboardLayout: DashboardLayout | null;
  selectedWidgets: string[];
  multiSelectMode: boolean;
  setDashboardLayout: (layout: DashboardLayout) => void;
  toggleWidgetSelection: (widgetId: string) => void;
  clearWidgetSelection: () => void;
  updateWidget: (widget: WidgetConfig) => void;
  deleteWidgets: (widgetIds: string[]) => void;
  alignWidgets: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboardLayout: null,
  selectedWidgets: [],
  multiSelectMode: false,
  setDashboardLayout: (layout) => set({ dashboardLayout: layout }),
  toggleWidgetSelection: (widgetId) =>
    set((state) => {
      const selectedWidgets = state.selectedWidgets.includes(widgetId)
        ? state.selectedWidgets.filter((id) => id !== widgetId)
        : [...state.selectedWidgets, widgetId];
      return { selectedWidgets, multiSelectMode: selectedWidgets.length > 1 };
    }),
  clearWidgetSelection: () => set({ selectedWidgets: [], multiSelectMode: false }),
  updateWidget: (widget) =>
    set((state) => ({
      dashboardLayout: state.dashboardLayout
        ? {
            ...state.dashboardLayout,
            widgets: state.dashboardLayout.widgets.map((w) =>
              w.id === widget.id ? widget : w
            ),
          }
        : null,
    })),
  deleteWidgets: (widgetIds) =>
    set((state) => ({
      dashboardLayout: state.dashboardLayout
        ? {
            ...state.dashboardLayout,
            widgets: state.dashboardLayout.widgets.filter(
              (w) => !widgetIds.includes(w.id)
            ),
          }
        : null,
    })),
  alignWidgets: (alignment) =>
    set((state) => {
      if (!state.dashboardLayout || state.selectedWidgets.length < 2) return {};

      const selectedWidgets = state.dashboardLayout.widgets.filter((w) =>
        state.selectedWidgets.includes(w.id)
      );

      const layouts = selectedWidgets.map((w) => w.layout);

      let newLayouts;

      switch (alignment) {
        case 'left': {
          const minX = Math.min(...layouts.map((l) => l.x));
          newLayouts = layouts.map((l) => ({ ...l, x: minX }));
          break;
        }
        case 'right': {
          const maxX = Math.max(...layouts.map((l) => l.x + l.w));
          newLayouts = layouts.map((l) => ({ ...l, x: maxX - l.w }));
          break;
        }
        // ... (implement other alignment logic)
        default:
          newLayouts = layouts;
      }

      return {
        dashboardLayout: {
          ...state.dashboardLayout,
          widgets: state.dashboardLayout.widgets.map((w) => {
            const newLayout = newLayouts.find((l) => l.i === w.id);
            return newLayout ? { ...w, layout: newLayout } : w;
          }),
        },
      };
    }),
}));