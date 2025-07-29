// 🚀 PHASE 5 - MONITORING SÉCURITÉ TEMPS RÉEL
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye,
  Wifi,
  Server,
  Lock,
  Users,
  Database,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSecurityMonitoring } from "@/utils/security-audit";

interface SecurityMetrics {
  activeConnections: number;
  failedAttempts: number;
  blockedIPs: number;
  databaseQueries: number;
  apiCalls: number;
  uptime: string;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'login_attempt' | 'data_access' | 'suspicious_activity' | 'security_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip?: string;
  userAgent?: string;
  blocked: boolean;
}

export function SecurityMonitoring() {
  const { toast } = useToast();
  const { logEvent } = useSecurityMonitoring();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    activeConnections: 247,
    failedAttempts: 12,
    blockedIPs: 5,
    databaseQueries: 1850,
    apiCalls: 920,
    uptime: "15d 7h 23m",
    responseTime: 145,
    memoryUsage: 68,
    cpuUsage: 34
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    // Simuler les événements de sécurité en temps réel
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5000),
        type: 'login_attempt',
        severity: 'medium',
        description: 'Tentatives de connexion multiples depuis la même IP',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        blocked: false
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15000),
        type: 'suspicious_activity',
        severity: 'high',
        description: 'Accès à des données sensibles en dehors des heures normales',
        ip: '203.0.113.45',
        blocked: true
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 30000),
        type: 'data_access',
        severity: 'low',
        description: 'Export de données utilisateur autorisé',
        blocked: false
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 45000),
        type: 'security_breach',
        severity: 'critical',
        description: 'Tentative d\'injection SQL détectée et bloquée',
        ip: '198.51.100.23',
        blocked: true
      }
    ];

    setSecurityEvents(mockEvents);

    // Simuler les mises à jour en temps réel
    const interval = setInterval(() => {
      if (isMonitoring) {
        setMetrics(prev => ({
          ...prev,
          activeConnections: prev.activeConnections + Math.floor(Math.random() * 10 - 5),
          failedAttempts: prev.failedAttempts + Math.floor(Math.random() * 3),
          apiCalls: prev.apiCalls + Math.floor(Math.random() * 50),
          responseTime: Math.max(50, prev.responseTime + Math.floor(Math.random() * 20 - 10)),
          memoryUsage: Math.min(95, Math.max(30, prev.memoryUsage + Math.floor(Math.random() * 6 - 3))),
          cpuUsage: Math.min(90, Math.max(15, prev.cpuUsage + Math.floor(Math.random() * 10 - 5)))
        }));

        // Ajouter parfois un nouvel événement
        if (Math.random() < 0.1) {
          const newEvent: SecurityEvent = {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: ['login_attempt', 'data_access', 'suspicious_activity'][Math.floor(Math.random() * 3)] as unknown,
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as unknown,
            description: 'Nouvel événement de sécurité détecté',
            blocked: Math.random() < 0.3
          };

          setSecurityEvents(prev => [newEvent, ...prev.slice(0, 9)]);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getMetricStatus = (value: number, type: 'percentage' | 'response') => {
    if (type === 'percentage') {
      if (value >= 80) return 'destructive';
      if (value >= 60) return 'secondary';
      return 'default';
    } else {
      if (value >= 300) return 'destructive';
      if (value >= 200) return 'secondary';
      return 'default';
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    
    logEvent({
      type: 'suspicious_activity',
      severity: 'low',
      description: `Security monitoring ${isMonitoring ? 'disabled' : 'enabled'}`,
      metadata: { action: isMonitoring ? 'stop' : 'start' }
    });

    toast({
      title: `Monitoring ${isMonitoring ? 'arrêté' : 'démarré'}`,
      description: `Le monitoring de sécurité est maintenant ${isMonitoring ? 'inactif' : 'actif'}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span>Monitoring Sécurité</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Surveillance en temps réel des événements de sécurité
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-sm">{isMonitoring ? 'En ligne' : 'Hors ligne'}</span>
          <Button onClick={toggleMonitoring} variant={isMonitoring ? "destructive" : "default"}>
            {isMonitoring ? 'Arrêter' : 'Démarrer'}
          </Button>
        </div>
      </div>

      {/* Métriques temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connexions Actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeConnections}</div>
            <p className="text-xs text-muted-foreground">Sessions utilisateur</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentatives Échouées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.failedAttempts}</div>
            <p className="text-xs text-muted-foreground">Dernière heure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs Bloquées</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">Automatiquement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <Badge variant={getMetricStatus(metrics.responseTime, 'response') as unknown} className="text-xs">
              {metrics.responseTime < 200 ? 'Optimal' : metrics.responseTime < 300 ? 'Acceptable' : 'Lent'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Métriques système */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Utilisation CPU</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilisation</span>
                <span>{metrics.cpuUsage}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="w-full" />
              <Badge variant={getMetricStatus(metrics.cpuUsage, 'percentage') as unknown} className="text-xs">
                {metrics.cpuUsage < 60 ? 'Normal' : metrics.cpuUsage < 80 ? 'Élevé' : 'Critique'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Utilisation Mémoire</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilisation</span>
                <span>{metrics.memoryUsage}%</span>
              </div>
              <Progress value={metrics.memoryUsage} className="w-full" />
              <Badge variant={getMetricStatus(metrics.memoryUsage, 'percentage') as unknown} className="text-xs">
                {metrics.memoryUsage < 60 ? 'Normal' : metrics.memoryUsage < 80 ? 'Élevé' : 'Critique'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Uptime</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.uptime}</div>
            <p className="text-sm text-muted-foreground">Disponibilité: 99.9%</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Système opérationnel</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Événements de sécurité en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Événements de Sécurité</span>
            <Badge variant="outline">{securityEvents.length} événements</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-start justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant={getSeverityColor(event.severity) as unknown}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={event.blocked ? "destructive" : "outline"}>
                      {event.blocked ? 'BLOQUÉ' : 'AUTORISÉ'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{event.description}</p>
                  {event.ip && (
                    <p className="text-xs text-muted-foreground">IP: {event.ip}</p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {event.severity === 'critical' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {event.blocked && <Shield className="h-4 w-4 text-green-600" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes système */}
      {(metrics.cpuUsage > 80 || metrics.memoryUsage > 80 || metrics.responseTime > 300) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Alerte système : Performance dégradée détectée. 
            {metrics.cpuUsage > 80 && " CPU élevé."}
            {metrics.memoryUsage > 80 && " Mémoire saturée."}
            {metrics.responseTime > 300 && " Temps de réponse lent."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}