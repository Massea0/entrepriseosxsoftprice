import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Star, 
  Users, 
  Calendar, 
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Trophy,
  BookOpen,
  MessageSquare,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
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

interface Objective {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'management' | 'communication' | 'business';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'on_track' | 'at_risk' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high';
}

interface PerformanceReview {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'in_progress' | 'completed' | 'pending_manager';
  overallRating: number;
  reviewerName: string;
  reviewerRole: string;
  strengths: string[];
  improvementAreas: string[];
  comments: string;
  goals: Objective[];
  competencies: {
    name: string;
    rating: number;
    description: string;
  }[];
  createdAt: string;
  submittedAt?: string;
  completedAt?: string;
}

export default function PerformanceReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Données mockées
  const mockObjectives: Objective[] = [
    {
      id: '1',
      title: 'Maîtrise React/TypeScript',
      description: 'Améliorer les compétences en développement React et TypeScript',
      category: 'technical',
      targetValue: 90,
      currentValue: 75,
      unit: '%',
      deadline: '2025-06-30',
      status: 'on_track',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Projets livrés dans les délais',
      description: 'Maintenir un taux de livraison dans les délais',
      category: 'business',
      targetValue: 95,
      currentValue: 88,
      unit: '%',
      deadline: '2025-12-31',
      status: 'on_track',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Formation équipe junior',
      description: 'Accompagner 2 développeurs juniors',
      category: 'management',
      targetValue: 2,
      currentValue: 1,
      unit: 'personnes',
      deadline: '2025-09-30',
      status: 'on_track',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Certifications techniques',
      description: 'Obtenir 2 certifications professionnelles',
      category: 'technical',
      targetValue: 2,
      currentValue: 0,
      unit: 'certif.',
      deadline: '2025-12-31',
      status: 'at_risk',
      priority: 'medium'
    }
  ];

  const mockReviews: PerformanceReview[] = [
    {
      id: '1',
      period: 'T4 2024',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      status: 'completed',
      overallRating: 4.2,
      reviewerName: 'Mohamed Diouf',
      reviewerRole: 'CTO',
      strengths: [
        'Excellente maîtrise technique des frameworks modernes',
        'Capacité à livrer des projets complexes dans les délais',
        'Bon esprit d\'équipe et collaboration',
        'Initiative dans l\'amélioration des processus'
      ],
      improvementAreas: [
        'Communication avec les clients',
        'Gestion du stress en période de rush',
        'Documentation du code'
      ],
      comments: 'Performance exceptionnelle ce trimestre. Perfect a su mener à bien des projets critiques tout en maintenant une excellente qualité. Je recommande une évolution vers plus de responsabilités.',
      goals: mockObjectives.slice(0, 2),
      competencies: [
        { name: 'Compétences techniques', rating: 4.5, description: 'Maîtrise excellente de React, TypeScript et des outils modernes' },
        { name: 'Qualité du code', rating: 4.0, description: 'Code propre et maintenable, respect des bonnes pratiques' },
        { name: 'Respect des délais', rating: 4.5, description: 'Livraisons toujours dans les temps' },
        { name: 'Travail en équipe', rating: 4.0, description: 'Très bon collaborateur, aide les autres développeurs' },
        { name: 'Communication', rating: 3.5, description: 'Bonne communication technique, peut s\'améliorer côté client' },
        { name: 'Autonomie', rating: 4.5, description: 'Très autonome, prend des initiatives pertinentes' }
      ],
      createdAt: '2024-12-15',
      submittedAt: '2024-12-20',
      completedAt: '2025-01-05'
    },
    {
      id: '2',
      period: 'T3 2024',
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      status: 'completed',
      overallRating: 3.8,
      reviewerName: 'Mohamed Diouf',
      reviewerRole: 'CTO',
      strengths: [
        'Adaptation rapide aux nouvelles technologies',
        'Résolution efficace des bugs complexes',
        'Ponctualité et assiduité'
      ],
      improvementAreas: [
        'Estimation des tâches',
        'Tests unitaires',
        'Participation aux réunions'
      ],
      comments: 'Bonne évolution sur ce trimestre. Perfect montre une progression constante dans ses compétences techniques.',
      goals: [],
      competencies: [
        { name: 'Compétences techniques', rating: 4.0, description: 'Bonnes compétences, en progression' },
        { name: 'Qualité du code', rating: 3.5, description: 'Code correct, peut améliorer la documentation' },
        { name: 'Respect des délais', rating: 4.0, description: 'Généralement dans les temps' },
        { name: 'Travail en équipe', rating: 3.5, description: 'Bon collaborateur, peut être plus proactif' },
        { name: 'Communication', rating: 3.5, description: 'Communication technique correcte' },
        { name: 'Autonomie', rating: 4.0, description: 'Autonome sur les tâches courantes' }
      ],
      createdAt: '2024-09-25',
      submittedAt: '2024-09-30',
      completedAt: '2024-10-10'
    }
  ];

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      // TODO: Charger depuis l'API
      setTimeout(() => {
        setReviews(mockReviews);
        setObjectives(mockObjectives);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des performances:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <BookOpen className="h-4 w-4" />;
      case 'management':
        return <Users className="h-4 w-4" />;
      case 'communication':
        return <MessageSquare className="h-4 w-4" />;
      case 'business':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-500 fill-current' 
            : i < rating 
            ? 'text-yellow-500 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const currentObjectives = objectives.filter(obj => obj.status !== 'completed');
  const completedObjectives = objectives.filter(obj => obj.status === 'completed');
  const latestReview = reviews[0];

  // Statistiques
  const stats = {
    currentRating: latestReview?.overallRating || 0,
    objectivesProgress: currentObjectives.length > 0 
      ? Math.round(currentObjectives.reduce((sum, obj) => sum + (obj.currentValue / obj.targetValue * 100), 0) / currentObjectives.length)
      : 0,
    completedReviews: reviews.filter(r => r.status === 'completed').length,
    onTrackObjectives: currentObjectives.filter(obj => obj.status === 'on_track').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className=" rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des évaluations...</p>
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
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Performance & Évaluations"
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-purple-100">
                      Suivi de vos objectifs et évaluations 📈
                    </GlowText>
                  </div>
                </div>
                
                <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StaggeredItem index={0}>
                    <AnimatedMetricCard
                      title="Note actuelle"
                      value={`${stats.currentRating.toFixed(1)}/5`}
                      icon={Star}
                      trend={stats.currentRating >= 4 ? '+' : '-'}
                      gradient="from-purple-500 to-indigo-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={1}>
                    <AnimatedMetricCard
                      title="Objectifs"
                      value={`${stats.objectivesProgress}%`}
                      icon={Target}
                      trend={stats.objectivesProgress >= 75 ? '+' : '-'}
                      gradient="from-indigo-500 to-blue-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={2}>
                    <AnimatedMetricCard
                      title="Évaluations"
                      value={stats.completedReviews.toString()}
                      icon={Award}
                      gradient="from-blue-500 to-cyan-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={3}>
                    <AnimatedMetricCard
                      title="En bonne voie"
                      value={stats.onTrackObjectives.toString()}
                      icon={CheckCircle2}
                      trend="+"
                      gradient="from-cyan-500 to-teal-500"
                    />
                  </StaggeredItem>
                </StaggeredList>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="objectives">Objectifs</TabsTrigger>
            <TabsTrigger value="reviews">Évaluations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            
            {/* Performance actuelle */}
            {latestReview && (
              <HoverZone>
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg text-white">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <GlowText>Performance Actuelle - {latestReview.period}</GlowText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  
                  {/* Note globale */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-purple-600">
                      {latestReview.overallRating.toFixed(1)}/5
                    </div>
                    <div className="flex justify-center gap-1">
                      {getRatingStars(latestReview.overallRating)}
                    </div>
                    <p className="text-muted-foreground">
                      Évaluation par {latestReview.reviewerName} - {latestReview.reviewerRole}
                    </p>
                  </div>

                  {/* Compétences clés */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {latestReview.competencies.slice(0, 4).map((comp, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{comp.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {comp.rating.toFixed(1)}/5
                            </span>
                            <div className="flex gap-1">
                              {getRatingStars(comp.rating)}
                            </div>
                          </div>
                        </div>
                        <Progress value={comp.rating * 20} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </EnhancedCard>
            </HoverZone>
            )}

            {/* Objectifs en cours */}
            <HoverZone>
              <EnhancedCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white">
                      <Target className="h-5 w-5" />
                    </div>
                    <GlowText>Objectifs en Cours ({currentObjectives.length})</GlowText>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                  {currentObjectives.slice(0, 3).map((objective) => (
                    <div key={objective.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(objective.category)}
                          <span className="font-medium">{objective.title}</span>
                          <Badge className={getStatusColor(objective.status)}>
                            {objective.status === 'on_track' ? 'En bonne voie' :
                             objective.status === 'at_risk' ? 'À risque' :
                             objective.status === 'completed' ? 'Terminé' : 'En retard'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{objective.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span>Échéance: {new Date(objective.deadline).toLocaleDateString('fr-FR')}</span>
                          <span>
                            Progression: {objective.currentValue}/{objective.targetValue} {objective.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-lg font-bold">
                          {Math.round((objective.currentValue / objective.targetValue) * 100)}%
                        </div>
                        <Progress 
                          value={(objective.currentValue / objective.targetValue) * 100} 
                          className="w-20 h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-6">
            
            {/* Objectifs actifs */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Objectifs Actifs</CardTitle>
                <CardDescription>
                  Vos objectifs pour la période en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentObjectives.map((objective) => (
                    <div key={objective.id} className="border rounded-lg p-6 space-y-4">
                      
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(objective.category)}
                            <h3 className="text-lg font-semibold">{objective.title}</h3>
                            <Badge className={getStatusColor(objective.status)}>
                              {objective.status === 'on_track' ? 'En bonne voie' :
                               objective.status === 'at_risk' ? 'À risque' :
                               objective.status === 'completed' ? 'Terminé' : 'En retard'}
                            </Badge>
                            <Badge variant="outline">
                              {objective.category === 'technical' ? 'Technique' :
                               objective.category === 'management' ? 'Management' :
                               objective.category === 'communication' ? 'Communication' : 'Business'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{objective.description}</p>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold">
                            {Math.round((objective.currentValue / objective.targetValue) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {objective.currentValue}/{objective.targetValue} {objective.unit}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>
                            Échéance: {new Date(objective.deadline).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <Progress 
                          value={(objective.currentValue / objective.targetValue) * 100} 
                          className="h-3" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Objectifs terminés */}
            {completedObjectives.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Objectifs Atteints ({completedObjectives.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedObjectives.map((objective) => (
                      <div key={objective.id} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(objective.category)}
                          <div>
                            <div className="font-medium">{objective.title}</div>
                            <div className="text-sm text-muted-foreground">{objective.description}</div>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Évaluation {review.period}
                      </CardTitle>
                      <CardDescription>
                        Du {new Date(review.startDate).toLocaleDateString('fr-FR')} au{' '}
                        {new Date(review.endDate).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {review.overallRating.toFixed(1)}/5
                      </div>
                      <div className="flex gap-1">
                        {getRatingStars(review.overallRating)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  
                  {/* Compétences détaillées */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Évaluation par Compétences</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {review.competencies.map((comp, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{comp.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {comp.rating.toFixed(1)}/5
                              </span>
                              <div className="flex gap-1">
                                {getRatingStars(comp.rating)}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{comp.description}</p>
                          <Progress value={comp.rating * 20} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Points forts et axes d'amélioration */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-green-600">
                        <Zap className="h-4 w-4" />
                        Points Forts
                      </h4>
                      <ul className="space-y-2">
                        {review.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-orange-600">
                        <ArrowUp className="h-4 w-4" />
                        Axes d'Amélioration
                      </h4>
                      <ul className="space-y-2">
                        {review.improvementAreas.map((area, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Commentaires */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Commentaires du Manager</h4>
                    <div className="bg-accent/50 rounded-lg p-4">
                      <p className="text-sm italic">"{review.comments}"</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {review.reviewerName} - {review.reviewerRole}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Créée: {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    {review.completedAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Finalisée: {new Date(review.completedAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {reviews.length === 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Aucune évaluation</h3>
                  <p className="text-muted-foreground">
                    Vos évaluations de performance apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}