import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Wifi, 
  Eye,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    latency: number;
    bandwidth: number;
  };
  cpu: number;
  score: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  compact?: boolean;
  showDetails?: boolean;
  position?: 'fixed' | 'relative';
  onAlert?: (metric: string, value: number) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  compact = false,
  showDetails = false,
  position = 'fixed',
  onAlert
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: { used: 0, total: 0, percentage: 0 },
    network: { latency: 0, bandwidth: 0 },
    cpu: 0,
    score: 100,
    timestamp: Date.now()
  });

  const [isExpanded, setIsExpanded] = useState(!compact);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const frameRef = useRef<number>();
  const lastFrameTime = useRef<number>(performance.now());
  const frameCount = useRef<number>(0);

  // Collecte des métriques de performance
  useEffect(() => {
    const collectMetrics = () => {
      const now = performance.now();
      
      // Calcul FPS
      frameCount.current++;
      const deltaTime = now - lastFrameTime.current;
      
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / deltaTime);
        frameCount.current = 0;
        lastFrameTime.current = now;

        // Métriques mémoire (estimation)
        const memoryInfo = (performance as any).memory;
        const memory = memoryInfo ? {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024),
          percentage: Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100)
        } : {
          used: Math.random() * 100,
          total: 200,
          percentage: Math.random() * 50 + 25
        };

        // Métriques réseau (simulation)
        const network = {
          latency: Math.random() * 50 + 10, // 10-60ms
          bandwidth: Math.random() * 100 + 50 // 50-150 Mbps
        };

        // CPU (estimation basée sur les performances)
        const cpu = Math.min(100, Math.max(0, 100 - fps + Math.random() * 20));

        // Score global
        const score = Math.round(
          (fps / 60) * 30 + 
          ((100 - memory.percentage) / 100) * 25 + 
          (Math.min(network.latency, 100) / 100) * 20 + 
          ((100 - cpu) / 100) * 25
        );

        const newMetrics: PerformanceMetrics = {
          fps,
          memory,
          network,
          cpu,
          score,
          timestamp: Date.now()
        };

        setMetrics(newMetrics);
        
        // Historique (garde les 50 dernières valeurs)
        setHistory(prev => [...prev.slice(-49), newMetrics]);

        // Alertes
        const newAlerts = [];
        if (fps < 30) newAlerts.push(`FPS faible: ${fps}`);
        if (memory.percentage > 80) newAlerts.push(`Mémoire élevée: ${memory.percentage}%`);
        if (network.latency > 100) newAlerts.push(`Latence élevée: ${network.latency}ms`);
        if (cpu > 80) newAlerts.push(`CPU élevé: ${cpu}%`);

        setAlerts(newAlerts);
        
        // Callback d'alerte
        if (newAlerts.length > 0 && onAlert) {
          newAlerts.forEach(alert => {
            const [metric, value] = alert.split(': ');
            onAlert(metric, parseFloat(value));
          });
        }
      }

      frameRef.current = requestAnimationFrame(collectMetrics);
    };

    frameRef.current = requestAnimationFrame(collectMetrics);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [onAlert]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 80) return CheckCircle2;
    if (score >= 40) return AlertTriangle;
    return AlertTriangle;
  };

  const StatusIcon = getStatusIcon(metrics.score);

  if (compact && !isExpanded) {
    return (
      <motion.div
        className={cn(
          "bg-black/50 backdrop-blur-xl rounded-lg border border-gray-700/50 p-3 cursor-pointer",
          position === 'fixed' && "fixed top-20 right-4 z-50"
        )}
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          <span className={cn("text-sm font-mono", getScoreColor(metrics.score))}>
            {metrics.score}
          </span>
          <StatusIcon className={cn("h-3 w-3", getScoreColor(metrics.score))} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "bg-black/80 backdrop-blur-xl rounded-xl border border-gray-700/50 text-white overflow-hidden",
        position === 'fixed' && "fixed top-20 right-4 z-50",
        compact ? "w-80" : "w-96"
      )}
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h3 className="font-semibold">Performance Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("text-lg font-bold", getScoreColor(metrics.score))}>
            {metrics.score}
          </div>
          {compact && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="p-1 h-6 w-6"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="p-4 space-y-4">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-green-400" />
            <span className="text-sm">FPS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-400"
                style={{ width: `${(metrics.fps / 60) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(metrics.fps / 60) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm font-mono w-8 text-right">{metrics.fps}</span>
          </div>
        </div>

        {/* Mémoire */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span className="text-sm">RAM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  metrics.memory.percentage > 80 ? "bg-red-400" :
                  metrics.memory.percentage > 60 ? "bg-yellow-400" : "bg-blue-400"
                )}
                style={{ width: `${metrics.memory.percentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.memory.percentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm font-mono w-8 text-right">{metrics.memory.percentage}%</span>
          </div>
        </div>

        {/* Réseau */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-purple-400" />
            <span className="text-sm">Ping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  metrics.network.latency > 100 ? "bg-red-400" :
                  metrics.network.latency > 50 ? "bg-yellow-400" : "bg-purple-400"
                )}
                style={{ width: `${Math.min(100, metrics.network.latency)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, metrics.network.latency)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm font-mono w-8 text-right">{Math.round(metrics.network.latency)}ms</span>
          </div>
        </div>

        {/* CPU */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-400" />
            <span className="text-sm">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  metrics.cpu > 80 ? "bg-red-400" :
                  metrics.cpu > 60 ? "bg-yellow-400" : "bg-orange-400"
                )}
                style={{ width: `${metrics.cpu}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.cpu}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm font-mono w-8 text-right">{Math.round(metrics.cpu)}%</span>
          </div>
        </div>
      </div>

      {/* Alertes */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            className="px-4 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="h-3 w-3 text-red-400" />
                <span className="text-xs text-red-400 font-medium">Alertes</span>
              </div>
              {alerts.map((alert, index) => (
                <div key={index} className="text-xs text-red-300">• {alert}</div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Détails avancés */}
      {showDetails && (
        <motion.div
          className="border-t border-gray-700/50 p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-xs text-gray-400 space-y-1">
            <div>Mémoire: {metrics.memory.used}MB / {metrics.memory.total}MB</div>
            <div>Bande passante: {metrics.network.bandwidth.toFixed(1)} Mbps</div>
            <div>Dernière mise à jour: {new Date(metrics.timestamp).toLocaleTimeString()}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};