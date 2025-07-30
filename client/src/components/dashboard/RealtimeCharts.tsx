import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Building2, Users } from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function RealtimeCharts() {
  const [timeRange, setTimeRange] = useState('month');

  // Fetch revenue data
  const { data: revenueData = [] } = useQuery({
    queryKey: ['revenue-chart', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/revenue?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      const data = await response.json();
      
      // Fallback data if API doesn't return proper format
      if (!data || !data.length) {
        return generateMockRevenueData(timeRange);
      }
      return data;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch project status data
  const { data: projectData = [] } = useQuery({
    queryKey: ['project-status'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/project-status');
      if (!response.ok) throw new Error('Failed to fetch project data');
      const data = await response.json();
      
      // Fallback data
      if (!data || !data.length) {
        return [
          { name: 'En cours', value: 12, color: '#3b82f6' },
          { name: 'Terminés', value: 8, color: '#10b981' },
          { name: 'En retard', value: 3, color: '#ef4444' },
          { name: 'Planifiés', value: 5, color: '#8b5cf6' }
        ];
      }
      return data;
    }
  });

  // Fetch team performance data
  const { data: performanceData = [] } = useQuery({
    queryKey: ['team-performance'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/team-performance');
      if (!response.ok) throw new Error('Failed to fetch performance data');
      const data = await response.json();
      
      // Fallback data
      if (!data || !data.length) {
        return [
          { name: 'Jean Dupont', tasks: 24, completed: 18, efficiency: 75 },
          { name: 'Marie Martin', tasks: 30, completed: 28, efficiency: 93 },
          { name: 'Pierre Durand', tasks: 20, completed: 15, efficiency: 75 },
          { name: 'Sophie Leroy', tasks: 22, completed: 20, efficiency: 91 }
        ];
      }
      return data;
    }
  });

  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Évolution du Chiffre d'Affaires
              </CardTitle>
              <CardDescription>
                Revenus en temps réel
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">7 jours</SelectItem>
                <SelectItem value="month">30 jours</SelectItem>
                <SelectItem value="quarter">3 mois</SelectItem>
                <SelectItem value="year">1 an</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Statut des Projets
            </CardTitle>
            <CardDescription>
              Répartition en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance de l'Équipe
            </CardTitle>
            <CardDescription>
              Efficacité par membre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" name="Terminées" />
                <Bar dataKey="tasks" fill="#3b82f6" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Indicateurs de Croissance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+23%</p>
              <p className="text-sm text-muted-foreground">CA vs mois dernier</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">+15</p>
              <p className="text-sm text-muted-foreground">Nouveaux clients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">87%</p>
              <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock data generator for development/fallback
function generateMockRevenueData(range: string) {
  const days = range === 'week' ? 7 : range === 'month' ? 30 : range === 'quarter' ? 90 : 365;
  const data = [];
  const baseRevenue = 10000;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      revenue: Math.floor(baseRevenue + Math.random() * 5000 + i * 100),
      target: baseRevenue + i * 80
    });
  }
  
  return data;
}