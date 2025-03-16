// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';

// NEW imports
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BenchmarksPage from './pages/BenchMarks';
import LiveMonitorPage from './pages/LiveMonitorPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/history" element={<HistoryPage />} />

      {/* New Routes */}
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/benchmarks" element={<BenchmarksPage />} />
      <Route path="/live-monitor" element={<LiveMonitorPage />} />

      {/* Catch-all or additional routes */}
    </Routes>
  );
};

export default AppRoutes;
