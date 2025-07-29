import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Users, 
  Phone, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Send,
  BarChart3,
  Zap,
  Globe,
  Bell,
  Shield,
  Activity,
  Link,
  Webhook,
  ArrowRight,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types pour les intégrations
interface Integration {
  id: string;
  type: 'slack' | 'teams' | 'whatsapp';
  name: string;
  enabled: boolean;
  status: 'connected' | 'error' | 'pending';
  settings: {
    notifications: boolean;
    channels: string[];
    autoRespond: boolean;
    filterKeywords: string[];
  };
  stats?: {
    messagesSent: number;
    messagesReceived: number;
    errorRate: number;
  };
  lastActivity?: string;
  webhookUrl?: string;
}

interface NotificationTest {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  platforms: string[];
}

interface IntegrationStats {
  totalIntegrations: number;
  activeIntegrations: number;
  platforms: {
    slack: number;
    teams: number;
    whatsapp: number;
  };
  notifications24h: {
    total: number;
    successful: number;
    failed: number;
  };
}

const ThirdPartyIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [stats, setStats] = useState<IntegrationStats>({
    totalIntegrations: 0,
    activeIntegrations: 0,
    platforms: { slack: 0, teams: 0, whatsapp: 0 },
    notifications24h: { total: 0, successful: 0, failed: 0 }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [testNotification, setTestNotification] = useState<NotificationTest>({
    title: 'Test Enterprise OS',
    message: 'Ceci est un message de test depuis Enterprise OS Genesis Framework',
    priority: 'medium',
    platforms: []
  });

  const { toast } = useToast();

  // Charger les intégrations
  useEffect(() => {
    loadIntegrations();
    loadStats();
    
    // Rafraîchir périodiquement
    const interval = setInterval(() => {
      loadStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadIntegrations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/functions/v1/third-party-integrations/config');
      const data = await response.json();
      
      if (data.success) {
        setIntegrations(data.data.integrations || []);
      }
    } catch (error) {
      console.error('Erreur chargement intégrations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les intégrations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/functions/v1/third-party-integrations/status');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.statistics);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  // Configurer une nouvelle intégration
  const setupIntegration = async (type: 'slack' | 'teams' | 'whatsapp') => {
    try {
      setIsLoading(true);
      
      switch (type) {
        case 'slack':
          await setupSlackIntegration();
          break;
        case 'teams':
          await setupTeamsIntegration();
          break;
        case 'whatsapp':
          await setupWhatsAppIntegration();
          break;
  }

      
    } catch (error) {
      console.error(`Erreur configuration ${type}:`, error);
      toast({
        title: "Erreur de configuration",
        description: `Impossible de configurer ${type}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupSlackIntegration = async () => {
    // Redirection vers OAuth Slack
    const clientId = 'your-slack-client-id'; // À configurer
    const scopes = 'chat:write,channels:read,groups:read,im:read,mpim:read';
    const redirectUri = `${window.location.origin}/functions/v1/third-party-integrations/slack/oauth`;
    
    const oauthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
    
    window.open(oauthUrl, 'slack-oauth', 'width=600,height=600');
  };

  const setupTeamsIntegration = async () => {
    // Redirection vers OAuth Teams
    const clientId = 'your-teams-client-id'; // À configurer
    const scopes = 'User.Read Chat.ReadWrite';
    const redirectUri = `${window.location.origin}/functions/v1/third-party-integrations/teams/oauth`;
    
    const oauthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
    
    window.open(oauthUrl, 'teams-oauth', 'width=600,height=600');
  };

  const setupWhatsAppIntegration = async () => {
    // Configuration manuelle WhatsApp Business
    const phoneNumberId = prompt('Phone Number ID WhatsApp Business:');
    const accessToken = prompt('Access Token WhatsApp:');
    
    if (phoneNumberId && accessToken) {
      const response = await fetch('/functions/v1/third-party-integrations/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'whatsapp',
          name: `WhatsApp Business - ${phoneNumberId}`,
          credentials: {
            phoneNumberId,
            accessToken
          },
          settings: {
            notifications: true,
            channels: [],
            autoRespond: false,
            filterKeywords: []
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "WhatsApp configuré",
          description: "WhatsApp Business a été configuré avec succès",
          variant: "default"
        });
        loadIntegrations();
      }
    }
  };

  // Basculer l'état d'une intégration
  const toggleIntegration = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/functions/v1/third-party-integrations/config/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      
      if (response.ok) {
        setIntegrations(prev => 
          prev.map(int => 
            int.id === id ? { ...int, enabled } : int
          )
        );
        
        toast({
          title: enabled ? "Intégration activée" : "Intégration désactivée",
          description: `L'intégration a été ${enabled ? 'activée' : 'désactivée'}`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erreur toggle intégration:', error);
    }
  };

  // Tester les intégrations
  const testIntegrations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/functions/v1/third-party-integrations/test');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Test terminé",
          description: `${data.data.summary.connected}/${data.data.summary.total} intégrations fonctionnelles`,
          variant: "default"
        });
        
        // Mettre à jour les statuts
        setIntegrations(prev => 
          prev.map(int => {
            const testResult = data.data.tests.find(t => t.id === int.id);
            return testResult ? { ...int, status: testResult.status } : int;
          })
        );
      }
    } catch (error) {
      console.error('Erreur test intégrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Envoyer notification test
  const sendTestNotification = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/functions/v1/third-party-integrations/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testNotification)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Notification envoyée",
          description: `Envoyée sur ${data.data.successCount}/${data.data.totalCount} plateformes`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erreur notification test:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification test",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une intégration
  const deleteIntegration = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette intégration ?')) return;
    
    try {
      const response = await fetch(`/functions/v1/third-party-integrations/config/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setIntegrations(prev => prev.filter(int => int.id !== id));
        toast({
          title: "Intégration supprimée",
          description: "L'intégration a été supprimée avec succès",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erreur suppression intégration:', error);
    }
  };

  // Obtenir l'icône pour chaque plateforme
  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'slack': return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'teams': return <Users className="h-5 w-5 text-blue-500" />;
      case 'whatsapp': return <Phone className="h-5 w-5 text-green-500" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Connecté</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" />Erreur</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><AlertTriangle className="h-3 w-3 mr-1" />En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const successRate = stats.notifications24h.total > 0 
    ? Math.round((stats.notifications24h.successful / stats.notifications24h.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Link className="h-6 w-6 text-blue-500" />
            Intégrations Tierces
          </h2>
          <p className="text-gray-600">Slack • Microsoft Teams • WhatsApp Business • Webhooks</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={testIntegrations} variant="outline" disabled={isLoading}>
            <Zap className="h-4 w-4 mr-2" />
            Tester tout
          </Button>
          <Button onClick={loadIntegrations} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Intégrations</p>
                <p className="text-2xl font-bold">{stats.activeIntegrations}/{stats.totalIntegrations}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Notifications 24h</p>
                <p className="text-2xl font-bold">{stats.notifications24h.total}</p>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de succès</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={successRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plateformes</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">{stats.platforms.slack} Slack</Badge>
                  <Badge variant="outline" className="text-xs">{stats.platforms.teams} Teams</Badge>
                  <Badge variant="outline" className="text-xs">{stats.platforms.whatsapp} WA</Badge>
                </div>
              </div>
              <Globe className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="setup">Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Tab Intégrations */}
        <TabsContent value="integrations" className="space-y-4">
          {integrations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune intégration configurée</h3>
                <p className="text-gray-600 mb-4">Commencez par configurer vos premières intégrations</p>
                <Button onClick={() => setupIntegration('slack')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une intégration
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(integration.type)}
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Actif</Label>
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={(enabled) => toggleIntegration(integration.id, enabled)}
                      />
                    </div>
                    
                    {integration.stats && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Messages envoyés</span>
                          <span className="font-medium">{integration.stats.messagesSent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Messages reçus</span>
                          <span className="font-medium">{integration.stats.messagesReceived}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux d'erreur</span>
                          <span className="font-medium">{integration.stats.errorRate}%</span>
                        </div>
                      </div>
                    )}
                    
                    {integration.lastActivity && (
                      <p className="text-xs text-gray-500">
                        Dernière activité: {new Date(integration.lastActivity).toLocaleString()}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedIntegration(integration)}
                        className="flex-1"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteIntegration(integration.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab Configuration */}
        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Slack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Slack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Connectez votre workspace Slack pour recevoir des notifications et gérer les conversations.
                </p>
                <Button 
                  onClick={() => setupIntegration('slack')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Configurer Slack
                </Button>
                <div className="text-xs text-gray-500">
                  <p>Permissions requises:</p>
                  <ul className="list-disc list-inside">
                    <li>chat:write</li>
                    <li>channels:read</li>
                    <li>groups:read</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Microsoft Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Microsoft Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Intégrez avec Microsoft Teams pour les notifications et la collaboration.
                </p>
                <Button 
                  onClick={() => setupIntegration('teams')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Configurer Teams
                </Button>
                <div className="text-xs text-gray-500">
                  <p>Permissions requises:</p>
                  <ul className="list-disc list-inside">
                    <li>User.Read</li>
                    <li>Chat.ReadWrite</li>
                    <li>ChannelMessage.Send</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Business */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-500" />
                  WhatsApp Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Connectez WhatsApp Business API pour les notifications mobiles.
                </p>
                <Button 
                  onClick={() => setupIntegration('whatsapp')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Configurer WhatsApp
                </Button>
                <div className="text-xs text-gray-500">
                  <p>Requis:</p>
                  <ul className="list-disc list-inside">
                    <li>Phone Number ID</li>
                    <li>Access Token</li>
                    <li>Webhook Token</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Test de Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={testNotification.title}
                    onChange={(e) => setTestNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la notification"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <select
                    value={testNotification.priority}
                    onChange={(e) => setTestNotification(prev => ({ ...prev, priority: e.target.value as unknown }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Message</Label>
                <textarea
                  value={testNotification.message}
                  onChange={(e) => setTestNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Contenu de la notification"
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <Button 
                onClick={sendTestNotification} 
                disabled={isLoading || integrations.filter(i => i.enabled).length === 0}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer test ({integrations.filter(i => i.enabled).length} plateformes)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Monitoring */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.notifications24h.total > 0 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Notifications envoyées</span>
                        <Badge>{stats.notifications24h.successful}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Échecs</span>
                        <Badge variant="destructive">{stats.notifications24h.failed}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Taux de succès</span>
                        <Badge variant="outline">{successRate}%</Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-4">Aucune activité récente</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(integration.type)}
                        <span className="text-sm">{integration.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {integration.webhookUrl ? (
                          <Badge className="bg-green-100 text-green-700">
                            <Webhook className="h-3 w-3 mr-1" />
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="outline">Non configuré</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de configuration d'intégration */}
      {selectedIntegration && (
        <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getPlatformIcon(selectedIntegration.type)}
                Configuration {selectedIntegration.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notifications</Label>
                <Switch checked={selectedIntegration.settings.notifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Réponse automatique</Label>
                <Switch checked={selectedIntegration.settings.autoRespond} />
              </div>
              <div className="space-y-2">
                <Label>Canaux</Label>
                <Input 
                  placeholder="Canal ou numéro"
                  value={selectedIntegration.settings.channels[0] || ''}
                />
              </div>
              <div className="space-y-2">
                <Label>Mots-clés de filtrage</Label>
                <Input 
                  placeholder="urgent, important, alerte"
                  value={selectedIntegration.settings.filterKeywords.join(', ')}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                  Annuler
                </Button>
                <Button>
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ThirdPartyIntegrations; 