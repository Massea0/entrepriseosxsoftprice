import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
// import { supabase } // Migrated from Supabase to Express API
import { useToast } from '@/hooks/use-toast';
import AssigneeSelector from '@/components/tasks/AssigneeSelector';
import { 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  TrendingUp,
  Calendar,
  Flag,
  Zap,
  Target,
  Timer
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  project_id: string;
  assignee_id?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  position?: number;
  labels?: string[];
  complexity_score?: number;
  custom_fields?: unknown;
  assignee?: {
    first_name: string;
    last_name: string;
  };
  comments_count?: number;
  attachments_count?: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  icon: unknown;
  limit?: number;
}

interface EnhancedKanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskCreate: () => void;
  onTaskEdit: (task: Task) => void;
  projectId: string;
}

const COLUMN_CONFIG = {
  todo: {
    title: 'À faire',
    color: 'bg-slate-50 border-slate-200',
    headerColor: 'bg-slate-100 text-slate-700',
    icon: Circle,
    limit: 10
  },
  in_progress: {
    title: 'En cours',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-100 text-blue-700',
    icon: Clock,
    limit: 5
  },
  review: {
    title: 'En révision',
    color: 'bg-yellow-50 border-yellow-200',
    headerColor: 'bg-yellow-100 text-yellow-700',
    icon: AlertCircle,
    limit: 8
  },
  done: {
    title: 'Terminé',
    color: 'bg-green-50 border-green-200',
    headerColor: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
    limit: undefined
  }
};

