import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  Building2, 
  DollarSign,
  Activity,
  Target,
  Shield,
  Eye,
  BarChart3,
  Rocket,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  HoverZone,
  StaggeredList,
  StaggeredItem,
  EnhancedCard,
  AnimatedMetricCard
} from '@/components/ui/revolutionary-design-system';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalQuotes: 0,
    totalEmployees: 0,
    revenue: 0,
    pendingInvoices: 0,
    projectsInProgress: 0,
    supportTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      const [companiesRes, invoicesRes, quotesRes, employeesRes, projectsRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/invoices'),
        fetch('/api/quotes'),
        fetch('/api/employees'),
        fetch('/api/projects')
      ]);

      const [companies, invoices, quotes, employees, projects] = await Promise.all([
        companiesRes.json(),
        invoicesRes.json(),
        quotesRes.json(),
        employeesRes.json(),
        projectsRes.json()
      ]);

      const totalRevenue = invoices?.filter((inv: any) => inv.status === 'paid').reduce((sum: number, inv: any) => sum + parseInt(inv.amount), 0) || 0;
      const pendingAmount = invoices?.filter((inv: any) => inv.status === 'sent').reduce((sum: number, inv: any) => sum + parseInt(inv.amount), 0) || 0;
      const projectsInProgress = projects?.filter((proj: any) => ['active', 'in_progress'].includes(proj.status)).length || 0;

      setStats({
        totalClients: companies?.length || 0,
        totalInvoices: invoices?.length || 0,
        totalQuotes: quotes?.length || 0,
        totalEmployees: employees?.length || 0,
        revenue: totalRevenue,
        pendingInvoices: pendingAmount,
        projectsInProgress,
        supportTickets: 12
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex-1 relative min-h-screen overflow-hidden">
        <FloatingParticles count={12} className="absolute inset-0 z-0" />
        <MorphingBlob className="absolute top-10 left-10 w-80 h-80 opacity-25 z-0" />
        <MorphingBlob className="absolute bottom-10 right-10 w-72 h-72 opacity-20 z-0" />
        
        <div className="relative z-10 p-6 space-y-6">
          <div className="text-center space-y-4">
            <TypewriterText 
              text="Chargement du Dashboard Admin..."
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
              speed={80}
            />
            <div className="animate-spin h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"></div>
          </div>
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <StaggeredItem key={i}>
                <EnhancedCard variant="shimmer" className="animate-pulse">
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </EnhancedCard>
              </StaggeredItem>
            ))}
          </StaggeredList>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={18} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-10 left-10 w-80 h-80 opacity-25 z-0" />
      <MorphingBlob className="absolute bottom-10 right-10 w-72 h-72 opacity-20 z-0" />
      
      <div className="relative z-10 p-6 space-y-6">
        {/* Header with Revolutionary Design */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <TypewriterText 
              text="Dashboard Admin Révolutionnaire"
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
              speed={70}
            />
            <GlowText className="text-gray-600 dark:text-gray-400 mt-1">
              Vue d'ensemble complète de votre entreprise ✨
            </GlowText>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadAdminStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques Principales avec AnimatedMetricCard */}
        <StaggeredList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggeredItem>
            <AnimatedMetricCard
              title="Chiffre d'Affaires"
              value={formatCurrency(stats.revenue)}
              icon={DollarSign}
              trend="up"
              trendValue="+23.5%"
              description="par rapport au mois dernier"
            />
          </StaggeredItem>
          <StaggeredItem>
            <AnimatedMetricCard
              title="Clients Actifs"
              value={stats.totalClients}
              icon={Building2}
              trend="up"
              trendValue="+12.3%"
              description="par rapport au mois dernier"
            />
          </StaggeredItem>
          <StaggeredItem>
            <AnimatedMetricCard
              title="Projets Actifs"
              value={stats.projectsInProgress}
              icon={Rocket}
              trend="up"
              trendValue="+8.7%"
              description="par rapport au mois dernier"
            />
          </StaggeredItem>
          <StaggeredItem>
            <AnimatedMetricCard
              title="Équipe"
              value={stats.totalEmployees}
              icon={Users}
              trend="up"
              trendValue="+5.2%"
              description="par rapport au mois dernier"
            />
          </StaggeredItem>
        </StaggeredList>

        {/* Contenu Principal avec Enhanced Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance */}
          <EnhancedCard variant="glow" className="animate-fadeInUp">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5" />
                <GlowText className="text-lg font-semibold">Performance Globale</GlowText>
              </div>
              <p className="text-muted-foreground mb-6">
                Indicateurs clés de performance
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Satisfaction Client</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Efficacité Projets</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ROI Moyen</span>
                    <span className="font-medium">156%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <HoverZone effect="glow" className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">12/15</div>
                    <div className="text-xs text-muted-foreground">Objectifs atteints</div>
                  </HoverZone>
                  <HoverZone effect="lift" className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">+32%</div>
                    <div className="text-xs text-muted-foreground">Croissance</div>
                  </HoverZone>
                </div>
              </div>
            </div>
          </EnhancedCard>

          {/* Activité Récente */}
          <EnhancedCard variant="shimmer" className="animate-fadeInUp">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5" />
                <GlowText className="text-lg font-semibold">Activité Récente</GlowText>
              </div>
              <p className="text-muted-foreground mb-6">
                Dernières actions et événements
              </p>
              <StaggeredList className="space-y-3">
                <StaggeredItem>
                  <HoverZone effect="lift" className="flex items-center gap-4 p-4 rounded-lg border bg-red-50 dark:bg-red-950/20">
                    <div className="p-2 rounded-lg text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">3 factures dépassent leur échéance</p>
                      <p className="text-xs text-muted-foreground">Il y a 1h</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </HoverZone>
                </StaggeredItem>
                
                <StaggeredItem>
                  <HoverZone effect="glow" className="flex items-center gap-4 p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
                    <div className="p-2 rounded-lg text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Nouveau contrat signé - 150K€</p>
                      <p className="text-xs text-muted-foreground">Il y a 2h</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </HoverZone>
                </StaggeredItem>
                
                <StaggeredItem>
                  <HoverZone effect="lift" className="flex items-center gap-4 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
                    <div className="p-2 rounded-lg text-blue-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">2 nouveaux employés intégrés</p>
                      <p className="text-xs text-muted-foreground">Il y a 4h</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </HoverZone>
                </StaggeredItem>
              </StaggeredList>
            </div>
          </EnhancedCard>
        </div>

        {/* Actions Rapides */}
        <EnhancedCard variant="pulse" className="animate-fadeInUp">
          <div className="p-6">
            <GlowText className="text-lg font-semibold mb-2">Actions Rapides</GlowText>
            <p className="text-muted-foreground mb-6">
              Raccourcis vers les fonctionnalités principales
            </p>
            <StaggeredList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StaggeredItem>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Rapports</span>
                </Button>
              </StaggeredItem>
              <StaggeredItem>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs">Support</span>
                </Button>
              </StaggeredItem>
              <StaggeredItem>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span className="text-xs">Objectifs</span>
                </Button>
              </StaggeredItem>
              <StaggeredItem>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </StaggeredItem>
              <StaggeredItem>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Nouveau</span>
                </Button>
              </StaggeredItem>
              <StaggeredItem>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Documents</span>
                </Button>
              </StaggeredItem>
            </StaggeredList>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
}
