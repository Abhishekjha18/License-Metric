// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import BenchmarksPage from './pages/BenchMarks';
import LiveMonitorPage from './pages/LiveMonitorPage';
import Layout from './layouts/layout';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes without the sidebar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Protected routes with the sidebar layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/benchmarks" element={<BenchmarksPage />} />
        <Route path="/live-monitor" element={<LiveMonitorPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;