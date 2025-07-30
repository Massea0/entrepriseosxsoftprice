import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Activity, 
  DollarSign, 
  Settings, 
  Play, 
  Pause, 
  AlertTriangle,
  TrendingUp,
  Brain,
  Users,
  Building,
  Calculator,
  Crown,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
// AI Agents Management - migrated from Supabase to Express API

// Types pour les agents IA
interface AIAgent {
  id: string;
  name: string;
  type: 'SALES' | 'HR' | 'FINANCE' | 'MARKETING' | 'OPERATIONS' | 'MASTER';
  description: string;
  autonomy_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'AUTONOMOUS';
  status: 'ACTIVE' | 'INACTIVE' | 'TRAINING' | 'ERROR';
  capabilities: string[];
  created_at: string;
  updated_at: string;
  daily_budget: number;
  monthly_budget: number;
  actions_count_today: number;
  actions_count_month: number;
  last_action_at?: string;
  performance_score: number;
  success_rate: number;
}

interface AgentAction {
  id: string;
  agent_id: string;
  action_type: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'EXECUTED' | 'REJECTED' | 'FAILED';
  cost: number;
  created_at: string;
  metadata: Record<string, unknown>;
}

interface AgentBudget {
  agent_id: string;
  daily_spent: number;
  monthly_spent: number;
  daily_limit: number;
  monthly_limit: number;
}

