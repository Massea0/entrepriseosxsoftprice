// 🧠 AI Orchestrator - Le Cerveau Central de l'Enterprise OS
// GRAND LEAP TODO - Phase 2.1: AI Core Engine

import { AITask, AIResult, AIModelType, AIContext, AIModel } from './types';
import { ModelRegistry } from './model-registry';
import { VectorCache } from './vector-cache';
import { AIQueue } from './queue';
import { PerformanceMonitor } from './performance-monitor';

export class AIOrchestrator {
  private queue: AIQueue;
  private models: ModelRegistry;
  private cache: VectorCache;
  private monitor: PerformanceMonitor;
  private context: Map<string, AIContext> = new Map();
  private startTime: number = Date.now();

  constructor() {
    this.queue = new AIQueue();
    this.models = new ModelRegistry();
    this.cache = new VectorCache();
    this.monitor = new PerformanceMonitor();
    
    this.initializeModels();
  }

  /**
   * 🎯 Traitement intelligent des tâches IA
   * Route automatiquement vers le meilleur modèle
   */
  async process(task: AITask, userId?: string): Promise<AIResult> {
    const startTime = Date.now();
    
    try {
      // 1. Enrichir le contexte
      const enrichedTask = await this.enrichWithContext(task, userId);
      
      // 2. Vérifier le cache sémantique
      const cached = await this.cache.search(enrichedTask);
      if (cached && cached.similarity > 0.95) {
        this.monitor.recordCacheHit(task.type);
        return this.formatResult(cached.result, true);
      }

      // 3. Sélectionner le modèle optimal
      const model = await this.selectOptimalModel(enrichedTask);
      
      // 4. Traiter avec gestion de la queue
      const result = await this.queue.process(async () => {
        return await model.process(enrichedTask);
      }, task.priority || 'normal');

      // 5. Mettre en cache le résultat
      await this.cache.store(enrichedTask, result);
      
      // 6. Enregistrer les métriques
      this.monitor.recordProcessing(task.type, Date.now() - startTime, model.name);
      
      return this.formatResult(result, false);
      
    } catch (error) {
      this.monitor.recordError(task.type, error as Error);
      throw new Error(`AI processing failed: ${error}`);
    }
  }

  /**
   * 🧠 Sélection intelligente du modèle
   */
  private async selectOptimalModel(task: AITask) {
    const criteria = {
      type: task.type,
      complexity: this.analyzeComplexity(task),
      latencyRequirement: task.maxLatency || 5000,
      qualityRequirement: task.minQuality || 0.8,
      cost: task.costConstraint || 'medium'
    };

    return await this.models.selectBest(criteria);
  }

  /**
   * 🔍 Enrichissement contextuel
   */
  private async enrichWithContext(task: AITask, userId?: string): Promise<AITask> {
    const context: AIContext = {
      timestamp: new Date(),
      userId,
      sessionId: task.sessionId,
      previousTasks: await this.getRecentTasks(userId),
      businessContext: await this.getBusinessContext(userId),
      preferences: await this.getUserPreferences(userId)
    };

    if (userId) {
      this.context.set(userId, context);
    }

    return {
      ...task,
      context
    };
  }

  /**
   * 📊 Analyse de complexité
   */
  private analyzeComplexity(task: AITask): 'low' | 'medium' | 'high' {
    const factors = {
      inputLength: task.input?.length || 0,
      taskType: task.type,
      hasMultimedia: (task.attachments?.length || 0) > 0,
      requiresReasoning: ['analysis', 'prediction', 'planning'].includes(task.type)
    };

    let score = 0;
    if (factors.inputLength > 1000) score += 2;
    if (factors.inputLength > 5000) score += 3;
    if (factors.hasMultimedia) score += 2;
    if (factors.requiresReasoning) score += 3;

    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    return 'high';
  }

  /**
   * 📈 Formatage des résultats
   */
  private formatResult(result: any, fromCache: boolean): AIResult {
    return {
      data: result,
      metadata: {
        fromCache,
        timestamp: new Date(),
        confidence: result.confidence || 0.9,
        processingTime: result.processingTime || 0,
        modelUsed: result.modelUsed || 'unknown'
      }
    };
  }

  /**
   * 📚 Récupération des tâches récentes
   */
  private async getRecentTasks(userId?: string): Promise<AITask[]> {
    // TODO: Implémenter la récupération depuis la DB
    return [];
  }

  /**
   * 🏢 Contexte business
   */
  private async getBusinessContext(userId?: string): Promise<any> {
    // TODO: Récupérer le contexte entreprise (rôle, projets, équipe)
    return {};
  }

  /**
   * ⚙️ Préférences utilisateur
   */
  private async getUserPreferences(userId?: string): Promise<any> {
    // TODO: Récupérer les préférences IA de l'utilisateur
    return {};
  }

  /**
   * 🚀 Initialisation des modèles
   */
  private async initializeModels() {
    // Gemini pour les tâches générales
    await this.models.register({
      name: 'gemini-pro',
      type: 'general',
      capabilities: ['text', 'analysis', 'generation'],
      maxTokens: 30720,
      costPerToken: 0.00025,
      avgLatency: 2000,
      qualityScore: 0.9,
      process: async (task: AITask) => {
        // Simulation du traitement
        return {
          success: true,
          data: `Processed: ${task.input}`,
          model: 'gemini-pro',
          timestamp: new Date()
        };
      }
    } as AIModel);

    // Modèle spécialisé pour les données business
    await this.models.register({
      name: 'business-analyzer',
      type: 'business',
      capabilities: ['analysis', 'prediction', 'reporting'],
      maxTokens: 8192,
      costPerToken: 0.0005,
      avgLatency: 1500,
      qualityScore: 0.95,
      process: async (task: AITask) => {
        // Simulation du traitement
        return {
          success: true,
          data: `Business Analysis: ${task.input}`,
          model: 'business-analyzer',
          timestamp: new Date()
        };
      }
    } as AIModel);

    // Modèle rapide pour les tâches simples
    await this.models.register({
      name: 'quick-responder',
      type: 'quick',
      capabilities: ['summarization', 'classification'],
      maxTokens: 4096,
      costPerToken: 0.0001,
      avgLatency: 500,
      qualityScore: 0.8,
      process: async (task: AITask) => {
        // Simulation du traitement
        return {
          success: true,
          data: `Quick Response: ${task.input}`,
          model: 'quick-responder',
          timestamp: new Date()
        };
      }
    } as AIModel);
  }

  /**
   * 📊 Métriques en temps réel
   */
  getMetrics() {
    return this.monitor.getStats();
  }

  /**
   * 🔄 Santé du système
   */
  getHealth() {
    return {
      models: this.models.getHealth(),
      queue: this.queue.getStats(),
      cache: this.cache.getStats(),
      uptime: Date.now() - this.startTime
    };
  }
}

// Instance singleton
export const aiOrchestrator = new AIOrchestrator();
