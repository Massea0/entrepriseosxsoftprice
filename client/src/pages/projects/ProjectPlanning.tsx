import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Users, 
  Clock, 
  AlertCircle, 
  Brain, 
  Zap,
  BarChart3,
  GitBranch,
  Target,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

// Composants pour les différentes vues
import { GanttChart } from '@/components/projects/GanttChart';
import { ResourceAllocation } from '@/components/projects/ResourceAllocation';
import { DependencyGraph } from '@/components/projects/DependencyGraph';
import { CriticalPath } from '@/components/projects/CriticalPath';

interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  tasks: Task[];
  team_members: TeamMember[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  assigned_to?: string;
  dependencies: string[];
  estimated_hours: number;
  actual_hours: number;
  progress: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: number;
  skills: string[];
  current_workload: number;
}

interface AIRecommendation {
  type: 'warning' | 'suggestion' | 'optimization';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  action?: () => void;
}

export default function ProjectPlanning() {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<'gantt' | 'resources' | 'dependencies' | 'critical'>('gantt');

  // Fetch project data
  const { data: project, isLoading } = useQuery({
    queryKey: ['project-planning', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/planning`);
      if (!response.ok) throw new Error('Failed to fetch project planning');
      return response.json();
    }
  });

  // AI recommendations
  const { data: aiRecommendations } = useQuery({
    queryKey: ['project-ai-recommendations', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/ai/project-planning/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch AI recommendations');
      return response.json();
    }
  });

  // Generate AI planning
  const generatePlanningMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai/generate-project-plan/${projectId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to generate AI planning');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-planning', projectId] });
      toast.success('Planning généré avec succès par l\'IA');
    },
    onError: () => {
      toast.error('Erreur lors de la génération du planning');
    }
  });

  // Optimize resources
  const optimizeResourcesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai/optimize-resources/${projectId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to optimize resources');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-planning', projectId] });
      toast.success('Ressources optimisées avec succès');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className=" rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Projet introuvable
        </AlertDescription>
      </Alert>
    );
  }

  const projectProgress = project.tasks.reduce((acc: number, task: Task) => acc + task.progress, 0) / project.tasks.length;
  const daysRemaining = differenceInDays(new Date(project.end_date), new Date());
  const budgetUsed = (project.tasks.reduce((acc: number, task: Task) => acc + (task.actual_hours * 50000), 0) / project.budget) * 100;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => generatePlanningMutation.mutate()}
            disabled={generatePlanningMutation.isPending}
          >
            <Brain className="h-4 w-4 mr-2" />
            Générer Planning IA
          </Button>
          <Button
            onClick={() => optimizeResourcesMutation.mutate()}
            disabled={optimizeResourcesMutation.isPending}
          >
            <Zap className="h-4 w-4 mr-2" />
            Optimiser
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(projectProgress)}%</div>
            <Progress value={projectProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Temps Restant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysRemaining} jours</div>
            <p className="text-xs text-muted-foreground">
              Fin prévue: {format(new Date(project.end_date), 'dd MMM yyyy', { locale: fr })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.team_members.length}</div>
            <p className="text-xs text-muted-foreground">
              Charge moyenne: {Math.round(project.team_members.reduce((acc: number, m: TeamMember) => acc + m.current_workload, 0) / project.team_members.length)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(budgetUsed)}%</div>
            <Progress value={budgetUsed} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations && aiRecommendations.length > 0 && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Recommandations IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiRecommendations.map((rec: AIRecommendation, index: number) => (
                <Alert key={index} className={
                  rec.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  rec.type === 'optimization' ? 'border-green-200 bg-green-50' :
                  'border-blue-200 bg-blue-50'
                }>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{rec.title}</p>
                        <p className="text-sm mt-1">{rec.description}</p>
                      </div>
                      <Badge variant={
                        rec.impact === 'high' ? 'destructive' :
                        rec.impact === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {rec.impact}
                      </Badge>
                    </div>
                    {rec.action && (
                      <Button size="sm" variant="outline" className="mt-2" onClick={rec.action}>
                        Appliquer
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planning Views */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Planification du Projet</CardTitle>
            <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)}>
              <TabsList>
                <TabsTrigger value="gantt" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Gantt
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Ressources
                </TabsTrigger>
                <TabsTrigger value="dependencies" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Dépendances
                </TabsTrigger>
                <TabsTrigger value="critical" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Chemin Critique
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {activeView === 'gantt' && (
            <GanttChart project={project} />
          )}
          {activeView === 'resources' && (
            <ResourceAllocation project={project} />
          )}
          {activeView === 'dependencies' && (
            <DependencyGraph project={project} />
          )}
          {activeView === 'critical' && (
            <CriticalPath project={project} />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Optimisations suggérées par l'IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Réduire le chemin critique
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Équilibrer la charge de travail
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertCircle className="h-4 w-4 mr-2" />
              Résoudre les conflits de ressources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}