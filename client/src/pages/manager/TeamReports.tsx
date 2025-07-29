import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Target,
  Download,
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMetrics {
  period: string;
  productivity: {
    overall: number;
    trend: 'up' | 'down' | 'stable';
    tasksCompleted: number;
    tasksTotal: number;
  };
  attendance: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
    presentToday: number;
    totalMembers: number;
  };
  performance: {
    average: number;
    trend: 'up' | 'down' | 'stable';
    topPerformers: string[];
    needsAttention: string[];
  };
  projects: {
    onTime: number;
    delayed: number;
    completed: number;
    total: number;
  };
}

interface MemberReport {
  id: string;
  name: string;
  role: string;
  hoursWorked: number;
  tasksCompleted: number;
  performanceScore: number;
  attendanceRate: number;
  projectsInvolved: number;
}

const TeamReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('productivity');

  const { data: teamMetrics } = useQuery({
    queryKey: ['/api/manager/reports/metrics', selectedPeriod],
    initialData: {
      period: selectedPeriod,
      productivity: {
        overall: 87,
        trend: 'up' as const,
        tasksCompleted: 145,
        tasksTotal: 167
      },
      attendance: {
        rate: 94,
        trend: 'stable' as const,
        presentToday: 7,
        totalMembers: 8
      },
      performance: {
        average: 91,
        trend: 'up' as const,
        topPerformers: ['Aminata Diallo', 'Omar Ndiaye'],
        needsAttention: ['Jean Dupont']
      },
      projects: {
        onTime: 12,
        delayed: 3,
        completed: 8,
        total: 23
      }
    } as TeamMetrics
  });

  const { data: memberReports = [] } = useQuery({
    queryKey: ['/api/manager/reports/members', selectedPeriod],
    initialData: [
      {
        id: '1',
        name: 'Aminata Diallo',
        role: 'Développeuse Frontend',
        hoursWorked: 168,
        tasksCompleted: 28,
        performanceScore: 94,
        attendanceRate: 98,
        projectsInvolved: 3
      },
      {
        id: '2',
        name: 'Omar Ndiaye',
        role: 'Designer UX/UI',
        hoursWorked: 160,
        tasksCompleted: 22,
        performanceScore: 87,
        attendanceRate: 95,
        projectsInvolved: 2
      },
      {
        id: '3',
        name: 'Fatou Sow',
        role: 'Chef de Projet',
        hoursWorked: 172,
        tasksCompleted: 35,
        performanceScore: 91,
        attendanceRate: 92,
        projectsInvolved: 4
      },
      {
        id: '4',
        name: 'Moussa Kane',
        role: 'Développeur Backend',
        hoursWorked: 165,
        tasksCompleted: 31,
        performanceScore: 89,
        attendanceRate: 96,
        projectsInvolved: 3
      }
    ] as MemberReport[]
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <span className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const generatePeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'quarter': return 'Ce trimestre';
      case 'year': return 'Cette année';
      default: return period;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rapports d'Équipe</h1>
          <p className="text-muted-foreground">Analyses détaillées des performances et métriques</p>
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
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productivité</p>
                <p className="text-2xl font-bold">{teamMetrics.productivity.overall}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {teamMetrics.productivity.tasksCompleted}/{teamMetrics.productivity.tasksTotal} tâches
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(teamMetrics.productivity.trend)}
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Présence</p>
                <p className="text-2xl font-bold">{teamMetrics.attendance.rate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {teamMetrics.attendance.presentToday}/{teamMetrics.attendance.totalMembers} aujourd'hui
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(teamMetrics.attendance.trend)}
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">{teamMetrics.performance.average}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {teamMetrics.performance.topPerformers.length} top performers
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(teamMetrics.performance.trend)}
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projets</p>
                <p className="text-2xl font-bold">{teamMetrics.projects.onTime}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {teamMetrics.projects.delayed} en retard
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="productivity">Productivité</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Présence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Team Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Projets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">En cours ({teamMetrics.projects.onTime})</span>
                    <Badge className="bg-green-100 text-green-800">À temps</Badge>
                  </div>
                  <Progress value={(teamMetrics.projects.onTime / teamMetrics.projects.total) * 100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">En retard ({teamMetrics.projects.delayed})</span>
                    <Badge className="bg-red-100 text-red-800">Attention</Badge>
                  </div>
                  <Progress value={(teamMetrics.projects.delayed / teamMetrics.projects.total) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Terminés ({teamMetrics.projects.completed})</span>
                    <Badge className="bg-blue-100 text-blue-800">Fini</Badge>
                  </div>
                  <Progress value={(teamMetrics.projects.completed / teamMetrics.projects.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Points d'Attention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMetrics.performance.needsAttention.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Performance à améliorer</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {teamMetrics.performance.needsAttention.map((member, index) => (
                        <li key={index}>• {member}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Top Performers</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {teamMetrics.performance.topPerformers.map((member, index) => (
                      <li key={index}>• {member}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productivité par Membre - {generatePeriodLabel(selectedPeriod)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberReports.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{member.hoursWorked}h</p>
                        <p className="text-muted-foreground">Temps</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{member.tasksCompleted}</p>
                        <p className="text-muted-foreground">Tâches</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{member.projectsInvolved}</p>
                        <p className="text-muted-foreground">Projets</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scores de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberReports.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <span className={`font-bold text-lg ${getPerformanceColor(member.performanceScore)}`}>
                        {member.performanceScore}%
                      </span>
                    </div>
                    <Progress value={member.performanceScore} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taux de Présence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberReports.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <span className={`font-bold text-lg ${getPerformanceColor(member.attendanceRate)}`}>
                        {member.attendanceRate}%
                      </span>
                    </div>
                    <Progress value={member.attendanceRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamReports;