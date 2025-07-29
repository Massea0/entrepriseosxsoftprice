import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Phone,
  Mail,
  Calendar,
  Brain,
  Zap,
  Settings,
  BarChart3
} from 'lucide-react';
// Migrated from Supabase to Express API

// Types pour SalesAgent
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  source: string;
  score: number;
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'PROPOSAL_SENT' | 'NEGOTIATING' | 'CLOSED_WON' | 'CLOSED_LOST';
  value: number;
  created_at: string;
  last_contact: string;
  next_action: string;
  ai_notes: string[];
}

interface SalesAction {
  id: string;
  type: 'LEAD_QUALIFICATION' | 'PRICE_NEGOTIATION' | 'PROPOSAL_GENERATION' | 'FOLLOW_UP' | 'CONTRACT_CREATION';
  lead_id: string;
  description: string;
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
  result: unknown;
  cost: number;
  created_at: string;
}

interface SalesMetrics {
  total_leads: number;
  qualified_leads: number;
  conversion_rate: number;
  avg_deal_value: number;
  pipeline_value: number;
  actions_today: number;
  revenue_generated: number;
}

const SalesAgent: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [actions, setActions] = useState<SalesAction[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics>({
    total_leads: 0,
    qualified_leads: 0,
    conversion_rate: 0,
    avg_deal_value: 0,
    pipeline_value: 0,
    actions_today: 0,
    revenue_generated: 0
  });
  const [loading, setLoading] = useState(true);
  const [processingLead, setProcessingLead] = useState<string | null>(null);

  // Configuration de l'agent
  const [agentConfig, setAgentConfig] = useState({
    min_lead_score: 70,
    max_discount: 15,
    auto_follow_up: true,
    qualification_criteria: ['Budget confirmé', 'Besoin identifié', 'Décideur contacté', 'Timeline définie'],
    pricing_rules: {
      volume_discount: 0.1,
      loyalty_bonus: 0.05,
      urgency_premium: 0.15
    }
  });

  // Charger les données
  const loadData = async () => {
    try {
      // Simuler des leads (en prod, viendraient de la base)
      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'Marie Dubois',
          email: 'marie.dubois@techcorp.fr',
          phone: '+33 1 23 45 67 89',
          company: 'TechCorp Solutions',
          source: 'Website',
          score: 85,
          status: 'QUALIFIED',
          value: 45000,
          created_at: new Date().toISOString(),
          last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          next_action: 'Envoyer proposition commerciale',
          ai_notes: [
            'Budget confirmé: 50K€',
            'Besoin urgent de digitalisation',
            'Décision en comité début février'
          ]
        },
        {
          id: '2',
          name: 'Jean Martin',
          email: 'j.martin@innovate.com',
          company: 'Innovate Industries',
          source: 'LinkedIn',
          score: 92,
          status: 'NEGOTIATING',
          value: 78000,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          last_contact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          next_action: 'Finaliser conditions contractuelles',
          ai_notes: [
            'Négociation sur le prix (-10%)',
            'Urgence projet (livraison mars)',
            'ROI validé par la direction'
          ]
        },
        {
          id: '3',
          name: 'Sophie Chen',
          email: 'sophie@startup-ai.fr',
          company: 'StartupAI',
          source: 'Referral',
          score: 65,
          status: 'NEW',
          value: 25000,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          last_contact: new Date().toISOString(),
          next_action: 'Qualification initiale',
          ai_notes: ['Premier contact établi']
        }
      ];

      setLeads(mockLeads);

      // Calculer les métriques
      const qualified = mockLeads.filter(l => l.score >= agentConfig.min_lead_score);
      const totalValue = mockLeads.reduce((sum, l) => sum + l.value, 0);
      
      setMetrics({
        total_leads: mockLeads.length,
        qualified_leads: qualified.length,
        conversion_rate: mockLeads.length > 0 ? (qualified.length / mockLeads.length) * 100 : 0,
        avg_deal_value: mockLeads.length > 0 ? totalValue / mockLeads.length : 0,
        pipeline_value: totalValue,
        actions_today: 8,
        revenue_generated: 156000
      });

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Actions automatiques de l'agent
  const qualifyLead = async (leadId: string) => {
    setProcessingLead(leadId);
    
    try {
      // Simuler l'IA de qualification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedLeads = leads.map(lead => {
        if (lead.id === leadId && lead.status === 'NEW') {
          const qualificationScore = Math.random() * 100;
          return {
            ...lead,
            score: Math.round(qualificationScore),
            status: qualificationScore >= agentConfig.min_lead_score ? 'QUALIFIED' : 'CONTACTED',
            ai_notes: [
              ...lead.ai_notes,
              `Qualification IA: ${Math.round(qualificationScore)}/100`,
              qualificationScore >= 80 ? 'Lead prioritaire identifié' : 'Suivi standard requis',
              `Critères validés: ${Math.floor(Math.random() * 4)} / 4`
            ]
          } as Lead;
        }
        return lead;
      });
      
      setLeads(updatedLeads);
      
      // Enregistrer l'action
      const newAction: SalesAction = {
        id: Date.now().toString(),
        type: 'LEAD_QUALIFICATION',
        lead_id: leadId,
        description: 'Qualification automatique du lead par IA',
        status: 'EXECUTED',
        result: { qualified: true, score: 85 },
        cost: 2.50,
        created_at: new Date().toISOString()
      };
      
      setActions(prev => [newAction, ...prev]);
      
    } catch (error) {
      console.error('Erreur qualification:', error);
    } finally {
      setProcessingLead(null);
    }
  };

  const generateProposal = async (leadId: string) => {
    setProcessingLead(leadId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      // Simuler génération de proposition
      const proposal = {
        basePrice: lead.value,
        discount: Math.min(Math.random() * agentConfig.max_discount, agentConfig.max_discount),
        timeline: `${4 + Math.floor(Math.random() * 8)} semaines`,
        terms: 'Standard avec garantie 2 ans'
      };

      const updatedLeads = leads.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            status: 'PROPOSAL_SENT' as const,
            ai_notes: [
              ...l.ai_notes,
              `Proposition générée automatiquement`,
              `Prix: ${proposal.basePrice.toLocaleString()}€ (remise ${proposal.discount.toFixed(1)}%)`,
              `Délai: ${proposal.timeline}`,
              `Conditions: ${proposal.terms}`
            ]
          };
        }
        return l;
      });
      
      setLeads(updatedLeads);

      const newAction: SalesAction = {
        id: Date.now().toString(),
        type: 'PROPOSAL_GENERATION',
        lead_id: leadId,
        description: 'Génération automatique de proposition commerciale',
        status: 'EXECUTED',
        result: proposal,
        cost: 5.00,
        created_at: new Date().toISOString()
      };
      
      setActions(prev => [newAction, ...prev]);

    } catch (error) {
      console.error('Erreur génération proposition:', error);
    } finally {
      setProcessingLead(null);
    }
  };

  const negotiatePrice = async (leadId: string, requestedDiscount: number) => {
    setProcessingLead(leadId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      // Logique de négociation IA
      const maxAllowedDiscount = agentConfig.max_discount;
      const approvedDiscount = Math.min(requestedDiscount, maxAllowedDiscount);
      const counterOffer = approvedDiscount < requestedDiscount ? approvedDiscount : requestedDiscount;

      const updatedLeads = leads.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            status: 'NEGOTIATING' as const,
            ai_notes: [
              ...l.ai_notes,
              `Négociation IA: Remise demandée ${requestedDiscount}%`,
              `Contre-offre: ${counterOffer}% (max autorisé: ${maxAllowedDiscount}%)`,
              counterOffer === requestedDiscount ? 'Conditions acceptées' : 'Contre-proposition envoyée'
            ]
          };
        }
        return l;
      });
      
      setLeads(updatedLeads);

      const newAction: SalesAction = {
        id: Date.now().toString(),
        type: 'PRICE_NEGOTIATION',
        lead_id: leadId,
        description: `Négociation automatique: ${requestedDiscount}% → ${counterOffer}%`,
        status: 'EXECUTED',
        result: { requested: requestedDiscount, approved: counterOffer },
        cost: 3.50,
        created_at: new Date().toISOString()
      };
      
      setActions(prev => [newAction, ...prev]);

    } catch (error) {
      console.error('Erreur négociation:', error);
    } finally {
      setProcessingLead(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'QUALIFIED': return 'bg-green-100 text-green-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'PROPOSAL_SENT': return 'bg-purple-100 text-purple-800';
      case 'NEGOTIATING': return 'bg-orange-100 text-orange-800';
      case 'CLOSED_WON': return 'bg-emerald-100 text-emerald-800';
      case 'CLOSED_LOST': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Initialisation SalesAgent...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">SalesAgent Pro</h2>
            <p className="text-muted-foreground">Agent IA autonome pour la qualification des leads et négociation</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Brain className="w-3 h-3 mr-1" />
            ACTIF
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Config
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Leads Qualifiés</p>
                <p className="text-2xl font-bold">{metrics.qualified_leads}/{metrics.total_leads}</p>
                <p className="text-xs text-green-600">+{metrics.conversion_rate.toFixed(1)}% taux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pipeline</p>
                <p className="text-2xl font-bold">€{(metrics.pipeline_value / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">€{(metrics.avg_deal_value / 1000).toFixed(0)}K moy/deal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Actions Aujourd'hui</p>
                <p className="text-2xl font-bold">{metrics.actions_today}</p>
                <p className="text-xs text-blue-600">Automatisées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue Généré</p>
                <p className="text-2xl font-bold">€{(metrics.revenue_generated / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline des leads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Pipeline des Leads</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className={`font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">€{lead.value.toLocaleString()}</span>
                    <div className="flex space-x-1">
                      {lead.status === 'NEW' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => qualifyLead(lead.id)}
                          disabled={processingLead === lead.id}
                        >
                          {processingLead === lead.id ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <Brain className="w-4 h-4" />
                          )}
                          Qualifier
                        </Button>
                      )}
                      {lead.status === 'QUALIFIED' && (
                        <Button 
                          size="sm"
                          onClick={() => generateProposal(lead.id)}
                          disabled={processingLead === lead.id}
                        >
                          {processingLead === lead.id ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                          Proposition
                        </Button>
                      )}
                      {lead.status === 'PROPOSAL_SENT' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => negotiatePrice(lead.id, 10)}
                          disabled={processingLead === lead.id}
                        >
                          {processingLead === lead.id ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <MessageSquare className="w-4 h-4" />
                          )}
                          Négocier
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contacts */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Dernier contact: {new Date(lead.last_contact).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Prochaine action */}
                <div className="bg-gray-50 rounded p-2 mb-3">
                  <span className="text-sm font-medium">Prochaine action: </span>
                  <span className="text-sm">{lead.next_action}</span>
                </div>

                {/* Notes IA */}
                {lead.ai_notes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Notes IA:</p>
                    <div className="space-y-1">
                      {lead.ai_notes.map((note, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Récentes de l'Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucune action enregistrée. L'agent commencera à travailler automatiquement.
              </p>
            ) : (
              actions.map((action) => {
                const lead = leads.find(l => l.id === action.lead_id);
                return (
                  <div key={action.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        action.status === 'EXECUTED' ? 'bg-green-100' :
                        action.status === 'PENDING' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {action.type === 'LEAD_QUALIFICATION' && <Brain className="w-4 h-4" />}
                        {action.type === 'PROPOSAL_GENERATION' && <FileText className="w-4 h-4" />}
                        {action.type === 'PRICE_NEGOTIATION' && <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{action.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead?.name} • {new Date(action.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">€{action.cost.toFixed(2)}</span>
                      <Badge variant={action.status === 'EXECUTED' ? 'default' : 'secondary'}>
                        {action.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="min_score">Score minimum qualification</Label>
              <Input
                id="min_score"
                type="number"
                value={agentConfig.min_lead_score}
                onChange={(e) => setAgentConfig(prev => ({ 
                  ...prev, 
                  min_lead_score: parseInt(e.target.value) 
                }))}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="max_discount">Remise maximum (%)</Label>
              <Input
                id="max_discount"
                type="number"
                value={agentConfig.max_discount}
                onChange={(e) => setAgentConfig(prev => ({ 
                  ...prev, 
                  max_discount: parseFloat(e.target.value) 
                }))}
                min="0"
                max="30"
                step="0.5"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="auto_follow"
                checked={agentConfig.auto_follow_up}
                onChange={(e) => setAgentConfig(prev => ({ 
                  ...prev, 
                  auto_follow_up: e.target.checked 
                }))}
                className="rounded"
              />
              <Label htmlFor="auto_follow">Suivi automatique</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAgent; 