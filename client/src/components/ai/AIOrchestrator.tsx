import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Target,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AITask {
  id: string;
  name: string;
  type: 'analysis' | 'optimization' | 'prediction' | 'automation';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
  startTime?: Date;
  completionTime?: Date;
  result?: any;
  dependencies?: string[];
}

interface AIModelStatus {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'error';
  load: number;
  tasks: number;
  accuracy: number;
}

export const AIOrchestrator: React.FC = () => {
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [models, setModels] = useState<AIModelStatus[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [globalMetrics, setGlobalMetrics] = useState({
    tasksCompleted: 0,
    avgAccuracy: 0,
    systemLoad: 0,
    uptime: 0
  });

  // Initialisation des modèles IA
  useEffect(() => {
    const initialModels: AIModelStatus[] = [
      {
        id: 'gpt-4-vision',
        name: 'GPT-4 Vision',
        status: 'idle',
        load: 15,
        tasks: 0,
        accuracy: 96.5
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        status: 'busy',
        load: 73,
        tasks: 3,
        accuracy: 98.2
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        status: 'idle',
        load: 28,
        tasks: 1,
        accuracy: 94.7
      },
      {
        id: 'custom-analyzer',
        name: 'Arcadis Analyzer',
        status: 'busy',
        load: 56,
        tasks: 2,
        accuracy: 97.8
      }
    ];

    setModels(initialModels);

    // Génération de tâches de démonstration
    const demoTasks: AITask[] = [
      {
        id: 'task-1',
        name: 'Analyse des performances RH Q4',
        type: 'analysis',
        status: 'running',
        progress: 67,
        priority: 'high',
        estimatedTime: 120,
        startTime: new Date(Date.now() - 45000)
      },
      {
        id: 'task-2',
        name: 'Optimisation workflow financier',
        type: 'optimization',
        status: 'queued',
        progress: 0,
        priority: 'medium',
        estimatedTime: 180
      },
      {
        id: 'task-3',
        name: 'Prédiction revenus 2025',
        type: 'prediction',
        status: 'completed',
        progress: 100,
        priority: 'critical',
        estimatedTime: 240,
        completionTime: new Date(Date.now() - 120000)
      },
      {
        id: 'task-4',
        name: 'Automatisation emails clients',
        type: 'automation',
        status: 'running',
        progress: 34,
        priority: 'low',
        estimatedTime: 90,
        startTime: new Date(Date.now() - 20000)
      }
    ];

    setTasks(demoTasks);
  }, []);

  // Simulation de l'orchestration IA
  useEffect(() => {
    if (!isOrchestrating) return;

    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(100, task.progress + Math.random() * 15);
          
          if (newProgress >= 100) {
            return {
              ...task,
              status: 'completed',
              progress: 100,
              completionTime: new Date()
            };
          }
          
          return {
            ...task,
            progress: newProgress
          };
        }
        return task;
      }));

      // Mise à jour des métriques globales
      setGlobalMetrics(prev => ({
        tasksCompleted: prev.tasksCompleted + Math.random() > 0.8 ? 1 : 0,
        avgAccuracy: 95 + Math.random() * 5,
        systemLoad: 30 + Math.random() * 40,
        uptime: prev.uptime + 1
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isOrchestrating]);

  const startOrchestration = () => {
    setIsOrchestrating(true);
    // Démarrer les tâches en attente
    setTasks(prev => prev.map(task => 
      task.status === 'queued' ? { ...task, status: 'running', startTime: new Date() } : task
    ));
  };

  const pauseOrchestration = () => {
    setIsOrchestrating(false);
  };

  const resetTasks = () => {
    setIsOrchestrating(false);
    setTasks(prev => prev.map(task => ({
      ...task,
      status: 'queued',
      progress: 0,
      startTime: undefined,
      completionTime: undefined
    })));
  };

  const getTaskIcon = (type: AITask['type']) => {
    switch (type) {
      case 'analysis': return TrendingUp;
      case 'optimization': return Target;
      case 'prediction': return Brain;
      case 'automation': return Settings;
      default: return Activity;
    }
  };

  const getStatusColor = (status: AITask['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'running': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      case 'queued': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: AITask['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getModelStatusColor = (status: AIModelStatus['status']) => {
    switch (status) {
      case 'busy': return 'text-orange-400';
      case 'error': return 'text-red-400';
      case 'idle': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOrchestrating ? 360 : 0 }}
            transition={{ 
              duration: 2, 
              repeat: isOrchestrating ? Infinity : 0, 
              ease: "linear" 
            }}
          >
            <Brain className="h-8 w-8 text-purple-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold">AI Orchestrator</h2>
            <p className="text-sm text-gray-400">
              Gestion intelligente des tâches IA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={startOrchestration}
            disabled={isOrchestrating}
            className="bg-green-500 hover:bg-green-600"
          >
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
          <Button
            onClick={pauseOrchestration}
            disabled={!isOrchestrating}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button
            onClick={resetTasks}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white/5 backdrop-blur rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Tâches Complétées</span>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{globalMetrics.tasksCompleted}</div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Précision Moyenne</span>
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">{globalMetrics.avgAccuracy.toFixed(1)}%</div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Charge Système</span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold">{globalMetrics.systemLoad.toFixed(0)}%</div>
          <Progress value={globalMetrics.systemLoad} className="h-1 mt-2" />
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Temps Actif</span>
            <Clock className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold">{Math.floor(globalMetrics.uptime / 60)}h {globalMetrics.uptime % 60}m</div>
        </motion.div>
      </div>

      {/* Modèles IA */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Modèles IA Actifs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              className="bg-white/5 backdrop-blur rounded-lg p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{model.name}</span>
                <Badge 
                  className={cn("text-xs", getModelStatusColor(model.status))}
                  variant="outline"
                >
                  {model.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Charge: {model.load}%</span>
                <span>Tâches: {model.tasks}</span>
                <span>Précision: {model.accuracy}%</span>
              </div>
              <Progress value={model.load} className="h-1 mt-2" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Tâches en Cours</h3>
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => {
            const IconComponent = getTaskIcon(task.type);
            return (
              <motion.div
                key={task.id}
                className="bg-white/5 backdrop-blur rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-blue-400" />
                    <div>
                      <h4 className="font-medium">{task.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                    <div className={cn("flex items-center gap-1", getStatusColor(task.status))}>
                      {task.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                      {task.status === 'running' && <Activity className="h-4 w-4 animate-pulse" />}
                      {task.status === 'failed' && <AlertTriangle className="h-4 w-4" />}
                      {task.status === 'queued' && <Clock className="h-4 w-4" />}
                      <span className="text-sm capitalize">{task.status}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Progression</span>
                    <span>{Math.round(task.progress)}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Temps estimé: {task.estimatedTime}s</span>
                    {task.startTime && (
                      <span>
                        Démarré: {task.startTime.toLocaleTimeString()}
                      </span>
                    )}
                    {task.completionTime && (
                      <span>
                        Terminé: {task.completionTime.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};