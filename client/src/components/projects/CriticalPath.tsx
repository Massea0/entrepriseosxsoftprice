import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Route, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Calendar,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  Timer,
  Activity,
  Users
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dependencies: string[];
  estimated_hours: number;
  actual_hours?: number;
  start_date?: string;
  end_date?: string;
  assignee?: {
    full_name: string;
  };
  progress: number;
}

interface CriticalPathProps {
  project: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    tasks: Task[];
  };
}

interface CPMNode {
  id: string;
  task: Task;
  earliestStart: number;
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  slack: number;
  isCritical: boolean;
}

export function CriticalPath({ project }: CriticalPathProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);

  // Calcul du chemin critique avec CPM (Critical Path Method)
  const cpmAnalysis = useMemo(() => {
    const taskMap = new Map(project.tasks.map(t => [t.id, t]));
    const nodes = new Map<string, CPMNode>();
    
    // Initialiser les nodes
    project.tasks.forEach(task => {
      nodes.set(task.id, {
        id: task.id,
        task,
        earliestStart: 0,
        earliestFinish: 0,
        latestStart: Infinity,
        latestFinish: Infinity,
        slack: 0,
        isCritical: false
      });
    });
    
    // Forward pass - calculer earliest start/finish
    const calculateEarliestTimes = (taskId: string, visited = new Set<string>()): number => {
      if (visited.has(taskId)) return 0;
      visited.add(taskId);
      
      const node = nodes.get(taskId)!;
      const task = node.task;
      
      if (task.dependencies.length === 0) {
        node.earliestStart = 0;
      } else {
        const maxDependencyFinish = Math.max(
          ...task.dependencies
            .filter(depId => taskMap.has(depId))
            .map(depId => {
              const depNode = nodes.get(depId)!;
              calculateEarliestTimes(depId, visited);
              return depNode.earliestFinish;
            })
        );
        node.earliestStart = maxDependencyFinish;
      }
      
      // Durée en jours (8h par jour)
      const duration = Math.ceil(task.estimated_hours / 8);
      node.earliestFinish = node.earliestStart + duration;
      
      return node.earliestFinish;
    };
    
    // Calculer les temps au plus tôt pour toutes les tâches
    project.tasks.forEach(task => calculateEarliestTimes(task.id));
    
    // Trouver la durée totale du projet
    const projectDuration = Math.max(...Array.from(nodes.values()).map(n => n.earliestFinish));
    
    // Backward pass - calculer latest start/finish
    const calculateLatestTimes = (taskId: string, visited = new Set<string>()): void => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      
      const node = nodes.get(taskId)!;
      const task = node.task;
      
      // Trouver les tâches qui dépendent de celle-ci
      const dependentTasks = project.tasks.filter(t => t.dependencies.includes(taskId));
      
      if (dependentTasks.length === 0) {
        // Tâche finale
        node.latestFinish = node.earliestFinish;
      } else {
        const minDependentStart = Math.min(
          ...dependentTasks.map(depTask => {
            const depNode = nodes.get(depTask.id)!;
            if (depNode.latestStart === Infinity) {
              calculateLatestTimes(depTask.id, visited);
            }
            return depNode.latestStart;
          })
        );
        node.latestFinish = minDependentStart;
      }
      
      const duration = Math.ceil(task.estimated_hours / 8);
      node.latestStart = node.latestFinish - duration;
      
      // Calculer le slack
      node.slack = node.latestStart - node.earliestStart;
      node.isCritical = node.slack === 0;
    };
    
    // Calculer les temps au plus tard pour toutes les tâches
    project.tasks.forEach(task => calculateLatestTimes(task.id));
    
    // Identifier le chemin critique
    const criticalPath: string[] = [];
    const findCriticalPath = (taskId: string) => {
      const node = nodes.get(taskId);
      if (!node || !node.isCritical) return;
      
      criticalPath.push(taskId);
      
      // Trouver la prochaine tâche critique
      const nextCriticalTask = project.tasks.find(t => 
        t.dependencies.includes(taskId) && 
        nodes.get(t.id)?.isCritical
      );
      
      if (nextCriticalTask) {
        findCriticalPath(nextCriticalTask.id);
      }
    };
    
    // Commencer par les tâches critiques sans dépendances
    const startingCriticalTasks = project.tasks.filter(t => 
      t.dependencies.length === 0 && 
      nodes.get(t.id)?.isCritical
    );
    
    startingCriticalTasks.forEach(task => findCriticalPath(task.id));
    
    return {
      nodes: Array.from(nodes.values()),
      projectDuration,
      criticalPath,
      criticalTasksCount: Array.from(nodes.values()).filter(n => n.isCritical).length,
      totalSlack: Array.from(nodes.values()).reduce((sum, n) => sum + n.slack, 0)
    };
  }, [project.tasks]);

  // Calculer les métriques de risque
  const riskMetrics = useMemo(() => {
    const criticalTasks = cpmAnalysis.nodes.filter(n => n.isCritical);
    const completedCriticalTasks = criticalTasks.filter(n => n.task.status === 'done').length;
    const delayedTasks = cpmAnalysis.nodes.filter(n => {
      if (!n.task.actual_hours) return false;
      const estimatedDays = n.task.estimated_hours / 8;
      const actualDays = n.task.actual_hours / 8;
      return actualDays > estimatedDays * 1.1; // 10% de dépassement
    });
    
    const riskLevel = 
      delayedTasks.length > 5 || (criticalTasks.length > 0 && completedCriticalTasks / criticalTasks.length < 0.3)
        ? 'high'
        : delayedTasks.length > 2
        ? 'medium'
        : 'low';
    
    return {
      riskLevel,
      delayedTasksCount: delayedTasks.length,
      criticalCompletion: criticalTasks.length > 0 
        ? (completedCriticalTasks / criticalTasks.length) * 100 
        : 100
    };
  }, [cpmAnalysis]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const filteredNodes = showOnlyCritical 
    ? cpmAnalysis.nodes.filter(n => n.isCritical)
    : cpmAnalysis.nodes;

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Durée Totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cpmAnalysis.projectDuration} jours</div>
            <p className="text-xs text-muted-foreground">
              Fin prévue: {format(addDays(new Date(project.start_date), cpmAnalysis.projectDuration), 'dd MMM yyyy', { locale: fr })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Route className="h-4 w-4" />
              Tâches Critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cpmAnalysis.criticalTasksCount}
            </div>
            <p className="text-xs text-muted-foreground">
              sur {project.tasks.length} tâches totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progression Critique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(riskMetrics.criticalCompletion)}%</div>
            <Progress value={riskMetrics.criticalCompletion} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Niveau de Risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={cn("text-sm", getRiskColor(riskMetrics.riskLevel))}>
              {riskMetrics.riskLevel === 'high' ? 'Élevé' :
               riskMetrics.riskLevel === 'medium' ? 'Moyen' : 'Faible'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {riskMetrics.delayedTasksCount} tâche(s) en retard
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et recommandations */}
      {riskMetrics.riskLevel !== 'low' && (
        <Alert variant={riskMetrics.riskLevel === 'high' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention au planning</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              {riskMetrics.delayedTasksCount > 0 && (
                <p>• {riskMetrics.delayedTasksCount} tâches accusent un retard significatif</p>
              )}
              {riskMetrics.criticalCompletion < 50 && (
                <p>• Moins de 50% des tâches critiques sont terminées</p>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Optimiser le planning
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Réaffecter les ressources
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Chemin critique visuel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analyse du Chemin Critique</CardTitle>
              <CardDescription>
                Méthode CPM (Critical Path Method) pour identifier les tâches sans marge
              </CardDescription>
            </div>
            <Button
              variant={showOnlyCritical ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyCritical(!showOnlyCritical)}
            >
              <Route className="h-4 w-4 mr-2" />
              {showOnlyCritical ? 'Toutes les tâches' : 'Chemin critique'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredNodes
              .sort((a, b) => a.earliestStart - b.earliestStart)
              .map((node) => (
                <div
                  key={node.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    node.isCritical 
                      ? "border-red-200 bg-red-50 hover:bg-red-100" 
                      : "border-gray-200 hover:bg-gray-50",
                    selectedTask === node.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedTask(node.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(node.task.status)}
                        <h4 className="font-medium">{node.task.title}</h4>
                        {node.isCritical && (
                          <Badge variant="destructive" className="text-xs">
                            Critique
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Début au plus tôt</p>
                          <p className="font-medium">Jour {node.earliestStart}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fin au plus tôt</p>
                          <p className="font-medium">Jour {node.earliestFinish}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Marge totale</p>
                          <p className={cn(
                            "font-medium",
                            node.slack === 0 && "text-red-600"
                          )}>
                            {node.slack} jour(s)
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Durée</p>
                          <p className="font-medium">{Math.ceil(node.task.estimated_hours / 8)} jour(s)</p>
                        </div>
                      </div>
                      
                      {node.task.assignee && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Assigné à: {node.task.assignee.full_name}
                        </p>
                      )}
                    </div>
                    
                    <div className="ml-4 text-right">
                      <Progress 
                        value={node.task.progress} 
                        className={cn(
                          "w-24 h-2",
                          node.isCritical && "[&>div]:bg-red-500"
                        )}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {node.task.progress}% complété
                      </p>
                    </div>
                  </div>
                  
                  {selectedTask === node.id && (
                    <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Début au plus tard</p>
                          <p className="font-medium">Jour {node.latestStart}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fin au plus tard</p>
                          <p className="font-medium">Jour {node.latestFinish}</p>
                        </div>
                      </div>
                      
                      {node.task.dependencies.length > 0 && (
                        <div>
                          <p className="text-muted-foreground mb-1">Dépend de:</p>
                          <div className="flex flex-wrap gap-1">
                            {node.task.dependencies.map(depId => {
                              const depTask = project.tasks.find(t => t.id === depId);
                              const depNode = cpmAnalysis.nodes.find(n => n.id === depId);
                              return depTask ? (
                                <Badge 
                                  key={depId} 
                                  variant={depNode?.isCritical ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {depTask.title}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
          
          {filteredNodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune tâche {showOnlyCritical ? 'critique' : ''} trouvée
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualisation timeline du chemin critique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline du Chemin Critique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Ligne de temps */}
            <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 -translate-y-1/2" />
            
            {/* Jalons */}
            <div className="relative flex justify-between items-center py-8">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2" />
                <p className="text-xs font-medium">Début</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(project.start_date), 'dd/MM', { locale: fr })}
                </p>
              </div>
              
              {cpmAnalysis.criticalPath.slice(0, 3).map((taskId, index) => {
                const task = project.tasks.find(t => t.id === taskId);
                const node = cpmAnalysis.nodes.find(n => n.id === taskId);
                if (!task || !node) return null;
                
                return (
                  <div key={taskId} className="text-center">
                    <div className={cn(
                      "w-4 h-4 rounded-full mx-auto mb-2",
                      task.status === 'done' ? "bg-green-500" :
                      task.status === 'in_progress' ? "bg-blue-500" : "bg-gray-300"
                    )} />
                    <p className="text-xs font-medium line-clamp-1 max-w-[100px]">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      J{node.earliestStart}-J{node.earliestFinish}
                    </p>
                  </div>
                );
              })}
              
              {cpmAnalysis.criticalPath.length > 3 && (
                <div className="text-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    +{cpmAnalysis.criticalPath.length - 3} autres
                  </p>
                </div>
              )}
              
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2" />
                <p className="text-xs font-medium">Fin prévue</p>
                <p className="text-xs text-muted-foreground">
                  {format(
                    addDays(new Date(project.start_date), cpmAnalysis.projectDuration), 
                    'dd/MM', 
                    { locale: fr }
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}