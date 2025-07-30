import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Clock,
  Zap,
  ChevronRight,
  Sparkles,
  LineChart
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Mock data pour les graphiques
const revenueData = [
  { month: 'Jan', actual: 45000, predicted: 42000 },
  { month: 'Fév', actual: 52000, predicted: 48000 },
  { month: 'Mar', actual: 48000, predicted: 51000 },
  { month: 'Avr', actual: 61000, predicted: 58000 },
  { month: 'Mai', actual: 58000, predicted: 62000 },
  { month: 'Jun', actual: 67000, predicted: 65000 },
  { month: 'Jul', predicted: 72000 },
  { month: 'Août', predicted: 75000 },
  { month: 'Sep', predicted: 78000 },
];

const projectHealthData = [
  { name: 'En retard', value: 15, color: '#ef4444' },
  { name: 'À risque', value: 25, color: '#f59e0b' },
  { name: 'Sur la bonne voie', value: 45, color: '#10b981' },
  { name: 'En avance', value: 15, color: '#3b82f6' },
];

const teamPerformanceData = [
  { skill: 'Productivité', A: 85, fullMark: 100 },
  { skill: 'Qualité', A: 92, fullMark: 100 },
  { skill: 'Communication', A: 78, fullMark: 100 },
  { skill: 'Innovation', A: 88, fullMark: 100 },
  { skill: 'Délais', A: 75, fullMark: 100 },
  { skill: 'Satisfaction', A: 90, fullMark: 100 },
];

