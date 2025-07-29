import { EventEmitter } from 'events';
import { WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';

// Types d'alertes
export const AlertTypeSchema = z.enum([
  'critical',
  'warning',
  'info',
  'success',
  'performance',
  'security',
  'business',
  'system'
]);

export type AlertType = z.infer<typeof AlertTypeSchema>;

// Schéma d'alerte
export const AlertSchema = z.object({
  id: z.string(),
  type: AlertTypeSchema,
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  message: z.string(),
  source: z.string(),
  timestamp: z.date(),
  userId: z.string().optional(),
  departmentId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  actions: z.array(z.object({
    label: z.string(),
    action: z.string(),
    primary: z.boolean().optional()
  })).optional(),
  autoResolve: z.boolean().optional(),
  ttl: z.number().optional() // Time to live en secondes
});

export type Alert = z.infer<typeof AlertSchema>;

// Configuration des règles d'alerte
interface AlertRule {
  id: string;
  name: string;
  condition: (data: any) => boolean;
  type: AlertType;
  severity: Alert['severity'];
  template: {
    title: string;
    message: string;
  };
  cooldown?: number; // Délai avant de pouvoir re-déclencher (en secondes)
  autoResolve?: boolean;
  ttl?: number;
}

export class RealTimeAlertService extends EventEmitter {
  private wsServer: WebSocketServer | null = null;
  private clients: Map<string, WebSocket> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private rules: Map<string, AlertRule> = new Map();
  private cooldowns: Map<string, Date> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map(); // userId -> alertTypes

  constructor() {
    super();
    this.initializeDefaultRules();
    this.startMonitoring();
  }

  // Initialiser les règles par défaut
  private initializeDefaultRules(): void {
    // Règle: Performance dégradée
    this.addRule({
      id: 'perf_degraded',
      name: 'Performance Dégradée',
      condition: (data) => data.responseTime > 2000 || data.errorRate > 0.05,
      type: 'performance',
      severity: 'high',
      template: {
        title: 'Performance Système Dégradée',
        message: 'Le temps de réponse dépasse 2s ou le taux d\'erreur est supérieur à 5%'
      },
      cooldown: 300,
      autoResolve: true
    });

    // Règle: Sécurité - Tentatives de connexion échouées
    this.addRule({
      id: 'security_failed_logins',
      name: 'Tentatives de Connexion Échouées',
      condition: (data) => data.failedLogins > 5,
      type: 'security',
      severity: 'critical',
      template: {
        title: 'Alerte Sécurité - Connexions Échouées',
        message: 'Plus de 5 tentatives de connexion échouées détectées'
      },
      cooldown: 600
    });

    // Règle: Business - Objectif de vente
    this.addRule({
      id: 'business_sales_target',
      name: 'Objectif de Vente',
      condition: (data) => data.salesProgress < 0.7 && data.daysRemaining < 7,
      type: 'business',
      severity: 'medium',
      template: {
        title: 'Objectif de Vente en Risque',
        message: 'Moins de 70% de l\'objectif atteint avec moins de 7 jours restants'
      },
      cooldown: 86400 // 1 jour
    });

    // Règle: Système - Espace disque
    this.addRule({
      id: 'system_disk_space',
      name: 'Espace Disque Faible',
      condition: (data) => data.diskUsage > 0.9,
      type: 'system',
      severity: 'high',
      template: {
        title: 'Espace Disque Critique',
        message: 'Plus de 90% de l\'espace disque utilisé'
      },
      cooldown: 3600,
      autoResolve: false
    });

    // Règle: Workflow - Tâches en retard
    this.addRule({
      id: 'workflow_overdue',
      name: 'Tâches en Retard',
      condition: (data) => data.overdueTasks > 10,
      type: 'warning',
      severity: 'medium',
      template: {
        title: 'Tâches en Retard',
        message: `${data.overdueTasks} tâches sont en retard`
      },
      cooldown: 7200,
      ttl: 86400
    });
  }

  // Ajouter une règle personnalisée
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
    this.emit('ruleAdded', rule);
  }

  // Démarrer le monitoring
  private startMonitoring(): void {
    // Simuler des vérifications périodiques
    setInterval(() => {
      this.checkPerformanceMetrics();
      this.checkSecurityEvents();
      this.checkBusinessMetrics();
      this.checkSystemHealth();
    }, 10000); // Toutes les 10 secondes

    // Nettoyer les alertes expirées
    setInterval(() => {
      this.cleanupExpiredAlerts();
    }, 60000); // Toutes les minutes
  }

  // Vérifications des métriques
  private checkPerformanceMetrics(): void {
    const metrics = {
      responseTime: 1500 + Math.random() * 1000,
      errorRate: Math.random() * 0.1,
      throughput: 1000 + Math.random() * 500
    };

    this.evaluateRules(metrics, ['performance']);
  }

  private checkSecurityEvents(): void {
    const events = {
      failedLogins: Math.floor(Math.random() * 10),
      suspiciousActivity: Math.random() > 0.95,
      unauthorizedAccess: false
    };

    this.evaluateRules(events, ['security']);
  }

  private checkBusinessMetrics(): void {
    const metrics = {
      salesProgress: 0.6 + Math.random() * 0.4,
      daysRemaining: Math.floor(Math.random() * 30),
      customerSatisfaction: 0.8 + Math.random() * 0.2,
      revenue: 100000 + Math.random() * 50000
    };

    this.evaluateRules(metrics, ['business']);
  }

  private checkSystemHealth(): void {
    const health = {
      diskUsage: 0.7 + Math.random() * 0.3,
      memoryUsage: 0.6 + Math.random() * 0.4,
      cpuUsage: 0.5 + Math.random() * 0.5,
      overdueTasks: Math.floor(Math.random() * 20)
    };

    this.evaluateRules(health, ['system', 'warning']);
  }

  // Évaluer les règles
  private evaluateRules(data: any, types?: AlertType[]): void {
    for (const [ruleId, rule] of this.rules) {
      if (types && !types.includes(rule.type)) continue;

      // Vérifier le cooldown
      const lastTriggered = this.cooldowns.get(ruleId);
      if (lastTriggered) {
        const elapsed = (Date.now() - lastTriggered.getTime()) / 1000;
        if (elapsed < (rule.cooldown || 0)) continue;
      }

      // Évaluer la condition
      try {
        if (rule.condition(data)) {
          const alert = this.createAlert(rule, data);
          this.triggerAlert(alert);
          this.cooldowns.set(ruleId, new Date());
        }
      } catch (error) {
        console.error(`Error evaluating rule ${ruleId}:`, error);
      }
    }
  }

  // Créer une alerte
  private createAlert(rule: AlertRule, data: any): Alert {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: rule.type,
      severity: rule.severity,
      title: this.interpolateTemplate(rule.template.title, data),
      message: this.interpolateTemplate(rule.template.message, data),
      source: rule.name,
      timestamp: new Date(),
      metadata: data,
      autoResolve: rule.autoResolve,
      ttl: rule.ttl
    };

    // Ajouter des actions selon le type
    switch (rule.type) {
      case 'security':
        alert.actions = [
          { label: 'Voir les détails', action: 'view_details', primary: true },
          { label: 'Bloquer l\'IP', action: 'block_ip' },
          { label: 'Ignorer', action: 'dismiss' }
        ];
        break;
      case 'performance':
        alert.actions = [
          { label: 'Analyser', action: 'analyze', primary: true },
          { label: 'Redémarrer le service', action: 'restart_service' }
        ];
        break;
      case 'business':
        alert.actions = [
          { label: 'Voir le rapport', action: 'view_report', primary: true },
          { label: 'Envoyer un rappel', action: 'send_reminder' }
        ];
        break;
      default:
        alert.actions = [
          { label: 'Marquer comme lu', action: 'mark_read', primary: true },
          { label: 'Ignorer', action: 'dismiss' }
        ];
    }

    return alert;
  }

  // Interpoler le template
  private interpolateTemplate(template: string, data: any): string {
    return template.replace(/\${(\w+)}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }

  // Déclencher une alerte
  triggerAlert(alert: Alert): void {
    this.alerts.set(alert.id, alert);
    this.emit('alert', alert);
    
    // Envoyer aux clients WebSocket abonnés
    this.broadcastAlert(alert);

    // Si auto-resolve est activé, résoudre après le TTL
    if (alert.autoResolve && alert.ttl) {
      setTimeout(() => {
        this.resolveAlert(alert.id);
      }, alert.ttl * 1000);
    }
  }

  // Diffuser l'alerte aux clients
  private broadcastAlert(alert: Alert): void {
    const message = JSON.stringify({
      type: 'alert',
      data: alert
    });

    // Envoyer à tous les clients abonnés au type d'alerte
    for (const [userId, ws] of this.clients) {
      const subscriptions = this.subscriptions.get(userId);
      if (subscriptions && (subscriptions.has(alert.type) || subscriptions.has('all'))) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      }
    }
  }

  // Résoudre une alerte
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      this.alerts.delete(alertId);
      this.emit('alertResolved', alert);
      
      const message = JSON.stringify({
        type: 'alertResolved',
        data: { alertId }
      });
      
      this.broadcast(message);
    }
  }

  // Nettoyer les alertes expirées
  private cleanupExpiredAlerts(): void {
    const now = Date.now();
    for (const [id, alert] of this.alerts) {
      if (alert.ttl) {
        const age = (now - alert.timestamp.getTime()) / 1000;
        if (age > alert.ttl) {
          this.resolveAlert(id);
        }
      }
    }
  }

  // WebSocket Server
  initializeWebSocketServer(server: any): void {
    this.wsServer = new WebSocketServer({ server, path: '/alerts' });

    this.wsServer.on('connection', (ws: WebSocket, req: any) => {
      const userId = this.getUserIdFromRequest(req);
      if (!userId) {
        ws.close(1008, 'User ID required');
        return;
      }

      this.clients.set(userId, ws);
      this.subscriptions.set(userId, new Set(['all']));

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(userId, message);
        } catch (error) {
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(userId);
        this.subscriptions.delete(userId);
      });

      // Envoyer les alertes actives
      const activeAlerts = Array.from(this.alerts.values());
      ws.send(JSON.stringify({
        type: 'activeAlerts',
        data: activeAlerts
      }));
    });
  }

  // Gérer les messages clients
  private handleClientMessage(userId: string, message: any): void {
    switch (message.type) {
      case 'subscribe':
        if (message.alertTypes && Array.isArray(message.alertTypes)) {
          this.subscriptions.set(userId, new Set(message.alertTypes));
        }
        break;
      case 'resolveAlert':
        if (message.alertId) {
          this.resolveAlert(message.alertId);
        }
        break;
      case 'executeAction':
        this.executeAlertAction(message.alertId, message.action);
        break;
    }
  }

  // Exécuter une action d'alerte
  private executeAlertAction(alertId: string, action: string): void {
    const alert = this.alerts.get(alertId);
    if (!alert) return;

    this.emit('alertAction', { alert, action });
    
    // Selon l'action, effectuer différentes opérations
    switch (action) {
      case 'dismiss':
      case 'mark_read':
        this.resolveAlert(alertId);
        break;
      default:
        // Émettre un événement pour que d'autres services puissent gérer l'action
        this.emit(`action:${action}`, alert);
    }
  }

  // Utilitaires
  private getUserIdFromRequest(req: any): string | null {
    // Extraire l'ID utilisateur depuis les headers ou la query
    return req.headers['x-user-id'] || req.url?.split('userId=')[1]?.split('&')[0] || null;
  }

  private broadcast(message: string): void {
    for (const ws of this.clients.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    }
  }

  // API publique
  getActiveAlerts(type?: AlertType): Alert[] {
    return Array.from(this.alerts.values())
      .filter(alert => !type || alert.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAlertStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    averageResolutionTime: number;
  } {
    const alerts = Array.from(this.alerts.values());
    const stats = {
      total: alerts.length,
      bySeverity: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      averageResolutionTime: 0
    };

    for (const alert of alerts) {
      stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
    }

    return stats;
  }
}

// Export singleton
export const alertService = new RealTimeAlertService();