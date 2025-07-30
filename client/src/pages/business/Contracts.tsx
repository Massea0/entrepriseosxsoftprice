import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { supabase } // Migrated from Supabase to Express API
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SynapseInsights } from '@/components/ai/SynapseInsights';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye,
  Edit,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Download,
  Archive,
  Users,
  Receipt,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface Contract {
  id: string;
  contract_number: string;
  title: string;
  object: string;
  amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  signature_date?: string;
  status: string;
  contract_type?: string;
  client_id: string;
  devis_id?: string;
  auto_renewal: boolean;
  renewal_date?: string;
  next_review_date?: string;
  created_at: string;
  company?: { name: string };
  ai_confidence_score?: number;
  compliance_score?: number;
  generated_by_ai?: boolean;
}

const CONTRACT_STATUSES = [
  { value: 'draft', label: 'Brouillon', color: 'bg-gray-500', icon: FileText, description: 'En préparation' },
  { value: 'pending_signature', label: 'En attente signature', color: 'bg-yellow-500', icon: Clock, description: 'Envoyé pour signature' },
  { value: 'active', label: 'Actif', color: 'bg-green-500', icon: CheckCircle, description: 'Signé et en cours' },
  { value: 'suspended', label: 'Suspendu', color: 'bg-orange-500', icon: Pause, description: 'Temporairement suspendu' },
  { value: 'expired', label: 'Expiré', color: 'bg-red-500', icon: AlertCircle, description: 'Échéance dépassée' },
  { value: 'terminated', label: 'Terminé', color: 'bg-blue-500', icon: Archive, description: 'Terminé normalement' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-gray-400', icon: FileText, description: 'Annulé avant terme' }
];

const CONTRACT_TYPES = [
  { value: 'service', label: 'Prestation de services' },
  { value: 'development', label: 'Développement logiciel' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'consulting', label: 'Conseil' },
  { value: 'training', label: 'Formation' },
  { value: 'license', label: 'Licence logicielle' },
  { value: 'hosting', label: 'Hébergement' },
  { value: 'support', label: 'Support technique' },
  { value: 'other', label: 'Autre' }
];

export default function Contracts() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'client';
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('contracts')
        .select(`
          *,
          company:client_id(name)
        `);

      // Filter by company for client users
      if (userRole === 'client') {
        const userCompanyId = user?.user_metadata?.company_id;
        if (userCompanyId) {
          query = query.eq('client_id', userCompanyId);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des contrats"
      });
      
      // Fallback with demo data for development
      setContracts([
        {
          id: 'demo-1',
          contract_number: 'CTR-2024-001',
          title: 'Transformation Digitale Orange Money',
          object: 'Développement plateforme mobile money nouvelle génération',
          amount: 85000000,
          currency: 'XOF',
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          signature_date: '2024-01-10',
          status: 'active',
          contract_type: 'development',
          client_id: 'company-1',
          auto_renewal: false,
          renewal_date: '2024-11-30',
          next_review_date: '2024-06-15',
          created_at: '2024-01-05',
          company: { name: 'Orange Sénégal' },
          ai_confidence_score: 0.92,
          compliance_score: 0.95,
          generated_by_ai: true
        },
        {
          id: 'demo-2',
          contract_number: 'CTR-2024-002',
          title: 'Portal Enterprise Sonatel',
          object: 'Portail client entreprise avec API REST',
          amount: 65000000,
          currency: 'XOF',
          start_date: '2024-02-01',
          end_date: '2024-08-31',
          signature_date: '2024-01-28',
          status: 'active',
          contract_type: 'development',
          client_id: 'company-2',
          auto_renewal: true,
          renewal_date: '2024-07-31',
          next_review_date: '2024-05-01',
          created_at: '2024-01-20',
          company: { name: 'Sonatel' },
          ai_confidence_score: 0.88,
          compliance_score: 0.91
        },
        {
          id: 'demo-3',
          contract_number: 'CTR-2024-003',
          title: 'Digital Banking CBAO',
          object: 'Application mobile banking et wallet digital',
          amount: 95000000,
          currency: 'XOF',
          start_date: '2024-03-01',
          end_date: '2025-02-28',
          signature_date: '2024-02-25',
          status: 'active',
          contract_type: 'development',
          client_id: 'company-3',
          auto_renewal: false,
          next_review_date: '2024-09-01',
          created_at: '2024-02-15',
          company: { name: 'CBAO Groupe Attijariwafa Bank' },
          ai_confidence_score: 0.94,
          compliance_score: 0.97,
          generated_by_ai: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateContractStatus = async (contractId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ 
          status: newStatus,
          ...(newStatus === 'active' && { signature_date: new Date().toISOString() })
        })
        .eq('id', contractId);

      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du contrat a été modifié avec succès"
      });
      
      loadContracts();
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut"
      });
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.contract_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusConfig = (status: string) => {
    return CONTRACT_STATUSES.find(s => s.value === status) || CONTRACT_STATUSES[0];
  };

  const getTypeLabel = (type: string) => {
    return CONTRACT_TYPES.find(t => t.value === type)?.label || type;
  };

  const formatCurrency = (amount: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getContractProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    const totalDays = differenceInDays(end, start);
    const elapsedDays = differenceInDays(now, start);
    
    if (elapsedDays < 0) return 0;
    if (elapsedDays > totalDays) return 100;
    
    return Math.round((elapsedDays / totalDays) * 100);
  };

  const getDaysUntilEnd = (endDate: string) => {
    return differenceInDays(new Date(endDate), new Date());
  };

  const getContractStats = () => {
    const total = contracts.reduce((sum, c) => sum + c.amount, 0);
    const active = contracts.filter(c => c.status === 'active').length;
    const pending = contracts.filter(c => c.status === 'pending_signature').length;
    const expiringSoon = contracts.filter(c => {
      const days = getDaysUntilEnd(c.end_date);
      return days > 0 && days <= 30 && c.status === 'active';
    }).length;
    const aiGenerated = contracts.filter(c => c.generated_by_ai).length;
    const avgCompliance = contracts.reduce((sum, c) => sum + (c.compliance_score || 0), 0) / contracts.length;
    
    return { total, active, pending, expiringSoon, aiGenerated, avgCompliance };
  };

  const stats = getContractStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className=" rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <EnhancedCard  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <FileText className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text={userRole === 'admin' ? 'Gestion des Contrats' : 'Mes Contrats'}
                      className="text-4xl font-bold mb-2"
                      speed={50}
                    />
                    <GlowText className="text-lg text-violet-100">
                      {userRole === 'admin' 
                        ? 'Administration complète des contrats clients 📄'
                        : 'Consultez vos contrats et leur statut 📋'
                      }
                    </GlowText>
                  </div>
                </div>
                <div className="flex gap-2">
                  {userRole === 'admin' && (
                    <>
                      <MagneticButton variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </MagneticButton>
                      <Link to="/business/contracts/new">
                        <MagneticButton className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Nouveau contrat
                        </MagneticButton>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

      {/* Synapse Insights */}
      <SynapseInsights context={userRole === 'admin' ? 'admin-contracts' : 'client-contracts'} />

      {/* Stats Cards */}
      <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StaggeredItem index={0}>
          <AnimatedMetricCard
            title="Total Contrats"
            value={contracts.length.toString()}
            description={formatCurrency(stats.total)}
            icon={FileText}
            gradient="from-violet-500 to-indigo-500"
          />
        </StaggeredItem>
        
        <StaggeredItem index={1}>
          <AnimatedMetricCard
            title="Actifs"
            value={stats.active.toString()}
            description="En cours d'exécution"
            icon={CheckCircle}
            trend="+"
            gradient="from-indigo-500 to-purple-500"
          />
        </StaggeredItem>

        <StaggeredItem index={2}>
          <AnimatedMetricCard
            title="En attente"
            value={stats.pending.toString()}
            description="Signature en attente"
            icon={Clock}
            gradient="from-purple-500 to-pink-500"
          />
        </StaggeredItem>

        <StaggeredItem index={3}>
          <AnimatedMetricCard
            title="Échéance proche"
            value={stats.expiringSoon.toString()}
            icon={AlertCircle}
            description="Dans les 30 jours"
            gradient="from-pink-500 to-red-500"
          />
        </StaggeredItem>

        <StaggeredItem index={4}>
          <AnimatedMetricCard
            title="IA Générés"
            value={stats.aiGenerated.toString()}
            description="Créés par IA"
            icon={RefreshCw}
            trend="+"
            gradient="from-red-500 to-orange-500"
          />
        </StaggeredItem>

        <StaggeredItem index={5}>
          <AnimatedMetricCard
            title="Conformité"
            value={`${Math.round(stats.avgCompliance * 100)}%`}
            description="Score moyen"
            icon={CheckCircle}
            trend="+"
            gradient="from-orange-500 to-amber-500"
          />
        </StaggeredItem>
      </StaggeredList>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un contrat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {CONTRACT_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {CONTRACT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Contrats</CardTitle>
          <CardDescription>
            {filteredContracts.length} contrat{filteredContracts.length > 1 ? 's' : ''} trouvé{filteredContracts.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrat</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => {
                const statusConfig = getStatusConfig(contract.status);
                const StatusIcon = statusConfig.icon;
                const progress = getContractProgress(contract.start_date, contract.end_date);
                const daysLeft = getDaysUntilEnd(contract.end_date);
                
                return (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{contract.contract_number}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {contract.title}
                        </div>
                        {contract.generated_by_ai && (
                          <Badge variant="secondary" className="text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {contract.company?.name || 'Client inconnu'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTypeLabel(contract.contract_type || 'other')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(contract.amount, contract.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${statusConfig.color} text-white`}
                        variant="secondary"
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {format(new Date(contract.end_date), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                        {daysLeft > 0 ? (
                          <div className={`text-xs ${daysLeft <= 30 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}
                          </div>
                        ) : (
                          <div className="text-xs text-red-600">
                            Expiré
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link to={`/business/contracts/${contract.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {userRole === 'admin' && (
                          <>
                            <Link to={`/business/contracts/${contract.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {contract.status === 'active' && (
                              <Link to={`/business/invoices/new?from_contract=${contract.id}`}>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-blue-600 hover:text-blue-700"
                                  title="Créer une facture depuis ce contrat"
                                >
                                  <Receipt className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredContracts.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun contrat trouvé</p>
              {userRole === 'admin' && (
                <Link to="/business/contracts/new" className="mt-4 inline-block">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier contrat
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);
} 