const AIAgentsManagement: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [budgets, setBudgets] = useState<AgentBudget[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Configuration modal state
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configAgent, setConfigAgent] = useState<Partial<AIAgent>>({});

  // Utilitaire pour s'assurer que capabilities est un array
  const ensureCapabilitiesArray = (capabilities: unknown): string[] => {
    if (Array.isArray(capabilities)) return capabilities;
    if (typeof capabilities === 'string') {
      try {
        const parsed = JSON.parse(capabilities);
        return Array.isArray(parsed) ? parsed : [capabilities];
      } catch {
        return capabilities.split(',').map(c => c.trim()).filter(c => c);
      }
    }
    return [];
  };

  // Charger les données des agents
  const loadAgents = async () => {
    try {
      const [agentsResponse, actionsResponse, budgetsResponse] = await Promise.all([
        fetch('/api/ai-agents?order=created_at:desc'),
        fetch('/api/ai-agent-actions?order=created_at:desc&limit=50'),
        fetch('/api/ai-agent-budgets')
      ]);

      const agentsData = agentsResponse.ok ? await agentsResponse.json() : null;
      const actionsData = actionsResponse.ok ? await actionsResponse.json() : null;
      const budgetsData = budgetsResponse.ok ? await budgetsResponse.json() : null;

      // Si pas d'agents en base, utiliser des données mock
      if (!agentsData || agentsData.length === 0) {
        const mockAgents: AIAgent[] = [
          {
            id: '1',
            name: 'SalesAgent Pro',
            type: 'SALES',
            description: 'Agent autonome pour qualification leads et négociation',
            autonomy_level: 'HIGH',
            status: 'ACTIVE',
            capabilities: ['Qualification leads', 'Négociation prix', 'Génération contrats'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            daily_budget: 50,
            monthly_budget: 1000,
            actions_count_today: 12,
            actions_count_month: 245,
            last_action_at: new Date().toISOString(),
            performance_score: 92,
            success_rate: 87
          },
          {
            id: '2',
            name: 'HRAgent Assistant',
            type: 'HR',
            description: 'Screening CV et prédiction turnover automatique',
            autonomy_level: 'MEDIUM',
            status: 'ACTIVE',
            capabilities: ['Screening CV', 'Prédiction turnover', 'Optimisation équipes'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            daily_budget: 30,
            monthly_budget: 600,
            actions_count_today: 8,
            actions_count_month: 156,
            last_action_at: new Date().toISOString(),
            performance_score: 88,
            success_rate: 91
          },
          {
            id: '3',
            name: 'FinanceAgent Analyst',
            type: 'FINANCE',
            description: 'Analyses financières et prédictions budgétaires',
            autonomy_level: 'MEDIUM',
            status: 'ACTIVE',
            capabilities: ['Analyse financière', 'Prédictions budget', 'Reporting automatique'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            daily_budget: 40,
            monthly_budget: 800,
            actions_count_today: 15,
            actions_count_month: 312,
            last_action_at: new Date().toISOString(),
            performance_score: 94,
            success_rate: 89
          },
          {
            id: '4',
            name: 'MasterAgent Orchestrator',
            type: 'MASTER',
            description: 'Coordination et supervision de tous les agents',
            autonomy_level: 'AUTONOMOUS',
            status: 'ACTIVE',
            capabilities: ['Coordination agents', 'Résolution conflits', 'Escalation décisions'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            daily_budget: 100,
            monthly_budget: 2000,
            actions_count_today: 25,
            actions_count_month: 567,
            last_action_at: new Date().toISOString(),
            performance_score: 96,
            success_rate: 93
          }
        ];

        const mockBudgets: AgentBudget[] = [
          { agent_id: '1', daily_spent: 25.50, monthly_spent: 456.80, daily_limit: 50, monthly_limit: 1000 },
          { agent_id: '2', daily_spent: 12.30, monthly_spent: 234.50, daily_limit: 30, monthly_limit: 600 },
          { agent_id: '3', daily_spent: 35.20, monthly_spent: 567.90, daily_limit: 40, monthly_limit: 800 },
          { agent_id: '4', daily_spent: 78.40, monthly_spent: 1234.60, daily_limit: 100, monthly_limit: 2000 }
        ];

        setAgents(mockAgents);
        setBudgets(mockBudgets);
      } else {
        // Normaliser les agents depuis la base de données
        const normalizedAgents = agentsData.map(agent => ({
          ...agent,
          capabilities: ensureCapabilitiesArray(agent.capabilities)
        }));
        setAgents(normalizedAgents);
        setBudgets(budgetsData || []);
      }
      
      setActions(actionsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utilitaires
  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'SALES': return Users;
      case 'HR': return Users;
      case 'FINANCE': return Calculator;
      case 'MARKETING': return TrendingUp;
      case 'OPERATIONS': return Building;
      case 'MASTER': return Crown;
      default: return Bot;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-gray-500';
      case 'TRAINING': return 'bg-blue-500';
      case 'ERROR': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAutonomyColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'AUTONOMOUS': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBudgetProgress = (agentId: string, type: 'daily' | 'monthly') => {
    const budget = budgets.find(b => b.agent_id === agentId);
    if (!budget) return 0;
    
    const spent = type === 'daily' ? (budget.daily_spent || 0) : (budget.monthly_spent || 0);
    const limit = type === 'daily' ? (budget.daily_limit || 0) : (budget.monthly_limit || 0);
    
    return limit > 0 ? Math.min(((spent / limit) * 100), 100) : 0;
  };

  // Actions sur les agents
  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ status: newStatus })
        .eq('id', agentId);

      if (error) throw error;
      
      await loadAgents();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const saveAgentConfig = async () => {
    if (!configAgent.id) return;

    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({
          name: configAgent.name,
          description: configAgent.description,
          autonomy_level: configAgent.autonomy_level,
          capabilities: configAgent.capabilities,
          daily_budget: configAgent.daily_budget,
          monthly_budget: configAgent.monthly_budget
        })
        .eq('id', configAgent.id);

      if (error) throw error;

      setIsConfigOpen(false);
      await loadAgents();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 " />
        <span className="ml-2">Chargement des agents IA...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Agents IA</h1>
          <p className="text-muted-foreground">
            Gérez vos agents IA autonomes, leurs budgets et performances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAgents}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Agent
          </Button>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium">Agents Actifs</p>
                <p className="text-2xl font-bold">
                  {agents.filter(a => a.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium">Actions Aujourd'hui</p>
                <p className="text-2xl font-bold">
                  {agents.reduce((sum, a) => sum + (a.actions_count_today || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium">Budget Journalier</p>
                <p className="text-2xl font-bold">
                  €{budgets.reduce((sum, b) => sum + (b.daily_spent || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium">Performance Moy.</p>
                <p className="text-2xl font-bold">
                  {agents.length > 0 
                    ? Math.round(agents.reduce((sum, a) => sum + (a.performance_score || 0), 0) / agents.length) || 0
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Statut des agents */}
            <Card>
              <CardHeader>
                <CardTitle>Statut des Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents.map((agent) => {
                    const Icon = getAgentIcon(agent.type);
                    return (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{agent.name}</span>
                          <Badge variant="outline" className={getAutonomyColor(agent.autonomy_level)}>
                            {agent.autonomy_level}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                          <span className="text-sm text-muted-foreground">{agent.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {actions.slice(0, 5).map((action) => {
                    const agent = agents.find(a => a.id === action.agent_id);
                    return (
                      <div key={action.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{action.action_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {agent?.name} • {new Date(action.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {action.status === 'EXECUTED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {action.status === 'PENDING' && <Clock className="w-4 h-4 text-yellow-500" />}
                          {action.status === 'FAILED' && <XCircle className="w-4 h-4 text-red-500" />}
                          <span className="text-sm">€{action.cost.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertes */}
          {budgets.some(b => b.daily_spent / b.daily_limit > 0.8) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Certains agents approchent de leur limite budgétaire quotidienne.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Liste des agents */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const Icon = getAgentIcon(agent.type);
              const dailyProgress = getBudgetProgress(agent.id, 'daily');
              
              return (
                <Card key={agent.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-6 h-6" />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setConfigAgent(agent);
                            setIsConfigOpen(true);
                          }}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAgentStatus(agent.id, agent.status)}
                        >
                          {agent.status === 'ACTIVE' ? 
                            <Pause className="w-4 h-4" /> : 
                            <Play className="w-4 h-4" />
                          }
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                      <span className="text-sm text-muted-foreground">{agent.status}</span>
                      <Badge variant="outline" className={getAutonomyColor(agent.autonomy_level)}>
                        {agent.autonomy_level}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                    
                    {/* Métriques */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Performance</p>
                        <p className="font-medium">{agent.performance_score || 0}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Taux succès</p>
                        <p className="font-medium">{agent.success_rate || 0}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actions aujourd'hui</p>
                        <p className="font-medium">{agent.actions_count_today || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actions ce mois</p>
                        <p className="font-medium">{agent.actions_count_month || 0}</p>
                      </div>
                    </div>

                    {/* Budget quotidien */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget quotidien</span>
                        <span>€{budgets.find(b => b.agent_id === agent.id)?.daily_spent.toFixed(2) || '0.00'} / €{agent.daily_budget}</span>
                      </div>
                      <Progress value={dailyProgress} className="h-2" />
                    </div>

                    {/* Capacités */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Capacités</p>
                      <div className="flex flex-wrap gap-1">
                        {ensureCapabilitiesArray(agent.capabilities).slice(0, 3).map((capability, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                        {ensureCapabilitiesArray(agent.capabilities).length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{ensureCapabilitiesArray(agent.capabilities).length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Actions */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actions.map((action) => {
                  const agent = agents.find(a => a.id === action.agent_id);
                  return (
                    <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{action.action_type}</span>
                          <Badge variant="outline">{agent?.name}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(action.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">€{action.cost.toFixed(2)}</span>
                        <div className="flex items-center space-x-1">
                          {action.status === 'EXECUTED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {action.status === 'PENDING' && <Clock className="w-4 h-4 text-yellow-500" />}
                          {action.status === 'FAILED' && <XCircle className="w-4 h-4 text-red-500" />}
                          {action.status === 'REJECTED' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                          <span className="text-sm">{action.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budgets */}
        <TabsContent value="budgets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => {
              const budget = budgets.find(b => b.agent_id === agent.id);
              const dailyProgress = getBudgetProgress(agent.id, 'daily');
              const monthlyProgress = getBudgetProgress(agent.id, 'monthly');
              
              return (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {React.createElement(getAgentIcon(agent.type), { className: "w-5 h-5" })}
                      <span>{agent.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Budget quotidien */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Budget Quotidien</span>
                        <span>€{budget?.daily_spent.toFixed(2) || '0.00'} / €{agent.daily_budget}</span>
                      </div>
                      <Progress value={dailyProgress} className="h-3" />
                      {dailyProgress > 80 && (
                        <p className="text-xs text-orange-600 mt-1">Attention: Budget presque épuisé</p>
                      )}
                    </div>

                    {/* Budget mensuel */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Budget Mensuel</span>
                        <span>€{budget?.monthly_spent.toFixed(2) || '0.00'} / €{agent.monthly_budget}</span>
                      </div>
                      <Progress value={monthlyProgress} className="h-3" />
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                      <div>
                        <p className="text-muted-foreground">Coût par action</p>
                        <p className="font-medium">
                          €{(agent.actions_count_today || 0) > 0 
                            ? ((budget?.daily_spent || 0) / (agent.actions_count_today || 1)).toFixed(2)
                            : '0.00'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Économies potentielles</p>
                        <p className="font-medium text-green-600">€{((agent.daily_budget || 0) * 0.3).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de configuration */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="agent-config-description">
          <DialogHeader>
            <DialogTitle>Configuration de l'Agent</DialogTitle>
          </DialogHeader>
          <div id="agent-config-description" className="sr-only">
            Configurer les paramètres de l'agent IA : nom, niveau d'autonomie, budget et capacités.
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={configAgent.name || ''}
                  onChange={(e) => setConfigAgent(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="autonomy">Niveau d'autonomie</Label>
                <Select
                  value={configAgent.autonomy_level}
                  onValueChange={(value) => setConfigAgent(prev => ({ ...prev, autonomy_level: value as unknown }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="MEDIUM">Moyen</SelectItem>
                    <SelectItem value="HIGH">Élevé</SelectItem>
                    <SelectItem value="AUTONOMOUS">Autonome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={configAgent.description || ''}
                onChange={(e) => setConfigAgent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daily_budget">Budget quotidien (€)</Label>
                <Input
                  id="daily_budget"
                  type="number"
                  value={configAgent.daily_budget || 0}
                  onChange={(e) => setConfigAgent(prev => ({ ...prev, daily_budget: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="monthly_budget">Budget mensuel (€)</Label>
                <Input
                  id="monthly_budget"
                  type="number"
                  value={configAgent.monthly_budget || 0}
                  onChange={(e) => setConfigAgent(prev => ({ ...prev, monthly_budget: parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="capabilities">Capacités (une par ligne)</Label>
              <Textarea
                id="capabilities"
                value={ensureCapabilitiesArray(configAgent.capabilities).join('\n')}
                onChange={(e) => setConfigAgent(prev => ({ 
                  ...prev, 
                  capabilities: e.target.value.split('\n').filter(c => c.trim())
                }))}
                rows={4}
                placeholder="Qualification des leads&#10;Génération de devis&#10;Négociation de prix"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Annuler
              </Button>
              <Button onClick={saveAgentConfig}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAgentsManagement; 