import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  User,
  Activity,
  Zap,
  ArrowRight,
  Eye,
  RefreshCw,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS - CORRECTED PATHS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  StaggeredList,
  StaggeredItem,
  HoverZone,

  EnhancedCard
} from '@/components/ui/simple-animations';
import { AnimatedMetricCard } from '@/components/ui/animated-metric-card';
import { Button } from '@/components/ui/button';

export default function ClientDashboard() {
  const { user } = useAuth();

  // Sample data
  const stats = {
    activeProjects: 3,
    pendingInvoices: 2,
    totalBudget: 125000,
    satisfaction: 96
  };

  const projects = [
    {
      id: 1,
      name: "Rénovation Bureau Principal",
      manager: "Marie Dubois",
      status: "En cours",
      progress: 75,
      deadline: "2025-02-15"
    },
    {
      id: 2,
      name: "Aménagement Espace Vert",
      manager: "Pierre Martin",
      status: "En cours",
      progress: 45,
      deadline: "2025-03-01"
    },
    {
      id: 3,
      name: "Installation Système Sécurité",
      manager: "Julie Martin",
      status: "Planifié",
      progress: 10,
      deadline: "2025-03-15"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Rapport de progression mis à jour",
      project: "Rénovation Bureau Principal",
      timestamp: "2025-01-16T10:30:00Z"
    },
    {
      id: 2,
      action: "Nouveau jalon atteint",
      project: "Aménagement Espace Vert",
      timestamp: "2025-01-15T14:20:00Z"
    },
    {
      id: 3,
      action: "Facture générée",
      project: "Rénovation Bureau Principal",
      timestamp: "2025-01-14T09:15:00Z"
    },
    {
      id: 4,
      action: "Planification mise à jour",
      project: "Installation Système Sécurité",
      timestamp: "2025-01-13T16:45:00Z"
    }
  ];

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles
        count={22}
        className="absolute inset-0 z-0"
      />
      <MorphingBlob
        className="absolute top-10 left-10 w-96 h-96 opacity-25 z-0"
      />
      <MorphingBlob
        className="absolute bottom-10 right-10 w-80 h-80 opacity-20 z-0"
      />

      <div className="relative z-10 p-6 space-y-6 max-w-full">
        {/* Header Révolutionnaire */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <TypewriterText
              text="Espace Client Révolutionnaire"
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
              speed={60}
            />
            <GlowText className="text-muted-foreground mt-2">
              Tableau de bord personnel • Bienvenue {user?.email?.split('@')[0]} ✨
            </GlowText>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Préférences
            </Button>
          </div>
        </div>

        {/* Métriques Révolutionnaires */}
        <EnhancedCard>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5" />
              <GlowText className="text-lg font-semibold">Vue d'ensemble</GlowText>
            </div>
            <StaggeredList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StaggeredItem>
                <HoverZone  className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Projets Actifs</p>
                    <p className="text-xs text-muted-foreground">{stats.activeProjects} en cours</p>
                  </div>
                </HoverZone>
              </StaggeredItem>
              <StaggeredItem>
                <HoverZone  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full "></div>
                  <div>
                    <p className="font-medium text-sm">Factures</p>
                    <p className="text-xs text-muted-foreground">{stats.pendingInvoices} en attente</p>
                  </div>
                </HoverZone>
              </StaggeredItem>
              <StaggeredItem>
                <HoverZone  className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full "></div>
                  <div>
                    <p className="font-medium text-sm">Budget Total</p>
                    <p className="text-xs text-muted-foreground">€{stats.totalBudget.toLocaleString()}</p>
                  </div>
                </HoverZone>
              </StaggeredItem>
              <StaggeredItem>
                <HoverZone  className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="w-3 h-3 bg-orange-500 rounded-full "></div>
                  <div>
                    <p className="font-medium text-sm">Satisfaction</p>
                    <p className="text-xs text-muted-foreground">{stats.satisfaction}%</p>
                  </div>
                </HoverZone>
              </StaggeredItem>
            </StaggeredList>
          </div>
        </EnhancedCard>

        {/* Métriques Principales */}
        <StaggeredList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggeredItem>
            <AnimatedMetricCard
              title="Projets Actifs"
              value={stats.activeProjects}
              icon={Building2}
              gradient="from-blue-500 to-cyan-500"
              trend="up"
              trendValue="+2 ce mois"
              description="projets en cours"
            />
          </StaggeredItem>
          <StaggeredItem>
            <AnimatedMetricCard
              title="Factures En Attente"
              value={stats.pendingInvoices}
              icon={FileText}
              gradient="from-orange-500 to-red-500"
              trend="neutral"
              trendValue="À régler"
              description="factures à traiter"
            />
          </StaggeredItem>
          <StaggeredItem>
            <AnimatedMetricCard
              title="Budget Total"
              value={`€${stats.totalBudget.toLocaleString()}`}
              icon={DollarSign}
              gradient="from-green-500 to-emerald-500"
              trend="up"
              trendValue="+15.2%"
              description="par rapport au trimestre dernier"
            />
          </StaggeredItem>
          <StaggeredItem>
            <AnimatedMetricCard
              title="Satisfaction Client"
              value={`${stats.satisfaction}%`}
              icon={Activity}
              gradient="from-purple-500 to-violet-500"
              trend="up"
              trendValue="Excellent"
              description="évaluation globale"
            />
          </StaggeredItem>
        </StaggeredList>

        {/* Projets Actifs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedCard>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5" />
                <GlowText className="text-lg font-semibold">Projets Actifs</GlowText>
              </div>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <StaggeredItem key={project.id}>
                    <HoverZone  className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge className={
                          project.status === "En cours" ? "bg-blue-100 text-blue-800" :
                          project.status === "Planifié" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Chef de projet: {project.manager}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}
                      </p>
                    </HoverZone>
                  </StaggeredItem>
                ))}
              </div>
            </div>
          </EnhancedCard>

          {/* Activité Récente */}
          <EnhancedCard>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5" />
                <GlowText className="text-lg font-semibold">Activité Récente</GlowText>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <StaggeredItem key={activity.id}>
                    <HoverZone  className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.project}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </HoverZone>
                  </StaggeredItem>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Actions Rapides */}
        <EnhancedCard>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5" />
              <GlowText className="text-lg font-semibold">Actions Rapides</GlowText>
            </div>
            <StaggeredList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StaggeredItem>
                <Link to="/client/projects">
                  <Button>
                    <Building2 className="h-6 w-6" />
                    <span className="text-xs">Projets</span>
                  </Button>
                </Link>
              </StaggeredItem>
              <StaggeredItem>
                <Link to="/client/invoices">
                  <Button>
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">Factures</span>
                  </Button>
                </Link>
              </StaggeredItem>
              <StaggeredItem>
                <Link to="/client/calendar">
                  <Button>
                    <Calendar className="h-6 w-6" />
                    <span className="text-xs">Planning</span>
                  </Button>
                </Link>
              </StaggeredItem>
              <StaggeredItem>
                <Button>
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-xs">Messages</span>
                </Button>
              </StaggeredItem>
              <StaggeredItem>
                <Button>
                  <DollarSign className="h-6 w-6" />
                  <span className="text-xs">Budget</span>
                </Button>
              </StaggeredItem>
              <StaggeredItem>
                <Button>
                  <User className="h-6 w-6" />
                  <span className="text-xs">Profil</span>
                </Button>
              </StaggeredItem>
            </StaggeredList>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
}
