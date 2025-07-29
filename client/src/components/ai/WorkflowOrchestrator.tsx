import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity,
  AlertTriangle,
  Bot,
  BrainCircuit,
  CheckCircle,
  Clock,
  Cog,
  Eye,
  Flame,
  GitBranch,
  Lightbulb,
  Loader,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Square,
  Trash2,
  Workflow,
  X,
  Zap
} from 'lucide-react';
// import { supabase } // Migrated from Supabase to Express API
import { useToast } from '@/hooks/use-toast';

interface IntelligentWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'hr' | 'finance' | 'operations' | 'sales';
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  isActive: boolean;
  aiAdaptive: boolean;
  priority: number;
  createdAt: string;
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
  metadata: Record<string, unknown>;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  currentStepId: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  executedSteps: ExecutedStep[];
  variables: Record<string, unknown>;
  logs: ExecutionLog[];
  error?: string;
  triggeredBy: string;
}

interface ExecutedStep {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  result?: unknown;
  error?: string;
  retryCount: number;
}

interface ExecutionLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  stepId?: string;
  data?: unknown;
}

interface WorkflowTrigger {
  id: string;
  type: 'event' | 'schedule' | 'condition' | 'manual' | 'ai_prediction';
  eventType?: string;
  schedule?: string;
  condition?: string;
  aiModel?: string;
  threshold?: number;
  data?: unknown;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'parallel' | 'wait' | 'ai_decision';
  action?: unknown;
  condition?: unknown;
  parallelSteps?: WorkflowStep[];
  waitDuration?: number;
  aiDecision?: unknown;
  nextStepId?: string;
  onSuccess?: string;
  onFailure?: string;
  retryPolicy?: unknown;
}

interface WorkflowCondition {
  id: string;
  expression: string;
  variables: Record<string, unknown>;
  aiEvaluated: boolean;
  logic: 'and' | 'or' | 'not';
}

// Interfaces pour les messages WebSocket
interface WebSocketMessage {
  type: string;
}

interface ConnectionEstablishedMessage extends WebSocketMessage {
  type: 'connection_established';
}

interface WorkflowStatusUpdateMessage extends WebSocketMessage {
  type: 'workflow_status_update';
  data: {
    activeExecutions: WorkflowExecution[];
    stats: ExecutionStats;
  };
}

interface WorkflowExecutionStartedMessage extends WebSocketMessage {
  type: 'workflow_execution_started';
  execution: WorkflowExecution;
}

interface WorkflowExecutionErrorMessage extends WebSocketMessage {
  type: 'workflow_execution_error';
  message: string;
}

interface ExecutionStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  runningExecutions: number;
  averageDuration: number;
}

// Type pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

interface WorkflowCondition {
  id: string;
  expression: string;
  variables: Record<string, unknown>;
  aiEvaluated: boolean;
  logic: 'and' | 'or' | 'not';
}

interface WorkflowStats {
  total: number;
  active: number;
  categories: Record<string, number>;
  aiAdaptive: number;
  totalExecutions: number;
  averageSuccessRate: number;
}

interface ExecutionStats {
  total: number;
  active: number;
  completed: number;
  failed: number;
  cancelled: number;
  paused: number;
  averageDuration: number;
  successRate: number;
}

