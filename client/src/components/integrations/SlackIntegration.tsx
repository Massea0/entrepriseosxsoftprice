import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Hash, 
  Users, 
  Bot,
  Send,
  Bell,
  Pin,
  AtSign,
  Settings,
  RefreshCw,
  ExternalLink,
  User,
  Clock,
  CheckCircle,
  Star,
  Paperclip,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_private: boolean;
  is_im: boolean;
  is_group: boolean;
  topic: {
    value: string;
  };
  purpose: {
    value: string;
  };
  num_members: number;
  is_member: boolean;
}

interface SlackMessage {
  ts: string;
  type: string;
  user: string;
  username?: string;
  text: string;
  channel: string;
  edited?: {
    ts: string;
  };
  reactions?: Array<{
    name: string;
    count: number;
    users: string[];
  }>;
  files?: Array<{
    id: string;
    name: string;
    mimetype: string;
    filetype: string;
    size: number;
  }>;
  thread_ts?: string;
  reply_count?: number;
}

interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    display_name: string;
    image_72: string;
    status_text: string;
    status_emoji: string;
  };
  is_bot: boolean;
  is_admin: boolean;
  is_owner: boolean;
  presence: 'active' | 'away';
}

interface SlackIntegrationProps {
  className?: string;
  onConnect?: (token: string) => Promise<boolean>;
  onDisconnect?: () => Promise<void>;
  onSendMessage?: (channel: string, message: string) => Promise<boolean>;
  isConnected?: boolean;
  workspaceUrl?: string;
}

