import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Shield, 
  Rocket,
  Globe,
  Activity,
  Layers3,
  Sparkles
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { QuantumWorkspace } from '@/components/innovation/QuantumWorkspace';
import { AIWorkspaceManager } from '@/components/innovation/AIWorkspaceManager';
import { HolographicDashboard } from '@/components/innovation/HolographicDashboard';
import { lazyWithRetry } from '@/utils/lazyWithRetry';

// Lazy load components
const PerformanceMonitor = lazyWithRetry(() => import('@/components/performance/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitor })));
const AnimatedMetricCard = lazyWithRetry(() => import('@/components/ui/animated-metric-card').then(m => ({ default: m.AnimatedMetricCard })));

const QuantumAdminDashboard = () => {
  const metrics = [
    {
      title: "Quantum Performance",
      value: 98.7,
      unit: "%",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      trend: "up" as const,
      trendValue: "+15.3%",
      onClick: () => console.log("Quantum Performance clicked")
    },
    {
      title: "Neural Networks",
      value: 7,
      unit: "active",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up" as const,
      trendValue: "+2 new",
      onClick: () => console.log("Neural Networks clicked")
    },
    {
      title: "Security Matrix",
      value: 100,
      unit: "%",
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
      trend: "neutral" as const,
      trendValue: "Quantum Safe",
      onClick: () => console.log("Security clicked")
    },
    {
      title: "Innovation Index",
      value: 97.2,
      unit: "pts",
      icon: Rocket,
      gradient: "from-orange-500 to-red-500",
      trend: "up" as const,
      trendValue: "+12.8",
      onClick: () => console.log("Innovation clicked")
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white p-6">
        {/* Floating Performance Monitor */}
        <Suspense fallback={null}>
          <div className="fixed top-20 right-4 z-50">
            <PerformanceMonitor compact showDetails />
          </div>
        </Suspense>

        {/* Header with Quantum branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Layers3 className="h-12 w-12 text-purple-400" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-12 w-12 text-pink-400" />
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Quantum Enterprise OS
              </h1>
              <p className="text-xl text-gray-400 mt-2">L'avenir de la gestion d'entreprise quantique</p>
            </div>
          </div>
        </motion.div>

        {/* Quantum Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Suspense key={metric.title} fallback={<div className="h-32 bg-white/5 rounded-lg " />}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <AnimatedMetricCard
                  {...metric}
                  delay={index * 100}
                  animateValue
                />
              </motion.div>
            </Suspense>
          ))}
        </div>

        {/* Main Quantum Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* AI Workspace Manager */}
          <div className="xl:col-span-2">
            <QuantumWorkspace
              variant="quantum"
              emotionalState="focused"
              adaptiveMode={true}
              className="h-full min-h-[600px]"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="h-8 w-8 text-purple-400" />
                  <h2 className="text-2xl font-bold">Intelligence Artificielle Quantique</h2>
                </div>
                
                <AIWorkspaceManager
                  userRole="admin"
                  currentModule="quantum-dashboard"
                  contextData={{}}
                />
              </div>
            </QuantumWorkspace>
          </div>

          {/* Holographic Data Visualization */}
          <div className="space-y-6">
            <QuantumWorkspace
              variant="holographic"
              emotionalState="analytical"
              className="h-[300px]"
            >
              <div className="h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-lg font-semibold">Visualisation Holographique</h3>
                </div>
                <HolographicDashboard
                  data={[]}
                  width={350}
                  height={200}
                  interactive={true}
                />
              </div>
            </QuantumWorkspace>

            <QuantumWorkspace
              variant="neural"
              emotionalState="creative"
              className="h-[280px]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold">Réseau Neural</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">7</div>
                    <div className="text-sm text-gray-400">Modèles Actifs</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">1.2K</div>
                    <div className="text-sm text-gray-400">Requêtes/min</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">98.7%</div>
                    <div className="text-sm text-gray-400">Précision</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400">4.2s</div>
                    <div className="text-sm text-gray-400">Latence Moy.</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">État Quantique</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '87%' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">87%</span>
                  </div>
                </div>
              </div>
            </QuantumWorkspace>
          </div>
        </div>

        {/* Quantum Status Bar */}
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-xl rounded-full px-6 py-3 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full " />
              <span className="text-gray-300">Quantum State: Active</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span className="text-gray-300">Neural Processing: 98.7%</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-blue-400" />
              <span className="text-gray-300">Global Sync: Online</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default QuantumAdminDashboard;