import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageCircle, 
  Edit3, 
  Eye, 
  Hand,
  MousePointer2,
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  FileText,
  Share2,
  Clock,
  CheckCircle,
  Circle,
  User,
  Send,
  Paperclip,
  Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

interface CollaboratorCursor {
  userId: string;
  x: number;
  y: number;
  color: string;
  name: string;
  lastUpdate: number;
}

interface ActiveUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  currentPage: string;
  isTyping: boolean;
  role: 'admin' | 'manager' | 'employee' | 'client';
  cursor?: CollaboratorCursor;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  mentions?: string[];
  reactions?: { [emoji: string]: string[] };
}

interface DocumentEdit {
  id: string;
  userId: string;
  userName: string;
  action: 'edit' | 'comment' | 'view';
  documentId: string;
  documentName: string;
  timestamp: Date;
  change?: string;
}

interface RealTimeCollaborationProps {
  className?: string;
  roomId?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  onJoinRoom?: (roomId: string) => void;
  onLeaveRoom?: () => void;
  onSendMessage?: (message: string, mentions?: string[]) => void;
  onStartVideoCall?: () => void;
  onShareScreen?: () => void;
}

export const RealTimeCollaboration = memo(function RealTimeCollaboration({
  className,
  roomId = 'main-workspace',
  userId = 'current-user',
  userName = 'Utilisateur actuel',
  userAvatar = '/placeholder.svg',
  onJoinRoom,
  onLeaveRoom,
  onSendMessage,
  onStartVideoCall,
  onShareScreen
}: RealTimeCollaborationProps) {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [documentEdits, setDocumentEdits] = useState<DocumentEdit[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cursors, setCursors] = useState<CollaboratorCursor[]>([]);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const cursorTrackingRef = useRef<HTMLDivElement>(null);

  // Mock data pour démonstration
  useEffect(() => {
    const mockUsers: ActiveUser[] = [
      {
        id: 'user1',
        name: 'Mamadou Diouf',
        email: 'mdiouf@arcadis.tech',
        avatar: '/placeholder.svg',
        status: 'online',
        lastSeen: 'Maintenant',
        currentPage: '/admin/performance',
        isTyping: false,
        role: 'admin',
        cursor: {
          userId: 'user1',
          x: 250,
          y: 150,
          color: '#3b82f6',
          name: 'Mamadou',
          lastUpdate: Date.now()
        }
      },
      {
        id: 'user2',
        name: 'Sarah Johnson',
        email: 'sarah@arcadis.tech',
        avatar: '/placeholder.svg',
        status: 'online',
        lastSeen: 'Maintenant',
        currentPage: '/manager/team',
        isTyping: true,
        role: 'manager',
        cursor: {
          userId: 'user2',
          x: 400,
          y: 280,
          color: '#10b981',
          name: 'Sarah',
          lastUpdate: Date.now()
        }
      },
      {
        id: 'user3',
        name: 'Alex Martin',
        email: 'alex@arcadis.tech',
        avatar: '/placeholder.svg',
        status: 'away',
        lastSeen: 'Il y a 5 minutes',
        currentPage: '/employee/dashboard',
        isTyping: false,
        role: 'employee'
      },
      {
        id: 'user4',
        name: 'Client Demo',
        email: 'client@example.com',
        avatar: '/placeholder.svg',
        status: 'online',
        lastSeen: 'Maintenant',
        currentPage: '/client/projects',
        isTyping: false,
        role: 'client'
      }
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: 'msg1',
        userId: 'user1',
        userName: 'Mamadou Diouf',
        userAvatar: '/placeholder.svg',
        message: 'Les nouvelles intégrations GitLab et Jira sont maintenant disponibles !',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        reactions: { '🎉': ['user2', 'user3'], '👍': ['user2'] }
      },
      {
        id: 'msg2',
        userId: 'user2',
        userName: 'Sarah Johnson',
        userAvatar: '/placeholder.svg',
        message: 'Excellent ! J\'ai testé l\'intégration Slack, elle fonctionne parfaitement avec les notifications d\'équipe.',
        timestamp: new Date(Date.now() - 240000),
        type: 'text'
      },
      {
        id: 'msg3',
        userId: 'system',
        userName: 'Système',
        userAvatar: '',
        message: 'Alex Martin a rejoint la collaboration temps réel',
        timestamp: new Date(Date.now() - 180000),
        type: 'system'
      },
      {
        id: 'msg4',
        userId: 'user3',
        userName: 'Alex Martin',
        userAvatar: '/placeholder.svg',
        message: '@Mamadou Diouf Peux-tu me montrer comment configurer l\'intégration Jira ?',
        timestamp: new Date(Date.now() - 120000),
        type: 'text',
        mentions: ['user1']
      }
    ];

    const mockEdits: DocumentEdit[] = [
      {
        id: 'edit1',
        userId: 'user1',
        userName: 'Mamadou Diouf',
        action: 'edit',
        documentId: 'perf-dashboard',
        documentName: 'Performance Dashboard',
        timestamp: new Date(Date.now() - 600000),
        change: 'Ajout du composant PerformanceOptimizer'
      },
      {
        id: 'edit2',
        userId: 'user2',
        userName: 'Sarah Johnson',
        action: 'comment',
        documentId: 'team-management',
        documentName: 'Gestion d\'équipe',
        timestamp: new Date(Date.now() - 480000),
        change: 'Commentaire sur l\'interface d\'approbation'
      },
      {
        id: 'edit3',
        userId: 'user3',
        userName: 'Alex Martin',
        action: 'view',
        documentId: 'employee-profile',
        documentName: 'Profil employé',
        timestamp: new Date(Date.now() - 300000)
      }
    ];

    setActiveUsers(mockUsers);
    setChatMessages(mockMessages);
    setDocumentEdits(mockEdits);
    setCursors(mockUsers.filter(u => u.cursor).map(u => u.cursor!));
  }, []);

  // Simulation de mouvement de curseur
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(prev => prev.map(cursor => ({
        ...cursor,
        x: cursor.x + (Math.random() - 0.5) * 20,
        y: cursor.y + (Math.random() - 0.5) * 20,
        lastUpdate: Date.now()
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const mentions = newMessage.match(/@(\w+)/g)?.map(mention => mention.slice(1)) || [];
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId,
      userName,
      userAvatar,
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
      mentions: mentions.length > 0 ? mentions : undefined
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    onSendMessage?.(newMessage, mentions);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[emoji]) {
          if (reactions[emoji].includes(userId)) {
            reactions[emoji] = reactions[emoji].filter(id => id !== userId);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji].push(userId);
          }
        } else {
          reactions[emoji] = [userId];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 dark:text-red-400';
      case 'manager':
        return 'text-blue-600 dark:text-blue-400';
      case 'employee':
        return 'text-green-600 dark:text-green-400';
      case 'client':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Collaboration Temps Réel</h3>
            <p className="text-muted-foreground">
              {activeUsers.filter(u => u.status === 'online').length} utilisateurs connectés
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isVideoCallActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setIsVideoCallActive(!isVideoCallActive);
              onStartVideoCall?.();
            }}
          >
            <Video className="h-4 w-4 mr-2" />
            Visio
          </Button>
          
          <Button
            variant={isScreenSharing ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setIsScreenSharing(!isScreenSharing);
              onShareScreen?.();
            }}
          >
            <ScreenShare className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      {/* Video Call Bar */}
      <AnimatePresence>
        {isVideoCallActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InteractiveCard variant="glass" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Appel vidéo en cours</span>
                  </div>
                  <Badge variant="outline">
                    {activeUsers.filter(u => u.status === 'online').length} participants
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isMuted ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={isVideoOff ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsVideoCallActive(false)}
                  >
                    Raccrocher
                  </Button>
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users */}
        <div className="lg:col-span-1">
          <InteractiveCard variant="gradient" className="p-4 h-fit">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs actifs ({activeUsers.length})
            </h4>
            
            <div className="space-y-3">
              {activeUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                      getStatusColor(user.status)
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      {user.isTyping && (
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100" />
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.currentPage}</p>
                    <Badge variant="outline" className={cn("text-xs", getRoleColor(user.role))}>
                      {user.role}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>

          {/* Recent Document Activity */}
          <InteractiveCard variant="glass" className="p-4 mt-6">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Activité récente
            </h4>
            
            <div className="space-y-3">
              {documentEdits.slice(0, 5).map((edit, index) => (
                <motion.div
                  key={edit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                    {edit.action === 'edit' ? (
                      <Edit3 className="h-3 w-3" />
                    ) : edit.action === 'comment' ? (
                      <MessageCircle className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs">
                      <span className="font-medium">{edit.userName}</span>
                      {edit.action === 'edit' ? ' a modifié ' : 
                       edit.action === 'comment' ? ' a commenté ' : ' a consulté '}
                      <span className="font-medium">{edit.documentName}</span>
                    </p>
                    {edit.change && (
                      <p className="text-xs text-muted-foreground mt-1">{edit.change}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(edit.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2">
          <InteractiveCard variant="default" className="h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat collaboration
              </h4>
              <Badge variant="outline">
                {chatMessages.length} messages
              </Badge>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3"
            >
              <AnimatePresence>
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex gap-3",
                      message.type === 'system' && "justify-center"
                    )}
                  >
                    {message.type !== 'system' && (
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarImage src={message.userAvatar} />
                        <AvatarFallback>{message.userName[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={cn(
                      "flex-1",
                      message.type === 'system' && "text-center"
                    )}>
                      {message.type !== 'system' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div className={cn(
                        "text-sm",
                        message.type === 'system' && "text-muted-foreground italic"
                      )}>
                        {message.message.split(' ').map((word, i) => {
                          if (word.startsWith('@')) {
                            return (
                              <span key={i} className="text-primary font-medium">
                                {word}{' '}
                              </span>
                            );
                          }
                          return word + ' ';
                        })}
                      </div>
                      
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {Object.entries(message.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className={cn(
                                "text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors",
                                users.includes(userId) && "bg-primary/20 text-primary"
                              )}
                            >
                              {emoji} {users.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message... (@mention pour mentionner)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 mt-2">
                {['👍', '❤️', '😊', '🎉', '👏'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      if (chatMessages.length > 0) {
                        handleReaction(chatMessages[chatMessages.length - 1].id, emoji);
                      }
                    }}
                    className="text-lg hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </InteractiveCard>
        </div>
      </div>

      {/* Cursors Overlay */}
      <div 
        ref={cursorTrackingRef}
        className="fixed inset-0 pointer-events-none z-50"
      >
        <AnimatePresence>
          {cursors.map((cursor) => (
            <motion.div
              key={cursor.userId}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: cursor.x,
                y: cursor.y
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{ 
                left: 0, 
                top: 0,
                transform: `translate(${cursor.x}px, ${cursor.y}px)`
              }}
            >
              <div className="relative">
                <MousePointer2 
                  className="h-5 w-5" 
                  style={{ color: cursor.color }}
                />
                <div 
                  className="absolute top-5 left-2 px-2 py-1 text-xs text-white rounded-md whitespace-nowrap"
                  style={{ backgroundColor: cursor.color }}
                >
                  {cursor.name}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default RealTimeCollaboration;