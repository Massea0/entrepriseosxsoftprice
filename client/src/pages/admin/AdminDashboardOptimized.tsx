import React, { lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Shield, 
  Rocket,
  BarChart3,
  Users,
  Globe,
  Activity,
  Command,
  ArrowUp,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import { useDebounce, usePrefetch } from '@/hooks/useOptimization';

// Lazy load heavy components with retry logic
const QuantumCard = lazyWithRetry(() => import('@/components/quantum/QuantumCard').then(m => ({ default: m.QuantumCard })));
const PerformanceMonitor = lazyWithRetry(() => import('@/components/performance/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitor })));
const AnimatedMetricCard = lazyWithRetry(() => import('@/components/ui/animated-metric-card').then(m => ({ default: m.AnimatedMetricCard })));
const FloatingActionButton = lazyWithRetry(() => import('@/components/ui/FloatingActionButton').then(m => ({ default: m.FloatingActionButton })));
const AIOrchestrator = lazyWithRetry(() => import('@/components/ai/AIOrchestrator').then(m => ({ default: m.default })));

// Loading fallback
const ComponentLoader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="space-y-4 text-center">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-purple-500/20 rounded-full " />
        <div className="absolute inset-0 h-16 w-16 border-4 border-t-purple-500 rounded-full " />
      </div>
      <p className="text-sm text-muted-foreground">Chargement {name}...</p>
    </div>
  </div>
);

const AdminDashboardOptimized = () => {
  // Use optimization hooks
  
  // Prefetch critical resources (commented for now)
  // usePrefetch([
  //   '/api/ai/status',
  //   '/api/performance/metrics',
  //   '/api/system/health'
  // ]);

  // Memoized metrics data
  const metrics = useMemo(() => [
    {
      title: "Performance IA",
      value: 98.5,
      unit: "%",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      trend: "up" as const,
      trendValue: "+12.3%",
      onClick: () => console.log("AI Performance clicked")
    },
    {
      title: "Vitesse Système",
      value: 0.84,
      unit: "s",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      trend: "down" as const,
      trendValue: "-23ms",
      onClick: () => console.log("System Speed clicked")
    },
    {
      title: "Sécurité",
      value: 100,
      unit: "%",
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
      trend: "neutral" as const,
      trendValue: "Optimal",
      onClick: () => console.log("Security clicked")
    },
    {
      title: "Innovation Score",
      value: 94.7,
      unit: "pts",
      icon: Rocket,
      gradient: "from-orange-500 to-red-500",
      trend: "up" as const,
      trendValue: "+8.2",
      onClick: () => console.log("Innovation clicked")
    }
  ], []);

  const floatingActions = useMemo(() => [
    {
      icon: <Brain className="h-5 w-5" />,
      label: 'AI Analysis',
      onClick: () => console.log('AI Analysis triggered'),
      color: 'bg-purple-500'
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Generate Report',
      onClick: () => console.log('Report generation triggered'),
      color: 'bg-blue-500'
    },
    {
      icon: <Command className="h-5 w-5" />,
      label: 'Command Center',
      onClick: () => console.log('Command center opened'),
      color: 'bg-green-500'
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-morph" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Tableau de Bord Quantique
          </h1>
          <p className="text-xl text-gray-400 mt-2">Le futur de la gestion d'entreprise</p>
        </motion.div>

        {/* Performance Monitor */}
        <Suspense fallback={<ComponentLoader name="Monitor de Performance" />}>
          <div className="fixed top-20 right-4 z-50">
            <PerformanceMonitor compact showDetails />
          </div>
        </Suspense>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AnimatePresence mode="wait">
            {metrics.map((metric, index) => (
              <Suspense key={metric.title} fallback={<ComponentLoader name={metric.title} />}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedMetricCard
                    {...metric}
                    delay={index * 100}
                    animateValue
                  />
                </motion.div>
              </Suspense>
            ))}
          </AnimatePresence>
        </div>

        {/* Quantum Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Suspense fallback={<ComponentLoader name="Centre de Commande IA" />}>
            <QuantumCard
              variant="holographic"
              data={{ type: 'ai-metrics', values: [85, 92, 78, 95] }}
              className="h-full"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Brain className="h-8 w-8 text-purple-400" />
                    Centre de Commande IA
                  </h2>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="h-6 w-6 text-green-400" />
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur">
                    <span>Modèles Actifs</span>
                    <span className="text-2xl font-bold">7</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur">
                    <span>Requêtes/min</span>
                    <span className="text-2xl font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur">
                    <span>Précision Moyenne</span>
                    <span className="text-2xl font-bold">98.7%</span>
                  </div>
                </div>

                <motion.button
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ouvrir le Centre IA
                </motion.button>
              </div>
            </QuantumCard>
          </Suspense>

          <Suspense fallback={<ComponentLoader name="Métriques Globales" />}>
            <QuantumCard
              variant="neural"
              data={{ type: 'network', nodes: 50 }}
              className="h-full"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Globe className="h-8 w-8 text-blue-400" />
                    Métriques Globales
                  </h2>
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur">
                    <div className="text-3xl font-bold text-blue-400">24.7K</div>
                    <div className="text-sm text-gray-400">Utilisateurs Actifs</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur">
                    <div className="text-3xl font-bold text-green-400">€1.2M</div>
                    <div className="text-sm text-gray-400">Revenue MTD</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur">
                    <div className="text-3xl font-bold text-purple-400">342</div>
                    <div className="text-sm text-gray-400">Projets Actifs</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur">
                    <div className="text-3xl font-bold text-orange-400">98.9%</div>
                    <div className="text-sm text-gray-400">Satisfaction</div>
                  </div>
                </div>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </QuantumCard>
          </Suspense>
        </div>

        {/* AI Orchestrator Section */}
        <Suspense fallback={<ComponentLoader name="Orchestrateur IA" />}>
          <QuantumCard variant="dimensional" className="mb-12">
            <AIOrchestrator />
          </QuantumCard>
        </Suspense>

        {/* Floating Action Button */}
        <Suspense fallback={null}>
          <FloatingActionButton actions={floatingActions} />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminDashboardOptimized;