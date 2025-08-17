import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Spinner from './components/Spinner';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/ProtectedRoute';

import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { WidgetEditorPage } from './pages/WidgetEditorPage';
import { DashboardHub } from './pages/DashboardHub';
import { PublicDashboard } from './pages/PublicDashboard';
import NotFound from './pages/NotFound';

function App() {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <Spinner />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/share/:shareKey" element={<PublicDashboard />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardHub /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/:dashboardId"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/editor/:dashboardId"
          element={<ProtectedRoute requiredRole="admin"><WidgetEditorPage /></ProtectedRoute>}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;