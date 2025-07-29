import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Shield, 
  Database, 
  Workflow, 
  Bell, 
  Key,
  Server,
  Monitor,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Activity,
  Brain,
  Mic
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SystemMetrics {
  uptime: string;
  activeUsers: number;
  totalProjects: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastBackup: string;
  diskUsage: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface AIAgent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  lastActive: string;
  actionsToday: number;
  performance: number;
}

const ConfigDashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');

  const { data: systemMetrics } = useQuery({
    queryKey: ['/api/admin/system-metrics'],
    initialData: {
      uptime: '15 jours 8h 32m',
      activeUsers: 24,
      totalProjects: 156,
      systemHealth: 'healthy' as const,
      lastBackup: '2025-01-21 03:00:00',
      diskUsage: 45,
      memoryUsage: 68,
      cpuUsage: 23
    } as SystemMetrics
  });

  const { data: aiAgents = [] } = useQuery({
    queryKey: ['/api/admin/ai-agents'],
    initialData: [
      {
        id: '1',
        name: 'Synapse Voice Assistant',
        type: 'voice',
        status: 'active' as const,
        lastActive: '2025-01-21 21:25:00',
        actionsToday: 47,
        performance: 96
      },
      {
        id: '2',
        name: 'Business Analyzer',
        type: 'analytics',
        status: 'active' as const,
        lastActive: '2025-01-21 20:15:00',
        actionsToday: 23,
        performance: 89
      },
      {
        id: '3',
        name: 'Task Optimizer',
        type: 'optimization',
        status: 'active' as const,
        lastActive: '2025-01-21 19:45:00',
        actionsToday: 156,
        performance: 92
      }
    ] as AIAgent[]
  });

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Configuration Système
          </h1>
          <p className="text-muted-foreground">Administration et contrôle du système Arcadis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Admin - {user?.firstName} {user?.lastName}</span>
          </Badge>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">État Système</p>
                <p className={`text-lg font-bold ${getHealthColor(systemMetrics.systemHealth)}`}>
                  {systemMetrics.systemHealth === 'healthy' && 'Sain'}
                  {systemMetrics.systemHealth === 'warning' && 'Attention'}
                  {systemMetrics.systemHealth === 'critical' && 'Critique'}
                </p>
              </div>
              {getHealthIcon(systemMetrics.systemHealth)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold">{systemMetrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projets Totaux</p>
                <p className="text-2xl font-bold">{systemMetrics.totalProjects}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-lg font-bold">{systemMetrics.uptime}</p>
              </div>
              <Server className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="ai-agents">Agents IA</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Resource Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="mr-2 h-5 w-5" />
                  Utilisation des Ressources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU</span>
                    <span>{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mémoire</span>
                    <span>{systemMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disque</span>
                    <span>{systemMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.diskUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Statut Base de Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connexion</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dernière sauvegarde</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(systemMetrics.lastBackup).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pool de connexions</span>
                  <span className="text-sm">8/10 actives</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Forcer la sauvegarde
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Agents IA Actifs
              </CardTitle>
              <CardDescription>
                Gestion et surveillance des agents d'intelligence artificielle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {agent.type === 'voice' && <Mic className="h-5 w-5 text-purple-600" />}
                        {agent.type === 'analytics' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                        {agent.type === 'optimization' && <Activity className="h-5 w-5 text-green-600" />}
                        <div>
                          <h4 className="font-semibold">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Dernière activité: {new Date(agent.lastActive).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status === 'active' && 'Actif'}
                        {agent.status === 'inactive' && 'Inactif'}
                        {agent.status === 'error' && 'Erreur'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Actions aujourd'hui:</span>
                        <p className="font-semibold">{agent.actionsToday}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Performance:</span>
                        <p className="font-semibold text-green-600">{agent.performance}%</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-1 h-3 w-3" />
                          Configurer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Workflow className="mr-2 h-5 w-5" />
                  Workflows Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuration générale
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Paramètres notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Gestion base de données
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Clés API & Intégrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google Gemini API</span>
                  <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ElevenLabs API</span>
                  <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database URL</span>
                  <Badge className="bg-green-100 text-green-800">Configuré</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Key className="mr-2 h-4 w-4" />
                  Gérer les clés
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Sécurité & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Système sécurisé</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Toutes les vérifications de sécurité sont passées avec succès.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Audit de sécurité
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Gestion des rôles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Key className="mr-2 h-4 w-4" />
                  Logs d'accès
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigDashboard;