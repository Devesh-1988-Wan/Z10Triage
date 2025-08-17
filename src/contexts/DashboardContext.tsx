import React, { createContext, useContext } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import type { StoreApi } from 'zustand';

// The type here should match the state shape from your Zustand store
type DashboardState = ReturnType<typeof useDashboardStore.getState>;

export const DashboardContext = createContext<StoreApi<DashboardState> | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardContext.Provider value={useDashboardStore}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const store = useContext(DashboardContext);
  if (store === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return store(state => state); // This returns the entire state
};