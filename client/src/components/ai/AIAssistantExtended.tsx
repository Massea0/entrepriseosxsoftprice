import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Zap
} from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'contextual' | 'predictive' | 'automation' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
  action?: () => void;
}

interface AutoCompletion {
  field: string;
  suggestions: string[];
  context: string;
}

interface AIAssistantExtendedProps {
  currentPage?: string;
  userData?: any;
  className?: string;
}

export default function AIAssistantExtended({ 
  currentPage = 'dashboard', 
  userData,
  className 
}: AIAssistantExtendedProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [autoCompletions, setAutoCompletions] = useState<AutoCompletion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<any[]>([]);

  // Générer des suggestions contextuelles
  const generateContextualSuggestions = useCallback(() => {
    const baseSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'contextual',
        title: 'Optimiser votre workflow',
        description: 'Automatisez la création de tâches répétitives pour gagner 2h par jour',
        confidence: 0.85,
        priority: 'high',
        category: 'Productivité'
      },
      {
        id: '2',
        type: 'predictive',
        title: 'Tendance des performances',
        description: 'Votre équipe montre une amélioration de 15% ce mois-ci',
        confidence: 0.92,
        priority: 'medium',
        category: 'Analytics'
      },
      {
        id: '3',
        type: 'automation',
        title: 'Notification intelligente',
        description: 'Configurez des alertes pour les projets à risque de retard',
        confidence: 0.78,
        priority: 'medium',
        category: 'Automation'
      },
      {
        id: '4',
        type: 'optimization',
        title: 'Répartition des ressources',
        description: 'Optimisez l\'allocation d\'équipe pour le prochain sprint',
        confidence: 0.89,
        priority: 'high',
        category: 'Management'
      }
    ];

    setSuggestions(baseSuggestions);
  }, [currentPage, userData]);

  // Analyser le contexte actuel
  const analyzeCurrentContext = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const contextInsights = [
      {
        type: 'performance',
        title: 'Performance de l\'équipe',
        value: '+15%',
        trend: 'up',
        description: 'Amélioration significative par rapport au mois dernier'
      },
      {
        type: 'efficiency',
        title: 'Efficacité des processus',
        value: '87%',
        trend: 'stable',
        description: 'Maintien d\'un niveau d\'efficacité élevé'
      },
      {
        type: 'prediction',
        title: 'Prédiction de charge',
        value: 'Pic prévu',
        trend: 'warning',
        description: 'Augmentation de la charge prévue la semaine prochaine'
      }
    ];
    
    setInsights(contextInsights);
    setIsAnalyzing(false);
  }, []);

  // Auto-completion intelligente
  const getAutoCompletions = useCallback((field: string, value: string) => {
    const completions: { [key: string]: string[] } = {
      project: [
        'Migration système ERP',
        'Refonte interface utilisateur',
        'Optimisation base de données',
        'Formation équipe technique'
      ],
      task: [
        'Révision code source',
        'Tests de performance',
        'Documentation API',
        'Déploiement production'
      ],
      client: [
        'Arcadis Technologies',
        'Orange Sénégal',
        'Sonatel',
        'Banque Atlantique'
      ]
    };

    return completions[field]?.filter(item => 
      item.toLowerCase().includes(value.toLowerCase())
    ) || [];
  }, []);

  // Notifications intelligentes
  const generateSmartNotifications = useCallback(() => {
    const notifications = [
      {
        type: 'deadline',
        message: 'Le projet "Migration ERP" nécessite une attention - deadline dans 3 jours',
        priority: 'high',
        action: 'Voir le projet'
      },
      {
        type: 'performance',
        message: 'Félicitations ! Votre équipe a dépassé les objectifs de 12%',
        priority: 'low',
        action: 'Voir les métriques'
      },
      {
        type: 'optimization',
        message: 'Suggestion : Réorganiser les tâches pour améliorer l\'efficacité',
        priority: 'medium',
        action: 'Optimiser'
      }
    ];

    return notifications;
  }, []);

  useEffect(() => {
    generateContextualSuggestions();
    analyzeCurrentContext();
  }, [generateContextualSuggestions, analyzeCurrentContext]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'contextual': return Lightbulb;
      case 'predictive': return TrendingUp;
      case 'automation': return Zap;
      case 'optimization': return Target;
      default: return Bot;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Assistant IA Étendu
        </CardTitle>
        <CardDescription>
          Suggestions intelligentes et automation avancée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Recherche et Query */}
        <div className="space-y-2">
          <Input
            placeholder="Demandez quelque chose à l'IA..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          <Button className="w-full" disabled={!query.trim()}>
            <Sparkles className="h-4 w-4 mr-2" />
            Analyser avec l'IA
          </Button>
        </div>

        {/* Insights en temps réel */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Insights Temps Réel</h4>
          {isAnalyzing ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 animate-pulse" />
              Analyse en cours...
            </div>
          ) : (
            <div className="grid gap-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{insight.title}</div>
                    <div className="text-xs text-muted-foreground">{insight.description}</div>
                  </div>
                  <Badge variant={insight.trend === 'warning' ? 'destructive' : 'default'}>
                    {insight.value}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions Contextuelles */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Suggestions Intelligentes</h4>
          <div className="grid gap-3">
            {suggestions.map((suggestion) => {
              const Icon = getSuggestionIcon(suggestion.type);
              return (
                <div key={suggestion.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">{suggestion.title}</span>
                    </div>
                    <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Confiance: {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Appliquer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications Intelligentes */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Alertes Intelligentes</h4>
          <div className="space-y-2">
            {generateSmartNotifications().map((notification, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                {notification.type === 'deadline' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                {notification.type === 'performance' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {notification.type === 'optimization' && <Target className="h-4 w-4 text-blue-500" />}
                <div className="flex-1">
                  <p className="text-xs">{notification.message}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-xs h-6">
                  {notification.action}
                </Button>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}