
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, MessageSquare, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { AIInsightsDashboard } from '@/components/ai/AIInsightsDashboard';
import { SynapseInsights } from '@/components/ai/SynapseInsights';
import { useState } from 'react';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ClientDashboard from '@/pages/client/ClientDashboard';
import EmployeeDashboard from '@/pages/employee/EmployeeDashboard';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const userRole = user?.user_metadata?.role;

  // Afficher un spinner pendant que le rôle se charge
  if (loading || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className=" rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirection vers les dashboards spécialisés selon le rôle
  if (userRole === 'admin' || userRole === 'super_admin') {
    return <AdminDashboard />;
  }
  
  if (userRole === 'client') {
    return <ClientDashboard />;
  }
  
  if (userRole === 'employee' || userRole === 'hr_manager' || userRole === 'hr_admin') {
    return <EmployeeDashboard />;
  }

  // Fallback sécurisé
  console.warn('Unknown user role:', userRole);
  return <ClientDashboard />;
}
