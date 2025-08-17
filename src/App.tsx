// src/App.tsx
import React, { useEffect, Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from 'lucide-react';
import { DashboardProvider } from "@/contexts/DashboardContext"; // Corrected import path

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy-loaded components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EnhancedDashboardBuilder = lazy(() => import("@/components/DashboardBuilder/EnhancedDashboardBuilder"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PublicDashboard = lazy(() => import("./pages/PublicDashboard"));
const DashboardHub = lazy(() => import('./pages/DashboardHub'));

const App: React.FC = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        queryClient.setPaused(true);
      } else {
        queryClient.setPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DashboardProvider>
            <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardHub />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/:dashboardId" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/editor/:dashboardId" element={
                    <ProtectedRoute requiredRole="admin">
                      <EnhancedDashboardBuilder />
                    </ProtectedRoute>
                  } />
                  <Route path="/public/dashboard/:shareKey" element={<PublicDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </DashboardProvider>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;