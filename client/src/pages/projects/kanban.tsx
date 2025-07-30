import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, FolderKanban, Clock, Users, AlertCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  assigned_to?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  project?: {
    name: string;
    company?: {
      name: string;
    };
  };
  assignee?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KANBAN_COLUMNS = [
  { id: 'planning', title: 'Planification' },
  { id: 'todo', title: 'À faire' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'review', title: 'Revue' },
  { id: 'completed', title: 'Terminé' }
];

export default function ProjectsKanban() {
  const queryClient = useQueryClient();
  const [columns, setColumns] = useState<Column[]>([]);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    }
  });

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tâche mise à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    }
  });

  // Organize tasks into columns
  useEffect(() => {
    const organizedColumns = KANBAN_COLUMNS.map(col => ({
      id: col.id,
      title: col.title,
      tasks: tasks.filter((task: Task) => task.status === col.id)
    }));
    setColumns(organizedColumns);
  }, [tasks]);

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Find the task being moved
    const taskId = draggableId;
    const newStatus = destination.droppableId;

    // Update local state immediately for smooth UX
    const newColumns = [...columns];
    const sourceColumn = newColumns.find(col => col.id === source.droppableId);
    const destColumn = newColumns.find(col => col.id === destination.droppableId);
    
    if (sourceColumn && destColumn) {
      const taskToMove = sourceColumn.tasks.find(task => task.id === taskId);
      if (taskToMove) {
        sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== taskId);
        destColumn.tasks.splice(destination.index, 0, { ...taskToMove, status: newStatus });
        setColumns(newColumns);
      }
    }

    // Update in backend
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'Critique';
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Non définie';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className=" rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vue Kanban</h1>
          <p className="text-muted-foreground">
            Glissez-déposez les tâches pour changer leur statut
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Tâche
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary">{column.tasks.length}</Badge>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <ScrollArea
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`h-[600px] pr-2 ${
                      snapshot.isDraggingOver ? 'bg-primary/5 rounded' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-grab ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                              }`}
                            >
                              <CardHeader className="p-4">
                                <CardTitle className="text-sm font-medium leading-tight">
                                  {task.title}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">
                                  {task.project?.name} • {task.project?.company?.name}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 space-y-3">
                                {task.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                    {getPriorityLabel(task.priority)}
                                  </Badge>
                                  
                                  {task.assignee && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={task.assignee.avatar_url} />
                                      <AvatarFallback className="text-xs">
                                        {task.assignee.full_name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                                
                                {task.due_date && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(task.due_date)}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {tasks.length === 0 && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Aucune tâche à afficher</p>
            <p className="text-sm text-muted-foreground mb-4">
              Créez des tâches pour commencer à utiliser le Kanban
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer une tâche
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}