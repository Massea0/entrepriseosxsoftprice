
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIContextProvider } from "@/components/ai/AIContextProvider";
import { ThemeProvider } from "next-themes";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import OfflineIndicator from "@/components/pwa/OfflineIndicator";

import { Suspense, lazy, startTransition } from "react";

// 🚀 PHASE 4 - LAZY LOADING OPTIMISÉ
// Pages critiques chargées immédiatement
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";

// Pages secondaires en lazy loading
const WorkDashboard = lazy(() => import("./pages/WorkDashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectsList = lazy(() => import("./pages/ProjectsList"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ProjectsKanban = lazy(() => import("./pages/projects/kanban"));
const ProjectsTimeline = lazy(() => import("./pages/projects/timeline"));
const ProjectForm = lazy(() => import("./pages/projects/new"));
const MyTasks = lazy(() => import("./pages/projects/my-tasks"));
const TaskDetailGitLab = lazy(() => import("./pages/TaskDetailGitLab"));
const HRDashboard = lazy(() => import("./pages/hr/HRDashboard"));
const Employees = lazy(() => import("./pages/hr/Employees"));
const EmployeeDetail = lazy(() => import("./pages/hr/EmployeeDetail"));
const Departments = lazy(() => import("./pages/hr/Departments"));
const Organization = lazy(() => import("./pages/hr/Organization"));
const Quotes = lazy(() => import("./pages/business/Quotes"));
const QuotesPage = lazy(() => import("./pages/quotes"));
const QuoteForm = lazy(() => import("./pages/business/QuoteForm"));
const QuoteDetail = lazy(() => import("./pages/business/QuoteDetail"));
const PaymentsPage = lazy(() => import("./pages/payments"));
const FinancialReports = lazy(() => import("./pages/financial-reports"));
const Invoices = lazy(() => import("./pages/business/Invoices"));
const InvoicesPage = lazy(() => import("./pages/invoices"));
const InvoiceForm = lazy(() => import("./pages/business/InvoiceForm"));
const InvoiceDetail = lazy(() => import("./pages/business/InvoiceDetail"));
const Clients = lazy(() => import("./pages/business/Clients"));
const ClientForm = lazy(() => import("./pages/business/ClientForm"));
const Contracts = lazy(() => import("./pages/business/Contracts"));
const ContractForm = lazy(() => import("./pages/business/ContractForm"));
const ContractDetail = lazy(() => import("./pages/business/ContractDetail"));
const BusinessDashboard = lazy(() => import("./pages/business/BusinessDashboard"));
const EmployeeDashboard = lazy(() => import("./pages/employee/EmployeeDashboard"));
const EmployeeProfile = lazy(() => import("./pages/employee/EmployeeProfile"));
const EmployeeAssignments = lazy(() => import("./pages/employee/EmployeeAssignments"));
const LeaveManagement = lazy(() => import("./pages/employee/LeaveManagement"));
const LeaveRequest = lazy(() => import("./pages/employee/LeaveRequest"));
const TimeTracking = lazy(() => import("./pages/employee/TimeTracking"));
const SickLeaveManagement = lazy(() => import("./pages/employee/SickLeaveManagement"));
const PerformanceReviews = lazy(() => import("./pages/employee/PerformanceReviews"));
const PayrollBenefits = lazy(() => import("./pages/employee/PayrollBenefits"));
const Training = lazy(() => import("./pages/employee/Training"));
const Communication = lazy(() => import("./pages/employee/Communication"));
const SynapsePage = lazy(() => import("./pages/SynapsePage"));
const SupportAdmin = lazy(() => import("./pages/admin/SupportAdmin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const PracticalAdminDashboard = lazy(() => import("./pages/admin/PracticalAdminDashboard"));
const EnhancedAdminDashboard = lazy(() => import("./pages/admin/EnhancedAdminDashboard"));
const ConfigDashboard = lazy(() => import("./pages/admin/ConfigDashboard"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const PerformanceDashboard = lazy(() => import("./pages/admin/PerformanceDashboard"));
const IntegrationsHub = lazy(() => import("./pages/admin/IntegrationsHub"));
const QuantumAdminDashboard = lazy(() => import("./pages/admin/QuantumAdminDashboard"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const WorkflowAdmin = lazy(() => import("./pages/admin/WorkflowAdmin"));
const SecurityAdmin = lazy(() => import("./pages/SecurityAdmin"));
const Settings = lazy(() => import("./pages/Settings"));
const NotificationTestPage = lazy(() => import("./pages/NotificationTest"));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));
const TeamManagement = lazy(() => import("./pages/manager/TeamManagement"));
const TeamApprovals = lazy(() => import("./pages/manager/TeamApprovals"));
const TeamPerformance = lazy(() => import("./pages/manager/TeamPerformance"));
const TeamSchedule = lazy(() => import("./pages/manager/TeamSchedule"));
const TeamReports = lazy(() => import("./pages/manager/TeamReports"));
const ProjectAssignments = lazy(() => import("./pages/manager/ProjectAssignments"));
const ClientProjects = lazy(() => import("./pages/client/ClientProjects"));
const ClientInvoices = lazy(() => import("./pages/client/ClientInvoices"));
const ClientSupport = lazy(() => import("./pages/client/ClientSupport"));

// 🤖 AI PAGES - GRAND LEAP TODO Phase 2.2
const WorkflowDesigner = lazy(() => import("./pages/ai/WorkflowDesigner"));
const PredictiveDashboard = lazy(() => import("./pages/ai/PredictiveDashboard"));
const NaturalLanguageInterface = lazy(() => import("./pages/ai/NaturalLanguageInterface"));
const AIInsights = lazy(() => import("./pages/ai/InsightsPage"));
const AIPredictions = lazy(() => import("./pages/ai/predictions"));
const AIAutoAssign = lazy(() => import("./pages/ai/auto-assign"));
const AIVoice = lazy(() => import("./pages/ai/voice"));

// Onboarding pages
const OnboardingFlow = lazy(() => import("./pages/onboarding/OnboardingFlow"));
const OnboardingSuccess = lazy(() => import("./pages/onboarding/OnboardingSuccess"));

// Landing page
const Landing = lazy(() => import("./pages/Landing"));

// Planning pages
const ProjectPlanning = lazy(() => import("./pages/projects/planning"));

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AIContextProvider>
                <>
                  <Routes>
                {/* Public routes */}
                <Route path="/landing" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>}>
                    <Landing />
                  </Suspense>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Onboarding routes (public) */}
                <Route path="/onboarding" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>}>
                    <OnboardingFlow />
                  </Suspense>
                } />
                <Route path="/onboarding/success/:id" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>}>
                    <OnboardingSuccess />
                  </Suspense>
                } />
                
                {/* Protected routes with layout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Index />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/work-dashboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <WorkDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/synapse" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <SynapsePage />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/projects" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin', 'manager', 'employee']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Projects />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/projects/list" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ProjectsList />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/projects/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ProjectDetail />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects/kanban" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ProjectsKanban />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects/timeline" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ProjectsTimeline />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects/new" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ProjectForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects/my-tasks" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <MyTasks />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/projects/:id/planning" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ProjectPlanning />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/tasks/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <TaskDetailGitLab />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* HR Routes */}
                <Route path="/hr" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <HRDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/hr/employees" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Employees />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/hr/employees/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <EmployeeDetail />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/hr/departments" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Departments />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/hr/organization" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Organization />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Business Routes */}
                <Route path="/business/dashboard" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin', 'manager']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <BusinessDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/quotes" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Quotes />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/quotes/new" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <QuoteForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/quotes/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <QuoteDetail />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/quotes/:id/edit" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <QuoteForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/invoices" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Invoices />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/invoices/new" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <InvoiceForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/invoices/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <InvoiceDetail />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/invoices/:id/edit" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <InvoiceForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/clients" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Clients />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/clients/new" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/clients/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Clients />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/clients/:id/edit" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/contracts" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Contracts />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/contracts/new" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ContractForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/contracts/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ContractDetail />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/business/contracts/:id/edit" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ContractForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <PracticalAdminDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <EnhancedAdminDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/enhanced" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <PracticalAdminDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/config" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ConfigDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Ancien dashboard avec éléments décoratifs - gardé pour comparaison */}
                <Route path="/admin/old-dashboard" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <AdminDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/quantum" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <QuantumAdminDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/overview" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <AdminOverview />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/performance" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <PerformanceDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/integrations" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <IntegrationsHub />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/support" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <SupportAdmin />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/workflows" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <WorkflowAdmin />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/security" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <SecurityAdmin />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* 🤖 AI Routes - GRAND LEAP TODO Phase 2.2 */}
                <Route path="/ai/workflow-designer" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <WorkflowDesigner />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/ai/predictive-dashboard" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin', 'manager']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <PredictiveDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/ai/natural-language" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin', 'manager']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <NaturalLanguageInterface />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/support/tickets" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <SupportAdmin />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/support/knowledge" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Base de connaissances</h1>
                        <p className="text-muted-foreground">Cette section sera bientôt disponible.</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Manager Routes */}
                <Route path="/manager/dashboard" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ManagerDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/manager/team" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <TeamManagement />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/manager/assignments" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ProjectAssignments />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/manager/approvals" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <TeamApprovals />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/manager/performance" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <TeamPerformance />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/manager/schedule" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <TeamSchedule />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/manager/reports" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <TeamReports />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Client Routes */}
                <Route path="/client/dashboard" element={
                  <ProtectedRoute requiredRole="client">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/client/projects" element={
                  <ProtectedRoute requiredRole="client">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientProjects />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/client/invoices" element={
                  <ProtectedRoute requiredRole="client">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientInvoices />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Employee Routes */}
                <Route path="/employee/dashboard" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <EmployeeDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/profile" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <EmployeeProfile />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/assignments" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <EmployeeAssignments />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/leave" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <LeaveManagement />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/leave-request" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <LeaveRequest />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/time" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <TimeTracking />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/sick-leave" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <SickLeaveManagement />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/performance" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <PerformanceReviews />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/payroll" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <PayrollBenefits />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/training" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Training />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employee/communication" element={
                  <ProtectedRoute requiredRole="employee">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Communication />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* AI Routes */}
                <Route path="/ai/insights" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <AIInsights />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/ai/predictions" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <AIPredictions />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/ai/auto-assign" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <AIAutoAssign />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/ai/voice" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <AIVoice />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Direct Business Routes (for sidebar navigation) */}
                <Route path="/invoices" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <InvoicesPage />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/invoices/new" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <InvoiceForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/invoices/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <InvoiceDetail />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/quotes" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <QuotesPage />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/quotes/new" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <QuoteForm />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/quotes/:id" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <QuoteDetail />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/contracts" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Contracts />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <PaymentsPage />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/financial-reports" element={
                  <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <FinancialReports />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Settings Route */}
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Settings />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Client Routes */}
                <Route path="/client/dashboard" element={
                  <ProtectedRoute requiredRole="client">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientDashboard />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/client/projects" element={
                  <ProtectedRoute requiredRole="client">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientProjects />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/client/invoices" element={
                  <ProtectedRoute requiredRole="client">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientInvoices />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/client/support" element={
                  <ProtectedRoute requiredRole="client">
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <ClientSupport />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Notification Test Route - Pour développement */}
                <Route path="/notification-test" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <NotificationTestPage />
                      </Suspense>
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Redirect unmatched routes to home page for role-based routing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

            </>
          </AIContextProvider>
          </AuthProvider>
        </BrowserRouter>
        
        {/* PWA Components */}
        <PWAInstallPrompt />
        <OfflineIndicator />
        
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
