import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { AnimatedMetricCard } from '@/components/ui/animated-metric-card';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  HelpCircle, 
  Book, 
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Send,
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  FileText,
  Video,
  Headphones,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  HoverZone,
  StaggeredList,
  StaggeredItem,
  MagneticButton,
  EnhancedCard,
  LiquidContainer,
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature' | 'bug';
  description: string;
  createdAt: string;
  updatedAt: string;
  messages: number;
  assignedTo?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

export default function ClientSupport() {
  const [selectedTab, setSelectedTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');

  // Mock data for tickets
  const tickets: Ticket[] = [
    {
      id: '1',
      title: 'Problème de connexion à l\'application mobile',
      status: 'in-progress',
      priority: 'high',
      category: 'technical',
      description: 'Impossible de se connecter depuis la mise à jour d\'hier',
      createdAt: '2025-01-20',
      updatedAt: '2025-01-22',
      messages: 3,
      assignedTo: 'Thomas Dupont'
    },
    {
      id: '2',
      title: 'Question sur la facturation',
      status: 'resolved',
      priority: 'medium',
      category: 'billing',
      description: 'Clarification nécessaire sur les frais de maintenance',
      createdAt: '2025-01-18',
      updatedAt: '2025-01-21',
      messages: 5
    },
    {
      id: '3',
      title: 'Demande de nouvelle fonctionnalité',
      status: 'open',
      priority: 'low',
      category: 'feature',
      description: 'Possibilité d\'exporter les données en CSV',
      createdAt: '2025-01-22',
      updatedAt: '2025-01-22',
      messages: 1
    }
  ];

  // Mock data for FAQ
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Comment puis-je accéder à mes factures ?',
      answer: 'Vous pouvez accéder à vos factures depuis l\'onglet "Factures" de votre tableau de bord. Toutes vos factures sont disponibles au téléchargement en format PDF.',
      category: 'Facturation',
      helpful: 25,
      notHelpful: 2,
      tags: ['factures', 'téléchargement', 'PDF']
    },
    {
      id: '2',
      question: 'Comment suivre l\'avancement de mon projet ?',
      answer: 'Dans l\'onglet "Projets", vous pouvez voir le statut en temps réel, la progression, et accéder aux documents liés à votre projet. Des notifications vous informent des mises à jour importantes.',
      category: 'Projets',
      helpful: 18,
      notHelpful: 1,
      tags: ['projets', 'suivi', 'progression']
    },
    {
      id: '3',
      question: 'Que faire si j\'ai un problème technique ?',
      answer: 'Créez un ticket de support en décrivant votre problème. Notre équipe technique vous répondra dans les plus brefs délais. Pour les urgences, utilisez le chat en direct.',
      category: 'Support',
      helpful: 32,
      notHelpful: 0,
      tags: ['support', 'technique', 'urgence']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in-progress': return 'En cours';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    return ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredFAQ = faqItems.filter(item => {
    return item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const supportMetrics = [
    {
      title: 'Tickets Ouverts',
      value: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
      description: 'En cours de traitement',
      trend: 'down' as const,
      trendValue: '-2 cette semaine',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Temps de Réponse',
      value: '2h',
      description: 'Moyenne actuelle',
      trend: 'up' as const,
      trendValue: 'Amélioration 30%',
      icon: Clock,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Taux de Résolution',
      value: '95%',
      description: 'Ce mois-ci',
      trend: 'up' as const,
      trendValue: '+5% vs mois dernier',
      icon: CheckCircle2,
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Satisfaction',
      value: '4.8/5',
      description: 'Note moyenne support',
      trend: 'up' as const,
      trendValue: '+0.3 ce trimestre',
      icon: Star,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const handleCreateTicket = () => {
    if (newTicketTitle.trim() && newTicketDescription.trim()) {
      console.log('Création ticket:', { title: newTicketTitle, description: newTicketDescription });
      setNewTicketTitle('');
      setNewTicketDescription('');
    }
  };

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={25} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Hero Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-4">
                <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Headphones className="h-10 w-10 text-white" />
                </LiquidContainer>
                <div>
                  <TypewriterText
                    text="Support Client"
                    className="text-4xl font-bold mb-2"
                    speed={50}
                  />
                  <GlowText className="text-lg text-purple-100">
                    Assistance technique et support pour vos projets 🎧
                  </GlowText>
                </div>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Métriques Support */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportMetrics.map((metric, index) => (
            <StaggeredItem key={metric.title} index={index}>
              <AnimatedMetricCard
                title={metric.title}
                value={metric.value}
                description={metric.description}
                trend={metric.trend}
                trendValue={metric.trendValue}
                icon={metric.icon}
                gradient={metric.gradient}
                delay={index * 0.1}
                onClick={() => console.log(`Navigate to ${metric.title}`)}
              />
            </StaggeredItem>
          ))}
        </StaggeredList>

        {/* Actions Rapides */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggeredItem index={0}>
            <HoverZone effect="lift">
              <EnhancedCard variant="glow" className="p-6 text-center">
                <LiquidContainer className="h-16 w-16 mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-blue-600" />
                </LiquidContainer>
                <h3 className="font-semibold text-lg mb-2">Chat en Direct</h3>
                <p className="text-muted-foreground mb-4">
                  Assistance immédiate avec un conseiller
                </p>
                <MagneticButton className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                  Démarrer le Chat
                </MagneticButton>
              </EnhancedCard>
            </HoverZone>
          </StaggeredItem>

          <StaggeredItem index={1}>
            <HoverZone effect="lift">
              <EnhancedCard variant="glow" className="p-6 text-center">
                <LiquidContainer className="h-16 w-16 mx-auto mb-4">
                  <Phone className="h-10 w-10 text-green-600" />
                </LiquidContainer>
                <h3 className="font-semibold text-lg mb-2">Appel Téléphonique</h3>
                <p className="text-muted-foreground mb-4">
                  Support prioritaire par téléphone
                </p>
                              <MagneticButton variant="outline" className="w-full">
                +33 1 23 45 67 89
              </MagneticButton>
            </EnhancedCard>
          </HoverZone>
        </StaggeredItem>

          <StaggeredItem index={2}>
            <HoverZone effect="lift">
              <EnhancedCard variant="glow" className="p-6 text-center">
                <LiquidContainer className="h-16 w-16 mx-auto mb-4">
                  <Video className="h-10 w-10 text-purple-600" />
                </LiquidContainer>
                <h3 className="font-semibold text-lg mb-2">Assistance Vidéo</h3>
                <p className="text-muted-foreground mb-4">
                  Session de support en visioconférence
                </p>
                <MagneticButton variant="outline" className="w-full">
                  Programmer un RDV
                </MagneticButton>
              </EnhancedCard>
            </HoverZone>
          </StaggeredItem>
        </StaggeredList>

        {/* Tabs Principal */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets">Mes Tickets</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="mt-6 space-y-6">
            {/* Nouveau Ticket */}
            <InteractiveCard variant="glass" hover="lift">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Créer un nouveau ticket</h3>
                </div>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Titre du problème..."
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Décrivez votre problème en détail..."
                    value={newTicketDescription}
                    onChange={(e) => setNewTicketDescription(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTicket} className="gap-2">
                      <Send className="h-4 w-4" />
                      Créer le Ticket
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Paperclip className="h-4 w-4" />
                      Joindre Fichier
                    </Button>
                  </div>
                </div>
              </div>
            </InteractiveCard>

            {/* Recherche Tickets */}
            <InteractiveCard variant="glass" hover="lift">
              <div className="p-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans mes tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtres
                  </Button>
                </div>
              </div>
            </InteractiveCard>

            {/* Liste des Tickets */}
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <InteractiveCard key={ticket.id} variant="glass" hover="lift">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusLabel(ticket.status)}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {getPriorityLabel(ticket.priority)}
                          </Badge>
                          <Badge variant="outline">
                            {ticket.category}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {ticket.messages}
                      </Button>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{ticket.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span>Mis à jour le {new Date(ticket.updatedAt).toLocaleDateString('fr-FR')}</span>
                        {ticket.assignedTo && (
                          <span>Assigné à {ticket.assignedTo}</span>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        Voir Détails
                      </Button>
                    </div>
                  </div>
                </InteractiveCard>
              ))}

              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">Aucun ticket trouvé</h3>
                  <p className="text-muted-foreground">
                    Aucun ticket ne correspond à votre recherche.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="mt-6 space-y-6">
            {/* Recherche FAQ */}
            <InteractiveCard variant="glass" hover="lift">
              <div className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans la FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </InteractiveCard>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQ.map((item) => (
                <InteractiveCard key={item.id} variant="glass" hover="lift">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <HelpCircle className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <h3 className="font-semibold text-lg">{item.question}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex gap-2">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Cette réponse était-elle utile ?</span>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {item.helpful}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsDown className="h-3 w-3" />
                              {item.notHelpful}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
              ))}

              {filteredFAQ.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">Aucune réponse trouvée</h3>
                  <p className="text-muted-foreground">
                    Aucune question ne correspond à votre recherche.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InteractiveCard variant="glass" hover="glow" className="p-6 text-center">
                <Book className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Documentation</h3>
                <p className="text-muted-foreground mb-4">
                  Guides complets et documentation technique
                </p>
                <Button variant="outline" className="w-full">
                  Accéder aux Guides
                </Button>
              </InteractiveCard>

              <InteractiveCard variant="glass" hover="glow" className="p-6 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold text-lg mb-2">Tutoriels Vidéo</h3>
                <p className="text-muted-foreground mb-4">
                  Apprenez avec nos tutoriels pas à pas
                </p>
                <Button variant="outline" className="w-full">
                  Voir les Vidéos
                </Button>
              </InteractiveCard>

              <InteractiveCard variant="glass" hover="glow" className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-lg mb-2">Base de Connaissances</h3>
                <p className="text-muted-foreground mb-4">
                  Articles techniques et bonnes pratiques
                </p>
                <Button variant="outline" className="w-full">
                  Explorer
                </Button>
              </InteractiveCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <FloatingActionButton
          actions={[
            {
              icon: <MessageSquare className="h-5 w-5" />,
              label: "Chat urgent",
              onClick: () => console.log("Chat urgent"),
              color: "bg-gradient-to-r from-red-500 to-pink-600"
            },
            {
              icon: <Plus className="h-5 w-5" />,
              label: "Nouveau ticket",
              onClick: () => setSelectedTab('tickets'),
              color: "bg-gradient-to-r from-blue-500 to-indigo-600"
            },
            {
              icon: <Phone className="h-5 w-5" />,
              label: "Appeler support",
              onClick: () => console.log("Appeler support"),
              color: "bg-gradient-to-r from-green-500 to-emerald-600"
            }
          ]}
        />
      </div>
    </div>
  );
}