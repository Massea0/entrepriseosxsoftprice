import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  CheckSquare, 
  MessageSquare, 
  Users,
  Zap,
  Settings,
  Plus,
  Link,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { AnimatedMetricCard } from '@/components/ui/animated-metric-card';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import GitLabIntegration from '@/components/integrations/GitLabIntegration';
import JiraIntegration from '@/components/integrations/JiraIntegration';
import SlackIntegration from '@/components/integrations/SlackIntegration';
import RealTimeCollaboration from '@/components/collaboration/RealTimeCollaboration';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  category: 'development' | 'communication' | 'project-management' | 'analytics';
  isPopular: boolean;
  lastSync?: Date;
  metrics?: {
    label: string;
    value: number;
    unit?: string;
  }[];
}

export default memo(function IntegrationsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Synchronisez vos projets, merge requests et pipelines GitLab',
      icon: GitBranch,
      status: 'connected',
      category: 'development',
      isPopular: true,
      lastSync: new Date(Date.now() - 300000),
      metrics: [
        { label: 'Projets', value: 2 },
        { label: 'MR Ouvertes', value: 3 },
        { label: 'Pipelines', value: 5 }
      ]
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Gérez vos tickets et suivez l\'avancement des projets',
      icon: CheckSquare,
      status: 'connected',
      category: 'project-management',
      isPopular: true,
      lastSync: new Date(Date.now() - 600000),
      metrics: [
        { label: 'Issues', value: 12 },
        { label: 'En cours', value: 4 },
        { label: 'Terminées', value: 8 }
      ]
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Communication d\'équipe et notifications en temps réel',
      icon: MessageSquare,
      status: 'connected',
      category: 'communication',
      isPopular: true,
      lastSync: new Date(Date.now() - 120000),
      metrics: [
        { label: 'Canaux', value: 8 },
        { label: 'Messages', value: 156 },
        { label: 'Utilisateurs', value: 12 }
      ]
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Intégration avec Microsoft Teams pour la collaboration',
      icon: Users,
      status: 'disconnected',
      category: 'communication',
      isPopular: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automatisez vos workflows avec des milliers d\'apps',
      icon: Zap,
      status: 'disconnected',
      category: 'analytics',
      isPopular: true
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(
    integrations.find(i => i.id === 'gitlab') || null
  );

  const handleConnectIntegration = async (integrationId: string, ...args: any[]) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'configuring' as const }
        : integration
    ));

    // Simulation connexion
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'connected' as const,
              lastSync: new Date()
            }
          : integration
      ));
    }, 2000);

    return true;
  };

  const handleDisconnectIntegration = async (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const, lastSync: undefined }
        : integration
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'disconnected':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'configuring':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      case 'configuring':
        return Clock;
      default:
        return Settings;
    }
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  const totalMetrics = connectedIntegrations.reduce((acc, integration) => {
    if (integration.metrics) {
      integration.metrics.forEach(metric => {
        acc += metric.value;
      });
    }
    return acc;
  }, 0);

  const categorizedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) acc[integration.category] = [];
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Hub d'Intégrations
          </h1>
          <p className="text-muted-foreground mt-1">
            Connectez et gérez vos outils externes pour une productivité maximale
          </p>
        </div>

        <FloatingActionButton
          actions={[
            {
              icon: <Plus className="h-4 w-4" />,
              label: 'Nouvelle intégration',
              onClick: () => setActiveTab('browse')
            },
            {
              icon: <Settings className="h-4 w-4" />,
              label: 'Paramètres globaux',
              onClick: () => {}
            },
            {
              icon: <BarChart3 className="h-4 w-4" />,
              label: 'Analytics',
              onClick: () => setActiveTab('analytics')
            }
          ]}
        />
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedMetricCard
          title="Intégrations actives"
          value={connectedIntegrations.length}
          description={`${integrations.length - connectedIntegrations.length} disponibles`}
          trend="up"
          trendValue="+2 cette semaine"
          icon={Link}
          gradient="from-blue-500 to-purple-600"
          onClick={() => setActiveTab('overview')}
        />

        <AnimatedMetricCard
          title="Données synchronisées"
          value={totalMetrics}
          description="Éléments au total"
          trend="up"
          trendValue="+15% ce mois"
          icon={Activity}
          gradient="from-green-500 to-blue-600"
          onClick={() => setActiveTab('analytics')}
        />

        <AnimatedMetricCard
          title="Dernière sync"
          value={2}
          description="minutes"
          trend="neutral"
          trendValue="Temps réel"
          icon={CheckCircle}
          gradient="from-orange-500 to-red-600"
          onClick={() => {}}
        />

        <AnimatedMetricCard
          title="Collaboration"
          value={4}
          description="utilisateurs actifs"
          trend="up"
          trendValue="+1 aujourd'hui"
          icon={Users}
          gradient="from-purple-500 to-pink-600"
          onClick={() => setActiveTab('collaboration')}
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="gitlab">GitLab</TabsTrigger>
          <TabsTrigger value="jira">Jira</TabsTrigger>
          <TabsTrigger value="slack">Slack</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Integration Categories */}
          {Object.entries(categorizedIntegrations).map(([category, categoryIntegrations]) => (
            <InteractiveCard key={category} variant="glass" className="p-6">
              <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                {category === 'development' && <GitBranch className="h-5 w-5" />}
                {category === 'communication' && <MessageSquare className="h-5 w-5" />}
                {category === 'project-management' && <CheckSquare className="h-5 w-5" />}
                {category === 'analytics' && <BarChart3 className="h-5 w-5" />}
                {category.replace('-', ' ')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map((integration, index) => {
                  const StatusIcon = getStatusIcon(integration.status);
                  const IntegrationIcon = integration.icon;

                  return (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={cn(
                          "p-4 hover:shadow-md transition-all duration-200 cursor-pointer",
                          selectedIntegration?.id === integration.id && "ring-2 ring-primary"
                        )}
                        onClick={() => {
                          setSelectedIntegration(integration);
                          setActiveTab(integration.id);
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted/50 rounded-lg">
                              <IntegrationIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2">
                                {integration.name}
                                {integration.isPopular && (
                                  <Badge variant="secondary" className="text-xs">Populaire</Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {integration.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge variant="outline" className={getStatusColor(integration.status)}>
                              {integration.status}
                            </Badge>
                          </div>
                        </div>

                        {integration.metrics && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {integration.metrics.map((metric, i) => (
                              <div key={i} className="text-center">
                                <div className="text-lg font-semibold">{metric.value}</div>
                                <div className="text-xs text-muted-foreground">{metric.label}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {integration.lastSync && (
                          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Sync: {integration.lastSync.toLocaleTimeString()}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </InteractiveCard>
          ))}
        </TabsContent>

        <TabsContent value="gitlab" className="space-y-6">
          <GitLabIntegration
            isConnected={integrations.find(i => i.id === 'gitlab')?.status === 'connected'}
            onConnect={(token, url) => handleConnectIntegration('gitlab', token, url)}
            onDisconnect={() => handleDisconnectIntegration('gitlab')}
          />
        </TabsContent>

        <TabsContent value="jira" className="space-y-6">
          <JiraIntegration
            isConnected={integrations.find(i => i.id === 'jira')?.status === 'connected'}
            onConnect={(url, email, token) => handleConnectIntegration('jira', url, email, token)}
            onDisconnect={() => handleDisconnectIntegration('jira')}
          />
        </TabsContent>

        <TabsContent value="slack" className="space-y-6">
          <SlackIntegration
            isConnected={integrations.find(i => i.id === 'slack')?.status === 'connected'}
            onConnect={(token) => handleConnectIntegration('slack', token)}
            onDisconnect={() => handleDisconnectIntegration('slack')}
            workspaceUrl="arcadis.slack.com"
          />
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <RealTimeCollaboration
            roomId="integrations-hub"
            userId="current-admin"
            userName="Mamadou Diouf"
            userAvatar="/placeholder.svg"
            onJoinRoom={(roomId) => console.log('Joined room:', roomId)}
            onLeaveRoom={() => console.log('Left room')}
            onSendMessage={(message, mentions) => console.log('Send message:', message, mentions)}
            onStartVideoCall={() => console.log('Start video call')}
            onShareScreen={() => console.log('Share screen')}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
});