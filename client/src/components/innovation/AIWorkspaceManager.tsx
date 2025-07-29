import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Target, 
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WorkspaceTask {
  id: string;
  title: string;
  type: 'document' | 'meeting' | 'analysis' | 'communication' | 'planning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  aiConfidence: number;
  estimatedTime: number;
  status: 'suggested' | 'accepted' | 'in-progress' | 'completed';
  context: string;
  aiReasoning: string;
}

interface AIWorkspaceManagerProps {
  userRole: 'admin' | 'manager' | 'employee' | 'client';
  currentModule: string;
  contextData?: any;
}

export const AIWorkspaceManager: React.FC<AIWorkspaceManagerProps> = ({
  userRole,
  currentModule,
  contextData
}) => {
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [workspaceOptimization, setWorkspaceOptimization] = useState(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  // Génération intelligente de tâches basée sur le contexte
  useEffect(() => {
    generateWorkspaceTasks();
  }, [userRole, currentModule, contextData]);

  const generateWorkspaceTasks = async () => {
    setIsGenerating(true);
    
    // Simulation de génération IA avancée
    await new Promise(resolve => setTimeout(resolve, 2000));

    const roleTasks = {
      admin: [
        {
          id: 'admin-1',
          title: 'Analyser les métriques de performance système',
          type: 'analysis' as const,
          priority: 'high' as const,
          aiConfidence: 0.92,
          estimatedTime: 15,
          status: 'suggested' as const,
          context: 'Performance du système en baisse de 5%',
          aiReasoning: 'Détection d\'anomalies dans les logs système'
        },
        {
          id: 'admin-2',
          title: 'Préparer rapport exécutif mensuel',
          type: 'document' as const,
          priority: 'medium' as const,
          aiConfidence: 0.88,
          estimatedTime: 30,
          status: 'suggested' as const,
          context: 'Échéance dans 3 jours',
          aiReasoning: 'Basé sur vos habitudes de reporting'
        }
      ],
      manager: [
        {
          id: 'mgr-1',
          title: 'Réunion one-on-one avec équipe',
          type: 'meeting' as const,
          priority: 'high' as const,
          aiConfidence: 0.95,
          estimatedTime: 60,
          status: 'suggested' as const,
          context: '3 membres n\'ont pas eu de suivi cette semaine',
          aiReasoning: 'Détection de besoins d\'accompagnement'
        }
      ],
      employee: [
        {
          id: 'emp-1',
          title: 'Compléter formation obligatoire sécurité',
          type: 'planning' as const,
          priority: 'urgent' as const,
          aiConfidence: 0.98,
          estimatedTime: 45,
          status: 'suggested' as const,
          context: 'Échéance dans 2 jours',
          aiReasoning: 'Formation en retard, impact compliance'
        }
      ],
      client: [
        {
          id: 'client-1',
          title: 'Réviser proposition commerciale',
          type: 'document' as const,
          priority: 'medium' as const,
          aiConfidence: 0.85,
          estimatedTime: 20,
          status: 'suggested' as const,
          context: 'Nouveau devis reçu',
          aiReasoning: 'Optimisation basée sur vos préférences'
        }
      ]
    };

    setTasks(roleTasks[userRole] || []);
    setWorkspaceOptimization(Math.random() * 30 + 70); // 70-100%
    
    setAiInsights([
      'Votre productivité est 23% plus élevée l\'après-midi',
      'Temps optimal pour les réunions: 10h-11h',
      'Recommandation: Grouper les tâches similaires'
    ]);

    setIsGenerating(false);
  };

  const handleTaskAction = (taskId: string, action: 'accept' | 'reject' | 'complete') => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      
      switch (action) {
        case 'accept':
          return { ...task, status: 'in-progress' };
        case 'complete':
          return { ...task, status: 'completed' };
        case 'reject':
          return task; // Remove from suggestions
        default:
          return task;
      }
    }));
  };

  const getTaskIcon = (type: WorkspaceTask['type']) => {
    switch (type) {
      case 'document': return FileText;
      case 'meeting': return Users;
      case 'analysis': return TrendingUp;
      case 'communication': return MessageSquare;
      case 'planning': return Calendar;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: WorkspaceTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="h-8 w-8 text-purple-400" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Workspace Manager
            </h2>
            <p className="text-sm text-gray-400">
              Optimisation intelligente de votre espace de travail
            </p>
          </div>
        </div>

        <Button
          onClick={generateWorkspaceTasks}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-4 w-4 mr-2" />
            </motion.div>
          ) : (
            <Lightbulb className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Analyse...' : 'Optimiser'}
        </Button>
      </div>

      {/* Métriques d'optimisation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="bg-white/5 backdrop-blur rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Optimisation</span>
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">{Math.round(workspaceOptimization)}%</div>
          <Progress value={workspaceOptimization} className="h-1 mt-2" />
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Tâches Suggérées</span>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'suggested').length}</div>
          <div className="text-xs text-gray-400 mt-1">
            {tasks.filter(t => t.status === 'completed').length} complétées
          </div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Temps Économisé</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold">
            {tasks.reduce((acc, task) => acc + (task.status === 'completed' ? task.estimatedTime : 0), 0)}min
          </div>
          <div className="text-xs text-gray-400 mt-1">Cette semaine</div>
        </motion.div>
      </div>

      {/* Tâches suggérées */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          Tâches Intelligentes
        </h3>

        <AnimatePresence mode="popLayout">
          {isGenerating ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center space-y-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-12 w-12 mx-auto text-purple-400" />
                </motion.div>
                <p className="text-gray-400">IA analyse votre contexte...</p>
              </div>
            </motion.div>
          ) : (
            tasks.map((task, index) => {
              const IconComponent = getTaskIcon(task.type);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        <IconComponent className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{task.context}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Confiance IA: {Math.round(task.aiConfidence * 100)}%</span>
                          <span>Temps estimé: {task.estimatedTime}min</span>
                        </div>
                        <details className="mt-2">
                          <summary className="text-xs text-purple-400 cursor-pointer hover:text-purple-300">
                            Voir le raisonnement IA
                          </summary>
                          <p className="text-xs text-gray-400 mt-1 pl-4">{task.aiReasoning}</p>
                        </details>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {task.status === 'suggested' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskAction(task.id, 'reject')}
                          >
                            Ignorer
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleTaskAction(task.id, 'accept')}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Accepter
                          </Button>
                        </>
                      )}
                      {task.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleTaskAction(task.id, 'complete')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Terminer
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <Badge className="bg-green-500/20 text-green-300">
                          ✓ Complété
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Insights IA */}
      {aiInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Insights IA
          </h3>
          <div className="grid gap-2">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm"
              >
                💡 {insight}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};