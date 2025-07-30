import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GitBranch, 
  AlertCircle, 
  Layers, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Info,
  Workflow,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dependencies: string[];
  progress: number;
  assignee?: {
    full_name: string;
  };
  estimated_hours: number;
}

interface DependencyGraphProps {
  project: {
    tasks: Task[];
  };
}

interface Node {
  id: string;
  x: number;
  y: number;
  task: Task;
  level: number;
  column: number;
}

interface Edge {
  from: string;
  to: string;
  type: 'normal' | 'critical';
}

export function DependencyGraph({ project }: DependencyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Analyser les dépendances et créer le graphe
  useEffect(() => {
    const taskMap = new Map(project.tasks.map(t => [t.id, t]));
    const levels = new Map<string, number>();
    const visited = new Set<string>();
    
    // Calculer les niveaux de chaque tâche (distance depuis les tâches sans dépendances)
    const calculateLevel = (taskId: string): number => {
      if (levels.has(taskId)) return levels.get(taskId)!;
      if (visited.has(taskId)) return 0; // Cycle détecté
      
      visited.add(taskId);
      const task = taskMap.get(taskId);
      if (!task || task.dependencies.length === 0) {
        levels.set(taskId, 0);
        return 0;
      }
      
      const maxDependencyLevel = Math.max(
        ...task.dependencies
          .filter(depId => taskMap.has(depId))
          .map(depId => calculateLevel(depId))
      );
      
      const level = maxDependencyLevel + 1;
      levels.set(taskId, level);
      return level;
    };
    
    // Calculer les niveaux pour toutes les tâches
    project.tasks.forEach(task => calculateLevel(task.id));
    
    // Grouper les tâches par niveau
    const tasksByLevel = new Map<number, Task[]>();
    project.tasks.forEach(task => {
      const level = levels.get(task.id) || 0;
      if (!tasksByLevel.has(level)) {
        tasksByLevel.set(level, []);
      }
      tasksByLevel.get(level)!.push(task);
    });
    
    // Créer les nodes avec positions
    const nodeWidth = 200;
    const nodeHeight = 80;
    const horizontalSpacing = 250;
    const verticalSpacing = 120;
    const newNodes: Node[] = [];
    
    tasksByLevel.forEach((tasks, level) => {
      tasks.forEach((task, index) => {
        newNodes.push({
          id: task.id,
          x: level * horizontalSpacing + 50,
          y: index * verticalSpacing + 50,
          task,
          level,
          column: index
        });
      });
    });
    
    // Créer les edges
    const newEdges: Edge[] = [];
    project.tasks.forEach(task => {
      task.dependencies.forEach(depId => {
        if (taskMap.has(depId)) {
          newEdges.push({
            from: depId,
            to: task.id,
            type: 'normal' // TODO: détecter le chemin critique
          });
        }
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [project.tasks]);

  // Dessiner le graphe
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    // Ajuster la taille du canvas
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Appliquer le zoom et le décalage
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x, offset.y);
    
    // Dessiner les edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;
      
      const startX = fromNode.x + 180;
      const startY = fromNode.y + 40;
      const endX = toNode.x + 20;
      const endY = toNode.y + 40;
      
      // Dessiner la ligne
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Courbe de Bézier pour une meilleure apparence
      const controlX = (startX + endX) / 2;
      ctx.bezierCurveTo(
        controlX, startY,
        controlX, endY,
        endX, endY
      );
      
      ctx.strokeStyle = edge.type === 'critical' ? '#ef4444' : '#94a3b8';
      ctx.lineWidth = edge.type === 'critical' ? 3 : 2;
      ctx.stroke();
      
      // Dessiner la flèche
      const angle = Math.atan2(endY - startY, endX - startX);
      const arrowLength = 10;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - Math.PI / 6),
        endY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + Math.PI / 6),
        endY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    });
    
    ctx.restore();
  }, [nodes, edges, zoom, offset]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 border-green-300 text-green-900';
      case 'in_progress': return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'todo': return 'bg-gray-100 border-gray-300 text-gray-900';
      default: return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  // Gestion du zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Gestion du drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Analyse des dépendances
  const analysis = {
    totalTasks: project.tasks.length,
    tasksWithDependencies: project.tasks.filter(t => t.dependencies.length > 0).length,
    orphanTasks: project.tasks.filter(t => 
      t.dependencies.length === 0 && 
      !project.tasks.some(other => other.dependencies.includes(t.id))
    ).length,
    maxDepth: Math.max(...nodes.map(n => n.level)) + 1,
    criticalTasks: nodes.filter(n => n.task.priority === 'high').length
  };

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avec Dépendances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.tasksWithDependencies}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tâches Isolées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.orphanTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profondeur Max</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.maxDepth}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tâches Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analysis.criticalTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes */}
      {analysis.orphanTasks > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {analysis.orphanTasks} tâche(s) isolée(s) détectée(s). 
            Ces tâches n'ont pas de dépendances et ne sont requises par aucune autre tâche.
          </AlertDescription>
        </Alert>
      )}

      {/* Graphe principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Graphe des Dépendances</CardTitle>
              <CardDescription>
                Visualisation des relations entre les tâches du projet
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleZoomReset}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef}
            className="relative h-[600px] border rounded-lg bg-gray-50 overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
            
            {/* Nodes */}
            <div 
              className="absolute inset-0"
              style={{
                transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                transformOrigin: 'top left'
              }}
            >
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={cn(
                    "absolute w-[180px] p-3 rounded-lg border-2 shadow-sm transition-all",
                    getStatusColor(node.task.status),
                    selectedNode === node.id && "ring-2 ring-primary shadow-lg"
                  )}
                  style={{
                    left: node.x,
                    top: node.y,
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node.id);
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm line-clamp-2">{node.task.title}</p>
                      {node.task.progress === 100 && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={getPriorityBadgeVariant(node.task.priority)} 
                        className="text-xs"
                      >
                        {node.task.priority}
                      </Badge>
                      <span className="text-xs opacity-75">
                        {node.task.progress}%
                      </span>
                    </div>
                    
                    {node.task.assignee && (
                      <p className="text-xs opacity-75 truncate">
                        {node.task.assignee.full_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Légende */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Légende
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded" />
                <span>À faire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded" />
                <span>En cours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded" />
                <span>Terminé</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="40" height="20">
                  <line x1="0" y1="10" x2="30" y2="10" stroke="#94a3b8" strokeWidth="2" />
                  <polygon points="30,10 25,7 25,13" fill="#94a3b8" />
                </svg>
                <span>Dépendance</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails de la tâche sélectionnée */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Détails de la Tâche
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              const dependsOn = node.task.dependencies
                .map(depId => nodes.find(n => n.id === depId))
                .filter(Boolean) as Node[];
                
              const dependentTasks = nodes.filter(n => 
                n.task.dependencies.includes(selectedNode)
              );
              
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">{node.task.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Niveau: {node.level + 1}</span>
                      <span>Progrès: {node.task.progress}%</span>
                      <span>Durée estimée: {node.task.estimated_hours}h</span>
                    </div>
                  </div>
                  
                  {dependsOn.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Dépend de:</p>
                      <div className="space-y-1">
                        {dependsOn.map(dep => (
                          <div 
                            key={dep.id}
                            className="text-sm p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedNode(dep.id)}
                          >
                            {dep.task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dependentTasks.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Bloque:</p>
                      <div className="space-y-1">
                        {dependentTasks.map(dep => (
                          <div 
                            key={dep.id}
                            className="text-sm p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedNode(dep.id)}
                          >
                            {dep.task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}