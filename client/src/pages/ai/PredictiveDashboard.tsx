import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Brain, 
  AlertTriangle,
  CheckCircle2,
  Eye,
  Calendar,
  Target,
  DollarSign,
  Users,
  Activity,
  Zap,
  RefreshCw,
  Download
} from 'lucide-react';
import { aiService, useAI } from '@/services/aiService';

interface PredictionMetric {
  name: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  unit: string;
}

interface Anomaly {
  id: string;
  metric: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: string;
  impact: string;
  recommendation: string;
}

interface ForecastData {
  date: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

export default function PredictiveDashboard() {
  const [predictions, setPredictions] = useState<PredictionMetric[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { formatCurrency, formatPrediction } = useAI();

  useEffect(() => {
    loadPredictiveData();
    const interval = setInterval(loadPredictiveData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPredictiveData = async () => {
    setLoading(true);
    try {
      const [predictionsData, anomaliesData, forecastData] = await Promise.all([
        aiService.getPredictions(),
        aiService.getAnomalies(),
        aiService.getForecast('revenue')
      ]);

      setPredictions(predictionsData.predictions || []);
      setAnomalies(anomaliesData || []);
      setForecastData(forecastData || []);
      setLastUpdate(new Date());
      
      toast({
        title: "Données mises à jour",
        description: "Analyse prédictive actualisée avec succès",
      });
    } catch (error) {
      console.error('Error loading predictive data:', error);
      toast({
        title: "Erreur de chargement",
        description: "Utilisation des données de démonstration",
        variant: "destructive",
      });
      // Load mock data for demo
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    setPredictions([
      {
        name: 'Chiffre d\'Affaires',
        currentValue: 245000,
        predictedValue: 267000,
        confidence: 94,
        trend: 'up',
        timeframe: '30 jours',
        unit: '€'
      },
      {
        name: 'Nouveaux Clients',
        currentValue: 23,
        predictedValue: 31,
        confidence: 87,
        trend: 'up',
        timeframe: '30 jours',
        unit: ''
      },
      {
        name: 'Taux de Rétention',
        currentValue: 89,
        predictedValue: 92,
        confidence: 91,
        trend: 'up',
        timeframe: '90 jours',
        unit: '%'
      },
      {
        name: 'Coûts Opérationnels',
        currentValue: 85000,
        predictedValue: 78000,
        confidence: 83,
        trend: 'down',
        timeframe: '30 jours',
        unit: '€'
      }
    ]);

    setAnomalies([
      {
        id: '1',
        metric: 'Temps de réponse support',
        severity: 'high',
        description: 'Augmentation de 340% du temps de réponse',
        detectedAt: '2025-01-15T10:30:00Z',
        impact: 'Risque de mécontentement client',
        recommendation: 'Affecter plus de ressources au support'
      },
      {
        id: '2',
        metric: 'Conversion prospects',
        severity: 'medium',
        description: 'Baisse de 15% du taux de conversion',
        detectedAt: '2025-01-15T08:15:00Z',
        impact: 'Perte de revenus potentielle',
        recommendation: 'Revoir la stratégie de nurturing'
      }
    ]);

    setForecastData([
      { date: '2025-01-15', actual: 245000, predicted: 245000, confidence: 100 },
      { date: '2025-01-22', predicted: 250000, confidence: 96 },
      { date: '2025-01-29', predicted: 256000, confidence: 94 },
      { date: '2025-02-05', predicted: 261000, confidence: 92 },
      { date: '2025-02-12', predicted: 267000, confidence: 89 }
    ]);
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '€') {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(value);
    }
    return `${value.toLocaleString('fr-FR')}${unit}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8  mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Analyse prédictive en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Prédictif IA
            </h1>
            <p className="text-muted-foreground">
              Analyse prédictive avancée avec détection d'anomalies • Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadPredictiveData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* AI Status */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">IA Prédictive Synapse Active</h3>
                <p className="text-sm text-muted-foreground">97% de précision • Analyse en temps réel</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full "></div>
              <span className="text-sm font-medium">En ligne</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predictions">Prédictions</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="forecast">Prévisions</TabsTrigger>
          </TabsList>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictions.map((prediction, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      {prediction.name}
                      {getTrendIcon(prediction.trend)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-sm text-muted-foreground">Actuel</div>
                        <div className="text-xl font-bold">
                          {formatValue(prediction.currentValue, prediction.unit)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Prédit ({prediction.timeframe})</div>
                        <div className="text-xl font-bold text-blue-600">
                          {formatValue(prediction.predictedValue, prediction.unit)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confiance IA</span>
                        <span className="font-medium">{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Évolution: {((prediction.predictedValue - prediction.currentValue) / prediction.currentValue * 100).toFixed(1)}%
                      </span>
                      <Badge variant={prediction.trend === 'up' ? 'default' : prediction.trend === 'down' ? 'destructive' : 'secondary'}>
                        {prediction.trend === 'up' ? 'Hausse' : prediction.trend === 'down' ? 'Baisse' : 'Stable'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="space-y-6">
            <div className="grid gap-4">
              {anomalies.map((anomaly) => (
                <Card key={anomaly.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <h3 className="font-semibold">{anomaly.metric}</h3>
                          <Badge>
                            <span className={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity}
                            </span>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {anomaly.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Impact</h4>
                            <p className="text-sm text-muted-foreground">{anomaly.impact}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Recommandation</h4>
                            <p className="text-sm text-muted-foreground">{anomaly.recommendation}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(anomaly.detectedAt).toLocaleString('fr-FR')}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Analyser
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Marquer résolu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {anomalies.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Aucune anomalie détectée</h3>
                  <p className="text-muted-foreground">
                    Tous vos indicateurs sont dans les paramètres normaux
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Prévisions Chiffre d'Affaires
                </CardTitle>
                <CardDescription>
                  Projection sur les 30 prochains jours avec niveaux de confiance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium w-20">
                          {new Date(data.date).toLocaleDateString('fr-FR', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          {data.actual && (
                            <Badge variant="outline">
                              <span className="bg-green-50 text-green-700 px-1 rounded">
                                Réel: {formatValue(data.actual, '€')}
                              </span>
                            </Badge>
                          )}
                          <Badge variant="outline">
                            <span className="bg-blue-50 text-blue-700 px-1 rounded">
                              Prédit: {formatValue(data.predicted, '€')}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Confiance</span>
                            <span>{data.confidence}%</span>
                          </div>
                          <Progress value={data.confidence} className="h-1" />
                        </div>
                        {data.confidence >= 90 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {data.confidence < 80 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600">+9%</div>
                  <div className="text-sm text-muted-foreground">Croissance prédite</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-600">22K€</div>
                  <div className="text-sm text-muted-foreground">Revenus additionnels</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-muted-foreground">Précision moyenne</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
