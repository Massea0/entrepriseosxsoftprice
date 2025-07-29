import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignedTo?: string;
  assignedToName?: string;
  projectId: string;
  projectName: string;
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  currentWorkload: number; // en heures
  maxCapacity: number; // heures par semaine
  skills: string[];
  availability: 'available' | 'busy' | 'overloaded';
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on_hold';
  deadline: string;
  progress: number;
}

const ProjectAssignments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedMember, setSelectedMember] = useState('all');

  const { data: tasks = [] } = useQuery({
    queryKey: ['/api/manager/assignments/tasks'],
    initialData: [
      {
        id: '1',
        title: 'Refonte interface utilisateur',
        description: 'Moderniser l\'interface avec le nouveau design system',
        priority: 'high' as const,
        status: 'todo' as const,
        projectId: 'proj1',
        projectName: 'Site Web Arcadis',
        dueDate: '2025-01-30',
        estimatedHours: 24,
        tags: ['Frontend', 'Design']
      },
      {
        id: '2',
        title: 'API authentification',
        description: 'Implémenter l\'authentification JWT',
        priority: 'medium' as const,
        status: 'in_progress' as const,
        assignedTo: '1',
        assignedToName: 'Aminata Diallo',
        projectId: 'proj2',
        projectName: 'App Mobile Client',
        dueDate: '2025-01-25',
        estimatedHours: 16,
        actualHours: 8,
        tags: ['Backend', 'Security']
      },
      {
        id: '3',
        title: 'Tests unitaires',
        description: 'Écrire les tests pour les nouveaux composants',
        priority: 'low' as const,
        status: 'review' as const,
        assignedTo: '2',
        assignedToName: 'Omar Ndiaye',
        projectId: 'proj1',
        projectName: 'Site Web Arcadis',
        dueDate: '2025-02-05',
        estimatedHours: 12,
        actualHours: 10,
        tags: ['Testing', 'QA']
      }
    ] as Task[]
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['/api/manager/team'],
    initialData: [
      {
        id: '1',
        name: 'Aminata Diallo',
        role: 'Développeuse Frontend',
        currentWorkload: 32,
        maxCapacity: 40,
        skills: ['React', 'TypeScript', 'CSS'],
        availability: 'available' as const
      },
      {
        id: '2',
        name: 'Omar Ndiaye',
        role: 'Designer UX/UI',
        currentWorkload: 38,
        maxCapacity: 40,
        skills: ['Figma', 'Design System', 'UX Research'],
        availability: 'busy' as const
      },
      {
        id: '3',
        name: 'Fatou Sow',
        role: 'Chef de Projet',
        currentWorkload: 45,
        maxCapacity: 40,
        skills: ['Management', 'Agile', 'Planning'],
        availability: 'overloaded' as const
      },
      {
        id: '4',
        name: 'Moussa Kane',
        role: 'Développeur Backend',
        currentWorkload: 25,
        maxCapacity: 40,
        skills: ['Node.js', 'PostgreSQL', 'API'],
        availability: 'available' as const
      }
    ] as TeamMember[]
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/manager/projects'],
    initialData: [
      {
        id: 'proj1',
        name: 'Site Web Arcadis',
        client: 'Arcadis Technologies',
        status: 'active' as const,
        deadline: '2025-02-15',
        progress: 65
      },
      {
        id: 'proj2',
        name: 'App Mobile Client',
        client: 'Client XYZ',
        status: 'active' as const,
        deadline: '2025-03-01',
        progress: 30
      }
    ] as Project[]
  });

  // Mutation pour assigner une tâche
  const assignMutation = useMutation({
    mutationFn: async ({ taskId, memberId }: { taskId: string; memberId: string }) => {
      const response = await fetch('/api/manager/assign-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, memberId })
      });
      if (!response.ok) throw new Error('Failed to assign task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/manager/assignments/tasks'] });
      toast({
        title: 'Tâche assignée',
        description: 'La tâche a été assignée avec succès.',
      });
    }
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Si on déplace vers une colonne membre
      if (destination.droppableId.startsWith('member-')) {
        const memberId = destination.droppableId.replace('member-', '');
        assignMutation.mutate({ taskId: draggableId, memberId });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'overloaded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unassignedTasks = tasks.filter(task => !task.assignedTo);
  const assignedTasks = tasks.filter(task => task.assignedTo);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assignations Projets</h1>
          <p className="text-muted-foreground">Gérez les tâches et assignations de votre équipe</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Tâche
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous les projets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les projets</SelectItem>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous les membres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les membres</SelectItem>
            {teamMembers.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Workload Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Charge de Travail Équipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge className={getAvailabilityColor(member.availability)} variant="secondary">
                    {member.availability === 'available' && 'Disponible'}
                    {member.availability === 'busy' && 'Occupé'}
                    {member.availability === 'overloaded' && 'Surchargé'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Charge: {member.currentWorkload}h/{member.maxCapacity}h</span>
                    <span>{Math.round((member.currentWorkload / member.maxCapacity) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(member.currentWorkload / member.maxCapacity) * 100} 
                    className="h-2" 
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drag & Drop Assignment Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Unassigned Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Tâches Non Assignées ({unassignedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="unassigned">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3 min-h-[400px]"
                    >
                      {unassignedTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 border rounded-lg bg-white space-y-2 cursor-move ${
                                snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                <Badge className={getPriorityColor(task.priority)} variant="outline">
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{task.description}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{task.projectName}</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.estimatedHours}h</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>

          {/* Team Members Columns */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member) => {
                const memberTasks = assignedTasks.filter(task => task.assignedTo === member.id);
                return (
                  <Card key={member.id}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-sm">{member.name}</CardTitle>
                            <CardDescription className="text-xs">{member.role}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getAvailabilityColor(member.availability)} variant="secondary">
                          {Math.round((member.currentWorkload / member.maxCapacity) * 100)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={`member-${member.id}`}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-2 min-h-[300px] p-2 rounded border-2 border-dashed ${
                              snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            {memberTasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-2 border rounded bg-white space-y-2 cursor-move ${
                                      snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-medium text-xs">{task.title}</h5>
                                      <Badge className={getStatusColor(task.status)} variant="outline">
                                        {task.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <span>{task.projectName}</span>
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{task.actualHours || 0}/{task.estimatedHours}h</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {memberTasks.length === 0 && (
                              <div className="text-center text-muted-foreground text-sm py-8">
                                Glissez une tâche ici pour l'assigner
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectAssignments;