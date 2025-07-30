import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 🌟 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  StaggeredList,
  StaggeredItem,
  HoverZone,
  MagneticButton,
  EnhancedCard,
  AnimatedMetricCard,
  LiquidContainer,
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

import {
  Search,
  Filter,
  Download,
  FileText,
  CreditCard,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Receipt,
  Euro,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  amount: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  project: string;
  description: string;
  paymentMethod?: string;
}

export default function ClientInvoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Mock data - In real app, fetch from API based on client
  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'FACT-2025-001',
      status: 'paid',
      amount: 42000,
      tax: 8400,
      total: 50400,
      issueDate: '2025-01-15',
      dueDate: '2025-02-14',
      paidDate: '2025-01-20',
      project: 'Application Mobile E-commerce',
      description: 'Développement Phase 1 - Interface utilisateur',
      paymentMethod: 'Virement bancaire'
    },
    {
      id: '2',
      number: 'FACT-2025-002',
      status: 'pending',
      amount: 25000,
      tax: 5000,
      total: 30000,
      issueDate: '2025-01-20',
      dueDate: '2025-02-19',
      project: 'Application Mobile E-commerce',
      description: 'Développement Phase 2 - Backend API'
    },
    {
      id: '3',
      number: 'FACT-2024-087',
      status: 'paid',
      amount: 20000,
      tax: 4000,
      total: 24000,
      issueDate: '2024-12-15',
      dueDate: '2025-01-14',
      paidDate: '2024-12-30',
      project: 'Refonte Site Web Corporate',
      description: 'Projet complet - Livraison finale',
      paymentMethod: 'Carte bancaire'
    },
    {
      id: '4',
      number: 'FACT-2025-003',
      status: 'overdue',
      amount: 15000,
      tax: 3000,
      total: 18000,
      issueDate: '2024-12-01',
      dueDate: '2024-12-31',
      project: 'Maintenance Système',
      description: 'Maintenance trimestrielle Q4 2024'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || invoice.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  const invoiceMetrics = [
    {
      title: 'Total Facturé',
      value: `${(totalAmount / 1000).toFixed(0)}k€`,
      description: 'Montant total',
      trend: 'up' as const,
      trendValue: '+12% ce mois',
      icon: Euro
    },
    {
      title: 'Factures Payées',
      value: `${(paidAmount / 1000).toFixed(0)}k€`,
      description: `${invoices.filter(i => i.status === 'paid').length} factures`,
      trend: 'up' as const,
      trendValue: 'Excellent taux',
      icon: CheckCircle2
    },
    {
      title: 'En Attente',
      value: `${(pendingAmount / 1000).toFixed(0)}k€`,
      description: `${invoices.filter(i => i.status === 'pending').length} factures`,
      trend: 'neutral' as const,
      trendValue: 'À régler',
      icon: Clock
    },
    {
      title: 'En Retard',
      value: `${(overdueAmount / 1000).toFixed(0)}k€`,
      description: `${invoices.filter(i => i.status === 'overdue').length} factures`,
      trend: 'down' as const,
      trendValue: 'Action requise',
      icon: AlertCircle
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles
        count={20}
        className="absolute inset-0 z-0"
      />
      <MorphingBlob
        className="absolute top-20 right-10 w-96 h-96 opacity-25 z-0"
      />
      <MorphingBlob
        className="absolute bottom-20 left-10 w-80 h-80 opacity-20 z-0"
      />

      <div className="relative z-10 p-6 space-y-8">
        {/* Header Révolutionnaire */}
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-4">
                <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Receipt className="h-10 w-10 text-white" />
                </LiquidContainer>
                <div>
                  <TypewriterText
                    text="Gestion Factures"
                    className="text-4xl font-bold mb-2"
                    speed={50}
                  />
                  <GlowText className="text-lg text-green-100">
                    Suivi intelligent de votre facturation et historique des paiements 💰
                  </GlowText>
                </div>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Métriques Révolutionnaires */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {invoiceMetrics.map((metric, index) => {
            const gradients = [
              "from-green-500 to-emerald-500",
              "from-emerald-500 to-teal-500",
              "from-teal-500 to-cyan-500",
              "from-cyan-500 to-blue-500"
            ];
            return (
              <StaggeredItem key={metric.title} index={index}>
                <AnimatedMetricCard
                  title={metric.title}
                  value={metric.value}
                  description={metric.description}
                  trend={metric.trend}
                  trendValue={metric.trendValue}
                  icon={metric.icon}
                  gradient={gradients[index % gradients.length]}
                />
              </StaggeredItem>
            );
          })}
        </StaggeredList>

        {/* Filtres et Recherche Révolutionnaires */}
        <HoverZone>
          <EnhancedCard>
            <CardContent className="flex flex-col lg:flex-row gap-4 items-center justify-between p-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <EnhancedInput
                    placeholder="Rechercher une facture..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <MagneticButton variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </MagneticButton>
                <MagneticButton size="sm" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <Download className="h-4 w-4" />
                  Export PDF
                </MagneticButton>
              </div>
            </CardContent>
          </EnhancedCard>
        </HoverZone>

        {/* Factures Révolutionnaires */}
        <HoverZone>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="paid">Payées</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="overdue">En retard</TabsTrigger>
              <TabsTrigger value="draft">Brouillons</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedTab} className="mt-6">
              <StaggeredList className="space-y-4">
                {filteredInvoices.map((invoice, index) => (
                  <StaggeredItem key={invoice.id}>
                    <EnhancedCard
                      variant={invoice.status === 'paid' ? 'glow' : invoice.status === 'overdue' ? 'pulse' : 'lift'}
                      className="hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              {getStatusIcon(invoice.status)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{invoice.number}</h3>
                              <GlowText className="text-sm text-muted-foreground">
                                {invoice.project}
                              </GlowText>
                            </div>
                          </div>

                          <div className="text-right">
                            <Badge className={getStatusColor(invoice.status)}>
                              {getStatusLabel(invoice.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Montant</p>
                            <p className="font-semibold text-xl">{formatCurrency(invoice.total)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date d'émission</p>
                            <p className="font-medium">{formatDate(invoice.issueDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date d'échéance</p>
                            <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            {invoice.description}
                          </p>

                          <div className="flex gap-2">
                            <MagneticButton variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </MagneticButton>
                            <MagneticButton variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </MagneticButton>
                            {invoice.status === 'pending' && (
                              <MagneticButton
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Payer
                              </MagneticButton>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </EnhancedCard>
                  </StaggeredItem>
                ))}
              </StaggeredList>

              {filteredInvoices.length === 0 && (
                <HoverZone>
                  <EnhancedCard variant="glass" className="text-center py-12">
                    <CardContent>
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <GlowText className="text-lg font-medium mb-2">
                        Aucune facture trouvée
                      </GlowText>
                      <p className="text-muted-foreground">
                        Aucune facture ne correspond à vos critères de recherche
                      </p>
                    </CardContent>
                  </EnhancedCard>
                </HoverZone>
              )}
            </TabsContent>
          </Tabs>
        </HoverZone>

        {/* Actions Rapides Finales */}
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardHeader>
              <TypewriterText
                text="⚡ Actions Rapides Factures"
                className="text-xl font-bold text-center"
                speed={70}
              />
            </CardHeader>
            <CardContent>
              <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StaggeredItem>
                  <MagneticButton className="w-full h-20 bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center">
                    <div>
                      <Download className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">Télécharger Toutes</span>
                    </div>
                  </MagneticButton>
                </StaggeredItem>
                <StaggeredItem>
                  <MagneticButton className="w-full h-20 bg-gradient-to-br from-green-400 to-green-600 text-white text-center">
                    <div>
                      <CreditCard className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">Payer en Attente</span>
                    </div>
                  </MagneticButton>
                </StaggeredItem>
                <StaggeredItem>
                  <MagneticButton className="w-full h-20 bg-gradient-to-br from-purple-400 to-purple-600 text-white text-center">
                    <div>
                      <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">Rapport Annuel</span>
                    </div>
                  </MagneticButton>
                </StaggeredItem>
              </StaggeredList>
            </CardContent>
          </EnhancedCard>
        </HoverZone>
      </div>
    </div>
  );
}