// 🗃️ Registre des Modèles IA
// GRAND LEAP TODO - Phase 2.1: AI Core Engine

import { AIModel, ModelSelectionCriteria, AIModelType } from './types';

export class ModelRegistry {
  private models: Map<string, AIModel> = new Map();
  private typeIndex: Map<AIModelType, string[]> = new Map();
  private capabilityIndex: Map<string, string[]> = new Map();

  /**
   * 📝 Enregistrement d'un nouveau modèle
   */
  async register(model: AIModel): Promise<void> {
    this.models.set(model.name, model);
    
    // Index par type
    if (!this.typeIndex.has(model.type)) {
      this.typeIndex.set(model.type, []);
    }
    this.typeIndex.get(model.type)!.push(model.name);
    
    // Index par capacités
    model.capabilities.forEach(capability => {
      if (!this.capabilityIndex.has(capability)) {
        this.capabilityIndex.set(capability, []);
      }
      this.capabilityIndex.get(capability)!.push(model.name);
    });
    
    console.log(`✅ Model registered: ${model.name} (${model.type})`);
  }

  /**
   * 🎯 Sélection du meilleur modèle
   */
  async selectBest(criteria: ModelSelectionCriteria): Promise<AIModel> {
    const candidates = this.findCandidates(criteria);
    
    if (candidates.length === 0) {
      throw new Error(`No suitable model found for criteria: ${JSON.stringify(criteria)}`);
    }
    
    // Calcul du score composite
    const scored = candidates.map(model => ({
      model,
      score: this.calculateScore(model, criteria)
    }));
    
    // Tri par score décroissant
    scored.sort((a, b) => b.score - a.score);
    
    const selected = scored[0].model;
    console.log(`🎯 Selected model: ${selected.name} (score: ${scored[0].score.toFixed(2)})`);
    
    return selected;
  }

  /**
   * 🔍 Recherche de candidats
   */
  private findCandidates(criteria: ModelSelectionCriteria): AIModel[] {
    const candidates: AIModel[] = [];
    
    // Recherche par type de tâche
    const taskCapability = this.mapTaskToCapability(criteria.type);
    const modelNamesWithCapability = this.capabilityIndex.get(taskCapability) || [];
    
    modelNamesWithCapability.forEach(modelName => {
      const model = this.models.get(modelName);
      if (model && this.meetsBasicRequirements(model, criteria)) {
        candidates.push(model);
      }
    });
    
    // Si pas de candidats spécifiques, chercher dans les modèles généraux
    if (candidates.length === 0) {
      const generalModels = this.typeIndex.get('general') || [];
      generalModels.forEach(modelName => {
        const model = this.models.get(modelName);
        if (model && this.meetsBasicRequirements(model, criteria)) {
          candidates.push(model);
        }
      });
    }
    
    return candidates;
  }

  /**
   * 📊 Calcul du score composite
   */
  private calculateScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    
    // Score de qualité (40%)
    const qualityScore = Math.min(model.qualityScore / criteria.qualityRequirement, 1);
    score += qualityScore * 40;
    
    // Score de latence (30%)
    const latencyScore = Math.max(0, 1 - (model.avgLatency / criteria.latencyRequirement));
    score += latencyScore * 30;
    
    // Score de coût (20%)
    const costScore = this.calculateCostScore(model, criteria.cost);
    score += costScore * 20;
    
    // Score de spécialisation (10%)
    const specializationScore = this.calculateSpecializationScore(model, criteria);
    score += specializationScore * 10;
    
    return score;
  }

  /**
   * 💰 Score de coût
   */
  private calculateCostScore(model: AIModel, costConstraint: string): number {
    const costThresholds = {
      low: 0.0002,
      medium: 0.0005,
      high: 0.001
    };
    
    const threshold = costThresholds[costConstraint as keyof typeof costThresholds];
    return Math.max(0, 1 - (model.costPerToken / threshold));
  }

  /**
   * 🎯 Score de spécialisation
   */
  private calculateSpecializationScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    const taskCapability = this.mapTaskToCapability(criteria.type);
    
    if (model.capabilities.includes(taskCapability)) {
      // Bonus pour les modèles spécialisés
      const isSpecialized = model.type !== 'general';
      return isSpecialized ? 1 : 0.7;
    }
    
    return 0.5; // Score neutre pour capacité générale
  }

  /**
   * ✅ Vérification des exigences de base
   */
  private meetsBasicRequirements(model: AIModel, criteria: ModelSelectionCriteria): boolean {
    return (
      model.isAvailable !== false &&
      model.avgLatency <= criteria.latencyRequirement &&
      model.qualityScore >= criteria.qualityRequirement
    );
  }

  /**
   * 🗺️ Mapping tâche -> capacité
   */
  private mapTaskToCapability(taskType: string): string {
    const mapping: Record<string, string> = {
      'analysis': 'analysis',
      'generation': 'generation',
      'summarization': 'summarization',
      'translation': 'translation',
      'classification': 'classification',
      'prediction': 'prediction',
      'planning': 'planning',
      'optimization': 'analysis',
      'automation': 'generation',
      'reporting': 'analysis',
      'support': 'generation',
      'search': 'classification'
    };
    
    return mapping[taskType] || 'text';
  }

  /**
   * 📋 Liste des modèles disponibles
   */
  getAvailable(): AIModel[] {
    return Array.from(this.models.values()).filter(model => model.isAvailable !== false);
  }

  /**
   * 🔧 Récupération d'un modèle par nom
   */
  get(name: string): AIModel | undefined {
    return this.models.get(name);
  }

  /**
   * 💚 État de santé des modèles
   */
  getHealth(): Record<string, any> {
    const models = Array.from(this.models.values());
    
    return {
      total: models.length,
      available: models.filter(m => m.isAvailable !== false).length,
      types: Object.fromEntries(this.typeIndex.entries()),
      avgQuality: models.reduce((sum, m) => sum + m.qualityScore, 0) / models.length,
      avgLatency: models.reduce((sum, m) => sum + m.avgLatency, 0) / models.length
    };
  }

  /**
   * 🗑️ Désenregistrement d'un modèle
   */
  unregister(name: string): boolean {
    const model = this.models.get(name);
    if (!model) return false;
    
    this.models.delete(name);
    
    // Nettoyage des index
    const typeModels = this.typeIndex.get(model.type);
    if (typeModels) {
      const index = typeModels.indexOf(name);
      if (index > -1) typeModels.splice(index, 1);
    }
    
    model.capabilities.forEach(capability => {
      const capabilityModels = this.capabilityIndex.get(capability);
      if (capabilityModels) {
        const index = capabilityModels.indexOf(name);
        if (index > -1) capabilityModels.splice(index, 1);
      }
    });
    
    console.log(`❌ Model unregistered: ${name}`);
    return true;
  }
}
