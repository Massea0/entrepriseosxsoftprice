import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, Brain, Briefcase, Heart, DollarSign, BarChart3,
  Sparkles, TrendingUp, Shield, Clock, Award, Target,
  ChevronRight, Home, ArrowLeft, FileText, Eye,
  Zap, Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  WaveformVisualizer
} from '@/components/design-system/RevolutionaryDesignSystem';

// Import des nouveaux composants
import { HRDashboard } from '@/components/hr/HRDashboard';
// Other modules will be migrated progressively from Supabase to Express API

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  stats: {
    label: string;
    value: string;
    trend?: string;
  }[];
  isNew?: boolean;
}

export default function HRDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const modules: ModuleCard[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Intelligent',
      description: 'Vue d\'ensemble avec prédictions IA et alertes temps réel',
      icon: Brain,
      color: 'from-purple-600 to-pink-600',
      stats: [
        { label: 'Effectif Total', value: '187', trend: '+5.2%' },
        { label: 'Performance Moy.', value: '8.6/10', trend: '+8.5%' }
      ],
      isNew: true
    },
    {
      id: 'talent',
      title: 'Gestion des Talents',
      description: 'Matrice 3D des compétences et plans de carrière IA',
      icon: Award,
      color: 'from-blue-600 to-cyan-600',
      stats: [
        { label: 'Talents Identifiés', value: '23', trend: '+15%' },
        { label: 'Skills Gap', value: '12%', trend: '-3%' }
      ],
      isNew: true
    },
    {
      id: 'recruitment',
      title: 'Recrutement Intelligent',
      description: 'Pipeline visuel avec scoring automatique des CV',
      icon: Briefcase,
      color: 'from-green-600 to-emerald-600',
      stats: [
        { label: 'Postes Ouverts', value: '8' },
        { label: 'Candidats', value: '142' }
      ],
      isNew: true
    },
    {
      id: 'wellbeing',
      title: 'Bien-être & Engagement',
      description: 'Pulse surveys et prévention des risques psychosociaux',
      icon: Heart,
      color: 'from-pink-600 to-rose-600',
      stats: [
        { label: 'Bien-être', value: '78%', trend: '+5%' },
        { label: 'Engagement', value: '82%', trend: '+3%' }
      ],
      isNew: true
    },
    {
      id: 'compensation',
      title: 'Compensation & Benefits',
      description: 'Simulateur de packages et comparaison marché en temps réel',
      icon: DollarSign,
      color: 'from-orange-600 to-amber-600',
      stats: [
        { label: 'Masse Salariale', value: '125M' },
        { label: 'Satisfaction', value: '87%' }
      ],
      isNew: true
    },
    {
      id: 'cvparser',
      title: 'Parser CV Intelligent',
      description: 'Extraction automatique des données CV avec IA pour création rapide d\'employés',
      icon: FileText,
      color: 'from-violet-600 to-fuchsia-600',
      stats: [
        { label: 'CV Analysés', value: '342', trend: '+45%' },
        { label: 'Précision', value: '96%', trend: '+3%' }
      ],
      isNew: true
    },
    {
      id: 'employee360',
      title: 'Vue Employé 360°',
      description: 'Vue complète avec IA prédictive, timeline de carrière et assistant personnel',
      icon: Eye,
      color: 'from-teal-600 to-cyan-600',
      stats: [
        { label: 'Prédictions', value: '89%', trend: '+7%' },
        { label: 'Insights IA', value: '156' }
      ],
      isNew: true
    },
    {
      id: 'employees',
      title: 'Gestion Employés',
      description: 'CRUD classique des employés et informations de base',
      icon: Users,
      color: 'from-gray-600 to-gray-700',
      stats: [
        { label: 'Actifs', value: '165' },
        { label: 'Nouveaux', value: '12' }
      ]
    },
    {
      id: 'organization',
      title: 'Organisation',
      description: 'Structure organisationnelle et départements',
      icon: Shield,
      color: 'from-indigo-600 to-purple-600',
      stats: [
        { label: 'Départements', value: '8' },
        { label: 'Équipes', value: '24' }
      ]
    }
  ];

  const renderModuleContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HRDashboard />;
      default:
        return <div className="p-8 text-center text-gray-500">Module en cours de migration depuis Supabase vers Express API...</div>;
    }
  };

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={20} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10">
        {/* Header Révolutionnaire */}
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-2xl rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <MagneticButton
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </MagneticButton>
                  <LiquidContainer className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <Users className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Module RH Nouvelle Génération"
                      className="text-4xl font-bold mb-2"
                      speed={50}
                    />
                    <GlowText className="text-lg text-violet-100">
                      Le meilleur système de gestion des ressources humaines avec IA intégrée ✨
                    </GlowText>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/10 backdrop-blur-sm border-white/20 text-white gap-1">
                    <Sparkles className="h-3 w-3" />
                    IA Active
                  </Badge>
                  <Badge className="bg-white/10 backdrop-blur-sm border-white/20 text-white gap-1">
                    <Clock className="h-3 w-3" />
                    Temps Réel
                  </Badge>
                  <WaveformVisualizer className="w-32 h-12" />
                </div>
              </div>
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Grille des Modules avec design révolutionnaire */}
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <StaggeredItem key={module.id} index={index}>
                    <HoverZone>
                      <EnhancedCard 
                        
                        className="cursor-pointer relative overflow-hidden h-full"
                        onClick={() => setActiveTab(module.id)}
                      >
                        {module.isNew && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-bl-lg z-10">
                            <span className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              NOUVEAU
                            </span>
                          </div>
                        )}
                        <CardHeader>
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} w-fit mb-4`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="flex items-center justify-between">
                            <GlowText className="text-xl">{module.title}</GlowText>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </CardTitle>
                          <CardDescription className="mt-2">{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            {module.stats.map((stat, statIndex) => (
                              <HoverZone key={statIndex} >
                                <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                                  <div className="flex items-baseline gap-2 mt-1">
                                    <p className="text-lg font-bold">{stat.value}</p>
                                    {stat.trend && (
                                      <Badge variant="outline" className={`text-xs ${
                                        stat.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                      }`}>
                                        {stat.trend}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </HoverZone>
                            ))}
                          </div>
                        </CardContent>
                      </EnhancedCard>
                    </HoverZone>
                  </StaggeredItem>
                );
              })}
            </StaggeredList>

            {/* Call to Action avec design révolutionnaire */}
            <HoverZone>
              <EnhancedCard  className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <TypewriterText
                        text="Découvrez la Puissance de l'IA en RH"
                        className="text-2xl font-bold mb-2"
                        speed={40}
                      />
                      <GlowText className="text-purple-100">
                        Automatisez vos processus, prédisez les tendances et prenez des décisions éclairées
                      </GlowText>
                    </div>
                    <MagneticButton size="lg" variant="secondary" className="gap-2">
                      <Brain className="h-5 w-5" />
                      Explorer l'IA RH
                    </MagneticButton>
                  </div>
                </CardContent>
              </EnhancedCard>
            </HoverZone>
          </div>
        )}

      {/* Navigation par Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-10 w-full">
            <TabsTrigger value="overview" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden lg:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden lg:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="talent" className="gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden lg:inline">Talents</span>
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden lg:inline">Recrutement</span>
            </TabsTrigger>
            <TabsTrigger value="wellbeing" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden lg:inline">Bien-être</span>
            </TabsTrigger>
            <TabsTrigger value="compensation" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden lg:inline">Paie</span>
            </TabsTrigger>
            <TabsTrigger value="cvparser" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">Parser CV</span>
            </TabsTrigger>
            <TabsTrigger value="employee360" className="gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden lg:inline">Vue 360°</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden lg:inline">Employés</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Organisation</span>
            </TabsTrigger>
          </TabsList>

          {activeTab !== 'overview' && (
            <TabsContent value={activeTab} className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {renderModuleContent()}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
      </div>
    </div>
  );
}