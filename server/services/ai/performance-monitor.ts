// 📊 Performance Monitor - Surveillance des performances IA
// GRAND LEAP TODO - Phase 2.1: AI Core Engine

interface PerformanceMetric {
  type: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceStats {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  modelUsage: Record<string, number>;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 10000;
  private stats: PerformanceStats = {
    totalRequests: 0,
    averageResponseTime: 0,
    errorRate: 0,
    cacheHitRate: 0,
    modelUsage: {}
  };

  constructor() {
    this.startPeriodicCleanup();
  }

  /**
   * 📝 Enregistrer une métrique de performance
   */
  recordProcessing(type: string, duration: number, modelName: string): void {
    this.addMetric({
      type: 'processing_time',
      value: duration,
      timestamp: Date.now(),
      metadata: { taskType: type, model: modelName }
    });

    this.updateStats();
  }

  /**
   * 🎯 Enregistrer un hit de cache
   */
  recordCacheHit(type: string): void {
    this.addMetric({
      type: 'cache_hit',
      value: 1,
      timestamp: Date.now(),
      metadata: { taskType: type }
    });

    this.updateStats();
  }

  /**
   * ❌ Enregistrer une erreur
   */
  recordError(type: string, error: Error): void {
    this.addMetric({
      type: 'error',
      value: 1,
      timestamp: Date.now(),
      metadata: { 
        taskType: type, 
        errorMessage: error.message,
        errorStack: error.stack
      }
    });

    this.updateStats();
  }

  /**
   * 📊 Enregistrer l'utilisation d'un modèle
   */
  recordModelUsage(modelName: string): void {
    this.stats.modelUsage[modelName] = (this.stats.modelUsage[modelName] || 0) + 1;
  }

  /**
   * ➕ Ajouter une métrique
   */
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Limiter le nombre de métriques stockées
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * 📈 Mettre à jour les statistiques
   */
  private updateStats(): void {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 3600000); // 1 heure

    // Calculer les statistiques
    const processingTimes = recentMetrics
      .filter(m => m.type === 'processing_time')
      .map(m => m.value);

    const errors = recentMetrics
      .filter(m => m.type === 'error')
      .length;

    const cacheHits = recentMetrics
      .filter(m => m.type === 'cache_hit')
      .length;

    const totalRequests = processingTimes.length + cacheHits;

    this.stats = {
      totalRequests,
      averageResponseTime: processingTimes.length > 0 
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
        : 0,
      errorRate: totalRequests > 0 ? errors / totalRequests : 0,
      cacheHitRate: totalRequests > 0 ? cacheHits / totalRequests : 0,
      modelUsage: { ...this.stats.modelUsage }
    };
  }

  /**
   * 🧹 Nettoyage périodique
   */
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const cutoff = Date.now() - 86400000; // 24 heures
      this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
      this.updateStats();
    }, 3600000); // Toutes les heures
  }

  /**
   * 📊 Obtenir les statistiques actuelles
   */
  getStats(): PerformanceStats {
    return { ...this.stats };
  }

  /**
   * 📈 Obtenir les métriques récentes
   */
  getRecentMetrics(duration: number = 3600000): PerformanceMetric[] {
    const cutoff = Date.now() - duration;
    return this.metrics.filter(m => m.timestamp > cutoff);
  }

  /**
   * 🎯 Obtenir les métriques par type
   */
  getMetricsByType(type: string, duration: number = 3600000): PerformanceMetric[] {
    const cutoff = Date.now() - duration;
    return this.metrics.filter(m => m.timestamp > cutoff && m.type === type);
  }

  /**
   * 📊 Obtenir un rapport de performance
   */
  getPerformanceReport(): {
    stats: PerformanceStats;
    recentMetrics: PerformanceMetric[];
    recommendations: string[];
  } {
    const recentMetrics = this.getRecentMetrics();
    const recommendations: string[] = [];

    // Analyser les performances et générer des recommandations
    if (this.stats.averageResponseTime > 5000) {
      recommendations.push('Temps de réponse élevé détecté. Considérer l\'optimisation des modèles.');
    }

    if (this.stats.errorRate > 0.1) {
      recommendations.push('Taux d\'erreur élevé détecté. Vérifier la stabilité des modèles.');
    }

    if (this.stats.cacheHitRate < 0.3) {
      recommendations.push('Taux de cache faible. Considérer l\'amélioration de la stratégie de cache.');
    }

    return {
      stats: this.getStats(),
      recentMetrics,
      recommendations
    };
  }

  /**
   * 🧹 Réinitialiser les métriques
   */
  reset(): void {
    this.metrics = [];
    this.stats = {
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      cacheHitRate: 0,
      modelUsage: {}
    };
  }

  /**
   * 📤 Exporter les métriques
   */
  exportMetrics(): string {
    return JSON.stringify({
      stats: this.getStats(),
      metrics: this.metrics,
      timestamp: Date.now()
    }, null, 2);
  }
} 