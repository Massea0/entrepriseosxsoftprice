import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoiceInterface } from './VoiceInterface';
import { useAIContext } from '@/components/ai/AIContextProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  X, 
  MessageSquare,
  Zap,
  Activity,
  Headphones
} from 'lucide-react';

interface EnhancedGlobalVoiceAssistantProps {
  userId?: string;
}

export const EnhancedGlobalVoiceAssistant: React.FC<EnhancedGlobalVoiceAssistantProps> = ({
  userId
}) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    suggestions = [], 
    insights = [], 
    currentModule = 'general',
    isLoading = false 
  } = useAIContext();

  const getContextStats = () => {
    return {
      projectsCount: 0,
      employeesCount: 0,
      companiesCount: 0,
      tasksCount: 0,
      inProgressProjects: 0,
      pendingTasks: 0
    };
  };

  const stats = getContextStats();

  return (
    <>
      {/* Bouton flottant moderne pour assistant vocal */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
            size="lg"
          >
            <div className="flex flex-col items-center">
              <Mic className="h-6 w-6 mb-0.5" />
              <div className="text-xs font-bold">IA</div>
            </div>
          </Button>
          
          {/* Indicateur d'activité vocal */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          
          {/* Badge vocal */}
          <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 shadow-lg">
            Vocal
          </Badge>
        </div>
      </div>

      {/* Interface vocale étendue */}
      {isExpanded && (
        <Card className="fixed bottom-28 right-6 w-[420px] z-40 shadow-2xl border-blue-200/50 bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-md">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Assistant Vocal IA
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-white/80 dark:bg-gray-800/80">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span className="capitalize">{currentModule}</span>
                    </Badge>
                    <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <Activity className="h-3 w-3 mr-1" />
                      En ligne
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-700/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Statistiques contextuelles rapides */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{stats.projectsCount} projets</span>
              </div>
              <div className="bg-green-50 p-2 rounded flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{stats.employeesCount} employés</span>
              </div>
              <div className="bg-orange-50 p-2 rounded flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>{stats.companiesCount} clients</span>
              </div>
              <div className="bg-purple-50 p-2 rounded flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{stats.tasksCount} tâches</span>
              </div>
            </div>

            {/* Interface Assistant Vocal IA */}
            <VoiceInterface 
              userId={userId}
              currentModule={currentModule}
              onInsight={(insight) => toast({
                title: "💡 Insight IA",
                description: insight.message || "Nouvelle recommandation disponible"
              })}
            />

            {/* Instructions d'utilisation améliorées */}
            <div className="text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Assistant Vocal Intelligent</span>
              </div>
              <p className="mb-1">
                <strong>🎙️ Commande :</strong> Dites "Arcadis" suivi de votre question
              </p>
              <p className="mb-1">
                <strong>🔊 Synthèse :</strong> Réponses vocales automatiques
              </p>
              <p>
                <strong>📊 Contexte :</strong> Analyse vos données en temps réel
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};