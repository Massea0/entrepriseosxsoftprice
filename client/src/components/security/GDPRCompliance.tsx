// 🚀 PHASE 5 - CONFORMITÉ RGPD
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  FileText, 
  Users, 
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Settings,
  Eye,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSecurityMonitoring } from "@/utils/security-audit";

interface GDPRCompliance {
  category: string;
  requirements: GDPRRequirement[];
  completionRate: number;
}

interface GDPRRequirement {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started';
  mandatory: boolean;
  evidence?: string;
  lastUpdated?: string;
}

interface DataProcessingActivity {
  id: string;
  name: string;
  purpose: string;
  dataTypes: string[];
  legalBasis: string;
  retentionPeriod: string;
  recipients: string[];
  lastReviewed: string;
  status: 'compliant' | 'review_needed' | 'non_compliant';
}

export function GDPRCompliance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logEvent } = useSecurityMonitoring();
  const [complianceData, setComplianceData] = useState<GDPRCompliance[]>([]);
  const [processingActivities, setProcessingActivities] = useState<DataProcessingActivity[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    // Initialiser les données de conformité RGPD
    const mockComplianceData: GDPRCompliance[] = [
      {
        category: "Droits des Personnes",
        completionRate: 75,
        requirements: [
          {
            id: "right_access",
            title: "Droit d'accès",
            description: "Permettre aux utilisateurs d'accéder à leurs données personnelles",
            status: "completed",
            mandatory: true,
            evidence: "API d'export des données utilisateur implémentée",
            lastUpdated: "2024-01-08"
          },
          {
            id: "right_rectification",
            title: "Droit de rectification",
            description: "Permettre la correction des données personnelles",
            status: "completed",
            mandatory: true,
            evidence: "Interface de modification du profil utilisateur",
            lastUpdated: "2024-01-07"
          },
          {
            id: "right_erasure",
            title: "Droit à l'effacement",
            description: "Permettre la suppression des données personnelles",
            status: "in_progress",
            mandatory: true,
            lastUpdated: "2024-01-06"
          },
          {
            id: "right_portability",
            title: "Droit à la portabilité",
            description: "Permettre l'export des données dans un format structuré",
            status: "not_started",
            mandatory: true
          }
        ]
      },
      {
        category: "Sécurité des Données",
        completionRate: 90,
        requirements: [
          {
            id: "encryption",
            title: "Chiffrement des données",
            description: "Chiffrer les données sensibles au repos et en transit",
            status: "completed",
            mandatory: true,
            evidence: "AES-256 implémenté, HTTPS forcé",
            lastUpdated: "2024-01-08"
          },
          {
            id: "access_control",
            title: "Contrôle d'accès",
            description: "Implémenter un contrôle d'accès basé sur les rôles",
            status: "completed",
            mandatory: true,
            evidence: "RBAC avec authentification 2FA",
            lastUpdated: "2024-01-08"
          },
          {
            id: "backup_security",
            title: "Sécurité des sauvegardes",
            description: "Sécuriser les sauvegardes de données",
            status: "in_progress",
            mandatory: true,
            lastUpdated: "2024-01-05"
          }
        ]
      },
      {
        category: "Documentation et Gouvernance",
        completionRate: 60,
        requirements: [
          {
            id: "privacy_policy",
            title: "Politique de confidentialité",
            description: "Politique claire et accessible",
            status: "completed",
            mandatory: true,
            evidence: "Politique publiée et mise à jour",
            lastUpdated: "2024-01-01"
          },
          {
            id: "consent_management",
            title: "Gestion du consentement",
            description: "Système de gestion des consentements",
            status: "in_progress",
            mandatory: true,
            lastUpdated: "2024-01-03"
          },
          {
            id: "data_mapping",
            title: "Cartographie des données",
            description: "Inventaire complet des traitements de données",
            status: "not_started",
            mandatory: true
          },
          {
            id: "impact_assessment",
            title: "Analyse d'impact (DPIA)",
            description: "Évaluation d'impact sur la protection des données",
            status: "not_started",
            mandatory: false
          }
        ]
      }
    ];

    const mockProcessingActivities: DataProcessingActivity[] = [
      {
        id: "user_auth",
        name: "Authentification Utilisateur",
        purpose: "Contrôle d'accès et sécurité",
        dataTypes: ["Email", "Mot de passe haché", "Adresse IP"],
        legalBasis: "Exécution d'un contrat",
        retentionPeriod: "Durée du compte + 1 an",
        recipients: ["Équipe technique", "Supabase (hébergement)"],
        lastReviewed: "2024-01-01",
        status: "compliant"
      },
      {
        id: "user_profile",
        name: "Gestion des Profils",
        purpose: "Personnalisation du service",
        dataTypes: ["Nom", "Prénom", "Entreprise", "Téléphone"],
        legalBasis: "Consentement",
        retentionPeriod: "Durée du compte",
        recipients: ["Équipe support"],
        lastReviewed: "2023-12-15",
        status: "review_needed"
      },
      {
        id: "analytics",
        name: "Analytics et Usage",
        purpose: "Amélioration du service",
        dataTypes: ["Pages visitées", "Actions utilisateur", "Métadonnées techniques"],
        legalBasis: "Intérêt légitime",
        retentionPeriod: "2 ans",
        recipients: ["Équipe produit"],
        lastReviewed: "2023-11-20",
        status: "non_compliant"
      }
    ];

    setComplianceData(mockComplianceData);
    setProcessingActivities(mockProcessingActivities);

    // Calculer le score global
    const totalRequirements = mockComplianceData.reduce((acc, cat) => acc + cat.requirements.length, 0);
    const completedRequirements = mockComplianceData.reduce((acc, cat) => 
      acc + cat.requirements.filter(req => req.status === 'completed').length, 0
    );
    setOverallScore(Math.round((completedRequirements / totalRequirements) * 100));
  }, []);

  const updateRequirementStatus = (categoryIndex: number, requirementId: string, status: GDPRRequirement['status']) => {
    setComplianceData(prev => {
      const updated = [...prev];
      const requirement = updated[categoryIndex].requirements.find(req => req.id === requirementId);
      if (requirement) {
        requirement.status = status;
        requirement.lastUpdated = new Date().toISOString().split('T')[0];
      }
      
      // Recalculer le taux de completion
      const completed = updated[categoryIndex].requirements.filter(req => req.status === 'completed').length;
      updated[categoryIndex].completionRate = Math.round((completed / updated[categoryIndex].requirements.length) * 100);
      
      return updated;
    });

    logEvent({
      type: 'data_access',
      severity: 'low',
      description: `GDPR requirement ${requirementId} status updated to ${status}`,
      userId: user?.id
    });

    toast({
      title: "Statut mis à jour",
      description: "La conformité RGPD a été mise à jour"
    });
  };

  const generateComplianceReport = () => {
    logEvent({
      type: 'data_access',
      severity: 'medium',
      description: 'GDPR compliance report generated',
      userId: user?.id
    });

    toast({
      title: "Rapport généré",
      description: "Le rapport de conformité RGPD a été généré"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'compliant': return 'default';
      case 'in_progress': case 'review_needed': return 'secondary';
      case 'not_started': case 'non_compliant': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complété';
      case 'in_progress': return 'En cours';
      case 'not_started': return 'Non démarré';
      case 'compliant': return 'Conforme';
      case 'review_needed': return 'À réviser';
      case 'non_compliant': return 'Non conforme';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Conformité RGPD</span>
        </h2>
        <p className="text-muted-foreground mt-2">
          Gestion de la conformité au Règlement Général sur la Protection des Données
        </p>
      </div>

      {/* Score global de conformité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Score de Conformité RGPD</span>
            <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}>
              {overallScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore} className="mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {complianceData.reduce((acc, cat) => 
                  acc + cat.requirements.filter(req => req.status === 'completed').length, 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Exigences complétées</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {complianceData.reduce((acc, cat) => 
                  acc + cat.requirements.filter(req => req.status === 'in_progress').length, 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">En cours</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {complianceData.reduce((acc, cat) => 
                  acc + cat.requirements.filter(req => req.status === 'not_started').length, 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">À démarrer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requirements">Exigences</TabsTrigger>
          <TabsTrigger value="processing">Traitements</TabsTrigger>
          <TabsTrigger value="rights">Droits</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          {complianceData.map((category, categoryIndex) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={category.completionRate} className="w-20" />
                    <span className="text-sm font-medium">{category.completionRate}%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.requirements.map((requirement) => (
                    <div key={requirement.id} className="flex items-start space-x-3 p-3 border rounded">
                      <Checkbox
                        checked={requirement.status === 'completed'}
                        onCheckedChange={(checked) => 
                          updateRequirementStatus(
                            categoryIndex, 
                            requirement.id, 
                            checked ? 'completed' : 'not_started'
                          )
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{requirement.title}</h4>
                          {requirement.mandatory && <Badge variant="destructive" className="text-xs">Obligatoire</Badge>}
                          <Badge variant={getStatusColor(requirement.status) as unknown} className="text-xs">
                            {getStatusText(requirement.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{requirement.description}</p>
                        {requirement.evidence && (
                          <p className="text-xs text-green-600">✓ {requirement.evidence}</p>
                        )}
                        {requirement.lastUpdated && (
                          <p className="text-xs text-muted-foreground">
                            Dernière mise à jour : {requirement.lastUpdated}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newStatus = requirement.status === 'completed' ? 'not_started' : 
                                          requirement.status === 'not_started' ? 'in_progress' : 'completed';
                          updateRequirementStatus(categoryIndex, requirement.id, newStatus);
                        }}
                      >
                        Changer Statut
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registre des Traitements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingActivities.map((activity) => (
                  <div key={activity.id} className="p-4 border rounded">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{activity.name}</h4>
                        <p className="text-sm text-muted-foreground">{activity.purpose}</p>
                      </div>
                      <Badge variant={getStatusColor(activity.status) as unknown}>
                        {getStatusText(activity.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs">Types de données</Label>
                        <p>{activity.dataTypes.join(', ')}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Base légale</Label>
                        <p>{activity.legalBasis}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Durée de conservation</Label>
                        <p>{activity.retentionPeriod}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Dernière révision</Label>
                        <p>{activity.lastReviewed}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Label className="text-xs">Destinataires</Label>
                      <p className="text-sm">{activity.recipients.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Droits Utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col">
                  <Eye className="h-6 w-6 mb-2" />
                  <span>Demandes d'Accès</span>
                  <span className="text-xs text-muted-foreground">3 en attente</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  <span>Demandes de Rectification</span>
                  <span className="text-xs text-muted-foreground">1 en cours</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Trash2 className="h-6 w-6 mb-2" />
                  <span>Demandes d'Effacement</span>
                  <span className="text-xs text-muted-foreground">0 en attente</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Demandes de Portabilité</span>
                  <span className="text-xs text-muted-foreground">2 complétées</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports de Conformité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={generateComplianceReport} className="h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Rapport Complet RGPD</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Database className="h-6 w-6 mb-2" />
                  <span>Registre des Traitements</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Clock className="h-6 w-6 mb-2" />
                  <span>Historique des Actions</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Statistiques des Droits</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}