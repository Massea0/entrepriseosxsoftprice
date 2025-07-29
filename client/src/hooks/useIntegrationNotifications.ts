import { useState, useEffect, useCallback, useRef } from 'react';

// Types pour les notifications d'intégration
interface NotificationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    type: 'system' | 'workflow' | 'user' | 'schedule';
    condition: string;
    data?: Record<string, unknown>;
  };
  actions: Array<{
    platform: 'slack' | 'teams' | 'whatsapp' | 'all';
    template: string;
    channel?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    delay?: number; // en secondes
  }>;
  filters: {
    timeWindow?: { start: string; end: string };
    weekdays?: number[];
    keywords?: string[];
    userRoles?: string[];
  };
  throttle?: {
    enabled: boolean;
    maxPerHour: number;
    maxPerDay: number;
  };
}

interface NotificationEvent {
  type: string;
  source: string;
        data: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationStats {
  totalSent: number;
  successRate: number;
  errorCount: number;
  ruleStats: Record<string, {
    triggered: number;
    sent: number;
    errors: number;
    lastTriggered?: string;
  }>;
}

interface UseIntegrationNotificationsOptions {
  enableAutoSend?: boolean;
  throttleCheck?: boolean;
  logEvents?: boolean;
}

// Règles de notification prédéfinies
const DEFAULT_RULES: NotificationRule[] = [
  {
    id: 'system-critical-alert',
    name: 'Alertes Système Critiques',
    enabled: true,
    trigger: {
      type: 'system',
      condition: 'alert.severity >= critical'
    },
    actions: [{
      platform: 'all',
      template: 'system_alert',
      priority: 'urgent'
    }],
    filters: {},
    throttle: {
      enabled: true,
      maxPerHour: 5,
      maxPerDay: 20
    }
  },
  {
    id: 'workflow-completion',
    name: 'Fin de Workflow Important',
    enabled: true,
    trigger: {
      type: 'workflow',
      condition: 'workflow.status == completed && workflow.priority >= high'
    },
    actions: [{
      platform: 'slack',
      template: 'workflow_complete',
      priority: 'medium'
    }],
    filters: {
      timeWindow: { start: '08:00', end: '20:00' },
      weekdays: [1, 2, 3, 4, 5] // Lundi à Vendredi
    }
  },
  {
    id: 'user-mention',
    name: 'Mention Utilisateur',
    enabled: true,
    trigger: {
      type: 'user',
      condition: 'user.mentioned == true'
    },
    actions: [{
      platform: 'slack',
      template: 'user_mention',
      priority: 'medium'
    }],
    filters: {}
  },
  {
    id: 'task-overdue',
    name: 'Tâches en Retard',
    enabled: true,
    trigger: {
      type: 'schedule',
      condition: 'task.dueDate < now() && task.status != completed'
    },
    actions: [{
      platform: 'teams',
      template: 'task_assignment',
      priority: 'high'
    }],
    filters: {
      timeWindow: { start: '09:00', end: '18:00' }
    },
    throttle: {
      enabled: true,
      maxPerHour: 10,
      maxPerDay: 50
    }
  },
  {
    id: 'emergency-contact',
    name: 'Contact d\'Urgence',
    enabled: true,
    trigger: {
      type: 'system',
      condition: 'emergency.level >= 4'
    },
    actions: [{
      platform: 'whatsapp',
      template: 'emergency_alert',
      priority: 'urgent'
    }],
    filters: {},
    throttle: {
      enabled: false,
      maxPerHour: 0,
      maxPerDay: 0
    }
  }
];

export const useIntegrationNotifications = (options: UseIntegrationNotificationsOptions = {}) => {
  const [rules, setRules] = useState<NotificationRule[]>(DEFAULT_RULES);
  const [stats, setStats] = useState<NotificationStats>({
    totalSent: 0,
    successRate: 0,
    errorCount: 0,
    ruleStats: {}
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [eventQueue, setEventQueue] = useState<NotificationEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const throttleRef = useRef<Map<string, { count: number; lastReset: number }>>(new Map());
  const processTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    enableAutoSend: true,
    throttleCheck: true,
    logEvents: true,
    ...options
  };

  // Initialisation
  useEffect(() => {
    loadRulesFromStorage();
    loadStatsFromStorage();
    setIsInitialized(true);
    
    // Commencer le traitement des événements
    if (config.enableAutoSend) {
      startEventProcessing();
    }
    
    return () => {
      if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
      }
    };
  }, [config.enableAutoSend]);

  // Traitement périodique des événements en file
  const startEventProcessing = useCallback(() => {
    const processEvents = async () => {
      if (eventQueue.length > 0 && !isProcessing) {
        await processEventQueue();
      }
      
      // Programmer le prochain traitement
      processTimeoutRef.current = setTimeout(processEvents, 5000); // 5 secondes
    };
    
    processEvents();
  }, [eventQueue.length, isProcessing]);

  // Charger les règles depuis le stockage local
  const loadRulesFromStorage = () => {
    try {
      const stored = localStorage.getItem('integration-notification-rules');
      if (stored) {
        setRules(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur chargement règles:', error);
    }
  };

  // Charger les statistiques
  const loadStatsFromStorage = () => {
    try {
      const stored = localStorage.getItem('integration-notification-stats');
      if (stored) {
        setStats(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  // Sauvegarder les règles
  const saveRulesToStorage = (newRules: NotificationRule[]) => {
    try {
      localStorage.setItem('integration-notification-rules', JSON.stringify(newRules));
    } catch (error) {
      console.error('Erreur sauvegarde règles:', error);
    }
  };

  // Sauvegarder les statistiques
  const saveStatsToStorage = (newStats: NotificationStats) => {
    try {
      localStorage.setItem('integration-notification-stats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Erreur sauvegarde stats:', error);
    }
  };

  // Ajouter un événement à traiter
  const addEvent = useCallback((event: NotificationEvent) => {
    if (config.logEvents) {
      console.log('📢 Nouvel événement notification:', event);
    }
    
    setEventQueue(prev => [...prev, {
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    }]);
  }, [config.logEvents]);

  // Traiter la file d'événements
  const processEventQueue = useCallback(async () => {
    if (isProcessing || eventQueue.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const eventsToProcess = [...eventQueue];
      setEventQueue([]);
      
      for (const event of eventsToProcess) {
        await processEvent(event);
      }
    } catch (error) {
      console.error('Erreur traitement file événements:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [eventQueue, isProcessing]);

  // Traiter un événement individuel
  const processEvent = async (event: NotificationEvent) => {
    const matchingRules = rules.filter(rule => 
      rule.enabled && evaluateCondition(rule.trigger, event)
    );
    
    for (const rule of matchingRules) {
      try {
        // Vérifier les filtres
        if (!passesFilters(rule.filters, event)) {
          continue;
        }
        
        // Vérifier le throttling
        if (config.throttleCheck && !passesThrottle(rule, event)) {
          console.log(`🚫 Règle ${rule.name} throttlée`);
          continue;
        }
        
        // Exécuter les actions
        for (const action of rule.actions) {
          await executeAction(rule, action, event);
        }
        
        // Mettre à jour les statistiques
        updateRuleStats(rule.id, true, false);
        
      } catch (error) {
        console.error(`Erreur traitement règle ${rule.name}:`, error);
        updateRuleStats(rule.id, false, true);
      }
    }
  };

  // Évaluer une condition
  const evaluateCondition = (trigger: NotificationRule['trigger'], event: NotificationEvent): boolean => {
    try {
      const condition = trigger.condition;
      
      // Évaluation simple basée sur le type et les données
      switch (trigger.type) {
        case 'system':
          return event.type === 'system' && evaluateExpression(condition, event.data);
        case 'workflow':
          return event.type === 'workflow' && evaluateExpression(condition, event.data);
        case 'user':
          return event.type === 'user' && evaluateExpression(condition, event.data);
        case 'schedule':
          return event.type === 'schedule' && evaluateExpression(condition, event.data);
        default:
          return false;
      }
    } catch (error) {
      console.error('Erreur évaluation condition:', error);
      return false;
    }
  };

  // Évaluer une expression simple
  const evaluateExpression = (expression: string, data: Record<string, unknown>): boolean => {
    try {
      // Remplacer les variables dans l'expression
      let evaluatedExpression = expression;
      
      Object.keys(data).forEach(key => {
        const value = data[key];
        evaluatedExpression = evaluatedExpression.replace(
          new RegExp(`\\b${key}\\b`, 'g'),
          typeof value === 'string' ? `"${value}"` : String(value)
        );
      });
      
      // Évaluation sécurisée basique (en production, utiliser un parser approprié)
      // Pour la démo, quelques patterns simples
      if (evaluatedExpression.includes('>=')) {
        const [left, right] = evaluatedExpression.split('>=').map(s => s.trim());
        return parseFloat(left) >= parseFloat(right);
      }
      
      if (evaluatedExpression.includes('==')) {
        const [left, right] = evaluatedExpression.split('==').map(s => s.trim().replace(/"/g, ''));
        return left === right;
      }
      
      if (evaluatedExpression.includes('<')) {
        const [left, right] = evaluatedExpression.split('<').map(s => s.trim());
        if (right === 'now()') {
          return new Date(left) < new Date();
        }
        return parseFloat(left) < parseFloat(right);
      }
      
      return false;
    } catch (error) {
      console.error('Erreur évaluation expression:', error);
      return false;
    }
  };

  // Vérifier les filtres
  const passesFilters = (filters: NotificationRule['filters'], event: NotificationEvent): boolean => {
    const now = new Date();
    
    // Filtre de fenêtre temporelle
    if (filters.timeWindow) {
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseTimeString(filters.timeWindow.start);
      const endTime = parseTimeString(filters.timeWindow.end);
      
      if (currentTime < startTime || currentTime > endTime) {
        return false;
      }
    }
    
    // Filtre de jours de la semaine
    if (filters.weekdays) {
      const currentDay = now.getDay();
      if (!filters.weekdays.includes(currentDay)) {
        return false;
      }
    }
    
    // Filtre de mots-clés
    if (filters.keywords && filters.keywords.length > 0) {
      const eventText = JSON.stringify(event.data).toLowerCase();
      const hasKeyword = filters.keywords.some(keyword => 
        eventText.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) {
        return false;
      }
    }
    
    return true;
  };

  // Vérifier le throttling
  const passesThrottle = (rule: NotificationRule, event: NotificationEvent): boolean => {
    if (!rule.throttle?.enabled) return true;
    
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;
    
    const throttleKey = rule.id;
    const throttleData = throttleRef.current.get(throttleKey) || { count: 0, lastReset: now };
    
    // Reset du compteur si plus d'une heure
    if (now - throttleData.lastReset > hourMs) {
      throttleData.count = 0;
      throttleData.lastReset = now;
    }
    
    // Vérifier les limites
    if (rule.throttle.maxPerHour && throttleData.count >= rule.throttle.maxPerHour) {
      return false;
    }
    
    // Incrémenter le compteur
    throttleData.count++;
    throttleRef.current.set(throttleKey, throttleData);
    
    return true;
  };

  // Exécuter une action
  const executeAction = async (
    rule: NotificationRule, 
    action: NotificationRule['actions'][0], 
    event: NotificationEvent
  ) => {
    try {
      // Appliquer le délai si spécifié
      if (action.delay && action.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, action.delay * 1000));
      }
      
      // Préparer le payload de notification
      const payload = {
        type: 'notification',
        title: `Notification: ${rule.name}`,
        message: generateMessageFromTemplate(action.template, event.data),
        priority: action.priority,
        platforms: action.platform === 'all' ? ['slack', 'teams', 'whatsapp'] : [action.platform],
        channels: action.channel ? [action.channel] : undefined,
        data: {
          ruleId: rule.id,
          ruleName: rule.name,
          eventType: event.type,
          timestamp: event.timestamp
        }
      };
      
      // Envoyer via l'API d'intégrations
      const response = await fetch('/functions/v1/third-party-integrations/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (config.logEvents) {
        console.log(`✅ Notification envoyée pour règle ${rule.name}:`, result);
      }
      
      return result;
      
    } catch (error) {
      console.error(`❌ Erreur envoi notification pour règle ${rule.name}:`, error);
      throw error;
    }
  };

  // Générer un message depuis un template
  const generateMessageFromTemplate = (template: string, data: Record<string, unknown>): string => {
    try {
      // Templates prédéfinis
      const templates = {
        system_alert: `🚨 Alerte Système: ${data.alertType || 'Inconnue'}`,
        workflow_complete: `✅ Workflow "${data.workflowName || 'Inconnu'}" terminé`,
        user_mention: `👤 Vous avez été mentionné dans ${data.context || 'un contexte'}`,
        task_assignment: `📋 Nouvelle tâche: ${data.taskTitle || 'Sans titre'}`,
        emergency_alert: `🚨 URGENCE: ${data.emergencyMessage || 'Situation critique'}`
      };
      
      return templates[template] || `Notification: ${JSON.stringify(data)}`;
    } catch (error) {
      return `Erreur génération message: ${error.message}`;
    }
  };

  // Mettre à jour les statistiques d'une règle
  const updateRuleStats = (ruleId: string, success: boolean, error: boolean) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      if (!newStats.ruleStats[ruleId]) {
        newStats.ruleStats[ruleId] = {
          triggered: 0,
          sent: 0,
          errors: 0
        };
      }
      
      newStats.ruleStats[ruleId].triggered++;
      
      if (success) {
        newStats.ruleStats[ruleId].sent++;
        newStats.totalSent++;
      }
      
      if (error) {
        newStats.ruleStats[ruleId].errors++;
        newStats.errorCount++;
      }
      
      newStats.ruleStats[ruleId].lastTriggered = new Date().toISOString();
      
      // Calculer le taux de succès
      const totalSent = newStats.totalSent;
      const totalErrors = newStats.errorCount;
      newStats.successRate = totalSent + totalErrors > 0 
        ? Math.round((totalSent / (totalSent + totalErrors)) * 100)
        : 100;
      
      saveStatsToStorage(newStats);
      return newStats;
    });
  };

  // Ajouter une nouvelle règle
  const addRule = useCallback((rule: Omit<NotificationRule, 'id'>) => {
    const newRule: NotificationRule = {
      ...rule,
      id: `custom-${Date.now()}`
    };
    
    const newRules = [...rules, newRule];
    setRules(newRules);
    saveRulesToStorage(newRules);
  }, [rules]);

  // Modifier une règle
  const updateRule = useCallback((ruleId: string, updates: Partial<NotificationRule>) => {
    const newRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    setRules(newRules);
    saveRulesToStorage(newRules);
  }, [rules]);

  // Supprimer une règle
  const removeRule = useCallback((ruleId: string) => {
    const newRules = rules.filter(rule => rule.id !== ruleId);
    setRules(newRules);
    saveRulesToStorage(newRules);
  }, [rules]);

  // Activer/désactiver une règle
  const toggleRule = useCallback((ruleId: string, enabled: boolean) => {
    updateRule(ruleId, { enabled });
  }, [updateRule]);

  // Tester une règle manuellement
  const testRule = useCallback(async (ruleId: string, testData: Record<string, unknown>) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return false;
    
    const testEvent: NotificationEvent = {
      type: rule.trigger.type,
      source: 'manual-test',
      data: testData,
      timestamp: new Date().toISOString()
    };
    
    try {
      await processEvent(testEvent);
      return true;
    } catch (error) {
      console.error('Erreur test règle:', error);
      return false;
    }
  }, [rules]);

  // Réinitialiser les statistiques
  const resetStats = useCallback(() => {
    const emptyStats: NotificationStats = {
      totalSent: 0,
      successRate: 0,
      errorCount: 0,
      ruleStats: {}
    };
    setStats(emptyStats);
    saveStatsToStorage(emptyStats);
  }, []);

  // Fonctions utilitaires
  const parseTimeString = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 100 + minutes;
  };

  return {
    // État
    rules,
    stats,
    isInitialized,
    isProcessing,
    queueSize: eventQueue.length,
    
    // Actions
    addEvent,
    addRule,
    updateRule,
    removeRule,
    toggleRule,
    testRule,
    resetStats,
    
    // Utilitaires
    processEventQueue: () => processEventQueue(),
    clearQueue: () => setEventQueue([]),
    
    // Configuration
    config
  };
};

export default useIntegrationNotifications; 