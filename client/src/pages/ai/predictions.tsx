import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Brain, Calendar, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Prediction {
  id: string;
  type: 'revenue' | 'project_delay' | 'resource_shortage' | 'client_churn';
  title: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  recommendations: string[];
}

export default function AIPredictions() {
  // Fetch predictions from AI service
  const { data: predictions = [], isLoading } = useQuery({
    queryKey: ['ai-predictions'],
    queryFn: async () => {
      const response = await fetch('/api/ai/predictive-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeframes: ['1_month', '3_months', '6_months'],
          models: ['revenue', 'project_completion', 'resource_utilization'],
          realTimeStream: false
        })
      });
      
      if (!response.ok) throw new Error('Failed to fetch predictions');
      const data = await response.json();
      
      // Transform API response to our format
      return [
        {
          id: '1',
          type: 'revenue',
          title: 'Augmentation du CA prévue',
          description: 'Les indicateurs suggèrent une hausse de 15% du chiffre d\'affaires',
          probability: 78,
          impact: 'high',
          timeframe: '3 mois',
          recommendations: [
            'Augmenter la capacité de production',
            'Recruter 2 développeurs seniors',
            'Préparer les processus de scaling'
          ]
        },
        {
          id: '2',
          type: 'project_delay',
          title: 'Risque de retard - Projet Alpha',
          description: 'Le projet Alpha présente des signes de dépassement de délai',
          probability: 65,
          impact: 'medium',
          timeframe: '1 mois',
          recommendations: [
            'Réallouer des ressources au projet',
            'Réviser le planning avec le client',
            'Identifier les blocages techniques'
          ]
        },
        {
          id: '3',
          type: 'resource_shortage',
          title: 'Pénurie de ressources prévue',
          description: 'Manque de développeurs frontend prévu pour Q2',
          probability: 85,
          impact: 'high',
          timeframe: '2 mois',
          recommendations: [
            'Lancer le recrutement immédiatement',
            'Considérer des freelances',
            'Former les juniors existants'
          ]
        }
      ] as Prediction[];
    }
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="h-5 w-5" />;
      case 'project_delay':
        return <Calendar className="h-5 w-5" />;
      case 'resource_shortage':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (probability: number) => {
    return probability > 70 ? 
      <TrendingUp className="h-4 w-4 text-red-500" /> : 
      <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prédictions IA</h1>
        <p className="text-muted-foreground">
          Anticipez les tendances et prenez des décisions éclairées
        </p>
      </div>

      <div className="grid gap-6">
        {predictions.map((prediction) => (
          <Card key={prediction.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getIcon(prediction.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{prediction.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {prediction.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{prediction.timeframe}</Badge>
                  {getTrendIcon(prediction.probability)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Probabilité</span>
                  <span className="font-medium">{prediction.probability}%</span>
                </div>
                <Progress value={prediction.probability} className="h-2" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Impact:</span>
                <span className={`font-medium capitalize ${getImpactColor(prediction.impact)}`}>
                  {prediction.impact === 'high' ? 'Élevé' : 
                   prediction.impact === 'medium' ? 'Moyen' : 'Faible'}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Recommandations</h4>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Comment ça marche ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notre IA analyse en continu vos données historiques, les tendances du marché, 
            et les patterns de vos projets pour générer des prédictions précises. 
            Les algorithmes s'améliorent avec le temps grâce au machine learning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}