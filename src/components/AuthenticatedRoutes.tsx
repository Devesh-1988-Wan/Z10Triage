import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import { WidgetEditorPage } from '../pages/WidgetEditorPage';
import { DashboardHub } from '../pages/DashboardHub';
import NotFound from '../pages/NotFound';


const AuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardHub /></ProtectedRoute>} />
      <Route path="/:dashboardId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/editor/:dashboardId" element={<ProtectedRoute requiredRole="admin"><WidgetEditorPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AuthenticatedRoutes;