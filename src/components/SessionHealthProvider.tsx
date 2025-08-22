import React from 'react';
import { useSessionHealth } from '@/hooks/useSessionHealth';

interface SessionHealthProviderProps {
  children: React.ReactNode;
}

export const SessionHealthProvider: React.FC<SessionHealthProviderProps> = ({ children }) => {
  useSessionHealth();
  return <>{children}</>;
};