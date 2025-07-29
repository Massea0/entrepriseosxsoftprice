import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User,
  Calendar,
  Search,
  Filter,
  Building2,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  HoverZone,
  StaggeredList,
  StaggeredItem,
  MagneticButton,
  EnhancedCard,
  AnimatedMetricCard,
  LiquidContainer,
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface Assignment {
  id: string;
  type: 'project' | 'task' | 'client';
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  dueDate?: string;
  progress: number;
  client?: string;
  project?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignedBy: string;
}

export default function EmployeeAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Données mockées - À remplacer par vraies API calls
  const mockAssignments: Assignment[] = [
    {
      id: '1',
      type: 'project',
      title: 'Site E-commerce Arcadis',
      description: 'Développement du nouveau site e-commerce avec React et Stripe',
      status: 'active',
      priority: 'high',
      startDate: '2025-01-15',
      dueDate: '2025-03-30',
      progress: 65,
      client: 'Arcadis Technologies',
      estimatedHours: 160,
      actualHours: 104,
      assignedBy: 'Mohamed Diouf'
    },
    {
      id: '2',
      type: 'task',
      title: 'Intégration API Payment',
      description: 'Intégrer l\'API Stripe pour les paiements en ligne',
      status: 'active',
      priority: 'urgent',
      startDate: '2025-01-20',
      dueDate: '2025-02-05',
      progress: 80,
      project: 'Site E-commerce Arcadis',
      estimatedHours: 24,
      actualHours: 19,
      assignedBy: 'Mohamed Diouf'
    },
    {
      id: '3',
      type: 'client',
      title: 'Support Client - TechCorp',
      description: 'Support technique et maintenance de l\'application TechCorp',
      status: 'active',
      priority: 'medium',
      startDate: '2025-01-01',
      progress: 90,
      client: 'TechCorp Sarl',
      estimatedHours: 40,
      actualHours: 36,
      assignedBy: 'Mohamed Diouf'
    },
    {
      id: '4',
      type: 'task',
      title: 'Tests Unitaires Frontend',
      description: 'Écrire les tests unitaires pour les composants React',
      status: 'completed',
      priority: 'medium',
      startDate: '2025-01-10',
      dueDate: '2025-01-18',
      progress: 100,
      project: 'Site E-commerce Arcadis',
      estimatedHours: 16,
      actualHours: 14,
      assignedBy: 'Mohamed Diouf'
    },
    {
      id: '5',
      type: 'project',
      title: 'Migration Base de Données',
      description: 'Migration de MySQL vers PostgreSQL pour meilleure performance',
      status: 'pending',
      priority: 'low',
      startDate: '2025-02-15',
      dueDate: '2025-04-01',
      progress: 0,
      client: 'Arcadis Technologies',
      estimatedHours: 80,
      actualHours: 0,
      assignedBy: 'Mohamed Diouf'
    }
  ];

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, statusFilter]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      // TODO: Charger depuis l'API
      // const response = await fetch(`/api/employees/${user?.id}/assignments`);
      // const data = await response.json();
      // setAssignments(data);
      
      // Simulation
      setTimeout(() => {
        setAssignments(mockAssignments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des assignations:', error);
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = assignments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.project?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Briefcase className="h-4 w-4" />;
      case 'task':
        return <Target className="h-4 w-4" />;
      case 'client':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    pending: assignments.filter(a => a.status === 'pending').length,
    totalHours: assignments.reduce((sum, a) => sum + (a.actualHours || 0), 0),
    estimatedHours: assignments.reduce((sum, a) => sum + (a.estimatedHours || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement de vos assignations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={30} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Briefcase className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Mes Assignations"
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-blue-100">
                      Projets, tâches et clients assignés 📋
                    </GlowText>
                  </div>
                </div>
                
                <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StaggeredItem index={0}>
                    <AnimatedMetricCard
                      title="Actifs"
                      value={stats.active.toString()}
                      icon={Briefcase}
                      trend="+"
                      gradient="from-blue-500 to-indigo-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={1}>
                    <AnimatedMetricCard
                      title="Terminés"
                      value={stats.completed.toString()}
                      icon={CheckCircle2}
                      gradient="from-indigo-500 to-purple-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={2}>
                    <AnimatedMetricCard
                      title="Travaillées"
                      value={`${stats.totalHours}h`}
                      icon={Clock}
                      gradient="from-purple-500 to-pink-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={3}>
                    <AnimatedMetricCard
                      title="Efficacité"
                      value={`${Math.round((stats.totalHours / stats.estimatedHours) * 100)}%`}
                      icon={TrendingUp}
                      trend="+"
                      gradient="from-pink-500 to-red-500"
                    />
                  </StaggeredItem>
                </StaggeredList>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Filtres et recherche */}
        <HoverZone effect="lift">
          <EnhancedCard variant="glow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <EnhancedInput
                    placeholder="Rechercher projets, tâches ou clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  Tous ({stats.total})
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('active')}
                  size="sm"
                >
                  Actifs ({stats.active})
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                  size="sm"
                >
                  Terminés ({stats.completed})
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  size="sm"
                >
                  En attente ({stats.pending})
                </Button>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>
      </HoverZone>

        {/* Liste des assignations */}
        <StaggeredList className="grid gap-6">
          {filteredAssignments.map((assignment, index) => (
            <StaggeredItem key={assignment.id} index={index}>
              <HoverZone effect="lift">
                <EnhancedCard variant="glow">
                  <CardContent className="p-6">
                <div className="space-y-4">
                  
                  {/* En-tête */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent rounded-lg">
                          {getTypeIcon(assignment.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status === 'active' ? 'Actif' :
                         assignment.status === 'completed' ? 'Terminé' :
                         assignment.status === 'on_hold' ? 'En pause' : 'En attente'}
                      </Badge>
                      <Badge className={getPriorityColor(assignment.priority)}>
                        {assignment.priority === 'urgent' ? 'Urgent' :
                         assignment.priority === 'high' ? 'Haute' :
                         assignment.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Badge>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {assignment.client && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.client}</span>
                      </div>
                    )}
                    {assignment.project && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.project}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{assignment.assignedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(assignment.startDate).toLocaleDateString('fr-FR')}</span>
                      {assignment.dueDate && (
                        <>
                          <span>-</span>
                          <span>{new Date(assignment.dueDate).toLocaleDateString('fr-FR')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progrès */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{assignment.progress}%</span>
                    </div>
                    <Progress value={assignment.progress} className="h-2" />
                  </div>

                  {/* Temps */}
                  {assignment.estimatedHours && (
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {assignment.actualHours || 0}h / {assignment.estimatedHours}h
                        </span>
                      </div>
                      <div className="text-sm">
                        {assignment.actualHours && assignment.estimatedHours && (
                          <span className={`font-medium ${
                            assignment.actualHours <= assignment.estimatedHours 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {assignment.actualHours <= assignment.estimatedHours ? 'Dans les temps' : 'Dépassé'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
        </StaggeredItem>
      ))}
    </StaggeredList>

        {filteredAssignments.length === 0 && (
          <HoverZone effect="lift">
            <EnhancedCard variant="glow">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucune assignation trouvée</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Vous n\'avez aucune assignation pour le moment'
                }
              </p>
            </CardContent>
          </EnhancedCard>
        </HoverZone>
      )}
      </div>
    </div>
  );
}