const WorkflowOrchestrator: React.FC = () => {
  const [workflows, setWorkflows] = useState<IntelligentWorkflow[]>([]);
  const [activeExecutions, setActiveExecutions] = useState<WorkflowExecution[]>([]);
  const [executionHistory, setExecutionHistory] = useState<WorkflowExecution[]>([]);
  const [workflowStats, setWorkflowStats] = useState<WorkflowStats | null>(null);
  const [executionStats, setExecutionStats] = useState<ExecutionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<IntelligentWorkflow | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { toast } = useToast();

  // Couleurs par catégorie
  const categoryColors = {
    business: 'bg-blue-100 text-blue-800',
    hr: 'bg-green-100 text-green-800',
    finance: 'bg-purple-100 text-purple-800',
    operations: 'bg-orange-100 text-orange-800',
    sales: 'bg-pink-100 text-pink-800'
  };

  // Couleurs par statut d'exécution
  const statusColors = {
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    paused: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  // Icônes par statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <X className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'cancelled': return <Square className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Initialisation WebSocket
  const initializeWebSocket = useCallback(() => {
    if (websocket) {
      websocket.close();
    }

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/functions/v1/ai-workflow-orchestrator`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('🤖 WebSocket Orchestrateur connecté');
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('❌ Erreur parsing WebSocket:', error);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket fermé');
      setIsMonitoring(false);
    };

    ws.onerror = (error) => {
      console.error('❌ Erreur WebSocket:', error);
      setError('Erreur de connexion temps réel');
      setIsMonitoring(false);
    };

    setWebsocket(ws);
  }, [websocket]);

  // Gestion des messages WebSocket
  const handleWebSocketMessage = (message: unknown) => {
    // Vérifier et typer le message WebSocket
    if (!message || typeof message !== 'object') return;
    
    const typedMessage = message as WebSocketMessage;
    
    switch (typedMessage.type) {
      case 'connection_established':
        setIsMonitoring(true);
        break;
      case 'workflow_status_update': {
        const statusMessage = message as WorkflowStatusUpdateMessage;
        if (statusMessage.data) {
          setActiveExecutions(statusMessage.data.activeExecutions);
          setExecutionStats(statusMessage.data.stats);
        }
        break;
      }
      case 'workflow_execution_started': {
        const startedMessage = message as WorkflowExecutionStartedMessage;
        if (startedMessage.execution) {
          setActiveExecutions(prev => [startedMessage.execution, ...prev]);
          toast({
            title: "Workflow démarré",
            description: `Exécution ${startedMessage.execution.id} en cours`,
            variant: "default"
          });
        }
        break;
      }
      case 'monitoring_started':
        setIsMonitoring(true);
        break;
      case 'monitoring_stopped':
        setIsMonitoring(false);
        break;
      case 'error': {
        const errorMessage = message as WorkflowExecutionErrorMessage;
        setError(errorMessage.message);
        break;
      }
    }

  };

  // Chargement des workflows
  const loadWorkflows = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('ai-workflow-orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'get_workflows' })
      });

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      
      const data = await response.json() as ApiResponse<{
        workflows: IntelligentWorkflow[];
        stats: any;
      }>;

      if (data.success) {
        setWorkflows(data.data?.workflows || []);
        setWorkflowStats(data.data?.stats || {});
        console.log('✅ Workflows chargés:', data.data?.workflows.length || 0);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement des workflows');
      }
    } catch (error: unknown) {
      console.error('❌ Erreur chargement workflows:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des workflows');
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des exécutions
  const loadExecutions = async () => {
    try {
      const response = await fetch('ai-workflow-orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'get_executions' })
      });

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      
      const data = await response.json() as ApiResponse<{
        active: WorkflowExecution[];
        history: WorkflowExecution[];
        stats: ExecutionStats;
      }>;

      if (data.success) {
        setActiveExecutions(data.data?.active || []);
        setExecutionHistory(data.data?.history || []);
        setExecutionStats(data.data?.stats || null);
      }
    } catch (error: unknown) {
      console.error('❌ Erreur chargement exécutions:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des exécutions');
    }
  };

  // Exécution d'un workflow
  const executeWorkflow = async (workflowId: string, initialData?: unknown) => {
    try {
      const response = await fetch('ai-workflow-orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'execute_workflow', 
          workflowId, 
          triggeredBy: 'manual',
          initialData: initialData || {}
        })
      });

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      
      const data = await response.json() as ApiResponse<{
        execution: WorkflowExecution;
      }>;

      if (data.success && data.data) {
        toast({
          title: "Workflow démarré",
          description: `Exécution ${data.data.execution.id} en cours`,
          variant: "default"
        });
        await loadExecutions();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('❌ Erreur exécution workflow:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer le workflow",
        variant: "destructive"
      });
    }
  };

  // Contrôle d'exécution
  const pauseExecution = async (executionId: string) => {
    try {
      const response = await fetch('ai-workflow-orchestrator', {
        body: { action: 'pause_execution', executionId }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Exécution pausée",
          description: `Workflow ${executionId} mis en pause`,
          variant: "default"
        });
        await loadExecutions();
      }
    } catch (error) {
      console.error('❌ Erreur pause exécution:', error);
    }
  };

  const resumeExecution = async (executionId: string) => {
    try {
      const response = await fetch('ai-workflow-orchestrator', {
        body: { action: 'resume_execution', executionId }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Exécution reprise",
          description: `Workflow ${executionId} repris`,
          variant: "default"
        });
        await loadExecutions();
      }
    } catch (error) {
      console.error('❌ Erreur reprise exécution:', error);
    }
  };

  const cancelExecution = async (executionId: string) => {
    try {
      const response = await fetch('ai-workflow-orchestrator', {
        body: { action: 'cancel_execution', executionId }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Exécution annulée",
          description: `Workflow ${executionId} annulé`,
          variant: "default"
        });
        await loadExecutions();
      }
    } catch (error) {
      console.error('❌ Erreur annulation exécution:', error);
    }
  };

  // Démarrage/arrêt du monitoring
  const startMonitoring = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: 'start_monitoring',
        interval: 3000
      }));
    } else {
      initializeWebSocket();
    }
  };

  const stopMonitoring = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: 'stop_monitoring'
      }));
    }
    setIsMonitoring(false);
  };

  // Formatage des durées
  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Effets
  useEffect(() => {
    loadWorkflows();
    loadExecutions();
  }, []);

  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'orchestrateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Workflow className="h-8 w-8 text-blue-500" />
            Orchestrateur de Workflows IA
          </h1>
          <p className="text-gray-600">
            Automatisation intelligente • Actions contextuelles • Monitoring temps réel
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            {isMonitoring ? "Monitoring Actif" : "Monitoring Inactif"}
          </Badge>
          <Button 
            variant={isMonitoring ? "destructive" : "default"}
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
          >
            {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isMonitoring ? 'Arrêter' : 'Démarrer'} Monitoring
          </Button>
          <Button onClick={loadWorkflows} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Alertes */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workflows Total</p>
                <p className="text-2xl font-bold">{workflowStats?.total || 0}</p>
              </div>
              <Workflow className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {workflowStats?.active || 0} actifs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exécutions</p>
                <p className="text-2xl font-bold">{executionStats?.active || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              en cours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de Succès</p>
                <p className="text-2xl font-bold">{(executionStats?.successRate || 0).toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              global
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">IA Adaptatifs</p>
                <p className="text-2xl font-bold">{workflowStats?.aiAdaptive || 0}</p>
              </div>
              <BrainCircuit className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              workflows IA
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Exécutions</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflows actifs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Workflows Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflows.filter(w => w.isActive).slice(0, 5).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{workflow.name}</span>
                          <Badge className={categoryColors[workflow.category]}>
                            {workflow.category}
                          </Badge>
                          {workflow.aiAdaptive && (
                            <Badge variant="outline" className="text-purple-600">
                              <BrainCircuit className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {workflow.executionCount} exécutions • 
                          {(workflow.successRate * 100).toFixed(1)}% succès
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => executeWorkflow(workflow.id)}
                        disabled={isLoading}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Lancer
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exécutions récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Exécutions Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...activeExecutions, ...executionHistory].slice(0, 5).map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(execution.status)}
                          <span className="font-medium">{execution.id.substring(0, 12)}...</span>
                          <Badge className={statusColors[execution.status]}>
                            {execution.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(execution.startedAt).toLocaleString()} • 
                          {execution.duration ? formatDuration(execution.duration) : 'En cours...'}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {execution.status === 'running' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => pauseExecution(execution.id)}>
                              <Pause className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => cancelExecution(execution.id)}>
                              <Square className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        {execution.status === 'paused' && (
                          <Button size="sm" variant="outline" onClick={() => resumeExecution(execution.id)}>
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelectedExecution(execution)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {workflowStats && Object.entries(workflowStats.categories).map(([category, count]) => (
                  <div key={category} className="text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{category}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${categoryColors[category]?.replace('text-', 'bg-').replace('-800', '-500')}`}
                        style={{ width: `${(count / workflowStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tous les Workflows</h2>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <WorkflowCard 
                key={workflow.id} 
                workflow={workflow}
                onExecute={executeWorkflow}
                onSelect={setSelectedWorkflow}
                categoryColors={categoryColors}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <ExecutionsTab 
            activeExecutions={activeExecutions}
            executionHistory={executionHistory}
            executionStats={executionStats}
            onPause={pauseExecution}
            onResume={resumeExecution}
            onCancel={cancelExecution}
            onSelect={setSelectedExecution}
            formatDuration={formatDuration}
            getStatusIcon={getStatusIcon}
            statusColors={statusColors}
          />
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <WorkflowBuilder 
            onWorkflowCreated={(workflow) => {
              setWorkflows(prev => [...prev, workflow]);
              toast({
                title: "Workflow créé",
                description: `Le workflow ${workflow.name} a été créé avec succès`,
                variant: "default"
              });
            }}
          />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <MonitoringTab 
            isMonitoring={isMonitoring}
            activeExecutions={activeExecutions}
            executionStats={executionStats}
            onStartMonitoring={startMonitoring}
            onStopMonitoring={stopMonitoring}
          />
        </TabsContent>
      </Tabs>

      {/* Modal détails workflow */}
      {selectedWorkflow && (
        <WorkflowDetailsModal 
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          onExecute={executeWorkflow}
        />
      )}

      {/* Modal détails exécution */}
      {selectedExecution && (
        <ExecutionDetailsModal 
          execution={selectedExecution}
          onClose={() => setSelectedExecution(null)}
          formatDuration={formatDuration}
          getStatusIcon={getStatusIcon}
        />
      )}
    </div>
  );
};

// Composant carte de workflow
const WorkflowCard: React.FC<{
  workflow: IntelligentWorkflow;
  onExecute: (id: string) => void;
  onSelect: (workflow: IntelligentWorkflow) => void;
  categoryColors: Record<string, string>;
}> = ({ workflow, onExecute, onSelect, categoryColors }) => {
  return (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${!workflow.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-grow" onClick={() => onSelect(workflow)}>
            <CardTitle className="text-lg mb-2">{workflow.name}</CardTitle>
            <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={categoryColors[workflow.category]}>
                {workflow.category}
              </Badge>
              {workflow.aiAdaptive && (
                <Badge variant="outline" className="text-purple-600">
                  <BrainCircuit className="h-3 w-3 mr-1" />
                  IA
                </Badge>
              )}
              <Badge variant={workflow.isActive ? "default" : "secondary"}>
                {workflow.isActive ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>{workflow.executionCount} exécutions</span>
          <span>{(workflow.successRate * 100).toFixed(1)}% succès</span>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onExecute(workflow.id)}
            disabled={!workflow.isActive}
            className="flex-grow"
          >
            <Play className="h-3 w-3 mr-1" />
            Exécuter
          </Button>
          <Button size="sm" variant="outline" onClick={() => onSelect(workflow)}>
            <Eye className="h-3 w-3" />
          </Button>
        </div>
        {workflow.lastExecuted && (
          <div className="text-xs text-gray-500 mt-2">
            Dernière exécution: {new Date(workflow.lastExecuted).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant onglet exécutions
const ExecutionsTab: React.FC<{
  activeExecutions: WorkflowExecution[];
  executionHistory: WorkflowExecution[];
  executionStats: ExecutionStats | null;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onSelect: (execution: WorkflowExecution) => void;
  formatDuration: (duration: number) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  statusColors: Record<string, string>;
}> = ({ 
  activeExecutions, 
  executionHistory, 
  executionStats, 
  onPause, 
  onResume, 
  onCancel, 
  onSelect, 
  formatDuration, 
  getStatusIcon, 
  statusColors 
}) => {
  return (
    <div className="space-y-6">
      {/* Statistiques d'exécution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{executionStats?.active || 0}</div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{executionStats?.completed || 0}</div>
            <div className="text-sm text-gray-600">Terminées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{executionStats?.failed || 0}</div>
            <div className="text-sm text-gray-600">Échouées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{executionStats ? formatDuration(executionStats.averageDuration) : '0s'}</div>
            <div className="text-sm text-gray-600">Durée moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Exécutions actives */}
      {activeExecutions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exécutions Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeExecutions.map((execution) => (
                <ExecutionRow 
                  key={execution.id}
                  execution={execution}
                  onPause={onPause}
                  onResume={onResume}
                  onCancel={onCancel}
                  onSelect={onSelect}
                  formatDuration={formatDuration}
                  getStatusIcon={getStatusIcon}
                  statusColors={statusColors}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique des exécutions */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Exécutions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {executionHistory.map((execution) => (
                <ExecutionRow 
                  key={execution.id}
                  execution={execution}
                  onPause={onPause}
                  onResume={onResume}
                  onCancel={onCancel}
                  onSelect={onSelect}
                  formatDuration={formatDuration}
                  getStatusIcon={getStatusIcon}
                  statusColors={statusColors}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant ligne d'exécution
const ExecutionRow: React.FC<{
  execution: WorkflowExecution;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onSelect: (execution: WorkflowExecution) => void;
  formatDuration: (duration: number) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  statusColors: Record<string, string>;
}> = ({ execution, onPause, onResume, onCancel, onSelect, formatDuration, getStatusIcon, statusColors }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          {getStatusIcon(execution.status)}
          <span className="font-medium">{execution.id}</span>
          <Badge className={statusColors[execution.status]}>
            {execution.status}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          Démarré: {new Date(execution.startedAt).toLocaleString()} • 
          Durée: {execution.duration ? formatDuration(execution.duration) : 'En cours...'}
        </div>
        <div className="text-xs text-gray-500">
          Déclenché par: {execution.triggeredBy} • 
          Étape: {execution.currentStepId}
        </div>
      </div>
      <div className="flex gap-1">
        {execution.status === 'running' && (
          <>
            <Button size="sm" variant="outline" onClick={() => onPause(execution.id)}>
              <Pause className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onCancel(execution.id)}>
              <Square className="h-3 w-3" />
            </Button>
          </>
        )}
        {execution.status === 'paused' && (
          <Button size="sm" variant="outline" onClick={() => onResume(execution.id)}>
            <Play className="h-3 w-3" />
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onSelect(execution)}>
          <Eye className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

// Composant builder de workflow (simplifié pour cette démo)
const WorkflowBuilder: React.FC<{
  onWorkflowCreated: (workflow: IntelligentWorkflow) => void;
}> = ({ onWorkflowCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'business' | 'hr' | 'finance' | 'operations' | 'sales'>('business');
  const [isCreating, setIsCreating] = useState(false);

  const createWorkflow = async () => {
    if (!name || !description) return;

    setIsCreating(true);
    try {
      // Workflow basique pour la démo
      const workflow: IntelligentWorkflow = {
        id: `custom_${Date.now()}`,
        name,
        description,
        category,
        triggers: [],
        steps: [],
        conditions: [],
        isActive: true,
        aiAdaptive: false,
        priority: 5,
        createdAt: new Date().toISOString(),
        executionCount: 0,
        successRate: 0,
        metadata: { custom: true }
      };

      onWorkflowCreated(workflow);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Erreur création workflow:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un Nouveau Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Nom du Workflow</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du workflow..."
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du workflow..."
          />
        </div>
        
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select value={category} onValueChange={(value: unknown) => setCategory(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="hr">RH</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="operations">Opérations</SelectItem>
              <SelectItem value="sales">Ventes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={createWorkflow} 
          disabled={!name || !description || isCreating}
          className="w-full"
        >
          {isCreating ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
          Créer Workflow
        </Button>
      </CardContent>
    </Card>
  );
};

// Composant onglet monitoring (simplifié)
const MonitoringTab: React.FC<{
  isMonitoring: boolean;
  activeExecutions: WorkflowExecution[];
  executionStats: ExecutionStats | null;
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
}> = ({ isMonitoring, activeExecutions, executionStats, onStartMonitoring, onStopMonitoring }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Temps Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                {isMonitoring ? 'Monitoring actif - Mise à jour toutes les 3 secondes' : 'Monitoring inactif'}
              </p>
            </div>
            <Button 
              variant={isMonitoring ? "destructive" : "default"}
              onClick={isMonitoring ? onStopMonitoring : onStartMonitoring}
            >
              {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isMonitoring ? 'Arrêter' : 'Démarrer'}
            </Button>
          </div>
          
          {isMonitoring && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activeExecutions.length}</div>
                <div className="text-sm text-gray-600">Exécutions actives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{executionStats?.completed || 0}</div>
                <div className="text-sm text-gray-600">Terminées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{executionStats?.failed || 0}</div>
                <div className="text-sm text-gray-600">Échouées</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Modals de détails (simplifiées pour cette démo)
const WorkflowDetailsModal: React.FC<{
  workflow: IntelligentWorkflow;
  onClose: () => void;
  onExecute: (id: string) => void;
}> = ({ workflow, onClose, onExecute }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{workflow.name}</h2>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">{workflow.description}</p>
          
          <div className="flex gap-2">
            <Badge>{workflow.category}</Badge>
            {workflow.aiAdaptive && <Badge variant="outline">IA Adaptatif</Badge>}
            <Badge variant={workflow.isActive ? "default" : "secondary"}>
              {workflow.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Exécutions:</span> {workflow.executionCount}
            </div>
            <div>
              <span className="font-medium">Taux de succès:</span> {(workflow.successRate * 100).toFixed(1)}%
            </div>
            <div>
              <span className="font-medium">Priorité:</span> {workflow.priority}
            </div>
            <div>
              <span className="font-medium">Étapes:</span> {workflow.steps.length}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={() => onExecute(workflow.id)} disabled={!workflow.isActive}>
              <Play className="h-4 w-4 mr-2" />
              Exécuter
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExecutionDetailsModal: React.FC<{
  execution: WorkflowExecution;
  onClose: () => void;
  formatDuration: (duration: number) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}> = ({ execution, onClose, formatDuration, getStatusIcon }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {getStatusIcon(execution.status)}
            Exécution {execution.id}
          </h2>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Statut:</span> {execution.status}
            </div>
            <div>
              <span className="font-medium">Déclenché par:</span> {execution.triggeredBy}
            </div>
            <div>
              <span className="font-medium">Démarré:</span> {new Date(execution.startedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Durée:</span> {execution.duration ? formatDuration(execution.duration) : 'En cours...'}
            </div>
          </div>
          
          {execution.logs.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Logs d'Exécution</h3>
              <ScrollArea className="h-40 bg-gray-50 p-3 rounded">
                <div className="space-y-1 text-xs font-mono">
                  {execution.logs.map((log, index) => (
                    <div key={index} className={`${
                      log.level === 'error' ? 'text-red-600' : 
                      log.level === 'warn' ? 'text-yellow-600' : 
                      'text-gray-600'
                    }`}>
                      [{new Date(log.timestamp).toLocaleTimeString()}] {log.level.toUpperCase()}: {log.message}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          <Button variant="outline" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowOrchestrator; 