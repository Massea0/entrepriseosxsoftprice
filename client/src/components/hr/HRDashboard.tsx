import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Building2, 
  Star, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Award,
  Target
} from 'lucide-react';

interface HRMetrics {
  totalEmployees: number;
  activeEmployees: number;
  averagePerformance: number;
  turnoverRate: number;
  engagementScore: number;
  openPositions: number;
  departmentPerformance: Array<{
    name: string;
    score: number;
    employees: number;
  }>;
  recentHires: Array<{
    id: string;
    name: string;
    position: string;
    startDate: string;
  }>;
}

export const HRDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HRMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hr/metrics');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMetrics(data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des métriques RH:', error);
        setError('Impossible de charger les données RH');
        // Mock data for development
        setMetrics({
          totalEmployees: 42,
          activeEmployees: 38,
          averagePerformance: 8.2,
          turnoverRate: 5.2,
          engagementScore: 87,
          openPositions: 4,
          departmentPerformance: [
            { name: 'Développement', score: 9.1, employees: 15 },
            { name: 'Marketing', score: 8.7, employees: 8 },
            { name: 'Ventes', score: 8.4, employees: 12 },
            { name: 'RH', score: 8.9, employees: 3 },
            { name: 'Administration', score: 7.8, employees: 4 }
          ],
          recentHires: [
            { id: '1', name: 'Marie Diop', position: 'Développeur Full Stack', startDate: '2024-12-15' },
            { id: '2', name: 'Ahmed Ndiaye', position: 'Designer UX/UI', startDate: '2024-12-10' },
            { id: '3', name: 'Fatou Sall', position: 'Chef de Projet', startDate: '2024-12-05' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHRData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Erreur lors du chargement des données'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 8.5) return 'default';
    if (score >= 7.5) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employés</p>
                <p className="text-2xl font-bold">{metrics.totalEmployees}</p>
                <p className="text-xs text-green-600">
                  {metrics.activeEmployees} actifs
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance Moyenne</p>
                <p className="text-2xl font-bold">{metrics.averagePerformance}/10</p>
                <p className="text-xs text-green-600">
                  Engagement: {metrics.engagementScore}%
                </p>
              </div>
              <TrendingUp className={`h-8 w-8 ${getPerformanceColor(metrics.averagePerformance)}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de Rotation</p>
                <p className="text-2xl font-bold">{metrics.turnoverRate}%</p>
                <p className="text-xs text-blue-600">
                  {metrics.openPositions} postes ouverts
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails par département et embauches récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par département */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Performance par Département</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.departmentPerformance.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{dept.name}</span>
                      <Badge variant={getPerformanceBadge(dept.score)}>
                        {dept.score}/10
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {dept.employees} employés
                    </span>
                  </div>
                  <Progress 
                    value={dept.score * 10} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Embauches récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Embauches Récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentHires.map((hire) => (
                <div key={hire.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{hire.name}</p>
                    <p className="text-sm text-muted-foreground">{hire.position}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {new Date(hire.startDate).toLocaleDateString('fr-FR')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};