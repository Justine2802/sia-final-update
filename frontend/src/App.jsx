import '@/styles/index.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Auth Pages
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';

// Layout Components
import AdminLayout from '@/components/AdminLayout';
import ResidentLayout from '@/components/ResidentLayout';

// Admin Pages
import Dashboard from '@/pages/Dashboard';
import ResidentsPage from '@/pages/Residents';
import ProgramsPage from '@/pages/Programs';
import IncidentsPage from '@/pages/Incidents';
import CertificatesPage from '@/pages/Certificates';
import EnrollmentsPage from '@/pages/Enrollments';

// Resident Pages
import ResidentDashboard from '@/pages/ResidentDashboard';
import ResidentPage from '@/pages/Resident';
import ResidentPrograms from '@/pages/ResidentPrograms';
import ResidentIncidents from '@/pages/ResidentIncidents';
import ResidentCertificates from '@/pages/ResidentCertificates';

// Common Components
import Loading from '@/components/Loading';

function AppRoutes() {
  const { user, loading } = useAuth();

  // 1. Handle Loading State
  if (loading) {
    return <Loading />;
  }

  // 2. Handle Public Routes (If NOT logged in)
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Redirect any other path to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 3. Handle Admin Routes
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
        {/* Redirect authenticated admins away from auth pages */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 4. Handle Resident Routes
  if (user.role === 'resident') {
    return (
      <Routes>
        <Route element={<ResidentLayout />}>
          <Route index element={<ResidentDashboard />} />
          <Route path="resident-dashboard" element={<ResidentDashboard />} />
          <Route path="resident-programs" element={<ResidentPrograms />} />
          <Route path="resident-incidents" element={<ResidentIncidents />} />
          <Route path="resident-certificates" element={<ResidentCertificates />} />
          <Route path="resident-profile" element={<ResidentPage />} />
        </Route>
        {/* Redirect authenticated residents away from auth pages */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Fallback for safety
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