import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { lazyWithRetry, preloadComponents } from '@/utils/lazyWithRetry';
import { queryClient } from '@/lib/queryClient';
import { AIContextProvider } from '@/components/ai/AIContextProvider';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <div className="relative">
      <div className="h-32 w-32 border-4 border-purple-500/20 rounded-full animate-pulse" />
      <div className="absolute inset-0 h-32 w-32 border-4 border-t-purple-500 rounded-full animate-spin" />
      <div className="absolute inset-4 h-24 w-24 border-4 border-r-pink-500 rounded-full animate-spin-slow" />
      <div className="absolute inset-8 h-16 w-16 border-4 border-b-blue-500 rounded-full animate-spin-reverse" />
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl font-bold text-red-500">Oops! Une erreur est survenue</h1>
            <p className="text-gray-400">{this.state.error?.message}</p>
            <button
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
              onClick={() => window.location.reload()}
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load all pages with retry logic
const LoginPage = lazyWithRetry(() => import('@/pages/auth/LoginPage'));
const Index = lazyWithRetry(() => import('@/pages/Index'));

// Admin pages
const AdminDashboard = lazyWithRetry(() => import('@/pages/admin/AdminDashboard'));
const AdminDashboardOptimized = lazyWithRetry(() => import('@/pages/admin/AdminDashboardOptimized'));
const QuantumAdminDashboard = lazyWithRetry(() => import('@/pages/admin/QuantumAdminDashboard'));
const ConfigDashboard = lazyWithRetry(() => import('@/pages/admin/ConfigDashboard'));
const AdminOverview = lazyWithRetry(() => import('@/pages/admin/AdminOverview'));
const SynapsePage = lazyWithRetry(() => import('@/pages/SynapsePage'));
const IntegrationsHub = lazyWithRetry(() => import('@/pages/admin/IntegrationsHub'));

// Manager pages
const ManagerDashboard = lazyWithRetry(() => import('@/pages/manager/ManagerDashboard'));
const TeamManagement = lazyWithRetry(() => import('@/pages/manager/TeamManagement'));
const TeamApprovals = lazyWithRetry(() => import('@/pages/manager/TeamApprovals'));
const TeamPerformance = lazyWithRetry(() => import('@/pages/manager/TeamPerformance'));
const TeamSchedule = lazyWithRetry(() => import('@/pages/manager/TeamSchedule'));
const TeamReports = lazyWithRetry(() => import('@/pages/manager/TeamReports'));
const ProjectAssignments = lazyWithRetry(() => import('@/pages/manager/ProjectAssignments'));

// Employee pages
const EmployeeDashboard = lazyWithRetry(() => import('@/pages/employee/EmployeeDashboard'));
const EmployeeProfile = lazyWithRetry(() => import('@/pages/employee/EmployeeProfile'));
const EmployeeAssignments = lazyWithRetry(() => import('@/pages/employee/EmployeeAssignments'));
const LeaveManagement = lazyWithRetry(() => import('@/pages/employee/LeaveManagement'));
const TimeTracking = lazyWithRetry(() => import('@/pages/employee/TimeTracking'));
const SickLeaveManagement = lazyWithRetry(() => import('@/pages/employee/SickLeaveManagement'));
const PerformanceReviews = lazyWithRetry(() => import('@/pages/employee/PerformanceReviews'));
const PayrollBenefits = lazyWithRetry(() => import('@/pages/employee/PayrollBenefits'));
const Training = lazyWithRetry(() => import('@/pages/employee/Training'));
const Communication = lazyWithRetry(() => import('@/pages/employee/Communication'));

// Client pages
const ClientDashboard = lazyWithRetry(() => import('@/pages/client/ClientDashboard'));
const ClientProjects = lazyWithRetry(() => import('@/pages/client/ClientProjects'));
const ClientInvoices = lazyWithRetry(() => import('@/pages/client/ClientInvoices'));
const ClientSupport = lazyWithRetry(() => import('@/pages/client/ClientSupport'));

// Common pages
const NotFound = lazyWithRetry(() => import('@/pages/NotFound'));

function AppOptimized() {
  // Preload critical routes on app start
  useEffect(() => {
    const criticalRoutes = [
      () => import('@/pages/admin/AdminDashboard'),
      () => import('@/pages/manager/ManagerDashboard'),
      () => import('@/pages/employee/EmployeeDashboard'),
      () => import('@/pages/client/ClientDashboard')
    ];
    
    // Preload after a short delay to not block initial render
    setTimeout(() => {
      preloadComponents(criticalRoutes);
    }, 2000);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="arcadis-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <AIContextProvider>
                <div className="min-h-screen bg-background text-foreground">
                  <CommandPalette />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/" element={<Index />} />

                      {/* Admin routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Navigate to="/admin/dashboard" replace />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/dashboard-optimized" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboardOptimized />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/quantum" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <QuantumAdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/config" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <ConfigDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/overview" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminOverview />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/synapse" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <SynapsePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/integrations" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <IntegrationsHub />
                        </ProtectedRoute>
                      } />

                      {/* Manager routes */}
                      <Route path="/manager" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <Navigate to="/manager/dashboard" replace />
                        </ProtectedRoute>
                      } />
                      <Route path="/manager/dashboard" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <ManagerDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/manager/team" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <TeamManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/manager/approvals" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <TeamApprovals />
                        </ProtectedRoute>
                      } />
                      <Route path="/manager/performance" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <TeamPerformance />
                        </ProtectedRoute>
                      } />
                      <Route path="/manager/schedule" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <TeamSchedule />
                        </ProtectedRoute>
                      } />
                      <Route path="/manager/reports" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <TeamReports />
                        </ProtectedRoute>
                      } />
                      <Route path="/manager/assignments" element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <ProjectAssignments />
                        </ProtectedRoute>
                      } />

                      {/* Employee routes */}
                      <Route path="/employee" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <Navigate to="/employee/dashboard" replace />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/dashboard" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <EmployeeDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/profile" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <EmployeeProfile />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/assignments" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <EmployeeAssignments />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/leave" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <LeaveManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/time" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <TimeTracking />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/sick-leave" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <SickLeaveManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/performance" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <PerformanceReviews />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/payroll" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <PayrollBenefits />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/training" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <Training />
                        </ProtectedRoute>
                      } />
                      <Route path="/employee/communication" element={
                        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                          <Communication />
                        </ProtectedRoute>
                      } />

                      {/* Client routes */}
                      <Route path="/client" element={
                        <ProtectedRoute allowedRoles={['client']}>
                          <Navigate to="/client/dashboard" replace />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/dashboard" element={
                        <ProtectedRoute allowedRoles={['client']}>
                          <ClientDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/projects" element={
                        <ProtectedRoute allowedRoles={['client']}>
                          <ClientProjects />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/invoices" element={
                        <ProtectedRoute allowedRoles={['client']}>
                          <ClientInvoices />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/support" element={
                        <ProtectedRoute allowedRoles={['client']}>
                          <ClientSupport />
                        </ProtectedRoute>
                      } />

                      {/* 404 route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Toaster />
                </div>
              </AIContextProvider>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default AppOptimized;