const PRIORITY_CONFIG = {
  low: { label: 'Faible', color: 'bg-gray-100 text-gray-600', icon: '●' },
  medium: { label: 'Moyen', color: 'bg-yellow-100 text-yellow-600', icon: '●●' },
  high: { label: 'Élevé', color: 'bg-orange-100 text-orange-600', icon: '●●●' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-600', icon: '🔥' }
};

function EnhancedKanbanBoard({ 
  tasks, 
  onTaskUpdate, 
  onTaskCreate, 
  onTaskEdit, 
  projectId 
}: EnhancedKanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [commentsCount, setCommentsCount] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  useEffect(() => {
    organizeTasksIntoColumns();
    loadCommentsCount();
  }, [tasks]);

  const organizeTasksIntoColumns = () => {
    const tasksByStatus = tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    const newColumns: Column[] = Object.entries(COLUMN_CONFIG).map(([status, config]) => ({
      id: status,
      title: config.title,
      tasks: (tasksByStatus[status] || []).sort((a, b) => (a.position || 0) - (b.position || 0)),
      color: config.color,
      icon: config.icon
    }));

    setColumns(newColumns);
  };

  const loadCommentsCount = async () => {
    try {
      const { data: counts } = await supabase
        .from('task_comments')
        .select('task_id')
        .in('task_id', tasks.map(t => t.id));

      const countMap = (counts || []).reduce((acc, comment) => {
        acc[comment.task_id] = (acc[comment.task_id] || 0) + 1;
        return acc;
      }, {} as {[key: string]: number});

      setCommentsCount(countMap);
    } catch (error) {
      console.error('Error loading comments count:', error);
    }
  };

  const handleDragStart = useCallback((start: unknown) => {
    setIsDragging(true);
    setDraggedTask(start.draggableId);
  }, []);

  const getStatusLabel = (status: string) => {
    return COLUMN_CONFIG[status as keyof typeof COLUMN_CONFIG]?.title || status;
  };

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    setIsDragging(false);
    setDraggedTask(null);

    if (!destination || 
        (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Animation fluide - optimistic update immédiat
    const draggedTask = tasks.find(t => t.id === draggableId);
    if (!draggedTask) return;

    // Mise à jour immédiate de l'UI pour fluidité
    onTaskUpdate(draggableId, { 
      status: destination.droppableId,
      position: destination.index 
    });

    // Feedback visuel subtil
    setTimeout(() => {
      const taskCard = document.querySelector(`[data-rbd-draggable-id="${draggableId}"]`);
      if (taskCard) {
        taskCard.classList.add('animate-scale-in');
        setTimeout(() => taskCard.classList.remove('animate-scale-in'), 300);
      }
    }, 100);

    // Persistence en arrière-plan avec rollback si erreur
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: destination.droppableId,
          position: destination.index,
          updated_at: new Date().toISOString()
        })
        .eq('id', draggableId);

      if (error) throw error;

      toast({
        title: "✅ Tâche déplacée",
        description: `Nouveau statut: ${getStatusLabel(destination.droppableId)}`,
        duration: 2000
      });

    } catch (error) {
      console.error('Drag error:', error);
      
      // Rollback en cas d'erreur
      onTaskUpdate(draggableId, { 
        status: source.droppableId, 
        position: source.index 
      });
      
      toast({
        variant: "destructive",
        title: "❌ Erreur de synchronisation",
        description: "La tâche a été restaurée à sa position initiale",
        duration: 3000
      });
    }
  }, [tasks, onTaskUpdate, toast]);

  const getPriorityInfo = (priority: string) => 
    PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.medium;

  const getColumnConfig = (status: string) => 
    COLUMN_CONFIG[status as keyof typeof COLUMN_CONFIG] || COLUMN_CONFIG.todo;

  const renderTask = (task: Task, index: number) => {
    const priorityInfo = getPriorityInfo(task.priority);
    const isOverdue = task.due_date && new Date(task.due_date) < new Date();
    const taskCommentsCount = commentsCount[task.id] || 0;

    return (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 transform transition-all duration-200 ease-out ${
              snapshot.isDragging 
                ? 'rotate-1 scale-105 shadow-xl z-50' 
                : 'hover:scale-[1.02] hover:shadow-md'
            } ${draggedTask === task.id ? 'opacity-70' : ''}`}
            style={{
              ...provided.draggableProps.style,
              transformOrigin: 'center',
            }}
          >
            <Card 
              className={`cursor-pointer border-l-4 transition-all duration-200 group ${
                snapshot.isDragging 
                  ? 'border-l-primary bg-white shadow-xl' 
                  : 'border-l-transparent hover:border-l-primary/50 hover:bg-muted/30'
              } ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}
              onClick={() => onTaskEdit(task)}
            >
              <CardContent className="p-4">
                {/* Header avec priorité et labels */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1.5 py-0.5 ${priorityInfo.color} border-0`}
                    >
                      {priorityInfo.icon}
                    </Badge>
                    
                    {task.complexity_score && task.complexity_score > 3 && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                        <Target className="h-3 w-3 mr-1" />
                        Complexe
                      </Badge>
                    )}
                    
                    {task.labels && task.labels.map((label: string) => (
                      <Badge key={label} variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>

                {/* Titre et description */}
                <div className="mb-3">
                  <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Métadonnées */}
                <div className="space-y-2">
                  {/* Date et estimation */}
                  {(task.due_date || task.estimated_hours) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {task.due_date && (
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(task.due_date), 'dd MMM', { locale: fr })}
                          </span>
                          {isOverdue && <AlertCircle className="h-3 w-3 text-red-500" />}
                        </div>
                      )}
                      
                      {task.estimated_hours && (
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span>{task.estimated_hours}h</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer avec assignee et stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {task.assignee ? (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.assignee.first_name[0]}{task.assignee.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <Plus className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {taskCommentsCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>{taskCommentsCount}</span>
                        </div>
                      )}
                      
                      {task.custom_fields?.attachments?.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Paperclip className="h-3 w-3" />
                          <span>{task.custom_fields.attachments.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  const renderColumn = (column: Column) => {
    const config = getColumnConfig(column.id);
    const isOverLimit = config.limit && column.tasks.length > config.limit;
    const IconComponent = config.icon;

    return (
      <div key={column.id} className="flex-1 min-w-[320px]">
        <Card className={`h-full ${config.color} border-2 transition-all duration-200`}>
          <CardHeader className={`pb-3 ${config.headerColor} rounded-t-lg border-b`}>
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span>{column.title}</span>
                <Badge variant="secondary" className="h-5 px-2 text-xs font-medium">
                  {column.tasks.length}
                </Badge>
                {isOverLimit && (
                  <Badge variant="destructive" className="h-5 px-2 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Limite
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-white/50"
                onClick={onTaskCreate}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-3">
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] transition-all duration-150 rounded-lg ${
                    snapshot.isDraggingOver 
                      ? 'bg-primary/5 border-2 border-dashed border-primary/30 scale-[1.01]' 
                      : ''
                  } ${isDragging && !snapshot.isDraggingOver ? 'opacity-70' : ''}`}
                >
                  <div className="space-y-3">
                    {column.tasks.map((task, index) => renderTask(task, index))}
                  </div>
                  {provided.placeholder}
                  
                  {/* Zone de drop vide */}
                  {column.tasks.length === 0 && (
                    <div className={`h-32 flex items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 ${
                      snapshot.isDraggingOver 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                    }`}>
                      <div className="text-center text-muted-foreground">
                        <IconComponent className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">Glissez une tâche ici</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(renderColumn)}
        </div>
      </DragDropContext>
      
      {/* Overlay de drag global */}
      {isDragging && (
        <div className="fixed inset-0 bg-black/3 backdrop-blur-[0.5px] z-40 pointer-events-none transition-all duration-150" />
      )}
    </div>
  );
}

export default EnhancedKanbanBoard;