import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Clock, 
  Award,
  Calendar,
  CheckCircle,
  PlayCircle,
  FileText,
  TrendingUp,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

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
  WaveformVisualizer
} from '@/components/design-system/RevolutionaryDesignSystem';

export default function Training() {
  const [activeTab, setActiveTab] = useState('en-cours');

  const coursEnCours = [
    {
      id: 1,
      titre: "Gestion de Projet Agile",
      categorie: "Management",
      progression: 65,
      duree: "12 heures",
      deadline: "2025-02-15",
      formateur: "Dr. Amadou Diallo",
      modules: 8,
      modulesCompletes: 5
    },
    {
      id: 2,
      titre: "Sécurité Informatique Avancée",
      categorie: "Technique",
      progression: 30,
      duree: "20 heures",
      deadline: "2025-03-01",
      formateur: "Fatou Sow",
      modules: 10,
      modulesCompletes: 3
    }
  ];

  const formations = [
    {
      id: 3,
      titre: "Leadership et Communication",
      categorie: "Soft Skills",
      duree: "8 heures",
      niveau: "Intermédiaire",
      note: 4.8,
      inscrits: 156,
      prochaine: "2025-02-10"
    },
    {
      id: 4,
      titre: "Intelligence Artificielle pour Managers",
      categorie: "Innovation",
      duree: "16 heures",
      niveau: "Avancé",
      note: 4.9,
      inscrits: 89,
      prochaine: "2025-02-20"
    }
  ];

  const certifications = [
    {
      id: 1,
      nom: "PMP - Project Management Professional",
      organisme: "PMI",
      dateObtention: "2024-06-15",
      validite: "2027-06-15",
      status: "active"
    },
    {
      id: 2,
      nom: "AWS Certified Solutions Architect",
      organisme: "Amazon",
      dateObtention: "2023-11-20",
      validite: "2026-11-20",
      status: "active"
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
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Formation & Développement"
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-purple-100">
                      Développez vos compétences et boostez votre carrière 🚀
                    </GlowText>
                  </div>
                </div>
                <MagneticButton className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Catalogue Complet
                </MagneticButton>
              </div>
              <WaveformVisualizer className="w-full h-12 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Stats */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StaggeredItem index={0}>
            <AnimatedMetricCard
              title="Heures de Formation"
              value="124h"
              icon={Clock}
              trend="+15% ce mois"
              gradient="from-purple-500 to-pink-500"
            />
          </StaggeredItem>

          <StaggeredItem index={1}>
            <AnimatedMetricCard
              title="Cours Complétés"
              value="18"
              icon={CheckCircle}
              trend="Cette année"
              gradient="from-green-500 to-emerald-500"
            />
          </StaggeredItem>

          <StaggeredItem index={2}>
            <AnimatedMetricCard
              title="Certifications"
              value="4"
              icon={Award}
              trend="2 en cours"
              gradient="from-blue-500 to-cyan-500"
            />
          </StaggeredItem>

          <StaggeredItem index={3}>
            <AnimatedMetricCard
              title="Score Moyen"
              value="92%"
              icon={Trophy}
              trend="Excellent"
              gradient="from-orange-500 to-red-500"
            />
          </StaggeredItem>
        </StaggeredList>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md glass-effect dark:glass-effect-dark">
          <TabsTrigger value="en-cours">En Cours</TabsTrigger>
          <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="space-y-6">
          {coursEnCours.map((cours) => (
            <AnimatedCard key={cours.id} className="card-modern p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{cours.titre}</h3>
                      <p className="text-sm text-muted-foreground">{cours.formateur}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Catégorie</p>
                      <Badge variant="outline" className="mt-1">{cours.categorie}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Durée totale</p>
                      <p className="text-sm font-medium">{cours.duree}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Modules</p>
                      <p className="text-sm font-medium">{cours.modulesCompletes}/{cours.modules}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Échéance</p>
                      <p className="text-sm font-medium">{new Date(cours.deadline).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{cours.progression}%</span>
                    </div>
                    <Progress value={cours.progression} className="h-2" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button className="btn-modern" size="sm">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Continuer
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Ressources
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </TabsContent>

        <TabsContent value="disponibles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formations.map((formation) => (
              <AnimatedCard key={formation.id} className="card-modern p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{formation.titre}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">{formation.categorie}</Badge>
                      <span className="text-sm text-muted-foreground">{formation.niveau}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{formation.note}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Durée</span>
                    <span>{formation.duree}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Inscrits</span>
                    <span>{formation.inscrits} personnes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Prochaine session</span>
                    <span>{new Date(formation.prochaine).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <Button className="w-full mt-4 btn-modern" variant="outline">
                  S'inscrire
                </Button>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          {certifications.map((cert) => (
            <AnimatedCard key={cert.id} className="card-modern p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{cert.nom}</h3>
                    <p className="text-sm text-muted-foreground">{cert.organisme}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">
                        Obtenue le {new Date(cert.dateObtention).toLocaleDateString('fr-FR')}
                      </span>
                      <Badge variant={cert.status === 'active' ? 'default' : 'secondary'}>
                        {cert.status === 'active' ? 'Active' : 'Expirée'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="btn-modern">
                  <FileText className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}