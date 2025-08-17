import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  onExportPdf?: () => void; // Changed to optional
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, description, onExportPdf }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} description={description} onExportPdf={onExportPdf} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};