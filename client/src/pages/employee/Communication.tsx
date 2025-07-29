import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Video, 
  Calendar,
  Bell,
  Megaphone,
  FileText,
  Send,
  AtSign,
  Hash,
  Globe,
  Lock,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  AnimatedMetricCard,
  LiquidContainer,
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

export default function Communication() {
  const [activeTab, setActiveTab] = useState('messages');

  const messages = [
    {
      id: 1,
      titre: "Nouvelle politique de télétravail",
      expediteur: "Direction RH",
      type: "annonce",
      date: "2025-01-20T10:00:00",
      lu: false,
      priorite: "haute",
      extrait: "Suite aux retours positifs, nous étendons notre politique de télétravail..."
    },
    {
      id: 2,
      titre: "Réunion équipe projet Banking",
      expediteur: "Mamadou Fall",
      type: "reunion",
      date: "2025-01-19T14:30:00",
      lu: true,
      priorite: "normale",
      extrait: "Rappel: Notre point hebdomadaire aura lieu demain à 14h30..."
    },
    {
      id: 3,
      titre: "Félicitations pour votre performance!",
      expediteur: "Manager Direct",
      type: "personnel",
      date: "2025-01-18T09:00:00",
      lu: true,
      priorite: "normale",
      extrait: "Je tenais à vous féliciter pour votre excellent travail sur le projet..."
    }
  ];

  const channels = [
    {
      id: 1,
      nom: "general",
      type: "public",
      membres: 245,
      nouveauxMessages: 5,
      dernierMessage: "Il y a 10 min"
    },
    {
      id: 2,
      nom: "equipe-dev",
      type: "public",
      membres: 32,
      nouveauxMessages: 0,
      dernierMessage: "Il y a 2h"
    },
    {
      id: 3,
      nom: "projet-banking",
      type: "prive",
      membres: 8,
      nouveauxMessages: 2,
      dernierMessage: "Il y a 30 min"
    }
  ];

  const reunions = [
    {
      id: 1,
      titre: "Stand-up quotidien",
      heure: "09:00",
      duree: "15 min",
      type: "recurrent",
      participants: 6
    },
    {
      id: 2,
      titre: "Revue de sprint",
      heure: "14:00",
      duree: "1h",
      type: "unique",
      participants: 12
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={25} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 p-6 space-y-8">
        {/* Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <MessageSquare className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Communication Interne"
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-blue-100">
                      Restez connecté avec votre équipe et l'entreprise 💬
                    </GlowText>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MagneticButton variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                    <Bell className="h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
                    <Send className="h-4 w-4 mr-2" />
                    Nouveau Message
                  </MagneticButton>
                </div>
              </div>
              <WaveformVisualizer className="w-full h-12 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Stats */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StaggeredItem index={0}>
            <AnimatedMetricCard
              title="Messages Non Lus"
              value="12"
              icon={MessageSquare}
              trend="3 urgents"
              gradient="from-blue-500 to-cyan-500"
            />
          </StaggeredItem>

          <StaggeredItem index={1}>
            <AnimatedMetricCard
              title="Canaux Actifs"
              value="8"
              icon={Hash}
              trend="3 privés"
              gradient="from-cyan-500 to-teal-500"
            />
          </StaggeredItem>

          <StaggeredItem index={2}>
            <AnimatedMetricCard
              title="Réunions Aujourd'hui"
              value="4"
              icon={Video}
              trend="Prochaine: 14h"
              gradient="from-green-500 to-emerald-500"
            />
          </StaggeredItem>

          <StaggeredItem index={3}>
            <AnimatedMetricCard
              title="Contacts Actifs"
              value="124"
              icon={Users}
              trend="En ligne"
              gradient="from-orange-500 to-red-500"
            />
          </StaggeredItem>
        </StaggeredList>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl glass-effect dark:glass-effect-dark">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="canaux">Canaux</TabsTrigger>
          <TabsTrigger value="reunions">Réunions</TabsTrigger>
          <TabsTrigger value="annonces">Annonces</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          {messages.map((message) => (
            <AnimatedCard key={message.id} className={`card-modern p-6 ${!message.lu ? 'border-l-4 border-l-blue-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{message.expediteur[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{message.titre}</h3>
                      {!message.lu && <Badge variant="default" className="text-xs">Nouveau</Badge>}
                      {message.priorite === 'haute' && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">De: {message.expediteur}</p>
                    <p className="text-sm">{message.extrait}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.date).toLocaleString('fr-FR', { 
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </AnimatedCard>
          ))}
        </TabsContent>

        <TabsContent value="canaux" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <AnimatedCard key={channel.id} className="card-modern p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {channel.type === 'public' ? (
                      <Hash className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold">{channel.nom}</h3>
                  </div>
                  {channel.nouveauxMessages > 0 && (
                    <Badge variant="default">{channel.nouveauxMessages}</Badge>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Membres</span>
                    <span>{channel.membres}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dernier message</span>
                    <span>{channel.dernierMessage}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 btn-modern" variant="outline" size="sm">
                  Rejoindre
                </Button>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reunions" className="space-y-4">
          <Card className="p-6 glass-effect dark:glass-effect-dark mb-6">
            <h3 className="text-lg font-semibold mb-4">Aujourd'hui - {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
            <div className="space-y-4">
              {reunions.map((reunion) => (
                <div key={reunion.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{reunion.heure}</p>
                      <p className="text-xs text-muted-foreground">{reunion.duree}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">{reunion.titre}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="h-3 w-3" />
                        <span className="text-sm text-muted-foreground">{reunion.participants} participants</span>
                        {reunion.type === 'recurrent' && (
                          <Badge variant="outline" className="text-xs">Récurrent</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button className="btn-modern" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Rejoindre
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="annonces" className="space-y-4">
          <AnimatedCard className="card-modern p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Nouvelle politique de télétravail</h3>
                <p className="text-sm text-muted-foreground mb-4">Direction Générale • Il y a 2 jours</p>
                <p className="text-sm mb-4">
                  Chers collaborateurs, suite aux excellents résultats de notre période d'essai, 
                  nous sommes heureux d'annoncer l'extension de notre politique de télétravail. 
                  À partir du 1er février, tous les employés pourront bénéficier de jusqu'à 3 jours 
                  de télétravail par semaine...
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Lire la suite
                  </Button>
                  <span className="text-sm text-muted-foreground">248 vues</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </TabsContent>
      </Tabs>

      {/* Quick Message */}
      <AnimatedCard className="card-modern p-6">
        <h3 className="text-lg font-semibold mb-4">Message Rapide</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="À: @personne ou #canal" className="input-modern" />
          </div>
          <Textarea 
            placeholder="Tapez votre message..." 
            className="input-modern min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <AtSign className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
            <Button className="btn-modern bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>
      </AnimatedCard>
      </div>
    </div>
  );
}