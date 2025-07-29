import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Target,
  Activity,
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teamMembers: 12,
    activeProjects: 8,
    pendingApprovals: 5,
    teamPerformance: 87,
    completedTasks: 156,
    overdueTasks: 3,
    weeklyProgress: 92,
    monthlyBudget: 45000,
    clientSatisfaction: 4.8
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Métriques principales avec animations
  const mainMetrics = [
    {
      label: 'Membres d\'équipe',
      value: stats.teamMembers,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      trendValue: '+2 ce mois',
      description: 'Équipe active'
    },
    {
      label: 'Projets actifs',
      value: stats.activeProjects,
      icon: Building2,
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
      trendValue: '+3 nouveaux',
      description: 'En cours'
    },
    {
      label: 'Validations en attente',
      value: stats.pendingApprovals,
      icon: CheckCircle,
      color: 'from-orange-500 to-amber-500',
      trend: 'neutral',
      trendValue: 'À traiter',
      description: 'Urgent'
    },
    {
      label: 'Performance équipe',
      value: stats.teamPerformance,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: '+5% ce mois',
      description: 'Score global',
      suffix: '%'
    }
  ];

  // Métriques secondaires
  const secondaryMetrics = [
    {
      label: 'Tâches complétées',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'from-teal-500 to-green-500'
    },
    {
      label: 'Progrès hebdomadaire',
      value: stats.weeklyProgress,
      icon: Activity,
      color: 'from-indigo-500 to-purple-500',
      suffix: '%'
    },
    {
      label: 'Budget mensuel',
      value: stats.monthlyBudget,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      prefix: '€',
      format: 'currency'
    },
    {
      label: 'Satisfaction client',
      value: stats.clientSatisfaction,
      icon: Star,
      color: 'from-pink-500 to-rose-500',
      suffix: '/5'
    }
  ];

  // Actions rapides avec descriptions
  const quickActions = [
    {
      title: 'Gérer l\'équipe',
      description: 'Affectations et permissions',
      icon: Users,
      href: '/manager/team-management',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Voir les projets',
      description: 'Suivi et avancement',
      icon: Building2,
      href: '/projects',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Valider les demandes',
      description: `${stats.pendingApprovals} en attente`,
      icon: CheckCircle,
      href: '/manager/team-approvals',
      color: 'from-orange-500 to-amber-500'
    },
    {
      title: 'Rapports d\'équipe',
      description: 'Analytics et insights',
      icon: BarChart3,
      href: '/manager/team-reports',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Planning équipe',
      description: 'Calendrier et deadlines',
      icon: Calendar,
      href: '/manager/team-schedule',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Performance',
      description: 'KPIs et objectifs',
      icon: TrendingUp,
      href: '/manager/team-performance',
      color: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={20} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-10 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-10 w-80 h-80 opacity-15 z-0" />
      
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Révolutionnaire */}
          <HoverZone effect="glow">
            <EnhancedCard variant="shimmer" className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <LiquidContainer className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                      <Briefcase className="h-10 w-10 text-white" />
                    </LiquidContainer>
                    <div>
                      <TypewriterText
                        text="Dashboard Manager"
                        className="text-4xl font-bold mb-2"
                        speed={50}
                      />
                      <GlowText className="text-lg text-indigo-100">
                        Gestion de votre équipe et de vos projets ✨
                      </GlowText>
                      <div className="mt-3 flex items-center gap-4 text-sm text-indigo-200">
                        <span className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Rôle: {user?.role || 'Manager'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <WaveformVisualizer className="w-32 h-16" />
                </div>
              </div>
            </EnhancedCard>
          </HoverZone>

          {/* Métriques principales avec StaggeredList */}
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainMetrics.map((metric, index) => (
              <StaggeredItem key={index} index={index}>
                <AnimatedMetricCard
                  label={metric.label}
                  value={metric.value}
                  icon={metric.icon}
                  trend={metric.trend as 'up' | 'down' | 'neutral'}
                  trendValue={metric.trendValue}
                  description={metric.description}
                  suffix={metric.suffix}
                  gradientFrom={metric.color.split(' ')[0].replace('from-', '')}
                  gradientTo={metric.color.split(' ')[2].replace('to-', '')}
                />
              </StaggeredItem>
            ))}
          </StaggeredList>

          {/* Actions rapides avec HoverZone */}
          <HoverZone effect="lift">
            <EnhancedCard variant="glow" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Actions Rapides
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Accès direct aux fonctionnalités clés
                  </p>
                </div>
                <Activity className="h-6 w-6 text-indigo-600 animate-pulse" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <MagneticButton
                      variant="ghost"
                      className="w-full h-full p-4 text-left hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </MagneticButton>
                  </Link>
                ))}
              </div>
            </EnhancedCard>
          </HoverZone>

          {/* Métriques secondaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryMetrics.map((metric, index) => (
              <HoverZone key={index} effect="rotate">
                <EnhancedCard variant="lift" className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {metric.prefix}
                        {metric.format === 'currency' 
                          ? metric.value.toLocaleString('fr-FR')
                          : metric.value
                        }
                        {metric.suffix}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                  </div>
                </EnhancedCard>
              </HoverZone>
            ))}
          </div>

          {/* Section Performance avec graphique animé */}
          <HoverZone effect="glow">
            <EnhancedCard variant="shimmer" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Performance de l'équipe
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Vue d'ensemble des KPIs cette semaine
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% vs semaine dernière
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Productivité</span>
                    <span className="text-sm font-bold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Qualité du code</span>
                    <span className="text-sm font-bold">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Respect des délais</span>
                    <span className="text-sm font-bold">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </EnhancedCard>
          </HoverZone>
        </motion.div>
      </div>
    </div>
  );
}