import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// import { supabase } // Migrated from Supabase to Express API
import { useToast } from '@/hooks/use-toast';
import { SynapseInsights } from '@/components/ai/SynapseInsights';
import { 
  DollarSign,
  FileText,
  ScrollText,
  Receipt,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  BarChart3,
  PieChart,
  Target,
  Briefcase,
  Sparkles,
  Zap
} from 'lucide-react';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  HoverZone,
  StaggeredList,
  StaggeredItem,
  MagneticButton,
  EnhancedCard,
  AnimatedMetricCard,
  LiquidContainer,
  WaveformVisualizer
} from '@/components/design-system/RevolutionaryDesignSystem';

interface DashboardStats {
  // Revenus
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  
  // Clients
  totalClients: number;
  newClientsThisMonth: number;
  activeClients: number;
  
  // Devis
  totalQuotes: number;
  quotesThisMonth: number;
  pendingQuotes: number;
  quotesConversion: number;
  
  // Contrats
  totalContracts: number;
  activeContracts: number;
  contractsExpiringThisMonth: number;
  contractsRevenue: number;
  
  // Factures
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  invoicesRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'quote' | 'contract' | 'invoice' | 'client';
  title: string;
  description: string;
  amount?: number;
  status: string;
  date: string;
  client?: string;
  url?: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  quotes: number;
  contracts: number;
  invoices: number;
}

