// 🚀 AI Queue - Gestionnaire de file d'attente pour les tâches IA
// GRAND LEAP TODO - Phase 2.1: AI Core Engine

import { AITask, AIResult } from './types';

interface QueueItem {
  id: string;
  task: AITask;
  processor: () => Promise<AIResult>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export class AIQueue {
  private queue: QueueItem[] = [];
  private processing: Set<string> = new Set();
  private maxConcurrent = 5;
  private maxRetries = 3;
  private isRunning = false;

  constructor() {
    this.startProcessor();
  }

  /**
   * 📥 Ajouter une tâche à la file d'attente
   */
  async process(
    processor: () => Promise<AIResult>,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<AIResult> {
    const id = this.generateId();
    const item: QueueItem = {
      id,
      task: { type: 'unknown', input: '' }, // Placeholder
      processor,
      priority,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: this.maxRetries
    };

    this.addToQueue(item);
    
    // Attendre que la tâche soit traitée
    return this.waitForCompletion(id);
  }

  /**
   * 🎯 Ajouter à la file avec priorité
   */
  private addToQueue(item: QueueItem): void {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    
    // Insérer selon la priorité
    const insertIndex = this.queue.findIndex(
      existing => priorityOrder[existing.priority] > priorityOrder[item.priority]
    );
    
    if (insertIndex === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(insertIndex, 0, item);
    }
  }

  /**
   * ⚡ Démarrer le processeur de file
   */
  private startProcessor(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.processQueue();
  }

  /**
   * 🔄 Traitement de la file d'attente
   */
  private async processQueue(): Promise<void> {
    while (this.isRunning) {
      if (this.processing.size < this.maxConcurrent && this.queue.length > 0) {
        const item = this.queue.shift();
        if (item) {
          this.processItem(item);
        }
      }
      
      // Attendre un peu avant la prochaine itération
      await this.sleep(100);
    }
  }

  /**
   * 🎯 Traitement d'un élément de la file
   */
  private async processItem(item: QueueItem): Promise<void> {
    this.processing.add(item.id);
    
    try {
      const result = await item.processor();
      this.resolveItem(item.id, result);
    } catch (error) {
      console.error(`Error processing queue item ${item.id}:`, error);
      
      if (item.retries < item.maxRetries) {
        // Réessayer
        item.retries++;
        this.addToQueue(item);
      } else {
        // Échec définitif
        this.rejectItem(item.id, error as Error);
      }
    } finally {
      this.processing.delete(item.id);
    }
  }

  /**
   * ⏳ Attendre la completion d'une tâche
   */
  private waitForCompletion(id: string): Promise<AIResult> {
    return new Promise((resolve, reject) => {
      const checkCompletion = () => {
        const item = this.queue.find(q => q.id === id);
        if (!item) {
          // La tâche a été traitée
          const result = this.getResult(id);
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Task failed'));
          }
        } else {
          // Continuer à attendre
          setTimeout(checkCompletion, 100);
        }
      };
      
      checkCompletion();
    });
  }

  /**
   * ✅ Résoudre une tâche avec succès
   */
  private resolveItem(id: string, result: AIResult): void {
    this.setResult(id, result);
  }

  /**
   * ❌ Rejeter une tâche avec erreur
   */
  private rejectItem(id: string, error: Error): void {
    this.setResult(id, null, error);
  }

  // Stockage temporaire des résultats
  private results: Map<string, { result?: AIResult; error?: Error }> = new Map();

  private setResult(id: string, result?: AIResult, error?: Error): void {
    this.results.set(id, { result, error });
  }

  private getResult(id: string): AIResult | null {
    const item = this.results.get(id);
    if (item?.result) {
      this.results.delete(id);
      return item.result;
    }
    if (item?.error) {
      this.results.delete(id);
      throw item.error;
    }
    return null;
  }

  /**
   * 🔢 Générer un ID unique
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 😴 Pause asynchrone
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 📊 Statistiques de la file
   */
  getStats() {
    return {
      queueLength: this.queue.length,
      processing: this.processing.size,
      maxConcurrent: this.maxConcurrent,
      isRunning: this.isRunning
    };
  }

  /**
   * 🛑 Arrêter le processeur
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * 🧹 Vider la file
   */
  clear(): void {
    this.queue = [];
    this.processing.clear();
    this.results.clear();
  }
} 