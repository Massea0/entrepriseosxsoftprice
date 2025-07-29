import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Building2, 
  TrendingUp, 
  Activity,
  Sparkles,
  Cpu,
  Zap,
  Brain,
  Play,
  Settings,
  Maximize,
  MessageSquare,
  Bot,
  Workflow,
  Database,
  BarChart,
  TrendingDown,
  Globe,
  Lightbulb
} from 'lucide-react';


import { 
  FloatingParticles, 
  MorphingBlob, 
  TypewriterText, 
  GlowText,
  LiquidContainer,
  HoverZone,
  WaveformVisualizer,
  StaggeredList,
  StaggeredItem,
  MagneticButton
} from '@/components/ui/EnhancedAnimations';
import { EnhancedCard } from '@/components/ui/enhanced-card';

// Sample data for demonstrations
const performanceData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fév', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Avr', value: 4500 },
  { name: 'Mai', value: 6000 },
  { name: 'Jun', value: 5500 }
];

const revenueData = [
  { name: 'Projets', value: 400000 },
  { name: 'Consulting', value: 300000 },
  { name: 'Support', value: 150000 },
  { name: 'Formation', value: 200000 }
];

export default function EnhancedAdminDashboard() {
    const [selectedDemo, setSelectedDemo] = useState('ia-synapse');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const demoSteps = [
    {
      id: 'personal',
      title: 'Informations personnelles',
      description: 'Vos données de base',
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom complet</label>
            <input
              type="text"
              placeholder="Entrez votre nom"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
      )
    },
    {
      id: 'company',
      title: 'Informations entreprise',
      description: 'Détails de votre organisation',
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de l'entreprise</label>
            <input
              type="text"
              placeholder="Arcadis Technologies"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Secteur d'activité</label>
            <input
              type="text"
              placeholder="Consulting IT"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fichiers</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">Glissez vos fichiers ici</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'finish',
      title: 'Finalisation',
      description: 'Confirmation de vos informations',
      component: (
        <div className="text-center space-y-4">
          <GlowText className="text-2xl font-bold">
            Configuration terminée !
          </GlowText>
          <WaveformVisualizer className="mx-auto" />
        </div>
      )
    }
  ];

  const gridItems = [
    {
      id: 'performance',
      x: 0, y: 0, w: 2, h: 2,
      component: (
        <EnhancedCard className="h-full">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">Métriques temps réel</p>
            <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Graphique d'évolution mensuelle</span>
            </div>
          </div>
        </EnhancedCard>
      )
    },
    {
      id: 'revenue',
      x: 2, y: 0, w: 1, h: 1,
      component: (
        <EnhancedCard className="h-full">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Revenus</h3>
            <p className="text-sm text-gray-600 mb-4">Par catégorie</p>
            <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Graphique circulaire</span>
            </div>
          </div>
        </EnhancedCard>
      )
    },
    {
      id: 'ai-insights',
      x: 0, y: 2, w: 1, h: 1,
      component: (
        <EnhancedCard className="h-full">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
            <p className="text-sm text-gray-600 mb-4">Prédictions intelligentes</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Croissance prévue: +23%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">Efficacité optimale</span>
              </div>
            </div>
          </div>
        </EnhancedCard>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles count={15} />
      
      {/* Morphing Blob Background */}
      <div className="absolute top-1/4 left-1/4 pointer-events-none">
        <MorphingBlob className="opacity-30" />
      </div>
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <GlowText>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <TypewriterText text="Phase 2: UI Innovation Dashboard" />
            </h1>
          </GlowText>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Découvrez les nouveaux composants et animations avancées
          </motion.p>
        </motion.div>

        {/* Demo Navigation */}
        <StaggeredList className="flex justify-center space-x-4">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
            { id: 'ia-synapse', label: 'IA Synapse', icon: Brain },
            { id: 'forms', label: 'Formulaires', icon: Settings },
            { id: 'charts', label: 'Graphiques', icon: BarChart3 },
            { id: 'widgets', label: 'Widgets', icon: Cpu }
          ].map((demo) => (
            <StaggeredItem key={demo.id}>
              <MagneticButton>
                <motion.button
                  onClick={() => setSelectedDemo(demo.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                    ${selectedDemo === demo.id 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                    }
                    backdrop-blur-md border border-white/20 dark:border-gray-700/20
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <demo.icon className="w-4 h-4" />
                  <span>{demo.label}</span>
                </motion.button>
              </MagneticButton>
            </StaggeredItem>
          ))}
        </StaggeredList>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDemo}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedDemo === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <HoverZone effect="lift">
                  <LiquidContainer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Utilisateurs</h3>
                        <p className="text-2xl font-bold text-blue-500">1,234</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">+12% ce mois</div>
                  </LiquidContainer>
                </HoverZone>

                <HoverZone effect="glow">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Revenus</h3>
                        <p className="text-2xl font-bold text-green-500">€89.5K</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">+8% ce mois</div>
                  </div>
                </HoverZone>

                <HoverZone effect="rotate">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Projets</h3>
                        <p className="text-2xl font-bold text-purple-500">47</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">3 nouveaux</div>
                  </div>
                </HoverZone>
              </div>
            )}

            {selectedDemo === 'ia-synapse' && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  >
                    🧠 IA Synapse - Intelligence Artificielle
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 dark:text-gray-400 mb-8"
                  >
                    Explorez l'écosystème d'intelligence artificielle révolutionnaire
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Workflow Designer */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link to="/ai/workflow-designer" className="block">
                      <HoverZone effect="lift">
                        <LiquidContainer className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-md rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/30 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                              <Workflow className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Workflow Designer</h3>
                              <p className="text-sm text-purple-600 dark:text-purple-400">IA Générative</p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                            Créez des workflows complexes en langage naturel. L'IA génère automatiquement les processus optimisés.
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                              Nouveau
                            </span>
                            <Bot className="w-4 h-4 text-purple-500" />
                          </div>
                        </LiquidContainer>
                      </HoverZone>
                    </Link>
                  </motion.div>

                  {/* Predictive Dashboard */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link to="/ai/predictive-dashboard" className="block">
                      <HoverZone effect="glow">
                        <LiquidContainer className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-md rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/30 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                              <BarChart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Analytics Prédictifs</h3>
                              <p className="text-sm text-blue-600 dark:text-blue-400">IA Prédictive</p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                            Prédictions business avancées, détection d'anomalies et insights automatiques en temps réel.
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                              Temps réel
                            </span>
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                          </div>
                        </LiquidContainer>
                      </HoverZone>
                    </Link>
                  </motion.div>

                  {/* Natural Language Interface */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link to="/ai/natural-language" className="block">
                      <HoverZone effect="rotate">
                        <LiquidContainer className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-md rounded-xl p-6 border border-green-200/50 dark:border-green-700/30 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                              <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Language SQL</h3>
                              <p className="text-sm text-green-600 dark:text-green-400">IA Conversationnelle</p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                            Interrogez vos données en langage naturel. L'IA traduit en SQL et exécute vos requêtes.
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                              Vocal
                            </span>
                            <Database className="w-4 h-4 text-green-500" />
                          </div>
                        </LiquidContainer>
                      </HoverZone>
                    </Link>
                  </motion.div>
                </div>

                {/* Stats IA Synapse */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-xl p-8 text-white mb-8"
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">📊 Performances IA en Temps Réel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Brain className="w-8 h-8 mr-2" />
                        <span className="text-3xl font-bold">97%</span>
                      </div>
                      <p className="text-sm opacity-90">Précision IA</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-8 h-8 mr-2" />
                        <span className="text-3xl font-bold">2.3s</span>
                      </div>
                      <p className="text-sm opacity-90">Temps de réponse</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-8 h-8 mr-2" />
                        <span className="text-3xl font-bold">+34%</span>
                      </div>
                      <p className="text-sm opacity-90">Efficacité</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Globe className="w-8 h-8 mr-2" />
                        <span className="text-3xl font-bold">24/7</span>
                      </div>
                      <p className="text-sm opacity-90">Disponibilité</p>
                    </div>
                  </div>
                </motion.div>

                {/* Innovations récentes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">🚀 Innovations Récentes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LiquidContainer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        <h4 className="text-lg font-semibold">Auto-Optimisation</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        L'IA apprend de vos habitudes et optimise automatiquement les performances du système.
                      </p>
                    </LiquidContainer>
                    
                    <LiquidContainer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                        <h4 className="text-lg font-semibold">Génération de Code</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Créez du code complexe à partir de descriptions en langage naturel avec une précision de 95%.
                      </p>
                    </LiquidContainer>
                  </div>
                </motion.div>
              </div>
            )}

            {selectedDemo === 'forms' && (
              <div className="max-w-2xl mx-auto">
                <LiquidContainer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-8 border border-white/20 dark:border-gray-700/20">
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold mb-2">Formulaire Multi-Étapes</h2>
                    <p className="text-gray-600 dark:text-gray-400">Démonstration des nouveaux composants de formulaire</p>
                  </div>
                  
                  {!isFormOpen ? (
                    <div className="text-center">
                      <MagneticButton>
                        <button
                          onClick={() => setIsFormOpen(true)}
                          className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Play className="w-5 h-5" />
                          <span>Démarrer la démo</span>
                        </button>
                      </MagneticButton>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Formulaire Multi-étapes</h3>
                      <p className="text-sm text-gray-600">Fonctionnalité en cours de développement</p>
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-center text-gray-500">Composant MultiStepForm à implémenter</p>
                      </div>
                    </div>
                  )}
                </LiquidContainer>
              </div>
            )}

            {selectedDemo === 'charts' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnhancedCard className="h-full">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Performance Mensuelle</h3>
                    <p className="text-sm text-gray-600 mb-4">Évolution des métriques clés</p>
                    <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Graphique en aire</span>
                    </div>
                  </div>
                </EnhancedCard>
                
                <EnhancedCard className="h-full">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Revenus par Catégorie</h3>
                    <p className="text-sm text-gray-600 mb-4">Répartition des sources de revenus</p>
                    <div className="h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Graphique en barres</span>
                    </div>
                  </div>
                </EnhancedCard>
                
                <EnhancedCard className="h-full">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Tendance Linéaire</h3>
                    <p className="text-sm text-gray-600 mb-4">Progression dans le temps</p>
                    <div className="h-64 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Graphique linéaire</span>
                    </div>
                  </div>
                </EnhancedCard>
                
                <EnhancedCard className="h-full">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Répartition Circulaire</h3>
                    <p className="text-sm text-gray-600 mb-4">Vue d'ensemble proportionnelle</p>
                    <div className="h-64 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Graphique circulaire</span>
                    </div>
                  </div>
                </EnhancedCard>
              </div>
            )}

            {selectedDemo === 'widgets' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Dashboard Widgets Dynamiques</h2>
                  <p className="text-gray-600 dark:text-gray-400">Widgets redimensionnables et configurables</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {gridItems.map((item) => (
                    <div key={item.id} className="col-span-1">
                      {item.component}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-6">Nouvelles Fonctionnalités</h2>
          
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Sparkles, title: 'Animations Avancées', desc: '15+ nouvelles animations CSS' },
              { icon: Settings, title: 'Formulaires Next-Gen', desc: 'Inputs flottants et validation' },
              { icon: BarChart3, title: 'Graphiques Animés', desc: 'Charts avec transitions fluides' },
              { icon: Maximize, title: 'Widgets Dynamiques', desc: 'Composants redimensionnables' }
            ].map((feature, index) => (
              <StaggeredItem key={index}>
                <HoverZone effect="lift">
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                    <feature.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </HoverZone>
              </StaggeredItem>
            ))}
          </StaggeredList>
        </motion.div>
      </div>
    </div>
  );
}