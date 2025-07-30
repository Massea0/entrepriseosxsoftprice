import { useMemo } from 'react';
import { format, eachDayOfInterval, isWithinInterval, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Task {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  assigned_to?: string;
  assignee?: {
    full_name: string;
    avatar_url?: string;
  };
  progress: number;
  dependencies: string[];
}

interface GanttChartProps {
  project: {
    start_date: string;
    end_date: string;
    tasks: Task[];
  };
}

export function GanttChart({ project }: GanttChartProps) {
  // Calculer la période du projet
  const projectDates = useMemo(() => {
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    return eachDayOfInterval({ start, end });
  }, [project.start_date, project.end_date]);

  // Grouper les jours par semaine
  const weeks = useMemo(() => {
    const grouped: Date[][] = [];
    let currentWeek: Date[] = [];
    
    projectDates.forEach((date, index) => {
      currentWeek.push(date);
      if (date.getDay() === 0 || index === projectDates.length - 1) {
        grouped.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return grouped;
  }, [projectDates]);

  // Calculer la position et la largeur d'une tâche
  const getTaskPosition = (task: Task) => {
    const projectStart = new Date(project.start_date);
    const taskStart = new Date(task.start_date);
    const taskEnd = new Date(task.end_date);
    
    const startOffset = differenceInDays(taskStart, projectStart);
    const duration = differenceInDays(taskEnd, taskStart) + 1;
    
    const leftPercentage = (startOffset / projectDates.length) * 100;
    const widthPercentage = (duration / projectDates.length) * 100;
    
    return { left: `${leftPercentage}%`, width: `${widthPercentage}%` };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-200';
      case 'in_progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Header avec les dates */}
          <div className="border-b">
            <div className="grid grid-cols-[300px_1fr] gap-4">
              <div className="p-4 font-semibold">Tâches</div>
              <div className="relative">
                {/* Mois */}
                <div className="flex border-b">
                  {weeks.map((week, weekIndex) => {
                    const firstDay = week[0];
                    const monthName = format(firstDay, 'MMMM yyyy', { locale: fr });
                    return (
                      <div
                        key={weekIndex}
                        className="flex-1 text-center py-2 text-sm font-medium border-r"
                        style={{ minWidth: `${(week.length / projectDates.length) * 100}%` }}
                      >
                        {weekIndex === 0 || firstDay.getDate() <= 7 ? monthName : ''}
                      </div>
                    );
                  })}
                </div>
                
                {/* Jours */}
                <div className="flex">
                  {projectDates.map((date, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 text-center py-1 text-xs border-r",
                        date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-50" : ""
                      )}
                      style={{ minWidth: `${100 / projectDates.length}%` }}
                    >
                      {format(date, 'd')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tâches */}
          <div className="divide-y">
            {project.tasks.map((task, taskIndex) => {
              const position = getTaskPosition(task);
              
              return (
                <div key={task.id} className="grid grid-cols-[300px_1fr] gap-4 h-16">
                  {/* Nom de la tâche */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className={cn("text-sm font-medium truncate", getPriorityColor(task.priority))}>
                        {task.title}
                      </span>
                    </div>
                    {task.assignee && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* Barre de Gantt */}
                  <div className="relative p-2">
                    {/* Grille de fond */}
                    <div className="absolute inset-0 flex">
                      {projectDates.map((date, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex-1 border-r border-gray-100",
                            date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-50" : ""
                          )}
                          style={{ minWidth: `${100 / projectDates.length}%` }}
                        />
                      ))}
                    </div>

                    {/* Barre de tâche */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute top-3 h-8 rounded cursor-pointer transition-all hover:shadow-md"
                          style={{
                            ...position,
                            backgroundColor: task.progress === 100 ? '#10b981' : '#3b82f6',
                            opacity: task.status === 'done' ? 0.8 : 1
                          }}
                        >
                          {/* Barre de progression */}
                          <div
                            className="h-full bg-black/20 rounded transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                          
                          {/* Texte sur la barre */}
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs text-white font-medium truncate">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm">
                            {format(new Date(task.start_date), 'dd MMM', { locale: fr })} - 
                            {format(new Date(task.end_date), 'dd MMM', { locale: fr })}
                          </p>
                          <p className="text-sm">Progression: {task.progress}%</p>
                          {task.assignee && (
                            <p className="text-sm">Assigné à: {task.assignee.full_name}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Lignes de dépendance */}
                    {task.dependencies.map((depId) => {
                      const depIndex = project.tasks.findIndex(t => t.id === depId);
                      if (depIndex === -1 || depIndex >= taskIndex) return null;
                      
                      return (
                        <svg
                          key={depId}
                          className="absolute pointer-events-none"
                          style={{
                            top: `-${(taskIndex - depIndex) * 64 - 20}px`,
                            left: position.left,
                            height: `${(taskIndex - depIndex) * 64}px`,
                            width: '20px'
                          }}
                        >
                          <path
                            d={`M 10 0 L 10 ${(taskIndex - depIndex) * 64 - 20} L 20 ${(taskIndex - depIndex) * 64 - 20}`}
                            stroke="#94a3b8"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                          />
                          <defs>
                            <marker
                              id="arrowhead"
                              markerWidth="10"
                              markerHeight="7"
                              refX="9"
                              refY="3.5"
                              orient="auto"
                            >
                              <polygon
                                points="0 0, 10 3.5, 0 7"
                                fill="#94a3b8"
                              />
                            </marker>
                          </defs>
                        </svg>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>En cours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Terminé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <span>À faire</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="40" height="20">
                  <path d="M 0 10 L 30 10" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>
                <span>Dépendance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}