export default function BusinessDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // En production, ces données viendraient de vraies requêtes
      // Pour le moment, on utilise des données demo réalistes
      
      setStats({
        // Revenus
        totalRevenue: 294500000, // ~295M XOF
        monthlyRevenue: 85000000, // 85M ce mois
        revenueGrowth: 15.3, // +15.3% vs mois dernier
        
        // Clients
        totalClients: 12,
        newClientsThisMonth: 2,
        activeClients: 8,
        
        // Devis
        totalQuotes: 28,
        quotesThisMonth: 6,
        pendingQuotes: 4,
        quotesConversion: 67.9, // 67.9% de conversion
        
        // Contrats
        totalContracts: 19,
        activeContracts: 11,
        contractsExpiringThisMonth: 2,
        contractsRevenue: 280000000,
        
        // Factures
        totalInvoices: 35,
        paidInvoices: 28,
        pendingInvoices: 5,
        overdueInvoices: 2,
        invoicesRevenue: 294500000
      });

      setRecentActivity([
        {
          id: '1',
          type: 'invoice',
          title: 'Facture FACT-2024-012',
          description: 'Facturation mensuelle maintenance',
          amount: 12500000,
          status: 'paid',
          date: '2024-01-15T10:30:00Z',
          client: 'Orange Sénégal',
          url: '/business/invoices/12'
        },
        {
          id: '2',
          type: 'contract',
          title: 'Contrat CTR-2024-004',
          description: 'Nouveau contrat support technique',
          amount: 45000000,
          status: 'active',
          date: '2024-01-14T16:45:00Z',
          client: 'Total Sénégal',
          url: '/business/contracts/4'
        },
        {
          id: '3',
          type: 'quote',
          title: 'Devis DEV-2024-008',
          description: 'Application mobile e-commerce',
          amount: 65000000,
          status: 'sent',
          date: '2024-01-14T14:20:00Z',
          client: 'Auchan Sénégal',
          url: '/business/quotes/8'
        },
        {
          id: '4',
          type: 'client',
          title: 'Nouveau client',
          description: 'Inscription de UBA Sénégal',
          status: 'active',
          date: '2024-01-13T09:15:00Z',
          client: 'UBA Sénégal',
          url: '/business/clients/demo-4'
        },
        {
          id: '5',
          type: 'invoice',
          title: 'Facture FACT-2024-011',
          description: 'Livraison projet mobile banking',
          amount: 47500000,
          status: 'pending',
          date: '2024-01-12T11:30:00Z',
          client: 'CBAO Bank',
          url: '/business/invoices/11'
        }
      ]);

      setMonthlyData([
        { month: 'Août', revenue: 45000000, quotes: 8, contracts: 3, invoices: 12 },
        { month: 'Sept', revenue: 78000000, quotes: 12, contracts: 5, invoices: 15 },
        { month: 'Oct', revenue: 92000000, quotes: 15, contracts: 4, invoices: 18 },
        { month: 'Nov', revenue: 67000000, quotes: 9, contracts: 6, invoices: 14 },
        { month: 'Déc', revenue: 125000000, quotes: 18, contracts: 8, invoices: 22 },
        { month: 'Jan', revenue: 85000000, quotes: 6, contracts: 3, invoices: 8 }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement du dashboard"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quote': return FileText;
      case 'contract': return ScrollText;
      case 'invoice': return Receipt;
      case 'client': return Users;
      default: return Activity;
    }
  };

  const getStatusColor = (type: string, status: string) => {
    switch (status) {
      case 'paid':
      case 'active':
      case 'approved': 
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'sent':
        return 'text-blue-600 bg-blue-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'overdue':
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={25} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 space-y-8 p-6">
        {/* Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <LiquidContainer className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <Briefcase className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Dashboard Business"
                      className="text-4xl font-bold mb-2"
                      speed={50}
                    />
                    <GlowText className="text-lg text-emerald-100">
                      Vue d'ensemble de votre activité commerciale ✨
                    </GlowText>
                    <div className="mt-3 flex items-center gap-4 text-sm text-emerald-200">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Performance exceptionnelle
                      </span>
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Croissance: +{stats.revenueGrowth}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to="/business/quotes/new">
                    <MagneticButton variant="secondary" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau devis
                    </MagneticButton>
                  </Link>
                  <Link to="/business/contracts/new">
                    <MagneticButton className="bg-white text-emerald-700 hover:bg-emerald-50">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau contrat
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Synapse Insights avec effet */}
        <HoverZone effect="lift">
          <SynapseInsights context="business-dashboard" />
        </HoverZone>

        {/* Métriques Principales avec AnimatedMetricCard */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggeredItem index={0}>
            <AnimatedMetricCard
              label="Chiffre d'affaires"
              value={stats.totalRevenue}
              icon={DollarSign}
              trend="up"
              trendValue={`+${stats.revenueGrowth}%`}
              description="vs mois dernier"
              prefix="XOF "
              format="currency"
              gradientFrom="green-500"
              gradientTo="emerald-500"
            />
          </StaggeredItem>

          <StaggeredItem index={1}>
            <AnimatedMetricCard
              label="Clients"
              value={stats.totalClients}
              icon={Users}
              trend="up"
              trendValue={`+${stats.newClientsThisMonth}`}
              description="nouveaux ce mois"
              gradientFrom="blue-500"
              gradientTo="cyan-500"
            />
          </StaggeredItem>

          <StaggeredItem index={2}>
            <AnimatedMetricCard
              label="Contrats Actifs"
              value={stats.activeContracts}
              icon={ScrollText}
              trend="neutral"
              trendValue={`${stats.contractsExpiringThisMonth} expirent`}
              description="ce mois"
              gradientFrom="indigo-500"
              gradientTo="purple-500"
            />
          </StaggeredItem>

          <StaggeredItem index={3}>
            <AnimatedMetricCard
              label="Conversion Devis"
              value={stats.quotesConversion}
              icon={Target}
              trend="up"
              trendValue={`${stats.pendingQuotes} en attente`}
              description="taux de conversion"
              suffix="%"
              gradientFrom="purple-500"
              gradientTo="pink-500"
            />
          </StaggeredItem>
        </StaggeredList>

        {/* Graphiques et détails avec design révolutionnaire */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Évolution mensuelle */}
          <HoverZone effect="lift">
            <EnhancedCard variant="glow" className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg text-white">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <GlowText className="text-lg font-semibold">Évolution Mensuelle</GlowText>
                    <p className="text-sm text-muted-foreground">
                      Chiffre d'affaires des 6 derniers mois
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StaggeredList className="space-y-4">
                  {monthlyData.map((month, index) => (
                    <StaggeredItem key={month.month} index={index}>
                      <HoverZone effect="glow" className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                              {month.month}
                            </span>
                            <span className="text-green-600 font-semibold">
                              {formatCurrency(month.revenue)}
                            </span>
                          </div>
                          <Progress 
                            value={(month.revenue / 125000000) * 100} 
                            className="h-2 bg-gray-200 dark:bg-gray-700"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {month.quotes} devis
                            </span>
                            <span className="flex items-center gap-1">
                              <ScrollText className="h-3 w-3" />
                              {month.contracts} contrats
                            </span>
                            <span className="flex items-center gap-1">
                              <Receipt className="h-3 w-3" />
                              {month.invoices} factures
                            </span>
                          </div>
                        </div>
                      </HoverZone>
                    </StaggeredItem>
                  ))}
                </StaggeredList>
              </CardContent>
            </EnhancedCard>
          </HoverZone>

          {/* Détails par module */}
          <HoverZone effect="rotate">
            <EnhancedCard variant="shimmer" className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <div>
                    <GlowText className="text-lg font-semibold">Détails par Module</GlowText>
                    <p className="text-sm text-muted-foreground">
                      Répartition de l'activité business
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
            
            {/* Devis */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Devis</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.quotesThisMonth} ce mois
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{stats.totalQuotes}</div>
                <Badge className="text-xs">
                  {stats.quotesConversion}% conversion
                </Badge>
              </div>
            </div>

            {/* Contrats */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ScrollText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">Contrats</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.activeContracts} actifs
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{stats.totalContracts}</div>
                <div className="text-xs text-green-600">
                  {formatCurrency(stats.contractsRevenue)}
                </div>
              </div>
            </div>

            {/* Factures */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold">Factures</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.paidInvoices} payées / {stats.totalInvoices}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  {Math.round((stats.paidInvoices / stats.totalInvoices) * 100)}%
                </div>
                {stats.overdueInvoices > 0 && (
                  <div className="text-xs text-red-600">
                    {stats.overdueInvoices} en retard
                  </div>
                )}
              </div>
            </div>

              </CardContent>
            </EnhancedCard>
          </HoverZone>
        </div>

        {/* Activité récente */}
        <HoverZone effect="glow">
          <EnhancedCard variant="lift" className="col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <GlowText className="text-lg font-semibold">Activité Récente</GlowText>
                  <p className="text-sm text-muted-foreground">
                    Dernières actions sur votre espace business
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StaggeredList className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <StaggeredItem key={activity.id} index={index}>
                      <HoverZone effect="lift" className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{activity.title}</h4>
                      <div className="flex items-center gap-2">
                        {activity.amount && (
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(activity.amount)}
                          </span>
                        )}
                        <Badge className={getStatusColor(activity.type, activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(activity.date)}
                        </span>
                        {activity.client && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.client}
                          </span>
                        )}
                      </div>
                      {activity.url && (
                        <Link to={activity.url}>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Voir détails
                          </Button>
                        </Link>
                      )}
                        </div>
                      </div>
                    </HoverZone>
                  </StaggeredItem>
                );
              })}
            </StaggeredList>
          </CardContent>
        </EnhancedCard>
      </HoverZone>

        {/* Actions rapides avec design révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="pulse" className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <LiquidContainer className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg text-white">
                  <Zap className="h-5 w-5" />
                </LiquidContainer>
                <div>
                  <GlowText className="text-lg font-semibold">Actions Rapides</GlowText>
                  <p className="text-sm text-muted-foreground">
                    Accès rapide aux fonctions les plus utilisées
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StaggeredItem index={0}>
                  <Link to="/business/quotes/new">
                    <MagneticButton variant="outline" className="w-full h-auto p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Nouveau Devis</div>
                          <div className="text-xs text-muted-foreground">Créer une proposition</div>
                        </div>
                      </div>
                    </MagneticButton>
                  </Link>
                </StaggeredItem>

                <StaggeredItem index={1}>
                  <Link to="/business/contracts/new">
                    <MagneticButton variant="outline" className="w-full h-auto p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <ScrollText className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Nouveau Contrat</div>
                          <div className="text-xs text-muted-foreground">Formaliser un accord</div>
                        </div>
                      </div>
                    </MagneticButton>
                  </Link>
                </StaggeredItem>

                <StaggeredItem index={2}>
                  <Link to="/business/invoices/new">
                    <MagneticButton variant="outline" className="w-full h-auto p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Nouvelle Facture</div>
                          <div className="text-xs text-muted-foreground">Facturer une prestation</div>
                        </div>
                      </div>
                    </MagneticButton>
                  </Link>
                </StaggeredItem>

                <StaggeredItem index={3}>
                  <Link to="/business/clients">
                    <MagneticButton variant="outline" className="w-full h-auto p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                          <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Gérer Clients</div>
                          <div className="text-xs text-muted-foreground">Consulter le portefeuille</div>
                        </div>
                      </div>
                    </MagneticButton>
                  </Link>
                </StaggeredItem>
              </StaggeredList>
            </CardContent>
          </EnhancedCard>
        </HoverZone>
      </div>
    </div>
  );
} 