export const SlackIntegration = memo(function SlackIntegration({
  className,
  onConnect,
  onDisconnect,
  onSendMessage,
  isConnected = false,
  workspaceUrl
}: SlackIntegrationProps) {
  const [slackToken, setSlackToken] = useState('');
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [users, setUsers] = useState<SlackUser[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<SlackChannel | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Mock data pour démonstration
  useEffect(() => {
    if (isConnected) {
      const mockUsers: SlackUser[] = [
        {
          id: 'U1234567',
          name: 'mamadou.diouf',
          real_name: 'Mamadou Diouf',
          profile: {
            display_name: 'Mamadou Diouf',
            image_72: '/placeholder.svg',
            status_text: 'En développement',
            status_emoji: ':computer:'
          },
          is_bot: false,
          is_admin: true,
          is_owner: true,
          presence: 'active'
        },
        {
          id: 'U2345678',
          name: 'sarah.johnson',
          real_name: 'Sarah Johnson',
          profile: {
            display_name: 'Sarah Johnson',
            image_72: '/placeholder.svg',
            status_text: 'En réunion',
            status_emoji: ':calendar:'
          },
          is_bot: false,
          is_admin: false,
          is_owner: false,
          presence: 'away'
        },
        {
          id: 'B3456789',
          name: 'arcadis-bot',
          real_name: 'Arcadis Assistant',
          profile: {
            display_name: 'Arcadis Bot',
            image_72: '/placeholder.svg',
            status_text: '',
            status_emoji: ''
          },
          is_bot: true,
          is_admin: false,
          is_owner: false,
          presence: 'active'
        }
      ];

      const mockChannels: SlackChannel[] = [
        {
          id: 'C1234567890',
          name: 'general',
          is_channel: true,
          is_private: false,
          is_im: false,
          is_group: false,
          topic: {
            value: 'Canal principal pour les discussions générales'
          },
          purpose: {
            value: 'Espace de discussion principale de l\'équipe Arcadis'
          },
          num_members: 15,
          is_member: true
        },
        {
          id: 'C2345678901',
          name: 'development',
          is_channel: true,
          is_private: false,
          is_im: false,
          is_group: false,
          topic: {
            value: 'Discussions techniques et développement'
          },
          purpose: {
            value: 'Canal dédié aux discussions de développement'
          },
          num_members: 8,
          is_member: true
        },
        {
          id: 'C3456789012',
          name: 'alerts',
          is_channel: true,
          is_private: false,
          is_im: false,
          is_group: false,
          topic: {
            value: 'Alertes automatiques du système'
          },
          purpose: {
            value: 'Notifications automatiques des systèmes'
          },
          num_members: 12,
          is_member: true
        },
        {
          id: 'G4567890123',
          name: 'management-team',
          is_channel: false,
          is_private: true,
          is_im: false,
          is_group: true,
          topic: {
            value: 'Discussions équipe management'
          },
          purpose: {
            value: 'Canal privé pour l\'équipe de management'
          },
          num_members: 4,
          is_member: true
        }
      ];

      const mockMessages: SlackMessage[] = [
        {
          ts: (Date.now() / 1000 - 3600).toString(),
          type: 'message',
          user: 'U1234567',
          text: 'L\'intégration GitLab est maintenant fonctionnelle ! 🎉 Vous pouvez synchroniser vos projets depuis le dashboard admin.',
          channel: 'C1234567890',
          reactions: [
            { name: 'tada', count: 3, users: ['U2345678', 'B3456789', 'U4567890'] },
            { name: 'rocket', count: 2, users: ['U2345678', 'U4567890'] }
          ]
        },
        {
          ts: (Date.now() / 1000 - 1800).toString(),
          type: 'message',
          user: 'U2345678',
          text: 'Excellent travail ! J\'ai testé la nouvelle interface de performance monitoring, c\'est vraiment impressionnant.',
          channel: 'C1234567890'
        },
        {
          ts: (Date.now() / 1000 - 900).toString(),
          type: 'message',
          user: 'B3456789',
          username: 'Arcadis Bot',
          text: '🤖 *Rapport automatique* - Performance du système:\n• CPU: 23%\n• Mémoire: 67%\n• Temps de réponse: 245ms\n• Status: ✅ Optimal',
          channel: 'C3456789012'
        },
        {
          ts: (Date.now() / 1000 - 600).toString(),
          type: 'message',
          user: 'U1234567',
          text: '@channel Déploiement prévu à 15h00 pour les nouvelles fonctionnalités d\'intégration. Préparez vos tests !',
          channel: 'C2345678901',
          reactions: [
            { name: 'eyes', count: 5, users: ['U2345678', 'U3456789', 'U4567890', 'U5678901', 'U6789012'] }
          ]
        }
      ];

      setUsers(mockUsers);
      setChannels(mockChannels);
      setMessages(mockMessages);
      setSelectedChannel(mockChannels[0]);
      setLastSync(new Date());
    }
  }, [isConnected]);

  const handleConnect = async () => {
    if (!slackToken) return;
    
    setIsLoading(true);
    try {
      const success = await onConnect?.(slackToken);
      if (success) {
        setLastSync(new Date());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await onDisconnect?.();
      setChannels([]);
      setMessages([]);
      setUsers([]);
      setSelectedChannel(null);
      setLastSync(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !onSendMessage) return;
    
    setIsSending(true);
    try {
      const success = await onSendMessage(selectedChannel.id, newMessage);
      if (success) {
        // Ajouter le message localement pour feedback immédiat
        const newMsg: SlackMessage = {
          ts: (Date.now() / 1000).toString(),
          type: 'message',
          user: 'U1234567', // Current user
          text: newMessage,
          channel: selectedChannel.id
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
      }
    } finally {
      setIsSending(false);
    }
  };

  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getChannelMessages = () => {
    if (!selectedChannel) return [];
    return messages.filter(msg => msg.channel === selectedChannel.id);
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(parseFloat(ts) * 1000);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isConnected) {
    return (
      <motion.div
        className={cn('w-full', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InteractiveCard variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Slack Integration</h3>
              <p className="text-muted-foreground">Connectez votre workspace Slack pour la communication d'équipe</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="slack-token">Token Bot Slack</Label>
              <Input
                id="slack-token"
                type="password"
                value={slackToken}
                onChange={(e) => setSlackToken(e.target.value)}
                placeholder="xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Créez une application Slack et générez un Bot User OAuth Token
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Instructions de configuration:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Allez sur api.slack.com et créez une nouvelle app</li>
                <li>Activez les permissions: channels:read, chat:write, users:read</li>
                <li>Installez l'app dans votre workspace</li>
                <li>Copiez le Bot User OAuth Token ici</li>
              </ol>
            </div>

            <Button 
              onClick={handleConnect}
              disabled={!slackToken || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2" />
              )}
              Se connecter à Slack
            </Button>
          </div>
        </InteractiveCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn('w-full space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Slack Integration</h3>
            <p className="text-muted-foreground">
              Connecté {workspaceUrl && `à ${workspaceUrl}`} • Dernière sync: {lastSync?.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastSync(new Date())}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
          >
            <Settings className="h-4 w-4 mr-2" />
            Déconnecter
          </Button>
        </div>
      </div>

      {/* Workspace Overview */}
      <InteractiveCard variant="gradient" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Canaux', 
              value: channels.filter(c => c.is_channel).length, 
              icon: '📺',
              color: 'text-blue-600' 
            },
            { 
              label: 'Groupes privés', 
              value: channels.filter(c => c.is_group || c.is_private).length, 
              icon: '🔒',
              color: 'text-orange-600' 
            },
            { 
              label: 'Utilisateurs', 
              value: users.filter(u => !u.is_bot).length, 
              icon: '👥',
              color: 'text-green-600' 
            },
            { 
              label: 'Bots actifs', 
              value: users.filter(u => u.is_bot).length, 
              icon: '🤖',
              color: 'text-purple-600' 
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 bg-background/50 rounded-lg"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </InteractiveCard>

      {/* Content Tabs */}
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="channels">
            <Hash className="h-4 w-4 mr-2" />
            Canaux
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Équipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96">
            {/* Channel Sidebar */}
            <div className="lg:col-span-1 border rounded-lg p-4 overflow-y-auto">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Canaux
              </h4>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={cn(
                      "w-full text-left p-2 rounded text-sm hover:bg-muted/50 transition-colors",
                      selectedChannel?.id === channel.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {channel.is_private ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Hash className="h-3 w-3" />
                      )}
                      <span className="truncate">{channel.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {channel.num_members} membres
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 border rounded-lg flex flex-col">
              {/* Chat Header */}
              {selectedChannel && (
                <div className="p-4 border-b bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedChannel.is_private ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Hash className="h-4 w-4" />
                    )}
                    <h4 className="font-medium">{selectedChannel.name}</h4>
                    <Badge variant="outline">{selectedChannel.num_members} membres</Badge>
                  </div>
                  {selectedChannel.topic.value && (
                    <p className="text-xs text-muted-foreground">{selectedChannel.topic.value}</p>
                  )}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <AnimatePresence>
                  {getChannelMessages().map((message, index) => {
                    const user = getUserInfo(message.user);
                    return (
                      <motion.div
                        key={message.ts}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
                          {user?.profile.display_name[0] || message.username?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {user?.profile.display_name || message.username || 'Utilisateur'}
                            </span>
                            {user?.is_bot && (
                              <Badge variant="secondary" className="text-xs">BOT</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(message.ts)}
                            </span>
                          </div>
                          <div className="text-sm text-foreground mb-2">
                            {message.text}
                          </div>
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex gap-1">
                              {message.reactions.map((reaction) => (
                                <Badge
                                  key={reaction.name}
                                  variant="outline"
                                  className="text-xs px-2 py-1"
                                >
                                  :{reaction.name}: {reaction.count}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Envoyer un message dans #${selectedChannel?.name || 'canal'}`}
                    className="flex-1 min-h-[40px] max-h-[100px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    size="sm"
                  >
                    {isSending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {channels.map((channel, index) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {channel.is_private ? (
                          <Lock className="h-5 w-5 text-orange-600" />
                        ) : (
                          <Hash className="h-5 w-5 text-blue-600" />
                        )}
                        <h4 className="font-medium">{channel.name}</h4>
                      </div>
                      
                      <Badge variant={channel.is_member ? "default" : "outline"}>
                        {channel.is_member ? 'Membre' : 'Non membre'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {channel.topic.value || channel.purpose.value || 'Aucune description'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {channel.num_members} membres
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedChannel(channel)}
                      >
                        Voir
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
                          {user.profile.display_name[0]}
                        </div>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                          user.presence === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{user.profile.display_name}</h4>
                          {user.is_bot && (
                            <Badge variant="secondary" className="text-xs">BOT</Badge>
                          )}
                          {user.is_admin && (
                            <Badge variant="outline" className="text-xs">ADMIN</Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">@{user.name}</p>
                        
                        {user.profile.status_text && (
                          <p className="text-xs text-muted-foreground">
                            {user.profile.status_emoji} {user.profile.status_text}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-1 mt-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            user.presence === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          )} />
                          <span className="text-xs text-muted-foreground">
                            {user.presence === 'active' ? 'Actif' : 'Absent'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
});

export default SlackIntegration;