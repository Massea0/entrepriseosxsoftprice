import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowManager } from "@/components/workflow/WorkflowManager";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow, 
  Zap, 
  FileText, 
  Users, 
  Calendar,
  BarChart3
} from "lucide-react";

export default function WorkflowAdmin() {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <Workflow className="h-8 w-8 text-primary" />
          <span>Administration Workflows</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Automatisation et gestion des processus métier
        </p>
      </div>

      <Tabs defaultValue="manager" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="manager" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Gestionnaire</span>
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Créateur</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Planification</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manager">
          <WorkflowManager />
        </TabsContent>

        <TabsContent value="builder">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Bibliothèque de Templates</span>
                <Badge variant="secondary">3 templates</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Nouveau Projet - Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Envoi automatique de notifications lors de la création d'un projet
                  </p>
                  <Badge variant="outline" className="mt-2">Projet</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Facture Échue - Rappel</h4>
                  <p className="text-sm text-muted-foreground">
                    Rappel automatique pour les factures échues
                  </p>
                  <Badge variant="outline" className="mt-2">Facturation</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Ticket Support - Escalade</h4>
                  <p className="text-sm text-muted-foreground">
                    Escalade automatique des tickets non traités
                  </p>
                  <Badge variant="outline" className="mt-2">Support</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Planification et Déclencheurs</span>
                <Badge variant="outline">En développement</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Système de planification avancé</h3>
                <p className="text-muted-foreground">
                  Configuration des déclencheurs temporels, événementiels et conditionnels
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics et Performances</span>
                <Badge variant="outline">En développement</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tableaux de bord analytics</h3>
                <p className="text-muted-foreground">
                  Métriques de performance, temps d'exécution et taux de succès des workflows
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}