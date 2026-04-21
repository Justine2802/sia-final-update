import '@/styles/index.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import AdminLayout from '@/components/AdminLayout';
import ResidentLayout from '@/components/ResidentLayout';
import Dashboard from '@/pages/Dashboard';
import ResidentsPage from '@/pages/Residents';
import ProgramsPage from '@/pages/Programs';
import IncidentsPage from '@/pages/Incidents';
import CertificatesPage from '@/pages/Certificates';
import EnrollmentsPage from '@/pages/Enrollments';
import ResidentDashboard from '@/pages/ResidentDashboard';
import ResidentPage from '@/pages/Resident';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loading from '@/components/Loading';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // If not logged in, show login page
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Admin routes
  if (user.role === 'admin') {
    return (
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
        </Route>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Resident routes
  if (user.role === 'resident') {
    return (
      <Routes>
        <Route element={<ResidentLayout />}>
          <Route index element={<ResidentDashboard />} />
          <Route path="resident-dashboard" element={<ResidentDashboard />} />
          <Route path="resident-profile" element={<ResidentPage />} />
        </Route>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
