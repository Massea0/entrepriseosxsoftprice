import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { AnimatedMetricCard } from '@/components/ui/animated-metric-card';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Star,
  Eye,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';

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
  LiquidContainer,
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'delayed';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamSize: number;
  priority: 'high' | 'medium' | 'low';
  description: string;
  documents: number;
  lastUpdate: string;
}

export default function ClientProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Mock data - In real app, fetch from API based on client
  const projects: Project[] = [
    {
      id: '1',
      name: 'Application Mobile E-commerce',
      status: 'active',
      progress: 75,
      startDate: '2025-01-15',
      endDate: '2025-04-15',
      budget: 50000,
      spent: 37500,
      teamSize: 5,
      priority: 'high',
      description: 'Développement d\'une application mobile native pour votre plateforme e-commerce',
      documents: 12,
      lastUpdate: 'Il y a 2 heures'
    },
    {
      id: '2',
      name: 'Refonte Site Web Corporate',
      status: 'completed',
      progress: 100,
      startDate: '2024-11-01',
      endDate: '2024-12-31',
      budget: 25000,
      spent: 24000,
      teamSize: 3,
      priority: 'medium',
      description: 'Refonte complète du site web avec nouveau design et CMS',
      documents: 8,
      lastUpdate: 'Il y a 1 semaine'
    },
    {
      id: '3',
      name: 'Système CRM Personnalisé',
      status: 'on-hold',
      progress: 30,
      startDate: '2025-02-01',
      endDate: '2025-06-30',
      budget: 75000,
      spent: 15000,
      teamSize: 7,
      priority: 'high',
      description: 'Développement d\'un CRM sur mesure pour vos équipes commerciales',
      documents: 5,
      lastUpdate: 'Il y a 3 jours'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'completed': return 'Terminé';
      case 'on-hold': return 'En pause';
      case 'delayed': return 'En retard';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || project.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const projectMetrics = [
    {
      title: 'Projets Actifs',
      value: projects.filter(p => p.status === 'active').length,
      description: 'En développement',
      trend: 'up' as const,
      trendValue: '+1 ce mois',
      icon: Briefcase,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Projets Terminés',
      value: projects.filter(p => p.status === 'completed').length,
      description: 'Livrés avec succès',
      trend: 'up' as const,
      trendValue: '+2 ce trimestre',
      icon: CheckCircle2,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Budget Total',
      value: `${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000)}k€`,
      description: 'Investissement global',
      trend: 'neutral' as const,
      trendValue: 'Budget approuvé',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Satisfaction',
      value: '4.8/5',
      description: 'Note moyenne projets',
      trend: 'up' as const,
      trendValue: '+0.2 ce mois',
      icon: Star,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={30} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Hero Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-4">
                <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Briefcase className="h-10 w-10 text-white" />
                </LiquidContainer>
                <div>
                  <TypewriterText
                    text="Mes Projets"
                    className="text-4xl font-bold mb-2"
                    speed={50}
                  />
                  <GlowText className="text-lg text-indigo-100">
                    Suivi et gestion de vos projets en cours et terminés 📊
                  </GlowText>
                </div>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Métriques */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectMetrics.map((metric, index) => (
            <StaggeredItem key={metric.title} index={index}>
              <AnimatedMetricCard
                title={metric.title}
                value={metric.value}
                description={metric.description}
                trend={metric.trend}
                trendValue={metric.trendValue}
                icon={metric.icon}
                gradient={metric.gradient}
                delay={index * 0.1}
                onClick={() => console.log(`Navigate to ${metric.title}`)}
              />
            </StaggeredItem>
          ))}
        </StaggeredList>

        {/* Filtres et Recherche */}
        <HoverZone effect="lift">
          <EnhancedCard variant="glow">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <EnhancedInput
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <MagneticButton variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </MagneticButton>
              <MagneticButton variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </MagneticButton>
            </div>
          </div>
        </EnhancedCard>
      </HoverZone>

        {/* Projets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
            <TabsTrigger value="on-hold">En pause</TabsTrigger>
            <TabsTrigger value="delayed">En retard</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <StaggeredList className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <StaggeredItem key={project.id} index={index}>
                  <HoverZone effect="lift">
                    <EnhancedCard
                      variant="glow"
                      className="overflow-hidden"
                    >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg leading-tight">
                          {project.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusLabel(project.status)}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(project.priority)}>
                            {getPriorityLabel(project.priority)}
                          </Badge>
                        </div>
                      </div>
                      <MagneticButton variant="ghost" size="sm" className="shrink-0">
                        <Eye className="h-4 w-4" />
                      </MagneticButton>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Échéance</span>
                        </div>
                        <p className="text-sm font-medium">
                          {new Date(project.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Équipe</span>
                        </div>
                        <p className="text-sm font-medium">{project.teamSize} membres</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>Budget</span>
                        </div>
                        <p className="text-sm font-medium">
                          {(project.spent / 1000)}k€ / {(project.budget / 1000)}k€
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Docs</span>
                        </div>
                        <p className="text-sm font-medium">{project.documents} fichiers</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <FileText className="h-4 w-4" />
                        Documents
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Discussion
                      </Button>
                    </div>

                    {/* Last Update */}
                    <div className="text-xs text-muted-foreground border-t pt-3">
                      Dernière mise à jour: {project.lastUpdate}
                    </div>
                  </div>
                </EnhancedCard>
              </HoverZone>
            </StaggeredItem>
          ))}
        </StaggeredList>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Aucun projet trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun projet ne correspond à vos critères de recherche.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <FloatingActionButton
          actions={[
            {
              icon: <MessageSquare className="h-5 w-5" />,
              label: "Nouveau message",
              onClick: () => console.log("Nouveau message"),
              color: "bg-gradient-to-r from-blue-500 to-indigo-600"
            },
            {
              icon: <FileText className="h-5 w-5" />,
              label: "Télécharger docs",
              onClick: () => console.log("Télécharger documents"),
              color: "bg-gradient-to-r from-green-500 to-emerald-600"
            },
            {
              icon: <Calendar className="h-5 w-5" />,
              label: "Planifier réunion",
              onClick: () => console.log("Planifier réunion"),
              color: "bg-gradient-to-r from-purple-500 to-violet-600"
            }
          ]}
        />
      </div>
    </div>
  );
}