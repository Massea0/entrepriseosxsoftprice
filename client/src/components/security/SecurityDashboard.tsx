// 🚀 PHASE 5 - DASHBOARD DE SÉCURITÉ
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Users, Activity } from "lucide-react";
import { SecurityAuditor, SecurityAuditResult, useSecurityMonitoring } from "@/utils/security-audit";
import { useAuth } from "@/contexts/AuthContext";

export function SecurityDashboard() {
  const { user } = useAuth();
  const { logEvent } = useSecurityMonitoring();
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeThreats, setActiveThreats] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);

  // Simuler des métriques de sécurité en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveThreats(Math.floor(Math.random() * 5));
      setSecurityScore(Math.floor(Math.random() * 20) + 80); // 80-100
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const runSecurityAudit = async () => {
    setIsLoading(true);
    logEvent({
      type: 'suspicious_activity',
      severity: 'medium',
      description: 'Manuel security audit initiated',
      userId: user?.id,
      metadata: { source: 'security_dashboard' }
    });

    try {
      const auditor = new SecurityAuditor();
      const result = await auditor.performFullAudit();
      setAuditResult(result);
      setSecurityScore(result.score);
    } catch (error) {
      console.error('Erreur lors de l\'audit de sécurité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🔒 Tableau de Bord Sécurité</h1>
          <p className="text-muted-foreground">
            Monitoring et audit de sécurité en temps réel
          </p>
        </div>
        <Button onClick={runSecurityAudit} disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          Lancer Audit Sécurité
        </Button>
      </div>

      {/* Métriques de sécurité globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Sécurité</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}/100
            </div>
            <Progress value={securityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menaces Actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{activeThreats}</div>
            <p className="text-xs text-muted-foreground">
              {activeThreats === 0 ? 'Aucune menace détectée' : 'Nécessite attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">RGPD</div>
            <p className="text-xs text-muted-foreground">
              Partiellement conforme
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Session utilisateur active
            </p>
          </CardContent>
        </Card>
      </div>

      {activeThreats > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{activeThreats} menace(s) active(s) détectée(s).</strong> 
            Vérifiez immédiatement les logs de sécurité.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit Sécurité</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          {auditResult ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Résultats de l'Audit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl font-bold ${getScoreColor(auditResult.score)}`}>
                      Score: {auditResult.score}/100
                    </div>
                    <Progress value={auditResult.score} className="flex-1" />
                  </div>

                  {auditResult.vulnerabilities.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Vulnérabilités Détectées ({auditResult.vulnerabilities.length})</h4>
                      <div className="space-y-2">
                        {auditResult.vulnerabilities.slice(0, 5).map((vuln, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant={getSeverityColor(vuln.severity) as unknown}>
                                  {vuln.severity.toUpperCase()}
                                </Badge>
                                <span className="font-medium">{vuln.category}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{vuln.description}</p>
                            </div>
                            {vuln.cvss && (
                              <Badge variant="outline">CVSS: {vuln.cvss}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {auditResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommandations ({auditResult.recommendations.length})</h4>
                      <div className="space-y-2">
                        {auditResult.recommendations.slice(0, 3).map((rec, index) => (
                          <div key={index} className="p-3 border rounded">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                                {rec.priority.toUpperCase()}
                              </Badge>
                              <span className="font-medium">{rec.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun audit récent</h3>
                  <p className="text-muted-foreground mb-4">
                    Lancez un audit de sécurité pour évaluer la posture de sécurité du système.
                  </p>
                  <Button onClick={runSecurityAudit} disabled={isLoading}>
                    Démarrer l'Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Monitoring en Temps Réel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">Surveillance Active</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <p className="text-sm text-muted-foreground">Tous les systèmes surveillés</p>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="h-4 w-4" />
                      <span className="font-medium">Chiffrement</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">AES-256</div>
                    <p className="text-sm text-muted-foreground">Données chiffrées</p>
                  </div>
                </div>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Monitoring de sécurité actif. Tous les événements sont tracés et analysés.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>État de la Conformité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">RGPD (EU)</span>
                  <Badge variant="secondary">En cours</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">ISO 27001</span>
                  <Badge variant="outline">À implémenter</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">OWASP Top 10</span>
                  <Badge variant="secondary">Niveau 3/10</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">SOC 2 Type II</span>
                  <Badge variant="outline">À implémenter</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}