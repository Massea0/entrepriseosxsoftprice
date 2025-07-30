import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Zap, Users, Brain, UserCheck, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Recommendation {
  employeeId: string;
  employeeName: string;
  score: number;
  reasons: string[];
  workloadAfter: number;
}

interface EmployeeCapacity {
  id: string;
  full_name: string;
  skills: string[];
  currentWorkload: number;
  availability: number;
  successRate: number;
}

export default function AIAutoAssign() {
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    }
  });

  // Fetch employee capacity
  const { data: employeeCapacity } = useQuery({
    queryKey: ['employee-capacity'],
    queryFn: async () => {
      const response = await fetch('/api/ai/auto-assign/employee-capacity');
      if (!response.ok) throw new Error('Failed to fetch employee capacity');
      const data = await response.json();
      return data.employees;
    }
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ['assignment-recommendations', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return null;
      const response = await fetch(`/api/ai/auto-assign/recommendations/${selectedProject}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      return data.recommendations;
    },
    enabled: !!selectedProject
  });

  // Auto-assign mutation
  const autoAssignMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/ai/auto-assign/assign/${projectId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to auto-assign');
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setSelectedProject('');
    },
    onError: () => {
      toast.error('Erreur lors de l\'assignation automatique');
    }
  });

  const unassignedProjects = projects.filter((p: any) => !p.assigned_to && p.status !== 'completed');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assignation Automatique IA</h1>
        <p className="text-muted-foreground">
          L'IA analyse les compétences et la charge de travail pour optimiser les assignations
        </p>
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Sélectionner un projet à assigner
          </CardTitle>
          <CardDescription>
            {unassignedProjects.length} projets non assignés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un projet..." />
            </SelectTrigger>
            <SelectContent>
              {unassignedProjects.map((project: any) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{project.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {project.priority}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedProject && (
            <Button
              className="mt-4"
              onClick={() => autoAssignMutation.mutate(selectedProject)}
              disabled={autoAssignMutation.isPending}
            >
              {autoAssignMutation.isPending ? (
                <>
                  <div className=" h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Assignation en cours...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Assigner automatiquement
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {selectedProject && recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recommandations IA
            </CardTitle>
            <CardDescription>
              Analyse basée sur les compétences et la disponibilité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec: Recommendation, index: number) => (
                <div
                  key={rec.employeeId}
                  className={`p-4 rounded-lg border ${
                    index === 0 ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {rec.employeeName}
                        {index === 0 && (
                          <Badge variant="default">Meilleur choix</Badge>
                        )}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Score: {rec.score}/100</span>
                        <span>Charge après: {Math.round(rec.workloadAfter)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{rec.score}%</div>
                      <div className="text-xs text-muted-foreground">Compatibilité</div>
                    </div>
                  </div>
                  
                  <Progress value={rec.score} className="h-2 mb-3" />
                  
                  <div className="space-y-1">
                    {rec.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        {reason.includes('⚠️') ? (
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        )}
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Capacité de l'équipe
          </CardTitle>
          <CardDescription>
            Vue en temps réel de la charge de travail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employeeCapacity?.map((employee: EmployeeCapacity) => (
              <div key={employee.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{employee.full_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(employee.availability)}% disponible
                    </span>
                  </div>
                  <Progress 
                    value={employee.currentWorkload} 
                    className={`h-2 ${
                      employee.currentWorkload > 80 ? 'bg-red-100' :
                      employee.currentWorkload > 60 ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}
                  />
                  <div className="flex gap-2 mt-1">
                    {employee.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {employee.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{employee.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {Math.round(employee.successRate)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Taux réussite</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}