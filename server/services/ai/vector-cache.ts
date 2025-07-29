// 🧠 Vector Cache - Cache sémantique pour les résultats IA
// GRAND LEAP TODO - Phase 2.1: AI Core Engine

import { AITask, AIResult } from './types';

interface CacheEntry {
  task: AITask;
  result: AIResult;
  timestamp: number;
  similarity: number;
}

export class VectorCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize = 1000;
  private ttl = 24 * 60 * 60 * 1000; // 24 heures

  /**
   * 🔍 Recherche sémantique dans le cache
   */
  async search(task: AITask): Promise<CacheEntry | null> {
    const taskKey = this.generateKey(task);
    
    // Nettoyer le cache expiré
    this.cleanup();
    
    // Recherche exacte d'abord
    const exact = this.cache.get(taskKey);
    if (exact && !this.isExpired(exact.timestamp)) {
      return exact;
    }
    
    // Recherche sémantique
    const bestMatch = await this.findSemanticMatch(task);
    if (bestMatch && bestMatch.similarity > 0.9) {
      return bestMatch;
    }
    
    return null;
  }

  /**
   * 💾 Stockage dans le cache
   */
  async store(task: AITask, result: AIResult): Promise<void> {
    const taskKey = this.generateKey(task);
    
    // Gérer la taille du cache
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(taskKey, {
      task,
      result,
      timestamp: Date.now(),
      similarity: 1.0
    });
  }

  /**
   * 🗑️ Nettoyage du cache
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry.timestamp)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 🔍 Recherche sémantique
   */
  private async findSemanticMatch(task: AITask): Promise<CacheEntry | null> {
    let bestMatch: CacheEntry | null = null;
    let bestSimilarity = 0;
    
    for (const entry of this.cache.values()) {
      if (this.isExpired(entry.timestamp)) continue;
      
      const similarity = this.calculateSimilarity(task, entry.task);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = { ...entry, similarity };
      }
    }
    
    return bestMatch;
  }

  /**
   * 📊 Calcul de similarité sémantique
   */
  private calculateSimilarity(task1: AITask, task2: AITask): number {
    // Implémentation simple basée sur les mots-clés
    const words1 = task1.input.toLowerCase().split(/\s+/);
    const words2 = task2.input.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  /**
   * 🔑 Génération de clé de cache
   */
  private generateKey(task: AITask): string {
    return `${task.type}_${this.hashString(task.input)}`;
  }

  /**
   * 🕐 Vérification d'expiration
   */
  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.ttl;
  }

  /**
   * 🗑️ Suppression des entrées les plus anciennes
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * 🔢 Hash simple pour les chaînes
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * 📊 Statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // À implémenter avec des métriques
      avgSimilarity: 0
    };
  }

  /**
   * 🧹 Vider le cache
   */
  clear(): void {
    this.cache.clear();
  }
} 