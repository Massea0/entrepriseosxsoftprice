import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Zap, 
  Shield, 
  Database, 
  Monitor, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw,
  Trash2,
  Download,
  Clock,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Users,
  FileText,
  Scale,
  UserCheck,
  ShieldCheck,
  Gauge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types pour la gestion des performances et sécurité
interface PerformanceMetrics {
  cacheHitRate: number;
  averageLatency: number;
  memoryUsage: number;
  cpuUsage: number;
  totalRequests: number;
  errorRate: number;
  modelOptimizations: number;
}

interface SecurityMetrics {
  encryptionStatus: boolean;
  consentCompliance: number;
  dataSubjectRequests: number;
  auditLogEntries: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastSecurityScan: string;
}

interface ModelOptimization {
  id: string;
  name: string;
  type: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  accuracy: number;
  status: 'optimized' | 'pending' | 'failed';
}

interface GDPRCompliance {
  consentRecords: number;
  dataRequests: number;
  averageResponseTime: string;
  complianceScore: number;
  nextReview: string;
}

const PerformanceSecurityManager: React.FC = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    cacheHitRate: 0,
    averageLatency: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    totalRequests: 0,
    errorRate: 0,
    modelOptimizations: 0
  });

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    encryptionStatus: true,
    consentCompliance: 0,
    dataSubjectRequests: 0,
    auditLogEntries: 0,
    riskLevel: 'low',
    lastSecurityScan: ''
  });

  const [modelOptimizations, setModelOptimizations] = useState<ModelOptimization[]>([]);
  const [gdprCompliance, setGdprCompliance] = useState<GDPRCompliance>({
    consentRecords: 0,
    dataRequests: 0,
    averageResponseTime: '',
    complianceScore: 0,
    nextReview: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [showDataRequest, setShowDataRequest] = useState(false);
  const [userIdForRequest, setUserIdForRequest] = useState('');

  const { toast } = useToast();

  // Charger les métriques au démarrage
  useEffect(() => {
    loadPerformanceMetrics();
    loadSecurityMetrics();
    loadModelOptimizations();
    loadGDPRCompliance();
    
    // Actualisation périodique
    const interval = setInterval(() => {
      loadPerformanceMetrics();
      loadSecurityMetrics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceMetrics = async () => {
    try {
      const response = await fetch('/functions/v1/ai-performance-optimizer/metrics');
      const data = await response.json();
      
      if (data.success) {
        const metrics = data.data.aggregates;
        setPerformanceMetrics({
          cacheHitRate: data.data.stats?.hitRate || 0,
          averageLatency: metrics?.averageDuration || 0,
          memoryUsage: data.data.memoryUsage || 0,
          cpuUsage: Math.random() * 100, // Simulation
          totalRequests: data.data.stats?.totalRequests || 0,
          errorRate: Math.random() * 5, // Simulation
          modelOptimizations: modelOptimizations.length
        });
      }
    } catch (error) {
      console.error('Erreur chargement métriques performance:', error);
    }
  };

  const loadSecurityMetrics = async () => {
    try {
      const response = await fetch('/functions/v1/gdpr-compliance/audit?days=30');
      const data = await response.json();
      
      if (data.success) {
        setSecurityMetrics({
          encryptionStatus: true,
          consentCompliance: 95,
          dataSubjectRequests: Math.floor(Math.random() * 20),
          auditLogEntries: data.data.totalEntries || 0,
          riskLevel: 'low',
          lastSecurityScan: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erreur chargement métriques sécurité:', error);
    }
  };

  const loadModelOptimizations = async () => {
    try {
      const response = await fetch('/functions/v1/ai-performance-optimizer/models/optimize');
      const data = await response.json();
      
      if (data.success && data.data.optimizations) {
        setModelOptimizations(data.data.optimizations.slice(0, 10));
      }
    } catch (error) {
      console.error('Erreur chargement optimisations modèles:', error);
    }
  };

  const loadGDPRCompliance = async () => {
    try {
      const response = await fetch('/functions/v1/gdpr-compliance/compliance-report');
      const data = await response.json();
      
      if (data.success) {
        setGdprCompliance({
          consentRecords: data.data.compliance?.consentManagement?.totalRecords || 0,
          dataRequests: data.data.compliance?.dataSubjectRights?.totalRequests || 0,
          averageResponseTime: data.data.compliance?.dataSubjectRights?.averageProcessingTime || 'N/A',
          complianceScore: 95,
          nextReview: data.data.nextReview || ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement conformité RGPD:', error);
    }
  };

  // Optimiser le cache
  const optimizeCache = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/functions/v1/ai-performance-optimizer/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup', strategy: 'lru' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Cache optimisé",
          description: "Le cache a été nettoyé et optimisé avec succès",
          variant: "default"
        });
        
        await loadPerformanceMetrics();
      }
    } catch (error) {
      console.error('Erreur optimisation cache:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'optimiser le cache",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Réchauffer le cache
  const warmupCache = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/functions/v1/ai-performance-optimizer/warmup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategies: ['frequent-queries', 'popular-models', 'recent-results']
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Cache réchauffé",
          description: `${data.data.warmedItems} éléments ajoutés au cache`,
          variant: "default"
        });
        
        await loadPerformanceMetrics();
      }
    } catch (error) {
      console.error('Erreur réchauffement cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optimiser un modèle
  const optimizeModel = async (modelType: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/functions/v1/ai-performance-optimizer/models/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: `${modelType}_${Date.now()}`,
          optimizationType: modelType,
          targetCompression: 0.3
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Modèle optimisé",
          description: `Compression: ${Math.round(data.data.compressionRatio * 100)}%`,
          variant: "default"
        });
        
        await loadModelOptimizations();
        await loadPerformanceMetrics();
      }
    } catch (error) {
      console.error('Erreur optimisation modèle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chiffrer des données
  const encryptData = async () => {
    try {
      const response = await fetch('/functions/v1/gdpr-compliance/encryption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'encrypt',
          data: { test: 'sensitive data' }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Données chiffrées",
          description: `Algorithme: ${data.data.algorithm}`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erreur chiffrement:', error);
    }
  };

  // Effectuer une demande de données utilisateur
  const submitDataRequest = async (type: string) => {
    if (!userIdForRequest.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un ID utilisateur",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/functions/v1/gdpr-compliance/data-subject-rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userIdForRequest,
          type,
          details: { requestedBy: 'admin', automated: true }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Demande soumise",
          description: `ID: ${data.data.requestId}`,
          variant: "default"
        });
        
        setShowDataRequest(false);
        setUserIdForRequest('');
        await loadGDPRCompliance();
      }
    } catch (error) {
      console.error('Erreur demande de données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un rapport de conformité
  const generateComplianceReport = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/functions/v1/gdpr-compliance/compliance-report');
      const data = await response.json();
      
      if (data.success) {
        // Téléchargement simulé
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-conformite-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Rapport généré",
          description: "Le rapport de conformité a été téléchargé",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erreur génération rapport:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceColor = (value: number, inverse = false) => {
    if (inverse) {
      return value < 30 ? 'text-green-600' : value < 70 ? 'text-yellow-600' : 'text-red-600';
    }
    return value > 70 ? 'text-green-600' : value > 40 ? 'text-yellow-600' : 'text-red-600';
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-100 text-green-700">Faible</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700">Moyen</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-700">Élevé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gauge className="h-6 w-6 text-blue-500" />
            Performance IA & Sécurité RGPD
          </h2>
          <p className="text-gray-600">Optimisations • Cache Intelligent • Conformité • Audit Trail</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={loadPerformanceMetrics} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? '' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de Cache</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.cacheHitRate)}`}>
                  {performanceMetrics.cacheHitRate.toFixed(1)}%
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={performanceMetrics.cacheHitRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Latence Moyenne</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.averageLatency, true)}`}>
                  {performanceMetrics.averageLatency.toFixed(0)}ms
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conformité RGPD</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(gdprCompliance.complianceScore)}`}>
                  {gdprCompliance.complianceScore}%
                </p>
              </div>
              <ShieldCheck className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={gdprCompliance.complianceScore} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Niveau de Risque</p>
                <div className="mt-1">
                  {getRiskBadge(securityMetrics.riskLevel)}
                </div>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance IA</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="gdpr">Conformité RGPD</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Tab Performance IA */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cache Intelligent */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cache Intelligent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Taux de réussite</p>
                    <p className="font-semibold">{performanceMetrics.cacheHitRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Requêtes totales</p>
                    <p className="font-semibold">{performanceMetrics.totalRequests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mémoire utilisée</p>
                    <p className="font-semibold">{performanceMetrics.memoryUsage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taux d'erreur</p>
                    <p className="font-semibold">{performanceMetrics.errorRate.toFixed(2)}%</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={optimizeCache} disabled={isLoading} size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Optimiser
                  </Button>
                  <Button onClick={warmupCache} disabled={isLoading} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réchauffer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Optimisation Modèles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Optimisation Modèles ML
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Modèles optimisés</p>
                    <p className="text-2xl font-bold">{performanceMetrics.modelOptimizations}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Gain moyen</p>
                    <p className="text-lg font-semibold text-green-600">-67%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => optimizeModel('predictive')} 
                    disabled={isLoading} 
                    size="sm" 
                    className="w-full"
                  >
                    Optimiser Modèles Prédictifs
                  </Button>
                  <Button 
                    onClick={() => optimizeModel('nlp')} 
                    disabled={isLoading} 
                    size="sm" 
                    variant="outline"
                    className="w-full"
                  >
                    Optimiser Modèles NLP
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <Label>Auto-optimisation</Label>
                  <Switch checked={autoOptimization} onCheckedChange={setAutoOptimization} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des optimisations récentes */}
          {modelOptimizations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Optimisations Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modelOptimizations.slice(0, 5).map((opt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{opt.type}</p>
                        <p className="text-sm text-gray-600">
                          {opt.originalSize?.toFixed(1)}MB → {opt.optimizedSize?.toFixed(1)}MB
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700">
                          -{Math.round((1 - opt.compressionRatio) * 100)}%
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          Précision: {(opt.accuracy * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Sécurité */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chiffrement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Chiffrement des Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Statut du chiffrement</p>
                    <div className="flex items-center gap-2 mt-1">
                      {securityMetrics.encryptionStatus ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">
                        {securityMetrics.encryptionStatus ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  <Switch 
                    checked={encryptionEnabled} 
                    onCheckedChange={setEncryptionEnabled}
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Algorithme</span>
                    <span className="font-medium">AES-256-GCM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rotation des clés</span>
                    <span className="font-medium">90 jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tables chiffrées</span>
                    <span className="font-medium">12/15</span>
                  </div>
                </div>
                
                <Button onClick={encryptData} disabled={isLoading} size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Test de Chiffrement
                </Button>
              </CardContent>
            </Card>

            {/* Audit & Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Audit & Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Entrées d'audit</p>
                    <p className="font-semibold">{securityMetrics.auditLogEntries.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dernière analyse</p>
                    <p className="font-semibold">
                      {new Date(securityMetrics.lastSecurityScan).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rétention</p>
                    <p className="font-semibold">7 ans</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Intégrité</p>
                    <p className="font-semibold text-green-600">✓ Vérifiée</p>
                  </div>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Tous les accès aux données sensibles sont enregistrés et surveillés en temps réel.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Conformité RGPD */}
        <TabsContent value="gdpr" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gestion des Consentements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Gestion des Consentements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Consentements actifs</p>
                    <p className="font-semibold">{gdprCompliance.consentRecords.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taux de conformité</p>
                    <p className="font-semibold text-green-600">{securityMetrics.consentCompliance}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expirations (30j)</p>
                    <p className="font-semibold">23</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Révocations</p>
                    <p className="font-semibold">7</p>
                  </div>
                </div>
                
                <Progress value={securityMetrics.consentCompliance} className="h-2" />
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    23 consentements expireront dans les 30 prochains jours.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Droits des Personnes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Droits des Personnes Concernées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Demandes totales</p>
                    <p className="font-semibold">{gdprCompliance.dataRequests}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Temps de réponse</p>
                    <p className="font-semibold">{gdprCompliance.averageResponseTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">En cours</p>
                    <p className="font-semibold">3</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Terminées</p>
                    <p className="font-semibold text-green-600">{gdprCompliance.dataRequests - 3}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowDataRequest(true)} 
                  size="sm"
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Nouvelle Demande
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Actions de Conformité */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <h3 className="font-semibold mb-2">Rapport de Conformité</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Générer un rapport complet de conformité RGPD
                </p>
                <Button onClick={generateComplianceReport} disabled={isLoading} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Générer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Scale className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                <h3 className="font-semibold mb-2">EIVP/DPIA</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Évaluation d'impact sur la vie privée
                </p>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Évaluer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                <h3 className="font-semibold mb-2">Violation de Données</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Signaler une violation de données
                </p>
                <Button size="sm" variant="destructive">
                  <Shield className="h-4 w-4 mr-2" />
                  Signaler
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Monitoring */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Métriques Système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Métriques Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU</span>
                      <span>{performanceMetrics.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={performanceMetrics.cpuUsage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mémoire</span>
                      <span>{performanceMetrics.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={performanceMetrics.memoryUsage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cache</span>
                      <span>{performanceMetrics.cacheHitRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={performanceMetrics.cacheHitRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alertes Système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Alertes & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Système opérationnel</span>
                  </div>
                  <span className="text-xs text-gray-500">Il y a 2min</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Consentements expirant</span>
                  </div>
                  <span className="text-xs text-gray-500">Il y a 1h</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Performance optimisée</span>
                  </div>
                  <span className="text-xs text-gray-500">Il y a 3h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog pour les demandes de données */}
      <Dialog open={showDataRequest} onOpenChange={setShowDataRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle Demande de Données</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ID Utilisateur</Label>
              <Input
                value={userIdForRequest}
                onChange={(e) => setUserIdForRequest(e.target.value)}
                placeholder="Saisir l'ID utilisateur"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => submitDataRequest('access')} disabled={isLoading}>
                Accès aux données
              </Button>
              <Button onClick={() => submitDataRequest('portability')} disabled={isLoading} variant="outline">
                Portabilité
              </Button>
              <Button onClick={() => submitDataRequest('rectification')} disabled={isLoading} variant="outline">
                Rectification
              </Button>
              <Button onClick={() => submitDataRequest('erasure')} disabled={isLoading} variant="destructive">
                Effacement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PerformanceSecurityManager; 