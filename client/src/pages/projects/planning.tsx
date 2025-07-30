import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Users, 
  GitBranch, 
  Route, 
  Calendar,
  BarChart3,
  Download,
  Share2,
  Settings,
  Zap
} from 'lucide-react';
import { ResourceAllocation } from '@/components/projects/ResourceAllocation';
import { DependencyGraph } from '@/components/projects/DependencyGraph';
import { CriticalPath } from '@/components/projects/CriticalPath';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProjectPlanning() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('resources');

  // Charger les données du projet avec les détails de planification
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project-planning', id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}/planning`);
      if (!response.ok) throw new Error('Failed to fetch project planning');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement de la planification du projet
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>
            Projet introuvable
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'success';
      case 'on_hold': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux projets
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {project.status === 'active' ? 'Actif' :
                 project.status === 'completed' ? 'Terminé' :
                 project.status === 'on_hold' ? 'En pause' : 'Annulé'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(project.start_date), 'dd MMM yyyy', { locale: fr })} - 
                {format(new Date(project.end_date), 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress || 0}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.tasks?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {project.tasks?.filter((t: any) => t.status === 'done').length || 0} terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.team_members?.length || 0}</div>
            <p className="text-xs text-muted-foreground">membres actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'EUR',
                maximumFractionDigits: 0
              }).format(project.budget || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {project.budget_spent ? `${Math.round((project.budget_spent / project.budget) * 100)}% utilisé` : 'Non défini'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommandation IA */}
      {project.ai_recommendation && (
        <Alert className="border-purple-200 bg-purple-50">
          <Zap className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <p className="font-medium text-purple-900 mb-1">Recommandation IA</p>
            <p className="text-sm">{project.ai_recommendation}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs de planification */}
      <Card>
        <CardHeader>
          <CardTitle>Planification Avancée</CardTitle>
          <CardDescription>
            Outils de gestion et d'analyse pour optimiser votre projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resources">
                <Users className="h-4 w-4 mr-2" />
                Ressources
              </TabsTrigger>
              <TabsTrigger value="dependencies">
                <GitBranch className="h-4 w-4 mr-2" />
                Dépendances
              </TabsTrigger>
              <TabsTrigger value="critical">
                <Route className="h-4 w-4 mr-2" />
                Chemin Critique
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="resources">
                <ResourceAllocation project={project} />
              </TabsContent>

              <TabsContent value="dependencies">
                <DependencyGraph project={project} />
              </TabsContent>

              <TabsContent value="critical">
                <CriticalPath project={project} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}