export default function AIInsights() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Charger les insights IA
  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights', selectedPeriod],
    queryFn: async () => {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        keyMetrics: {
          revenueGrowth: { value: 23.5, trend: 'up', confidence: 92 },
          projectSuccess: { value: 78, trend: 'stable', confidence: 88 },
          teamUtilization: { value: 82, trend: 'up', confidence: 95 },
          customerSatisfaction: { value: 4.6, trend: 'up', confidence: 90 }
        },
        predictions: [
          {
            id: 1,
            type: 'revenue',
            title: 'Croissance du chiffre d\'affaires',
            description: 'Augmentation prévue de 15% au prochain trimestre',
            probability: 85,
            impact: 'high',
            timeframe: '3 mois'
          },
          {
            id: 2,
            type: 'risk',
            title: 'Surcharge de l\'équipe détectée',
            description: '3 membres clés approchent de la surcharge',
            probability: 72,
            impact: 'medium',
            timeframe: '2 semaines'
          },
          {
            id: 3,
            type: 'opportunity',
            title: 'Opportunité de vente croisée',
            description: '5 clients potentiels pour des services additionnels',
            probability: 68,
            impact: 'high',
            timeframe: '1 mois'
          }
        ],
        anomalies: [
          {
            id: 1,
            severity: 'high',
            type: 'performance',
            description: 'Baisse inhabituelle de productivité détectée sur 2 projets',
            detected: new Date().toISOString()
          },
          {
            id: 2,
            severity: 'medium',
            type: 'budget',
            description: 'Dépassement budgétaire prévu sur le projet Alpha',
            detected: new Date().toISOString()
          }
        ],
        recommendations: [
          {
            id: 1,
            priority: 'high',
            category: 'resource',
            title: 'Réaffecter les ressources',
            description: 'Transférer 2 développeurs du projet Beta vers Alpha',
            expectedImpact: '+15% efficacité'
          },
          {
            id: 2,
            priority: 'medium',
            category: 'process',
            title: 'Optimiser le workflow',
            description: 'Automatiser les tests de régression',
            expectedImpact: '-20% temps de cycle'
          },
          {
            id: 3,
            priority: 'low',
            category: 'training',
            title: 'Formation équipe',
            description: 'Formation React avancé pour 3 développeurs',
            expectedImpact: '+10% productivité'
          }
        ]
      };
    }
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600 " />
            <p className="text-muted-foreground">Analyse des données en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Centre d'Intelligence IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyses prédictives et recommandations basées sur l'IA
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedPeriod('week')}>
            Semaine
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Mois
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedPeriod('quarter')}>
            Trimestre
          </Button>
        </div>
      </div>

      {/* Métriques clés avec niveau de confiance */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Croissance CA
              </span>
              <Badge variant="outline">
                <span className="text-xs">{insights?.keyMetrics.revenueGrowth.confidence}% confiance</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{insights?.keyMetrics.revenueGrowth.value}%
            </div>
            <p className="text-xs text-muted-foreground">vs période précédente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Succès Projets
              </span>
              <Badge variant="outline">
                <span className="text-xs">{insights?.keyMetrics.projectSuccess.confidence}% confiance</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.keyMetrics.projectSuccess.value}%
            </div>
            <Progress value={insights?.keyMetrics.projectSuccess.value} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisation Équipe
              </span>
              <Badge variant="outline">
                <span className="text-xs">{insights?.keyMetrics.teamUtilization.confidence}% confiance</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.keyMetrics.teamUtilization.value}%
            </div>
            <Progress value={insights?.keyMetrics.teamUtilization.value} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Satisfaction Client
              </span>
              <Badge variant="outline">
                <span className="text-xs">{insights?.keyMetrics.customerSatisfaction.confidence}% confiance</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.keyMetrics.customerSatisfaction.value}/5
            </div>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={cn(
                    "w-4 h-4 rounded-sm",
                    star <= Math.floor(insights?.keyMetrics.customerSatisfaction.value || 0)
                      ? "bg-yellow-400"
                      : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et anomalies */}
      {insights?.anomalies && insights.anomalies.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-orange-900">Anomalies détectées</p>
              {insights.anomalies.map((anomaly) => (
                <div key={anomaly.id} className="flex items-center justify-between">
                  <p className="text-sm">{anomaly.description}</p>
                  <Badge variant={getSeverityColor(anomaly.severity) as any}>
                    {anomaly.severity === 'high' ? 'Critique' : 
                     anomaly.severity === 'medium' ? 'Moyen' : 'Faible'}
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Graphiques principaux */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prévisions de Revenus</CardTitle>
                <CardDescription>
                  Actual vs Prédit (avec intervalle de confiance)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `${value.toLocaleString('fr-FR')}€`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorActual)"
                      name="Réel"
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorPredicted)"
                      name="Prédit"
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Santé des Projets</CardTitle>
                <CardDescription>
                  Distribution par statut avec analyse prédictive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={projectHealthData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance de l'équipe */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse de Performance de l'Équipe</CardTitle>
              <CardDescription>
                Évaluation multidimensionnelle basée sur l'IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={teamPerformanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4 mt-6">
          {insights?.predictions.map((prediction) => (
            <Card key={prediction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {prediction.type === 'revenue' && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {prediction.type === 'risk' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                      {prediction.type === 'opportunity' && <Sparkles className="h-5 w-5 text-purple-600" />}
                      <h3 className="font-semibold">{prediction.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {prediction.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{prediction.timeframe}</span>
                      </div>
                      <Badge>
                        <span className={cn("text-xs", getImpactColor(prediction.impact))}>
                          Impact {prediction.impact === 'high' ? 'élevé' : 
                                 prediction.impact === 'medium' ? 'moyen' : 'faible'}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {prediction.probability}%
                    </div>
                    <p className="text-xs text-muted-foreground">probabilité</p>
                    <Progress value={prediction.probability} className="mt-2 w-24 h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          {/* Tendances de performance */}
          <Card>
            <CardHeader>
              <CardTitle>Tendances de Performance</CardTitle>
              <CardDescription>
                Évolution des indicateurs clés sur la période
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={[
                    { month: 'Jan', productivity: 75, quality: 82, satisfaction: 88 },
                    { month: 'Fév', productivity: 78, quality: 85, satisfaction: 90 },
                    { month: 'Mar', productivity: 82, quality: 88, satisfaction: 92 },
                    { month: 'Avr', productivity: 85, quality: 90, satisfaction: 91 },
                    { month: 'Mai', productivity: 88, quality: 92, satisfaction: 94 },
                    { month: 'Jun', productivity: 90, quality: 93, satisfaction: 95 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#8b5cf6" 
                    name="Productivité"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="quality" 
                    stroke="#10b981" 
                    name="Qualité"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="#f59e0b" 
                    name="Satisfaction"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparaison par département */}
          <Card>
            <CardHeader>
              <CardTitle>Performance par Département</CardTitle>
              <CardDescription>
                Analyse comparative avec benchmarks IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { dept: 'Dev', current: 85, target: 80, benchmark: 75 },
                    { dept: 'Design', current: 92, target: 85, benchmark: 80 },
                    { dept: 'Marketing', current: 78, target: 80, benchmark: 82 },
                    { dept: 'Sales', current: 88, target: 90, benchmark: 85 },
                    { dept: 'Support', current: 95, target: 90, benchmark: 88 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#8b5cf6" name="Actuel" />
                  <Bar dataKey="target" fill="#10b981" name="Objectif" />
                  <Bar dataKey="benchmark" fill="#f59e0b" name="Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 mt-6">
          <div className="mb-6">
            <Alert className="border-purple-200 bg-purple-50">
              <Zap className="h-4 w-4 text-purple-600" />
              <AlertDescription>
                <p className="font-medium text-purple-900">
                  {insights?.recommendations.length} recommandations actives basées sur l'analyse IA
                </p>
              </AlertDescription>
            </Alert>
          </div>

          {insights?.recommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        Priorité {rec.priority === 'high' ? 'haute' :
                                 rec.priority === 'medium' ? 'moyenne' : 'basse'}
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{rec.title}</h3>
                    <p className="text-muted-foreground mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>Impact attendu: {rec.expectedImpact}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="ml-4">
                    Appliquer
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Actions suggérées */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <Brain className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  L'IA continue d'analyser vos données pour générer de nouvelles recommandations
                </p>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Forcer l'analyse
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}