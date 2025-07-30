import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
// import { supabase } // Migrated from Supabase to Express API
import { usePageInsights } from '@/hooks/usePageInsights';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Eye,
  MessageSquare,
  Activity,
  Star,
  Lightbulb,
  Rocket,
  Shield
} from 'lucide-react';

interface SynapseInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'critical';
  category: string;
  title: string;
  description: string;
  action?: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  priority: number;
}

interface SynapseInsightsProps {
  context?: string;
  entityId?: string;
  entityType?: string;
  compact?: boolean;
  maxInsights?: number;
}

export const SynapseInsights: React.FC<SynapseInsightsProps> = ({
  context = 'global',
  entityId,
  entityType,
  compact = false,
  maxInsights = 3
}) => {
  const { toast } = useToast();
  const { 
    insights: pageInsights, 
    loading, 
    currentPageContext, 
    refreshInsights,
    clearInsights 
  } = usePageInsights();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Convertir les insights de page en format SynapseInsight
  const insights: SynapseInsight[] = pageInsights.map(pi => ({
    id: pi.id,
    type: pi.type,
    category: pi.pageContext,
    title: pi.title,
    description: pi.description,
    confidence: pi.confidence,
    impact: pi.type === 'critical' ? 'high' : pi.type === 'warning' ? 'medium' : 'low',
    priority: pi.type === 'critical' ? 1 : pi.type === 'warning' ? 2 : 3,
    action: 'Voir détails'
  }));

  const runDeepAnalysis = async () => {
    setIsAnalyzing(true);
    toast({
      title: "🧠 Analyse approfondie en cours",
      description: `Synapse analyse ${currentPageContext}...`
    });

    try {
      // Régénérer les insights pour la page actuelle
      await refreshInsights();
      
      toast({
        title: "✨ Analyse approfondie terminée",
        description: `Insights mis à jour pour ${currentPageContext}`
      });

    } catch (error) {
      console.error('Erreur analyse approfondie:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'analyse",
        description: "Impossible d'effectuer l'analyse approfondie"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-orange-100 text-orange-600',
      high: 'bg-red-100 text-red-600'
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  const renderInsight = (insight: SynapseInsight, index: number) => (
    <div
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${getTypeColor(insight.type)} overflow-hidden h-full`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 dark:bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="relative h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3 flex-1">
          <div className="p-2 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm flex-shrink-0">
            {getTypeIcon(insight.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <h4 className="font-bold text-sm leading-tight">{insight.title}</h4>
              <Badge className={`text-xs font-medium ${getImpactBadge(insight.impact)} border-white/30 flex-shrink-0`}>
                {insight.impact}
              </Badge>
            </div>
            <p className="text-xs opacity-95 mb-3 leading-relaxed line-clamp-3">
              {insight.description}
            </p>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-1 bg-white/20 dark:bg-white/10 px-2 py-1 rounded-full">
                <Target className="h-3 w-3" />
                <span className="font-medium">{Math.round(insight.confidence * 100)}%</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 dark:bg-white/10 px-2 py-1 rounded-full">
                <BarChart3 className="h-3 w-3" />
                <span className="font-medium text-xs">{insight.category}</span>
              </div>
            </div>
          </div>
        </div>
        
        {insight.action && (
          <div className="mt-auto pt-3 border-t border-white/30">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs h-7 px-3 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm font-medium w-full"
            >
              <Rocket className="h-3 w-3 mr-1" />
              {insight.action}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-sm">
            <Brain className="h-4 w-4 text-white " />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-purple-700">🧠 Synapse</span>
              {insights.length > 0 && (
                <Badge variant="outline" className="text-xs bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300">
                  {insights.length} insight{insights.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <span className="text-xs text-purple-600 opacity-90">IA Contextuelle Active</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {insights.length > 0 && (
            <div className="flex -space-x-1">
              {insights.slice(0, 3).map((insight, i) => (
                <div 
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs ${
                    insight.type === 'success' ? 'bg-green-100 text-green-600' :
                    insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    insight.type === 'critical' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}
                >
                  {getTypeIcon(insight.type)}
                </div>
              ))}
            </div>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 px-3 text-xs bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
            onClick={runDeepAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Activity className="h-3 w-3  mr-1" />
                Analyse...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Analyser
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                🧠 Synapse Insights
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                Intelligence Artificielle Contextuelle
              </span>
            </div>
            <Badge variant="outline" className="bg-white/90 dark:bg-gray-800/90 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 shadow-sm">
              IA Active
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-3">
            {insights.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-gray-700/50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full "></div>
                <span className="text-xs font-medium text-green-700">
                  {insights.length} insight{insights.length > 1 ? 's' : ''} actif{insights.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
              onClick={runDeepAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="h-4 w-4  mr-2" />
                  Analyse...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyse profonde
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} >
                <div className="h-20 bg-gradient-to-r from-white/60 to-white/40 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative">
              <Brain className="h-16 w-16 mx-auto text-purple-300 mb-4" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-200 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Synapse en veille</h3>
            <p className="text-muted-foreground mb-4">
              Aucun insight disponible pour le moment
            </p>
            <p className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
              L'IA analyse votre contexte en temps réel
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Organiser les insights selon la logique demandée */}
            {insights.length === 1 && (
              <div className="w-full">
                {renderInsight(insights[0], 0)}
              </div>
            )}
            
            {insights.length === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {insights.map((insight, index) => (
                  <div key={insight.id}>
                    {renderInsight(insight, index)}
                  </div>
                ))}
              </div>
            )}
            
            {insights.length === 3 && (
              <div className="grid grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                  <div key={insight.id}>
                    {renderInsight(insight, index)}
                  </div>
                ))}
              </div>
            )}
            
            {insights.length >= 4 && (
              <div className="space-y-4">
                {/* Première ligne : 3 insights */}
                <div className="grid grid-cols-3 gap-4">
                  {insights.slice(0, 3).map((insight, index) => (
                    <div key={insight.id}>
                      {renderInsight(insight, index)}
                    </div>
                  ))}
                </div>
                
                {/* Lignes suivantes : organiser le reste */}
                {insights.slice(3).length > 0 && (
                  <div className={`grid gap-4 ${
                    insights.slice(3).length === 1 ? 'grid-cols-1' :
                    insights.slice(3).length === 2 ? 'grid-cols-2' : 
                    'grid-cols-3'
                  }`}>
                    {insights.slice(3).map((insight, index) => (
                      <div key={insight.id}>
                        {renderInsight(insight, index + 3)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-white/30 bg-gradient-to-r from-purple-50/50 to-blue-50/50 -mx-6 px-6 -mb-6 pb-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-purple-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full "></div>
                <Activity className="h-4 w-4" />
                <span className="font-medium">Système IA actif</span>
              </div>
              <div className="w-px h-4 bg-purple-300"></div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Contexte: {currentPageContext}</span>
              </div>
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-300 bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
              Dernière analyse: maintenant
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};