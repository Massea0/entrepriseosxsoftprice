import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Clock, 
  Star,
  Award,
  BarChart3,
  FileText,
  Users
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PerformanceData {
  employeeId: string;
  employeeName: string;
  role: string;
  overallScore: number;
  goals: Goal[];
  recentReviews: Review[];
  kpis: KPI[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed';
}

interface Review {
  id: string;
  date: string;
  reviewer: string;
  score: number;
  feedback: string;
  type: 'quarterly' | 'annual' | 'project';
}

interface KPI {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

const TeamPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const { data: performanceData = [] } = useQuery({
    queryKey: ['/api/manager/performance', selectedPeriod],
    initialData: [
      {
        employeeId: '1',
        employeeName: 'Aminata Diallo',
        role: 'Développeuse Frontend',
        overallScore: 94,
        goals: [
          {
            id: '1',
            title: 'Maîtriser React Native',
            description: 'Développer des compétences en développement mobile',
            targetDate: '2025-03-31',
            progress: 75,
            status: 'on_track' as const
          },
          {
            id: '2',
            title: 'Mentoring junior',
            description: 'Encadrer 2 développeurs juniors',
            targetDate: '2025-02-28',
            progress: 60,
            status: 'on_track' as const
          }
        ],
        recentReviews: [
          {
            id: '1',
            date: '2025-01-15',
            reviewer: 'Mamadou Fall',
            score: 4.5,
            feedback: 'Excellent travail sur le projet client. Très autonome et proactive.',
            type: 'quarterly' as const
          }
        ],
        kpis: [
          {
            id: '1',
            name: 'Productivité',
            current: 96,
            target: 90,
            unit: '%',
            trend: 'up' as const
          },
          {
            id: '2',
            name: 'Qualité code',
            current: 4.8,
            target: 4.5,
            unit: '/5',
            trend: 'up' as const
          }
        ]
      },
      {
        employeeId: '2',
        employeeName: 'Omar Ndiaye',
        role: 'Designer UX/UI',
        overallScore: 87,
        goals: [
          {
            id: '3',
            title: 'Certification UX',
            description: 'Obtenir la certification Google UX Design',
            targetDate: '2025-04-30',
            progress: 45,
            status: 'on_track' as const
          }
        ],
        recentReviews: [
          {
            id: '2',
            date: '2025-01-10',
            reviewer: 'Mamadou Fall',
            score: 4.2,
            feedback: 'Designs créatifs et user-friendly. Peut améliorer la collaboration.',
            type: 'quarterly' as const
          }
        ],
        kpis: [
          {
            id: '3',
            name: 'Satisfaction client',
            current: 4.6,
            target: 4.5,
            unit: '/5',
            trend: 'stable' as const
          }
        ]
      }
    ] as PerformanceData[]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_track': return 'Sur la bonne voie';
      case 'at_risk': return 'À risque';
      case 'delayed': return 'En retard';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <span className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const filteredData = selectedEmployee === 'all' 
    ? performanceData 
    : performanceData.filter(p => p.employeeId === selectedEmployee);

  const averageScore = Math.round(
    performanceData.reduce((acc, p) => acc + p.overallScore, 0) / performanceData.length
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance d'Équipe</h1>
          <p className="text-muted-foreground">Suivi des performances et objectifs de votre équipe</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute l'équipe</SelectItem>
              {performanceData.map(p => (
                <SelectItem key={p.employeeId} value={p.employeeId}>
                  {p.employeeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Score Moyen</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Objectifs Actifs</p>
                <p className="text-2xl font-bold">
                  {filteredData.reduce((acc, p) => acc + p.goals.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Évaluations</p>
                <p className="text-2xl font-bold">
                  {filteredData.reduce((acc, p) => acc + p.recentReviews.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Membres Équipe</p>
                <p className="text-2xl font-bold">{performanceData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Details */}
      <div className="space-y-6">
        {filteredData.map((employee) => (
          <Card key={employee.employeeId} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {employee.employeeName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{employee.employeeName}</CardTitle>
                    <CardDescription>{employee.role}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{employee.overallScore}%</div>
                  <p className="text-sm text-muted-foreground">Score global</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="goals" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="goals">Objectifs</TabsTrigger>
                  <TabsTrigger value="reviews">Évaluations</TabsTrigger>
                  <TabsTrigger value="kpis">KPIs</TabsTrigger>
                </TabsList>

                <TabsContent value="goals" className="space-y-4">
                  {employee.goals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun objectif défini
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {employee.goals.map((goal) => (
                        <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{goal.title}</h4>
                            <Badge className={getStatusColor(goal.status)}>
                              {getStatusText(goal.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progression</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            Échéance: {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {employee.recentReviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucune évaluation récente
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {employee.recentReviews.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">{review.score}/5</span>
                            </div>
                            <Badge variant="outline">
                              {review.type === 'quarterly' ? 'Trimestrielle' : 
                               review.type === 'annual' ? 'Annuelle' : 'Projet'}
                            </Badge>
                          </div>
                          <p className="text-sm">{review.feedback}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Par: {review.reviewer}</span>
                            <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="kpis" className="space-y-4">
                  {employee.kpis.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun KPI défini
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employee.kpis.map((kpi) => (
                        <div key={kpi.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{kpi.name}</h4>
                            {getTrendIcon(kpi.trend)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                {kpi.current}{kpi.unit}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Objectif: {kpi.target}{kpi.unit}
                              </span>
                            </div>
                            <Progress 
                              value={(kpi.current / kpi.target) * 100} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamPerformance;