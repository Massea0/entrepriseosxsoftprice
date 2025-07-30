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
  Download,
  Send,
  Trash2,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';
import { format } from 'date-fns';
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

interface Quote {
  id: string;
  number: string;
  object: string;
  amount: number;
  status: string;
  valid_until: string;
  validated_at?: string;
  created_at: string;
  company_id: string;
  company?: { name: string };
  notes?: string;
  rejection_reason?: string;
}

const QUOTE_STATUSES = [
  { value: 'draft', label: 'Brouillon', color: 'bg-gray-500' },
  { value: 'sent', label: 'Envoyé', color: 'bg-blue-500' },
  { value: 'approved', label: 'Approuvé', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejeté', color: 'bg-red-500' },
  { value: 'expired', label: 'Expiré', color: 'bg-orange-500' }
];

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('devis')
        .select(`
          *,
          company:company_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des devis"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('devis')
        .update({ status: newStatus })
        .eq('id', quoteId);

      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du devis a été modifié avec succès"
      });
      
      loadQuotes();
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut"
      });
    }
  };

  const deleteQuote = async (quoteId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) return;
    
    try {
      const { error } = await supabase
        .from('devis')
        .delete()
        .eq('id', quoteId);
      
      if (error) throw error;
      
      toast({
        title: "Devis supprimé",
        description: "Le devis a été supprimé avec succès"
      });
      
      loadQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le devis"
      });
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    return QUOTE_STATUSES.find(s => s.value === status) || QUOTE_STATUSES[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getQuoteStats = () => {
    const total = quotes.reduce((sum, q) => sum + q.amount, 0);
    const approved = quotes.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.amount, 0);
    const pending = quotes.filter(q => q.status === 'sent').length;
    const conversionRate = quotes.length > 0 ? (quotes.filter(q => q.status === 'approved').length / quotes.length * 100) : 0;
    
    return { total, approved, pending, conversionRate };
  };

  const stats = getQuoteStats();

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
          <EnhancedCard  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <FileText className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Gestion des Devis"
                      className="text-4xl font-bold mb-2"
                      speed={50}
                    />
                    <GlowText className="text-lg text-amber-100">
                      Administration complète des devis - Contrôle total 📋
                    </GlowText>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MagneticButton variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </MagneticButton>
                  <Link to="/business/quotes/new">
                    <MagneticButton className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau devis
                    </MagneticButton>
                  </Link>
                </div>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

      {/* Synapse Insights */}
      <SynapseInsights context="admin-quotes" />

      {/* Enhanced Stats Cards */}
      <StaggeredList className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StaggeredItem index={0}>
          <AnimatedMetricCard
            title="Valeur Totale"
            value={formatCurrency(stats.total)}
            description={`${quotes.length} devis au total`}
            icon={DollarSign}
            gradient="from-amber-500 to-orange-500"
          />
        </StaggeredItem>
        
        <StaggeredItem index={1}>
          <AnimatedMetricCard
            title="Chiffre Signé"
            value={formatCurrency(stats.approved)}
            description="Devis approuvés"
            icon={Building2}
            trend="+"
            gradient="from-orange-500 to-red-500"
          />
        </StaggeredItem>
        
        <StaggeredItem index={2}>
          <AnimatedMetricCard
            title="En Attente"
            value={stats.pending.toString()}
            description="Réponse client attendue"
            icon={Calendar}
            gradient="from-red-500 to-pink-500"
          />
        </StaggeredItem>
        
        <StaggeredItem index={3}>
          <AnimatedMetricCard
            title="Taux Conversion"
            value={`${stats.conversionRate.toFixed(0)}%`}
            description="Performance commerciale"
            icon={FileText}
            trend="+"
            gradient="from-pink-500 to-purple-500"
          />
        </StaggeredItem>
      </StaggeredList>

      {/* Filters */}
      <HoverZone>
        <EnhancedCard>
        <CardHeader>
          <CardTitle>Filtres & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <EnhancedInput
                  placeholder="Rechercher un devis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
                {QUOTE_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </EnhancedCard>
    </HoverZone>

      {/* Enhanced Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Devis (Vue Admin)</CardTitle>
          <CardDescription>
            {filteredQuotes.length} devis trouvé{filteredQuotes.length > 1 ? 's' : ''} - Contrôles administrateur disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Objet</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Validité</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => {
                const statusConfig = getStatusConfig(quote.status);
                const isExpired = new Date(quote.valid_until) < new Date();
                
                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.number}</TableCell>
                    <TableCell>{quote.object}</TableCell>
                    <TableCell>{quote.company?.name || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(quote.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                          {statusConfig.label}
                        </Badge>
                        {quote.status === 'sent' && (
                          <Select onValueChange={(value) => updateQuoteStatus(quote.id, value)}>
                            <SelectTrigger className="w-20 h-6">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approved">Approuver</SelectItem>
                              <SelectItem value="rejected">Rejeter</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                        {format(new Date(quote.valid_until), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(quote.created_at), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link to={`/business/quotes/${quote.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Link to={`/business/quotes/${quote.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Send className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteQuote(quote.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredQuotes.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun devis trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);
}