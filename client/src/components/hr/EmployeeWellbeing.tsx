import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Area, AreaChart, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  Heart, Brain, Activity, TrendingUp, TrendingDown,
  AlertCircle, Smile, Frown, Meh, Star, Award,
  Calendar, Clock, Coffee, Home, Users, MessageCircle,
  Sparkles, Target, Zap, Shield, CheckCircle, XCircle,
  PlusCircle, BarChart3, FileText, Send, Bot
} from 'lucide-react';
// import { supabase } // Migrated from Supabase to Express API

interface WellbeingMetric {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: React.ElementType;
  color: string;
}

interface PulseSurvey {
  id: string;
  title: string;
  date: Date;
  responseRate: number;
  averageScore: number;
  status: 'active' | 'completed' | 'scheduled';
  questions: PulseSurveyQuestion[];
}

interface PulseSurveyQuestion {
  id: string;
  question: string;
  type: 'scale' | 'text' | 'multiple_choice';
  responses?: number;
  averageScore?: number;
}

interface EmployeeWellbeing {
  id: string;
  name: string;
  department: string;
  position: string;
  wellbeingScore: number;
  engagementScore: number;
  burnoutRisk: 'low' | 'medium' | 'high';
  lastSurvey: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  stressLevel: number;
  workLifeBalance: number;
  teamConnection: number;
  careerSatisfaction: number;
}

interface TeamInsight {
  team: string;
  averageWellbeing: number;
  topConcerns: string[];
  improvements: string[];
  actionItems: string[];
}

export const EmployeeWellbeing: React.FC = () => {
  const [wellbeingMetrics, setWellbeingMetrics] = useState<WellbeingMetric[]>([]);
  const [pulseSurveys, setPulseSurveys] = useState<PulseSurvey[]>([]);
  const [employees, setEmployees] = useState<EmployeeWellbeing[]>([]);
  const [teamInsights, setTeamInsights] = useState<TeamInsight[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const [loading, setLoading] = useState(true);

  // Couleurs pour les visualisations
  const COLORS = {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  };

  useEffect(() => {
    loadWellbeingData();
  }, [selectedTimeRange]);

  const loadWellbeingData = async () => {
    try {
      // Simuler le chargement des données
      setWellbeingMetrics([
        {
          category: 'Bien-être Global',
          score: 72,
          trend: 'up',
          change: 5.2,
          icon: Heart,
          color: 'text-pink-600'
        },
        {
          category: 'Engagement',
          score: 78,
          trend: 'up',
          change: 3.8,
          icon: Activity,
          color: 'text-purple-600'
        },
        {
          category: 'Équilibre Vie Pro/Perso',
          score: 65,
          trend: 'down',
          change: -2.1,
          icon: Home,
          color: 'text-blue-600'
        },
        {
          category: 'Connexion Équipe',
          score: 81,
          trend: 'stable',
          change: 0.5,
          icon: Users,
          color: 'text-green-600'
        }
      ]);

      // Simuler les pulse surveys
      setPulseSurveys([
        {
          id: '1',
          title: 'Pulse Check Hebdomadaire',
          date: new Date(),
          responseRate: 87,
          averageScore: 7.8,
          status: 'active',
          questions: [
            {
              id: 'q1',
              question: 'Comment vous sentez-vous cette semaine?',
              type: 'scale',
              responses: 145,
              averageScore: 7.5
            },
            {
              id: 'q2',
              question: 'Votre charge de travail est-elle gérable?',
              type: 'scale',
              responses: 143,
              averageScore: 6.8
            }
          ]
        }
      ]);

      // Générer des données d'employés
      const mockEmployees = generateMockEmployees();
      setEmployees(mockEmployees);

      // Générer des insights d'équipe
      setTeamInsights(generateTeamInsights());

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement données bien-être:', error);
      setLoading(false);
    }
  };

  const generateMockEmployees = (): EmployeeWellbeing[] => {
    const departments = ['Tech', 'Commercial', 'RH', 'Finance', 'Marketing'];
    const names = [
      'Sophie Martin', 'Jean Dupont', 'Marie Bernard', 'Pierre Lefebvre',
      'Amélie Rousseau', 'Thomas Petit', 'Julie Moreau', 'Lucas Simon'
    ];

    return Array.from({ length: 20 }, (_, i) => ({
      id: `emp-${i}`,
      name: names[i % names.length],
      department: departments[i % departments.length],
      position: ['Manager', 'Senior', 'Junior'][i % 3],
      wellbeingScore: Math.floor(Math.random() * 30 + 60),
      engagementScore: Math.floor(Math.random() * 30 + 65),
      burnoutRisk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      lastSurvey: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
      stressLevel: Math.floor(Math.random() * 40 + 30),
      workLifeBalance: Math.floor(Math.random() * 30 + 50),
      teamConnection: Math.floor(Math.random() * 20 + 70),
      careerSatisfaction: Math.floor(Math.random() * 30 + 60)
    }));
  };

  const generateTeamInsights = (): TeamInsight[] => {
    return [
      {
        team: 'Tech',
        averageWellbeing: 75,
        topConcerns: ['Charge de travail élevée', 'Deadlines serrées'],
        improvements: ['Communication améliorée', 'Plus de flexibilité'],
        actionItems: ['Revoir la répartition des tâches', 'Implémenter des journées sans réunion']
      },
      {
        team: 'Commercial',
        averageWellbeing: 68,
        topConcerns: ['Pression des objectifs', 'Stress client'],
        improvements: ['Support managérial', 'Formation continue'],
        actionItems: ['Sessions de coaching', 'Révision des objectifs Q2']
      }
    ];
  };

  // Données pour les graphiques
  const wellbeingTrend = [
    { month: 'Jan', score: 68, engagement: 72, stress: 45 },
    { month: 'Fév', score: 70, engagement: 74, stress: 43 },
    { month: 'Mar', score: 69, engagement: 76, stress: 46 },
    { month: 'Avr', score: 72, engagement: 78, stress: 42 },
    { month: 'Mai', score: 74, engagement: 79, stress: 40 },
    { month: 'Juin', score: 76, engagement: 81, stress: 38 }
  ];

  const sentimentDistribution = [
    { name: 'Positif', value: 45, color: COLORS.success },
    { name: 'Neutre', value: 35, color: COLORS.warning },
    { name: 'Négatif', value: 20, color: COLORS.danger }
  ];

  const departmentWellbeing = [
    { department: 'Tech', wellbeing: 75, engagement: 82 },
    { department: 'Commercial', wellbeing: 68, engagement: 75 },
    { department: 'RH', wellbeing: 82, engagement: 88 },
    { department: 'Finance', wellbeing: 71, engagement: 76 },
    { department: 'Marketing', wellbeing: 78, engagement: 84 }
  ];

  const getEmotionIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return Smile;
      case 'neutral': return Meh;
      case 'negative': return Frown;
      default: return Meh;
    }
  };

  const getBurnoutColor = (risk: string) => {
    switch (risk) {
      case 'low': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'high': return COLORS.danger;
      default: return COLORS.info;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bien-être & Engagement
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyse IA du bien-être et prévention des risques
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 jours</SelectItem>
              <SelectItem value="month">30 jours</SelectItem>
              <SelectItem value="quarter">3 mois</SelectItem>
              <SelectItem value="year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreatingSurvey} onOpenChange={setIsCreatingSurvey}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
                <PlusCircle className="h-4 w-4" />
                Nouveau Pulse Survey
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un Pulse Survey</DialogTitle>
                <DialogDescription>
                  Créez un questionnaire rapide pour mesurer le bien-être
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="survey-title">Titre du Survey</Label>
                  <Input id="survey-title" placeholder="ex: Check-in Hebdomadaire" />
                </div>
                <div>
                  <Label>Questions</Label>
                  <div className="space-y-2 mt-2">
                    <div className="p-3 border rounded-lg">
                      <Input placeholder="Question 1: Comment vous sentez-vous aujourd'hui?" />
                      <Select className="mt-2">
                        <SelectTrigger>
                          <SelectValue placeholder="Type de réponse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scale">Échelle 1-10</SelectItem>
                          <SelectItem value="text">Texte libre</SelectItem>
                          <SelectItem value="emoji">Émojis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Ajouter une question
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Bot className="h-3 w-3" />
                    Suggestions IA
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-3 w-3" />
                    Utiliser un modèle
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingSurvey(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le Survey
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Métriques Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wellbeingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color.replace('text', 'from')}/10`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <Badge 
                    variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary'}
                  >
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}%
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">{metric.category}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{metric.score}%</p>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
                <Progress value={metric.score} className="h-2 mt-3" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertes et Actions Préventives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Alertes & Actions Préventives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Risque de Burnout Élevé</AlertTitle>
              <AlertDescription>
                5 employés montrent des signes de surcharge. Action recommandée: entretiens individuels.
              </AlertDescription>
              <Button size="sm" variant="outline" className="mt-2">
                Voir les profils
              </Button>
            </Alert>

            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <Brain className="h-4 w-4 text-orange-600" />
              <AlertTitle>Baisse d'Engagement - Équipe Commercial</AlertTitle>
              <AlertDescription>
                Score d'engagement en baisse de 8% ce mois. Causes identifiées: pression des objectifs.
              </AlertDescription>
              <Button size="sm" variant="outline" className="mt-2">
                Plan d'action
              </Button>
            </Alert>

            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Amélioration Notable - Équipe Tech</AlertTitle>
              <AlertDescription>
                +12% de satisfaction après l'implémentation du télétravail flexible.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Pulse Survey Actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pulseSurveys.filter(s => s.status === 'active').map(survey => (
              <div key={survey.id} className="space-y-3">
                <div>
                  <h4 className="font-medium">{survey.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Lancé il y a {Math.floor((Date.now() - survey.date.getTime()) / (1000 * 60 * 60))}h
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Taux de réponse</span>
                    <span className="font-medium">{survey.responseRate}%</span>
                  </div>
                  <Progress value={survey.responseRate} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Voir Résultats
                  </Button>
                  <Button size="sm" className="flex-1">
                    Relancer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analyses Détaillées */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="individuals">Individus</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du Bien-être Global</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={wellbeingTrend}>
                  <defs>
                    <linearGradient id="colorWellbeing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="score" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorWellbeing)" name="Bien-être" />
                  <Area type="monotone" dataKey="engagement" stroke={COLORS.secondary} fillOpacity={1} fill="url(#colorEngagement)" name="Engagement" />
                  <Line type="monotone" dataKey="stress" stroke={COLORS.danger} strokeDasharray="5 5" name="Stress" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des Sentiments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {sentimentDistribution.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-2xl mb-1`}>
                        {item.name === 'Positif' ? '😊' : item.name === 'Neutre' ? '😐' : '😔'}
                      </div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-lg font-bold" style={{ color: item.color }}>
                        {item.value}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nuage de Mots - Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center items-center h-[300px]">
                  {['Équilibre', 'Flexibilité', 'Communication', 'Charge', 'Support', 
                    'Reconnaissance', 'Stress', 'Collaboration', 'Innovation', 'Formation',
                    'Autonomie', 'Objectifs', 'Feedback', 'Évolution'].map((word, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full transition-all hover:scale-110"
                      style={{
                        fontSize: `${Math.random() * 16 + 12}px`,
                        backgroundColor: `${COLORS.primary}${Math.floor(Math.random() * 50 + 20).toString(16)}`,
                        color: index % 3 === 0 ? COLORS.danger : index % 2 === 0 ? COLORS.primary : COLORS.secondary
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bien-être par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={departmentWellbeing}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="wellbeing" fill={COLORS.primary} name="Bien-être" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="engagement" fill={COLORS.secondary} name="Engagement" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teamInsights.map((team, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{team.team}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Progress value={team.averageWellbeing} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{team.averageWellbeing}%</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">Préoccupations</p>
                    <ul className="text-sm space-y-1">
                      {team.topConcerns.map((concern, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <XCircle className="h-3 w-3 text-red-500 mt-0.5" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Améliorations</p>
                    <ul className="text-sm space-y-1">
                      {team.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Plan d'Action Détaillé
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="individuals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employés Nécessitant une Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees
                  .filter(emp => emp.burnoutRisk === 'high' || emp.sentiment === 'negative')
                  .slice(0, 5)
                  .map(employee => {
                    const EmotionIcon = getEmotionIcon(employee.sentiment);
                    return (
                      <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.position} - {employee.department}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <EmotionIcon className="h-5 w-5 mx-auto mb-1" />
                            <p className="text-xs capitalize">{employee.sentiment}</p>
                          </div>
                          
                          <div className="text-center">
                            <Badge 
                              variant="outline"
                              style={{ 
                                borderColor: getBurnoutColor(employee.burnoutRisk),
                                color: getBurnoutColor(employee.burnoutRisk)
                              }}
                            >
                              Burnout: {employee.burnoutRisk}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div>
                              <p className="text-xs text-muted-foreground">Bien-être</p>
                              <p className="font-semibold">{employee.wellbeingScore}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Stress</p>
                              <p className="font-semibold">{employee.stressLevel}%</p>
                            </div>
                          </div>

                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Matrice Bien-être/Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Matrice Bien-être / Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="wellbeingScore" 
                    name="Bien-être" 
                    unit="%" 
                    domain={[0, 100]}
                    label={{ value: 'Bien-être →', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="engagementScore" 
                    name="Engagement" 
                    unit="%" 
                    domain={[0, 100]}
                    label={{ value: 'Engagement →', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Employés" 
                    data={employees} 
                    fill={COLORS.primary}
                  >
                    {employees.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.burnoutRisk === 'high' ? COLORS.danger :
                          entry.burnoutRisk === 'medium' ? COLORS.warning :
                          COLORS.success
                        } 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                <Badge className="gap-1" style={{ backgroundColor: COLORS.success }}>
                  <Circle className="h-2 w-2" />
                  Risque Faible
                </Badge>
                <Badge className="gap-1" style={{ backgroundColor: COLORS.warning }}>
                  <Circle className="h-2 w-2" />
                  Risque Moyen
                </Badge>
                <Badge className="gap-1" style={{ backgroundColor: COLORS.danger }}>
                  <Circle className="h-2 w-2" />
                  Risque Élevé
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Actions Recommandées par l'IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    priority: 'urgent',
                    title: 'Sessions Anti-Stress',
                    description: 'Organiser des ateliers de gestion du stress pour l\'équipe commerciale',
                    impact: 'Réduction du burnout de 25%',
                    effort: 'Moyen'
                  },
                  {
                    priority: 'high',
                    title: 'Journées Sans Réunion',
                    description: 'Implémenter des "Focus Fridays" sans réunions',
                    impact: 'Productivité +15%',
                    effort: 'Faible'
                  },
                  {
                    priority: 'medium',
                    title: 'Programme de Mentorat',
                    description: 'Lancer un programme de mentorat inter-équipes',
                    impact: 'Engagement +20%',
                    effort: 'Élevé'
                  }
                ].map((action, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{action.title}</h4>
                      <Badge variant={
                        action.priority === 'urgent' ? 'destructive' :
                        action.priority === 'high' ? 'default' : 'secondary'
                      }>
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        Impact: {action.impact}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-600" />
                        Effort: {action.effort}
                      </span>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Lancer l'Action
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Initiatives Bien-être
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  {[
                    { name: 'Semaine du Bien-être', date: 'Mars 2024', status: 'planned' },
                    { name: 'Challenge Sport & Santé', date: 'Avril 2024', status: 'active' },
                    { name: 'Ateliers Mindfulness', date: 'Hebdomadaire', status: 'ongoing' }
                  ].map((initiative, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div>
                        <p className="font-medium">{initiative.name}</p>
                        <p className="text-sm text-muted-foreground">{initiative.date}</p>
                      </div>
                      <Badge variant={
                        initiative.status === 'active' ? 'default' :
                        initiative.status === 'ongoing' ? 'secondary' : 'outline'
                      }>
                        {initiative.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Proposer une Initiative
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Coffee className="h-5 w-5" />
                  <span className="text-xs">Pause Café Virtuelle</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Award className="h-5 w-5" />
                  <span className="text-xs">Reconnaissance Équipe</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Team Building</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs">Check-in Manager</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Composant Circle pour les badges
const Circle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 8 8" fill="currentColor">
    <circle cx="4" cy="4" r="4" />
  </svg>
);

export default EmployeeWellbeing;