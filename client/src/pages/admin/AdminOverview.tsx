import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Building2, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Target,
  Activity,
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GlobalMetrics {
  totalUsers: number;
  activeProjects: number;
  revenue: number;
  satisfaction: number;
  growth: number;
  departments: Array<{
    name: string;
    employees: number;
    performance: number;
    projects: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'success' | 'warning' | 'info';
  }>;
}

const AdminOverview = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const { data: globalMetrics } = useQuery({
    queryKey: ['/api/admin/global-metrics', selectedPeriod],
    initialData: {
      totalUsers: 47,
      activeProjects: 23,
      revenue: 12750000,
      satisfaction: 94,
      growth: 15.8,
      departments: [
        { name: 'Développement', employees: 15, performance: 92, projects: 8 },
        { name: 'Marketing', employees: 8, performance: 88, projects: 4 },
        { name: 'Ventes', employees: 12, performance: 91, projects: 6 },
        { name: 'RH', employees: 4, performance: 95, projects: 2 },
        { name: 'Administration', employees: 8, performance: 89, projects: 3 }
      ],
      recentActivity: [
        {
          id: '1',
          action: 'Nouveau projet créé: "App Mobile Banking"',
          user: 'Aminata Diallo',
          timestamp: '2025-01-21 20:45',
          type: 'success' as const
        },
        {
          id: '2',
          action: 'Validation congé: Omar Ndiaye',
          user: 'Manager Équipe Dev',
          timestamp: '2025-01-21 19:30',
          type: 'info' as const
        },
        {
          id: '3',
          action: 'Alerte budget: Projet dépassement 10%',
          user: 'Système',
          timestamp: '2025-01-21 18:15',
          type: 'warning' as const
        }
      ]
    } as GlobalMetrics
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Vue d'ensemble Globale
          </h1>
          <p className="text-muted-foreground">Supervision de l'écosystème Arcadis Technologies</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold">{globalMetrics.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+8.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projets Actifs</p>
                <p className="text-2xl font-bold">{globalMetrics.activeProjects}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus</p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'XOF', 
                    minimumFractionDigits: 0,
                    notation: 'compact'
                  }).format(globalMetrics.revenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+{globalMetrics.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold">{globalMetrics.satisfaction}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-600">Excellent</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">91%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+3.7%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Performance par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {globalMetrics.departments.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{dept.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {dept.employees} employés
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {dept.projects} projets
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold">{dept.performance}%</span>
                  </div>
                  <Progress value={dept.performance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Dernières actions système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {globalMetrics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.action}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            État du Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-800 dark:text-green-200">Services</p>
              <p className="text-sm text-green-700 dark:text-green-300">Tous opérationnels</p>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-800 dark:text-blue-200">Performance</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Excellente</p>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-purple-800 dark:text-purple-200">Utilisateurs</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">47 connectés</p>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="font-semibold text-orange-800 dark:text-orange-200">Uptime</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;