import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../pages/Index';
import Auth from '../pages/Auth';
import { PublicDashboard } from '../pages/PublicDashboard';
import NotFound from '../pages/NotFound';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/share/:shareKey" element={<PublicDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;