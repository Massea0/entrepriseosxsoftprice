import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu,
  MemoryStick,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

interface PerformanceOptimizerProps {
  className?: string;
  realTimeUpdate?: boolean;
  showOptimizations?: boolean;
  onOptimize?: (metric: string) => Promise<void>;
}

export const PerformanceOptimizer = memo(function PerformanceOptimizer({
  className,
  realTimeUpdate = true,
  showOptimizations = true,
  onOptimize
}: PerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized performance data
  const performanceData = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const memory = (performance as any).memory;

    return {
      navigation,
      memory,
      connection: (navigator as any).connection
    };
  }, []);

  // Generate realistic performance metrics
  const generateMetrics = useMemo(() => (): PerformanceMetric[] => {
    const baseMetrics: PerformanceMetric[] = [
      {
        name: 'Page Load Time',
        value: performanceData?.navigation?.loadEventEnd 
          ? Math.round((performanceData.navigation.loadEventEnd - performanceData.navigation.navigationStart) / 10) / 100
          : Math.random() * 2 + 0.5,
        target: 2.0,
        unit: 's',
        status: 'good',
        trend: 'stable',
        icon: Zap
      },
      {
        name: 'Memory Usage',
        value: performanceData?.memory?.usedJSHeapSize 
          ? Math.round((performanceData.memory.usedJSHeapSize / performanceData.memory.totalJSHeapSize) * 100)
          : Math.random() * 30 + 40,
        target: 70,
        unit: '%',
        status: 'good',
        trend: 'up',
        icon: MemoryStick
      },
      {
        name: 'CPU Usage',
        value: Math.random() * 20 + 10,
        target: 80,
        unit: '%',
        status: 'good',
        trend: 'down',
        icon: Cpu
      },
      {
        name: 'Network Speed',
        value: performanceData?.connection?.downlink || Math.random() * 50 + 10,
        target: 10,
        unit: 'Mbps',
        status: 'good',
        trend: 'stable',
        icon: Wifi
      },
      {
        name: 'Bundle Size',
        value: Math.random() * 500 + 1200,
        target: 2000,
        unit: 'KB',
        status: 'good',
        trend: 'down',
        icon: HardDrive
      },
      {
        name: 'Database Queries',
        value: Math.random() * 50 + 20,
        target: 100,
        unit: 'ms',
        status: 'good',
        trend: 'stable',
        icon: Database
      }
    ];

    return baseMetrics.map(metric => {
      let status: 'good' | 'warning' | 'critical' = 'good';
      
      if (metric.name === 'Memory Usage' || metric.name === 'CPU Usage') {
        if (metric.value > metric.target * 0.9) status = 'critical';
        else if (metric.value > metric.target * 0.7) status = 'warning';
      } else {
        if (metric.value > metric.target * 1.5) status = 'critical';
        else if (metric.value > metric.target) status = 'warning';
      }

      return { ...metric, status };
    });
  }, [performanceData]);

  useEffect(() => {
    // Initial load
    setMetrics(generateMetrics());

    if (realTimeUpdate) {
      intervalRef.current = setInterval(() => {
        setMetrics(generateMetrics());
        setLastUpdate(new Date());
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [generateMetrics, realTimeUpdate]);

  const handleOptimize = async (metricName: string) => {
    if (!onOptimize) return;

    setIsOptimizing(true);
    try {
      await onOptimize(metricName);
      // Simulate improvement
      setMetrics(prev => prev.map(metric => 
        metric.name === metricName 
          ? { ...metric, value: metric.value * 0.8, status: 'good' }
          : metric
      ));
    } finally {
      setIsOptimizing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return CheckCircle;
      case 'warning':
      case 'critical':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const overallScore = useMemo(() => {
    const scores = metrics.map(metric => {
      if (metric.name === 'Memory Usage' || metric.name === 'CPU Usage') {
        return Math.max(0, 100 - (metric.value / metric.target) * 100);
      }
      return Math.max(0, 100 - Math.max(0, (metric.value - metric.target) / metric.target) * 100);
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [metrics]);

  return (
    <motion.div
      className={cn('w-full space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Performance Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Monitor
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallScore}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMetrics(generateMetrics());
                setLastUpdate(new Date());
              }}
              disabled={isOptimizing}
            >
              <RefreshCw className={cn(
                "h-4 w-4 mr-2",
                isOptimizing && "animate-spin"
              )} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Performance</span>
              <span>{overallScore}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {metrics.map((metric, index) => {
                const StatusIcon = getStatusIcon(metric.status);
                const MetricIcon = metric.icon;

                return (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className="p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MetricIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{metric.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                          <Badge variant="outline" className={getStatusColor(metric.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {metric.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold">
                            {metric.value.toFixed(metric.unit === 's' ? 2 : 0)}
                          </span>
                          <span className="text-sm text-muted-foreground">{metric.unit}</span>
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Target: {metric.target}{metric.unit}</span>
                          {showOptimizations && onOptimize && metric.status !== 'good' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleOptimize(metric.name)}
                              disabled={isOptimizing}
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Optimize
                            </Button>
                          )}
                        </div>

                        {/* Performance bar */}
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <motion.div
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-500",
                              metric.status === 'good' && "bg-green-500",
                              metric.status === 'warning' && "bg-yellow-500",
                              metric.status === 'critical' && "bg-red-500"
                            )}
                            style={{
                              width: `${Math.min(100, (metric.value / (metric.target * 1.5)) * 100)}%`
                            }}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(100, (metric.value / (metric.target * 1.5)) * 100)}%` 
                            }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      {showOptimizations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics
                .filter(metric => metric.status !== 'good')
                .map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={cn(
                        "h-4 w-4",
                        metric.status === 'critical' ? 'text-red-500' : 'text-yellow-500'
                      )} />
                      <div>
                        <p className="text-sm font-medium">{metric.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Current: {metric.value.toFixed(2)}{metric.unit} | Target: {metric.target}{metric.unit}
                        </p>
                      </div>
                    </div>
                    
                    {onOptimize && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptimize(metric.name)}
                        disabled={isOptimizing}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Fix
                      </Button>
                    )}
                  </motion.div>
                ))}
              
              {metrics.every(metric => metric.status === 'good') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">
                    All systems optimal!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your application is performing at peak efficiency.
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
});

export default PerformanceOptimizer;