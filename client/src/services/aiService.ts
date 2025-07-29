// 🤖 AI Services Frontend - GRAND LEAP TODO Phase 2.2
// Interface avec les services IA du backend

export interface WorkflowGenerationRequest {
  description: string;
  context: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface WorkflowStep {
  id: string;
  type: 'condition' | 'action' | 'trigger';
  name: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface GeneratedWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  estimatedTime: string;
  complexity: 'simple' | 'medium' | 'complex';
  confidence: number;
}

export interface PredictionRequest {
  metrics: string[];
  timeframe: string;
  context?: Record<string, any>;
}

export interface PredictionResult {
  predictions: Array<{
    name: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
    timeframe: string;
    unit: string;
  }>;
  anomalies: Array<{
    id: string;
    metric: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    detectedAt: string;
    impact: string;
    recommendation: string;
  }>;
  forecast: Array<{
    date: string;
    actual?: number;
    predicted: number;
    confidence: number;
  }>;
}

export interface NaturalLanguageRequest {
  query: string;
  database?: string;
  context?: string;
}

export interface NaturalLanguageResult {
  query: string;
  sql: string;
  results: any[];
  executionTime: number;
  confidence: number;
  explanation: string;
  intent: string;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
}

class AIService {
  private baseUrl = '/api/ai';

  /**
   * Génère un workflow automatiquement à partir d'une description
   */
  async generateWorkflow(request: WorkflowGenerationRequest): Promise<GeneratedWorkflow> {
    const response = await fetch(`${this.baseUrl}/generate-workflow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Erreur génération workflow: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Sauvegarde un workflow généré
   */
  async saveWorkflow(workflow: GeneratedWorkflow): Promise<{ id: string; saved: boolean }> {
    const response = await fetch(`${this.baseUrl}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      throw new Error(`Erreur sauvegarde workflow: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Récupère tous les workflows sauvegardés
   */
  async getWorkflows(): Promise<GeneratedWorkflow[]> {
    const response = await fetch(`${this.baseUrl}/workflows`);
    
    if (!response.ok) {
      throw new Error(`Erreur récupération workflows: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Génère des prédictions et analyse les anomalies
   */
  async getPredictions(request?: PredictionRequest): Promise<PredictionResult> {
    const url = request 
      ? `${this.baseUrl}/predictions`
      : `${this.baseUrl}/predictions`;
    
    const options: RequestInit = {
      method: request ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (request) {
      options.body = JSON.stringify(request);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erreur prédictions: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Détecte les anomalies en temps réel
   */
  async getAnomalies(): Promise<PredictionResult['anomalies']> {
    const response = await fetch(`${this.baseUrl}/anomalies`);
    
    if (!response.ok) {
      throw new Error(`Erreur anomalies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.anomalies || [];
  }

  /**
   * Génère des prévisions pour une métrique spécifique
   */
  async getForecast(metric: string, timeframe = '30d'): Promise<PredictionResult['forecast']> {
    const response = await fetch(`${this.baseUrl}/forecast?metric=${metric}&timeframe=${timeframe}`);
    
    if (!response.ok) {
      throw new Error(`Erreur prévisions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.forecast || [];
  }

  /**
   * Traite une requête en langage naturel
   */
  async processNaturalLanguage(request: NaturalLanguageRequest): Promise<NaturalLanguageResult> {
    const response = await fetch(`${this.baseUrl}/natural-language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Erreur traitement langage naturel: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Valide la sécurité d'une requête SQL générée
   */
  async validateSQL(sql: string): Promise<{ isValid: boolean; risks: string[]; sanitized: string }> {
    const response = await fetch(`${this.baseUrl}/validate-sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      throw new Error(`Erreur validation SQL: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Récupère les métriques de performance de l'IA
   */
  async getAIMetrics(): Promise<{
    accuracy: number;
    responseTime: number;
    totalQueries: number;
    successRate: number;
    modelVersion: string;
  }> {
    const response = await fetch(`${this.baseUrl}/metrics`);
    
    if (!response.ok) {
      throw new Error(`Erreur métriques IA: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Test de connectivité avec les services IA
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
    timestamp: string;
  }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error(`Erreur health check: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Exporte les résultats en différents formats
   */
  async exportResults(data: any, format: 'csv' | 'xlsx' | 'pdf' | 'json'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, format }),
    });

    if (!response.ok) {
      throw new Error(`Erreur export: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Instance singleton du service IA
export const aiService = new AIService();

// Hooks React pour l'utilisation dans les composants
export const useAI = () => {
  return {
    aiService,
    
    // Helper pour gérer les erreurs
    handleAIError: (error: any) => {
      console.error('Erreur IA:', error);
      // Ici on pourrait ajouter des notifications toast, etc.
      return {
        message: error.message || 'Erreur inconnue du service IA',
        code: error.code || 'UNKNOWN_ERROR'
      };
    },

    // Helper pour formater les résultats
    formatPrediction: (prediction: PredictionResult['predictions'][0]) => {
      const change = ((prediction.predictedValue - prediction.currentValue) / prediction.currentValue) * 100;
      return {
        ...prediction,
        changePercent: change.toFixed(1),
        isPositive: change > 0
      };
    },

    // Helper pour formater les valeurs monétaires
    formatCurrency: (value: number) => {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(value);
    }
  };
};

// Les types sont déjà exportés au début du fichier
