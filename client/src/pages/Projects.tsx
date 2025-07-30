
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectPlannerAI } from '@/components/projects/ProjectPlannerAI';
import { SynapseInsights } from '@/components/ai/SynapseInsights';
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Bot,
  Brain,
  Sparkles,
  ArrowRight,
  Building2,
  Filter,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  Zap,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  Flag,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  HoverZone,
  StaggeredList,
  StaggeredItem,
  EnhancedCard,
  AnimatedMetricCard
} from '@/components/ui/revolutionary-design-system';

// Types pour les données
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget: number;
  progress: number;
  start_date: string;
  end_date?: string;
  owner_id: string;
  client_company: string;
  custom_fields?: Record<string, any>;
  completedTasks?: number;
  tasksCount?: number;
  owner?: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
}

interface Task {
  id: string;
  name: string;
  status: string;
  project_id: string;
}

export default function Projects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlanner, setShowPlanner] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Debug: Afficher les informations de l'utilisateur
  console.log('Projects Component - User:', user);
  console.log('Projects Component - User Role:', user?.role);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Remplacer les appels Supabase par des appels API
      const [projectsResponse, companiesResponse, employeesResponse, tasksResponse] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/companies'),
        fetch('/api/employees'),
        fetch('/api/tasks')
      ]);

      const [projectsData, companiesData, employeesData, tasksData] = await Promise.all([
        projectsResponse.json(),
        companiesResponse.json(),
        employeesResponse.json(),
        tasksResponse.json()
      ]);

      if (projectsData.data) {
        setProjects(projectsData.data);
      }
      if (companiesData.data) {
        setCompanies(companiesData.data);
      }
      if (employeesData.data) {
        setEmployees(employeesData.data);
      }
      if (tasksData.data) {
        setTasks(tasksData.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des projets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
    setShowPlanner(false);
    toast({
      title: "Projet créé",
      description: "Le projet a été créé avec succès",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'on_hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'planning': return 'Planification';
      case 'on_hold': return 'En pause';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const getProjectStats = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgProgress = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length 
      : 0;

    return [
      {
        title: 'Total Projets',
        value: totalProjects.toString(),
        description: 'Projets en cours',
        trend: 'up' as const,
        trendValue: '+5 ce mois',
        icon: Target
      },
      {
        title: 'Projets Actifs',
        value: activeProjects.toString(),
        description: 'En développement',
        trend: 'up' as const,
        trendValue: 'Excellent rythme',
        icon: Activity
      },
      {
        title: 'Projets Terminés',
        value: completedProjects.toString(),
        description: 'Livrés avec succès',
        trend: 'up' as const,
        trendValue: 'Taux élevé',
        icon: CheckCircle
      },
      {
        title: 'Budget Total',
        value: `${(totalBudget / 1000).toFixed(0)}k€`,
        description: 'Investissement total',
        trend: 'neutral' as const,
        trendValue: 'Dans les objectifs',
        icon: DollarSign
      }
    ];
  };

  const getProjectsByTab = () => {
    let filteredProjects = projects;

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
    }

    // Filtrage par priorité
    if (priorityFilter !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.priority === priorityFilter);
    }

    // Filtrage par recherche
    if (searchTerm) {
      filteredProjects = filteredProjects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    filteredProjects.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          return a.priority.localeCompare(b.priority);
        case 'budget':
          return (b.budget || 0) - (a.budget || 0);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

    return filteredProjects;
  };

  const filteredProjects = getProjectsByTab();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className=" rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={15} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-10 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-10 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 p-6 space-y-8">
        {/* Header Révolutionnaire */}
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl">
            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <TypewriterText
                      text="🚀 Gestion Projets Révolutionnaire"
                      className="text-4xl font-bold"
                      speed={50}
                    />
                    <GlowText className="text-lg text-blue-100 mt-2">
                      Planification intelligente et suivi avancé de vos projets ✨
                    </GlowText>
                  </div>
                </div>
                <Button
                  onClick={() => setShowPlanner(true)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau Projet
                </Button>
              </div>
            </CardHeader>
          </EnhancedCard>
        </HoverZone>

        {/* Métriques Révolutionnaires */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getProjectStats().map((metric, index) => (
            <StaggeredItem key={metric.title}>
              <AnimatedMetricCard
                title={metric.title}
                value={metric.value}
                description={metric.description}
                trend={metric.trend}
                trendValue={metric.trendValue}
                icon={metric.icon}
                variant={index % 4 === 0 ? "glow" : index % 4 === 1 ? "shimmer" : index % 4 === 2 ? "pulse" : "lift"}
                className={
                  index % 4 === 0 ? "border-blue-200 dark:border-blue-800" :
                  index % 4 === 1 ? "border-green-200 dark:border-green-800" :
                  index % 4 === 2 ? "border-purple-200 dark:border-purple-800" :
                  "border-orange-200 dark:border-orange-800"
                }
              />
            </StaggeredItem>
          ))}
        </StaggeredList>

        {/* Filtres et Recherche Révolutionnaires */}
        <HoverZone>
          <EnhancedCard variant="glass">
            <CardContent className="flex flex-col lg:flex-row gap-4 items-center justify-between p-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="planning">Planification</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="on_hold">En pause</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="status">Statut</SelectItem>
                    <SelectItem value="priority">Priorité</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="progress">Progression</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </EnhancedCard>
        </HoverZone>

        {/* Liste des Projets Révolutionnaire */}
        <HoverZone>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="planning">Planification</TabsTrigger>
              <TabsTrigger value="completed">Terminés</TabsTrigger>
              <TabsTrigger value="on_hold">En pause</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              <StaggeredList className="space-y-4">
                {filteredProjects.map((project, index) => (
                  <StaggeredItem key={project.id}>
                    <EnhancedCard
                      variant={project.status === 'active' ? 'glow' : project.status === 'completed' ? 'shimmer' : 'lift'}
                      className="hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              <Target className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{project.name}</h3>
                              <GlowText className="text-sm text-muted-foreground">
                                {project.client_company}
                              </GlowText>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                            <Badge className={getPriorityColor(project.priority)}>
                              {getPriorityLabel(project.priority)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Budget</p>
                            <p className="font-semibold text-xl">{project.budget?.toLocaleString('fr-FR')}€</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Progression</p>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress || 0} className="flex-1" />
                              <span className="text-sm font-medium">{project.progress || 0}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date de début</p>
                            <p className="font-medium">
                              {project.start_date ? format(new Date(project.start_date), 'dd/MM/yyyy', { locale: fr }) : 'Non définie'}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Discussion
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </EnhancedCard>
                  </StaggeredItem>
                ))}
              </StaggeredList>

              {filteredProjects.length === 0 && (
                <HoverZone>
                  <EnhancedCard variant="glass" className="text-center py-12">
                    <CardContent>
                      <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <GlowText className="text-lg font-medium mb-2">
                        Aucun projet trouvé
                      </GlowText>
                      <p className="text-muted-foreground">
                        Aucun projet ne correspond à vos critères de recherche
                      </p>
                    </CardContent>
                  </EnhancedCard>
                </HoverZone>
              )}
            </TabsContent>
          </Tabs>
        </HoverZone>

        {/* Actions Rapides Finales */}
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader>
              <TypewriterText
                text="⚡ Actions Rapides Projets"
                className="text-xl font-bold text-center"
                speed={70}
              />
            </CardHeader>
            <CardContent>
              <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StaggeredItem>
                  <Button className="w-full h-20 bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center">
                    <div>
                      <Plus className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">Nouveau Projet</span>
                    </div>
                  </Button>
                </StaggeredItem>
                <StaggeredItem>
                  <Button className="w-full h-20 bg-gradient-to-br from-green-400 to-green-600 text-white text-center">
                    <div>
                      <BarChart3 className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">Rapport Global</span>
                    </div>
                  </Button>
                </StaggeredItem>
                <StaggeredItem>
                  <Button className="w-full h-20 bg-gradient-to-br from-purple-400 to-purple-600 text-white text-center">
                    <div>
                      <Brain className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">IA Assistant</span>
                    </div>
                  </Button>
                </StaggeredItem>
              </StaggeredList>
            </CardContent>
          </EnhancedCard>
        </HoverZone>
      </div>

      {/* Modal AI Project Planner */}
      {showPlanner && (
        <ProjectPlannerAI
          onClose={() => setShowPlanner(false)}
          onProjectCreated={handleProjectCreated}
          companies={companies}
          employees={employees}
        />
      )}
    </div>
  );
}
