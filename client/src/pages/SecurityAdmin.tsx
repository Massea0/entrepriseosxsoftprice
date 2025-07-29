// 🚀 PHASE 5 - PAGE ADMINISTRATION SÉCURITÉ
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityDashboard } from "@/components/security/SecurityDashboard";
import { TwoFactorAuth } from "@/components/security/TwoFactorAuth";
import { VulnerabilityManagement } from "@/components/security/VulnerabilityManagement";
import { GDPRCompliance } from "@/components/security/GDPRCompliance";
import { BackupRecovery } from "@/components/security/BackupRecovery";
import { SecurityMonitoring } from "@/components/security/SecurityMonitoring";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Shield, Users, Activity, Lock, Bug, FileText, Database, Eye } from "lucide-react";

export default function SecurityAdmin() {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span>Administration Sécurité</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestion complète de la sécurité et des audits systèmes
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>2FA</span>
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="flex items-center space-x-2">
            <Bug className="h-4 w-4" />
            <span>Vulnérabilités</span>
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>RGPD</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Sauvegarde</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Utilisateurs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="2fa">
          <TwoFactorAuth />
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <VulnerabilityManagement />
        </TabsContent>

        <TabsContent value="gdpr">
          <GDPRCompliance />
        </TabsContent>

        <TabsContent value="backup">
          <BackupRecovery />
        </TabsContent>

        <TabsContent value="monitoring">
          <SecurityMonitoring />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Gestion Utilisateurs</h3>
                <p className="text-muted-foreground">
                  Module de gestion des utilisateurs et permissions (à implémenter)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}