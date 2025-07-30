import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  FileText, 
  Download, 
  Calendar, 
  CreditCard, 
  Shield,
  Heart,
  Car,
  GraduationCap,
  Gift,
  Receipt,
  TrendingUp,
  Building2,
  User,
  Clock,
  Eye,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface Payslip {
  id: string;
  month: string;
  year: number;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  taxDeductions: number;
  socialContributions: number;
  status: 'draft' | 'finalized' | 'paid';
  issuedDate: string;
  paymentDate?: string;
  downloadUrl?: string;
}

interface Benefit {
  id: string;
  name: string;
  type: 'health' | 'transport' | 'meal' | 'education' | 'bonus' | 'insurance';
  description: string;
  value: number;
  unit: 'amount' | 'percentage' | 'reimbursement';
  provider?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  eligibilityRules: string;
}

interface ExpenseReport {
  id: string;
  title: string;
  category: 'transport' | 'meal' | 'equipment' | 'training' | 'other';
  amount: number;
  currency: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  description: string;
  receipts: string[];
  approverName?: string;
  approvalDate?: string;
  reimbursementDate?: string;
  rejectionReason?: string;
}

export default function PayrollBenefits() {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [expenses, setExpenses] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Données mockées
  const mockPayslips: Payslip[] = [
    {
      id: '1',
      month: 'Janvier',
      year: 2025,
      baseSalary: 850000,
      overtime: 75000,
      bonuses: 50000,
      deductions: 127500,
      netSalary: 847500,
      taxDeductions: 85000,
      socialContributions: 42500,
      status: 'paid',
      issuedDate: '2025-01-31',
      paymentDate: '2025-02-01',
      downloadUrl: '/downloads/payslip_2025_01.pdf'
    },
    {
      id: '2',
      month: 'Décembre',
      year: 2024,
      baseSalary: 850000,
      overtime: 100000,
      bonuses: 200000,
      deductions: 172500,
      netSalary: 977500,
      taxDeductions: 115000,
      socialContributions: 57500,
      status: 'paid',
      issuedDate: '2024-12-31',
      paymentDate: '2025-01-02',
      downloadUrl: '/downloads/payslip_2024_12.pdf'
    },
    {
      id: '3',
      month: 'Novembre',
      year: 2024,
      baseSalary: 850000,
      overtime: 50000,
      bonuses: 0,
      deductions: 135000,
      netSalary: 765000,
      taxDeductions: 90000,
      socialContributions: 45000,
      status: 'paid',
      issuedDate: '2024-11-30',
      paymentDate: '2024-12-01',
      downloadUrl: '/downloads/payslip_2024_11.pdf'
    }
  ];

  const mockBenefits: Benefit[] = [
    {
      id: '1',
      name: 'Assurance Maladie Complémentaire',
      type: 'health',
      description: 'Couverture santé 100% pour employé et famille',
      value: 50000,
      unit: 'amount',
      provider: 'CNPS Plus',
      isActive: true,
      startDate: '2024-01-01',
      eligibilityRules: 'Tous les employés permanents'
    },
    {
      id: '2',
      name: 'Tickets Restaurant',
      type: 'meal',
      description: 'Allocation repas quotidienne',
      value: 3000,
      unit: 'amount',
      provider: 'Sodexo',
      isActive: true,
      startDate: '2024-01-01',
      eligibilityRules: 'Employés présents au bureau'
    },
    {
      id: '3',
      name: 'Indemnité Transport',
      type: 'transport',
      description: 'Remboursement frais de transport',
      value: 75,
      unit: 'percentage',
      isActive: true,
      startDate: '2024-01-01',
      eligibilityRules: 'Tous les employés'
    },
    {
      id: '4',
      name: 'Formation Continue',
      type: 'education',
      description: 'Budget annuel pour formations professionnelles',
      value: 500000,
      unit: 'amount',
      isActive: true,
      startDate: '2024-01-01',
      eligibilityRules: 'Formations approuvées par le manager'
    },
    {
      id: '5',
      name: 'Prime de Performance',
      type: 'bonus',
      description: 'Prime basée sur l\'atteinte des objectifs',
      value: 20,
      unit: 'percentage',
      isActive: true,
      startDate: '2024-01-01',
      eligibilityRules: 'Évaluation annuelle >= 4/5'
    }
  ];

  const mockExpenses: ExpenseReport[] = [
    {
      id: '1',
      title: 'Transport client TechCorp',
      category: 'transport',
      amount: 45000,
      currency: 'XOF',
      submitDate: '2025-01-15',
      status: 'reimbursed',
      description: 'Déplacement chez le client pour maintenance',
      receipts: ['taxi_receipt_1.jpg'],
      approverName: 'Mohamed Diouf',
      approvalDate: '2025-01-16',
      reimbursementDate: '2025-01-20'
    },
    {
      id: '2',
      title: 'Formation React Advanced',
      category: 'training',
      amount: 150000,
      currency: 'XOF',
      submitDate: '2025-01-10',
      status: 'approved',
      description: 'Formation avancée React/TypeScript en ligne',
      receipts: ['invoice_formation.pdf'],
      approverName: 'Mohamed Diouf',
      approvalDate: '2025-01-12'
    },
    {
      id: '3',
      title: 'Équipement développement',
      category: 'equipment',
      amount: 25000,
      currency: 'XOF',
      submitDate: '2025-01-05',
      status: 'pending',
      description: 'Souris ergonomique et clavier mécanique',
      receipts: ['facture_materiel.pdf']
    }
  ];

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      // TODO: Charger depuis l'API
      setTimeout(() => {
        setPayslips(mockPayslips);
        setBenefits(mockBenefits);
        setExpenses(mockExpenses);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des données paie:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'reimbursed':
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
      case 'finalized':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'transport':
        return <Car className="h-5 w-5 text-blue-500" />;
      case 'meal':
        return <Receipt className="h-5 w-5 text-orange-500" />;
      case 'education':
        return <GraduationCap className="h-5 w-5 text-purple-500" />;
      case 'bonus':
        return <Gift className="h-5 w-5 text-green-500" />;
      case 'insurance':
        return <Shield className="h-5 w-5 text-indigo-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  // Statistiques
  const currentYear = new Date().getFullYear();
  const yearlyPayslips = payslips.filter(p => p.year === currentYear);
  const totalGross = yearlyPayslips.reduce((sum, p) => sum + p.baseSalary + p.overtime + p.bonuses, 0);
  const totalNet = yearlyPayslips.reduce((sum, p) => sum + p.netSalary, 0);
  const activeBenefits = benefits.filter(b => b.isActive);
  const pendingExpenses = expenses.filter(e => e.status === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className=" rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des données de paie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={30} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Révolutionnaire */}
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <DollarSign className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Paie & Avantages"
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-green-100">
                      Consultation de vos bulletins de paie et avantages 💰
                    </GlowText>
                  </div>
                </div>
                
                <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StaggeredItem index={0}>
                    <AnimatedMetricCard
                      title={`Net ${currentYear}`}
                      value={formatCurrency(totalNet)}
                      icon={DollarSign}
                      trend="+"
                      gradient="from-green-500 to-emerald-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={1}>
                    <AnimatedMetricCard
                      title="Avantages"
                      value={activeBenefits.length.toString()}
                      icon={Gift}
                      gradient="from-emerald-500 to-teal-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={2}>
                    <AnimatedMetricCard
                      title="Bulletins"
                      value={yearlyPayslips.length.toString()}
                      icon={FileText}
                      gradient="from-teal-500 to-cyan-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={3}>
                    <AnimatedMetricCard
                      title="Notes de frais"
                      value={pendingExpenses.length.toString()}
                      icon={Receipt}
                      gradient="from-cyan-500 to-blue-500"
                    />
                  </StaggeredItem>
                </StaggeredList>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        <Tabs defaultValue="payslips" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="payslips">Bulletins de Paie</TabsTrigger>
            <TabsTrigger value="benefits">Avantages</TabsTrigger>
            <TabsTrigger value="expenses">Notes de Frais</TabsTrigger>
          </TabsList>

          <TabsContent value="payslips" className="space-y-6">
            
            {/* Salaire actuel */}
            {payslips[0] && (
              <HoverZone>
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg text-white">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <GlowText>Dernier Bulletin - {payslips[0].month} {payslips[0].year}</GlowText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <StaggeredItem index={0}>
                        <HoverZone>
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(payslips[0].baseSalary)}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">Salaire de base</div>
                          </div>
                        </HoverZone>
                      </StaggeredItem>
                      <StaggeredItem index={1}>
                        <HoverZone>
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(payslips[0].overtime + payslips[0].bonuses)}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">Heures sup. + Primes</div>
                          </div>
                        </HoverZone>
                      </StaggeredItem>
                      <StaggeredItem index={2}>
                        <HoverZone>
                          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              -{formatCurrency(payslips[0].deductions)}
                            </div>
                            <div className="text-sm text-red-700 dark:text-red-300">Déductions</div>
                          </div>
                        </HoverZone>
                      </StaggeredItem>
                      <StaggeredItem index={3}>
                        <HoverZone>
                          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-lg">
                            <div className="text-2xl font-bold text-emerald-600">
                              {formatCurrency(payslips[0].netSalary)}
                            </div>
                            <div className="text-sm text-emerald-700 dark:text-emerald-300">Net à payer</div>
                          </div>
                        </HoverZone>
                      </StaggeredItem>
                    </StaggeredList>
                  </CardContent>
                </EnhancedCard>
              </HoverZone>
            )}

            {/* Historique des bulletins */}
            <HoverZone>
              <EnhancedCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <GlowText>Historique des Bulletins</GlowText>
                  </CardTitle>
                  <CardDescription>
                    Consultez et téléchargez vos bulletins de paie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                  {payslips.map((payslip) => (
                    <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-accent rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {payslip.month} {payslip.year}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Net: {formatCurrency(payslip.netSalary)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Émis le {new Date(payslip.issuedDate).toLocaleDateString('fr-FR')}
                            {payslip.paymentDate && ` • Payé le ${new Date(payslip.paymentDate).toLocaleDateString('fr-FR')}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(payslip.status)}>
                          {payslip.status === 'paid' ? 'Payé' :
                           payslip.status === 'finalized' ? 'Finalisé' : 'Brouillon'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        {payslip.downloadUrl && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <HoverZone>
              <EnhancedCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
                      <Gift className="h-5 w-5" />
                    </div>
                    <GlowText>Vos Avantages Sociaux</GlowText>
                  </CardTitle>
                  <CardDescription>
                    Liste de tous vos avantages et leur valeur
                  </CardDescription>
                </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {activeBenefits.map((benefit) => (
                    <div key={benefit.id} className="border rounded-lg p-6 space-y-4">
                      
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getBenefitIcon(benefit.type)}
                          <div>
                            <h3 className="text-lg font-semibold">{benefit.name}</h3>
                            <p className="text-muted-foreground">{benefit.description}</p>
                            {benefit.provider && (
                              <p className="text-sm text-muted-foreground">
                                Partenaire: {benefit.provider}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {benefit.unit === 'percentage' 
                              ? `${benefit.value}%` 
                              : formatCurrency(benefit.value)
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {benefit.unit === 'amount' ? 'Valeur mensuelle' :
                             benefit.unit === 'percentage' ? 'Taux de remboursement' : 'Remboursement'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Depuis le {new Date(benefit.startDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{benefit.eligibilityRules}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <HoverZone>
              <EnhancedCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg text-white">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <GlowText>Notes de Frais</GlowText>
                  </CardTitle>
                  <CardDescription>
                    Gérez vos demandes de remboursement
                  </CardDescription>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full lg:w-auto">
                    <Receipt className="h-4 w-4 mr-2" />
                    Nouvelle Note de Frais
                  </Button>
                  
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="border rounded-lg p-6 space-y-4">
                        
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent rounded-lg">
                                <Receipt className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{expense.title}</h3>
                                <p className="text-muted-foreground">{expense.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-2">
                            <div className="text-xl font-bold">
                              {formatCurrency(expense.amount)}
                            </div>
                            <Badge className={getStatusColor(expense.status)}>
                              {expense.status === 'pending' ? 'En attente' :
                               expense.status === 'approved' ? 'Approuvé' :
                               expense.status === 'rejected' ? 'Refusé' : 'Remboursé'}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Soumis le {new Date(expense.submitDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          
                          {expense.approverName && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Approuvé par {expense.approverName}</span>
                            </div>
                          )}
                          
                          {expense.reimbursementDate && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>Remboursé le {new Date(expense.reimbursementDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                        </div>

                        {expense.receipts.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Justificatifs:</div>
                            <div className="flex flex-wrap gap-2">
                              {expense.receipts.map((receipt, index) => (
                                <Button key={index} variant="outline" size="sm" className="text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {receipt}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {expense.rejectionReason && (
                          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                            <div className="text-sm font-medium text-red-800 dark:text-red-200">
                              Motif de refus:
                            </div>
                            <div className="text-sm text-red-700 dark:text-red-300">
                              {expense.rejectionReason}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}