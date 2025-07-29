// 📊 Predictive Analytics Dashboard - IA prédictive pour les KPIs
// GRAND LEAP TODO - Phase 2.2: AI Features Révolutionnaires

import { aiOrchestrator } from '../ai/orchestrator';
import { AITask } from '../ai/types';

export interface PredictionConfig {
  timeframe: '1week' | '1month' | '3months' | '6months' | '1year';
  confidence: number;
  dataPoints: number;
  methodology: 'linear' | 'exponential' | 'seasonal' | 'neural' | 'ensemble';
}

export interface PredictiveMetric {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'customer' | 'employee' | 'project';
  currentValue: number;
  unit: string;
  predictions: PredictionPoint[];
  trends: TrendAnalysis;
  alerts: PredictiveAlert[];
  confidence: number;
  lastUpdated: Date;
}

export interface PredictionPoint {
  date: Date;
  predictedValue: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
  factors: string[];
}

export interface TrendAnalysis {
  direction: 'up' | 'down' | 'stable' | 'volatile';
  strength: 'weak' | 'moderate' | 'strong';
  seasonality: boolean;
  cyclicalPattern: boolean;
  anomalies: AnomalyDetection[];
}

export interface AnomalyDetection {
  date: Date;
  expectedValue: number;
  actualValue: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleCauses: string[];
}

export interface PredictiveAlert {
  id: string;
  type: 'threshold' | 'trend' | 'anomaly' | 'forecast';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  triggeredAt: Date;
  metric: string;
  threshold?: number;
  currentValue?: number;
  predictedValue?: number;
  recommendations: string[];
}

export interface BusinessForecast {
  revenue: PredictiveMetric;
  costs: PredictiveMetric;
  profit: PredictiveMetric;
  customerAcquisition: PredictiveMetric;
  employeeRetention: PredictiveMetric;
  projectDelivery: PredictiveMetric;
  marketShare: PredictiveMetric;
  overallHealth: {
    score: number;
    trend: 'improving' | 'stable' | 'declining';
    riskFactors: string[];
    opportunities: string[];
  };
}

export class PredictiveAnalyticsDashboard {
  private metricsCache: Map<string, PredictiveMetric> = new Map();
  private forecastCache: BusinessForecast | null = null;
  private lastUpdate: Date = new Date();
  private updateInterval: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeMetrics();
    this.startPeriodicUpdates();
  }

  /**
   * 🔮 Génération du forecast business complet
   */
  async generateBusinessForecast(config: PredictionConfig): Promise<BusinessForecast> {
    console.log('🔮 Generating comprehensive business forecast...');

    // Paralléliser la génération de toutes les prédictions
    const [
      revenue,
      costs,
      profit,
      customerAcquisition,
      employeeRetention,
      projectDelivery,
      marketShare
    ] = await Promise.all([
      this.predictMetric('revenue', config),
      this.predictMetric('costs', config),
      this.predictMetric('profit', config),
      this.predictMetric('customer_acquisition', config),
      this.predictMetric('employee_retention', config),
      this.predictMetric('project_delivery', config),
      this.predictMetric('market_share', config)
    ]);

    // Analyse globale avec l'IA
    const overallHealth = await this.analyzeOverallHealth([
      revenue, costs, profit, customerAcquisition, 
      employeeRetention, projectDelivery, marketShare
    ]);

    const forecast: BusinessForecast = {
      revenue,
      costs,
      profit,
      customerAcquisition,
      employeeRetention,
      projectDelivery,
      marketShare,
      overallHealth
    };

    this.forecastCache = forecast;
    console.log('✅ Business forecast generated successfully');
    
    return forecast;
  }

  /**
   * 📈 Prédiction d'une métrique spécifique
   */
  async predictMetric(metricId: string, config: PredictionConfig): Promise<PredictiveMetric> {
    // 1. Récupérer les données historiques
    const historicalData = await this.getHistoricalData(metricId);
    
    // 2. Préparer le contexte pour l'IA
    const aiTask: AITask = {
      type: 'prediction',
      input: `
        Predict the future values for metric "${metricId}" using this historical data:
        
        Historical Data: ${JSON.stringify(historicalData)}
        
        Configuration:
        - Timeframe: ${config.timeframe}
        - Methodology: ${config.methodology}
        - Required Confidence: ${config.confidence}
        
        Please provide:
        1. Predicted values for each time period
        2. Confidence intervals (upper/lower bounds)
        3. Trend analysis (direction, strength, seasonality)
        4. Anomaly detection in historical data
        5. Key factors influencing the predictions
        6. Potential alerts and recommendations
        
        Return JSON with structured prediction data.
      `,
      priority: 'high',
      maxLatency: 15000
    };

    const result = await aiOrchestrator.process(aiTask);
    
    try {
      const aiPrediction = JSON.parse(result.data);
      
      // 3. Post-traitement et validation
      const processedMetric = await this.processPredictionResult(
        metricId, 
        aiPrediction, 
        historicalData,
        config
      );
      
      // 4. Mettre en cache
      this.metricsCache.set(metricId, processedMetric);
      
      return processedMetric;
      
    } catch (error) {
      console.error(`Failed to parse AI prediction for ${metricId}:`, error);
      return this.generateFallbackPrediction(metricId, historicalData, config);
    }
  }

  /**
   * 🚨 Détection d'anomalies en temps réel
   */
  async detectAnomalies(currentMetrics: Record<string, number>): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];
    
    for (const [metricId, currentValue] of Object.entries(currentMetrics)) {
      const cachedMetric = this.metricsCache.get(metricId);
      
      if (cachedMetric) {
        // Trouver la prédiction pour aujourd'hui
        const today = new Date();
        const todayPrediction = cachedMetric.predictions.find(p => 
          this.isSameDay(p.date, today)
        );
        
        if (todayPrediction) {
          const deviation = Math.abs(currentValue - todayPrediction.predictedValue);
          const expectedRange = todayPrediction.upperBound - todayPrediction.lowerBound;
          
          // Si la déviation est supérieure à 2x la range attendue
          if (deviation > expectedRange * 2) {
            const severity = this.calculateAnomalySeverity(deviation, expectedRange);
            
            anomalies.push({
              date: today,
              expectedValue: todayPrediction.predictedValue,
              actualValue: currentValue,
              severity,
              possibleCauses: await this.identifyAnomalyCauses(metricId, currentValue, todayPrediction)
            });
          }
        }
      }
    }
    
    return anomalies;
  }

  /**
   * 🎯 Recommandations intelligentes
   */
  async generateRecommendations(forecast: BusinessForecast): Promise<string[]> {
    const aiTask: AITask = {
      type: 'analysis',
      input: `
        Analyze this business forecast and provide strategic recommendations:
        
        ${JSON.stringify(forecast, null, 2)}
        
        Focus on:
        1. Risk mitigation strategies
        2. Growth opportunities
        3. Operational improvements
        4. Financial optimization
        5. Market positioning
        
        Provide actionable, specific recommendations with priority levels.
      `,
      priority: 'normal'
    };

    const result = await aiOrchestrator.process(aiTask);
    
    try {
      const analysis = JSON.parse(result.data);
      return analysis.recommendations || [];
    } catch {
      return this.generateFallbackRecommendations(forecast);
    }
  }

  /**
   * 📊 Analyse de santé globale
   */
  private async analyzeOverallHealth(metrics: PredictiveMetric[]): Promise<BusinessForecast['overallHealth']> {
    const aiTask: AITask = {
      type: 'analysis',
      input: `
        Analyze the overall business health based on these predictive metrics:
        
        ${metrics.map(m => `${m.name}: Current ${m.currentValue}${m.unit}, Trend: ${m.trends.direction} (${m.trends.strength})`).join('\n')}
        
        Provide:
        1. Overall health score (0-100)
        2. Trend direction (improving/stable/declining)
        3. Top risk factors
        4. Key opportunities
        
        Return JSON format.
      `,
      priority: 'normal'
    };

    const result = await aiOrchestrator.process(aiTask);
    
    try {
      return JSON.parse(result.data);
    } catch {
      // Fallback calculation
      const avgConfidence = metrics.reduce((sum, m) => sum + m.confidence, 0) / metrics.length;
      const positiveMetrics = metrics.filter(m => m.trends.direction === 'up').length;
      
      return {
        score: Math.round(avgConfidence * 100),
        trend: positiveMetrics > metrics.length / 2 ? 'improving' : 'stable',
        riskFactors: ['Market volatility', 'Competition pressure'],
        opportunities: ['Digital transformation', 'Market expansion']
      };
    }
  }

  /**
   * 🔄 Mise à jour en temps réel
   */
  async updateRealTimeMetrics(newData: Record<string, number>): Promise<PredictiveAlert[]> {
    const alerts: PredictiveAlert[] = [];
    
    // Détecter les anomalies
    const anomalies = await this.detectAnomalies(newData);
    
    // Générer des alertes pour les anomalies
    for (const anomaly of anomalies) {
      const alertSeverity = this.mapAnomalySeverityToAlert(anomaly.severity);
      
      alerts.push({
        id: `anomaly_${Date.now()}_${Math.random()}`,
        type: 'anomaly',
        severity: alertSeverity,
        message: `Anomaly detected: Expected ${anomaly.expectedValue}, got ${anomaly.actualValue}`,
        triggeredAt: new Date(),
        metric: 'unknown', // TODO: Link to metric
        currentValue: anomaly.actualValue,
        predictedValue: anomaly.expectedValue,
        recommendations: anomaly.possibleCauses
      });
    }
    
    // Vérifier les seuils
    for (const [metricId, value] of Object.entries(newData)) {
      const thresholdAlerts = await this.checkThresholds(metricId, value);
      alerts.push(...thresholdAlerts);
    }
    
    return alerts;
  }

  /**
   * 📈 Métriques en temps réel avec prédictions
   */
  getLiveMetricsWithPredictions(): {
    metrics: PredictiveMetric[];
    forecast: BusinessForecast | null;
    lastUpdate: Date;
    nextUpdate: Date;
  } {
    return {
      metrics: Array.from(this.metricsCache.values()),
      forecast: this.forecastCache,
      lastUpdate: this.lastUpdate,
      nextUpdate: new Date(this.lastUpdate.getTime() + this.updateInterval)
    };
  }

  // Méthodes privées utilitaires
  private async getHistoricalData(metricId: string): Promise<any[]> {
    // TODO: Récupérer les données historiques depuis la base de données
    // Pour maintenant, retourner des données simulées
    const now = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date,
        value: Math.random() * 100 + 50 + Math.sin(i / 5) * 20
      });
    }
    
    return data;
  }

  private async processPredictionResult(
    metricId: string,
    aiPrediction: any,
    historicalData: any[],
    config: PredictionConfig
  ): Promise<PredictiveMetric> {
    const lastValue = historicalData[historicalData.length - 1]?.value || 0;
    
    return {
      id: metricId,
      name: this.getMetricDisplayName(metricId),
      category: this.getMetricCategory(metricId),
      currentValue: lastValue,
      unit: this.getMetricUnit(metricId),
      predictions: aiPrediction.predictions || [],
      trends: aiPrediction.trends || { direction: 'stable', strength: 'moderate', seasonality: false, cyclicalPattern: false, anomalies: [] },
      alerts: aiPrediction.alerts || [],
      confidence: config.confidence,
      lastUpdated: new Date()
    };
  }

  private generateFallbackPrediction(
    metricId: string,
    historicalData: any[],
    config: PredictionConfig
  ): PredictiveMetric {
    const lastValue = historicalData[historicalData.length - 1]?.value || 0;
    const trend = this.calculateSimpleTrend(historicalData);
    
    return {
      id: metricId,
      name: this.getMetricDisplayName(metricId),
      category: this.getMetricCategory(metricId),
      currentValue: lastValue,
      unit: this.getMetricUnit(metricId),
      predictions: this.generateSimplePredictions(lastValue, trend, config.timeframe),
      trends: {
        direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
        strength: Math.abs(trend) > 0.1 ? 'strong' : 'moderate',
        seasonality: false,
        cyclicalPattern: false,
        anomalies: []
      },
      alerts: [],
      confidence: 0.6,
      lastUpdated: new Date()
    };
  }

  private calculateSimpleTrend(data: any[]): number {
    if (data.length < 2) return 0;
    
    const first = data[0].value;
    const last = data[data.length - 1].value;
    
    return (last - first) / first;
  }

  private generateSimplePredictions(
    currentValue: number,
    trend: number,
    timeframe: string
  ): PredictionPoint[] {
    const periods = this.getPeriodsFromTimeframe(timeframe);
    const predictions: PredictionPoint[] = [];
    
    for (let i = 1; i <= periods; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      const predictedValue = currentValue * (1 + trend * i / periods);
      const variance = predictedValue * 0.1;
      
      predictions.push({
        date: futureDate,
        predictedValue,
        confidence: Math.max(0.3, 0.9 - i * 0.1),
        lowerBound: predictedValue - variance,
        upperBound: predictedValue + variance,
        factors: ['Historical trend']
      });
    }
    
    return predictions;
  }

  private initializeMetrics(): void {
    // Initialiser avec des métriques par défaut
    console.log('📊 Initializing predictive metrics...');
  }

  private startPeriodicUpdates(): void {
    setInterval(async () => {
      console.log('🔄 Updating predictive analytics...');
      this.lastUpdate = new Date();
      // TODO: Trigger real update logic
    }, this.updateInterval);
  }

  // Méthodes utilitaires pour les métriques
  private getMetricDisplayName(metricId: string): string {
    const names: Record<string, string> = {
      revenue: 'Chiffre d\'affaires',
      costs: 'Coûts opérationnels',
      profit: 'Bénéfice net',
      customer_acquisition: 'Acquisition clients',
      employee_retention: 'Rétention employés',
      project_delivery: 'Livraison projets',
      market_share: 'Part de marché'
    };
    return names[metricId] || metricId;
  }

  private getMetricCategory(metricId: string): PredictiveMetric['category'] {
    if (['revenue', 'costs', 'profit'].includes(metricId)) return 'financial';
    if (['customer_acquisition'].includes(metricId)) return 'customer';
    if (['employee_retention'].includes(metricId)) return 'employee';
    if (['project_delivery'].includes(metricId)) return 'project';
    return 'operational';
  }

  private getMetricUnit(metricId: string): string {
    const units: Record<string, string> = {
      revenue: '€',
      costs: '€',
      profit: '€',
      customer_acquisition: 'clients',
      employee_retention: '%',
      project_delivery: '%',
      market_share: '%'
    };
    return units[metricId] || '';
  }

  private getPeriodsFromTimeframe(timeframe: string): number {
    const periods: Record<string, number> = {
      '1week': 7,
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365
    };
    return periods[timeframe] || 30;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private calculateAnomalySeverity(deviation: number, expectedRange: number): AnomalyDetection['severity'] {
    const ratio = deviation / expectedRange;
    if (ratio > 5) return 'critical';
    if (ratio > 3) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  private async identifyAnomalyCauses(
    metricId: string,
    actualValue: number,
    prediction: PredictionPoint
  ): Promise<string[]> {
    // TODO: Utiliser l'IA pour identifier les causes possibles
    return ['Market conditions', 'Seasonal variation', 'External factors'];
  }

  private async checkThresholds(metricId: string, value: number): Promise<PredictiveAlert[]> {
    // TODO: Implémenter la vérification des seuils configurés
    return [];
  }

  private generateFallbackRecommendations(forecast: BusinessForecast): string[] {
    return [
      'Monitor cash flow closely',
      'Focus on customer retention',
      'Optimize operational efficiency',
      'Explore new market opportunities'
    ];
  }

  private mapAnomalySeverityToAlert(severity: AnomalyDetection['severity']): PredictiveAlert['severity'] {
    const mapping: Record<AnomalyDetection['severity'], PredictiveAlert['severity']> = {
      'low': 'info',
      'medium': 'warning',
      'high': 'error',
      'critical': 'critical'
    };
    return mapping[severity];
  }
}

export const predictiveAnalyticsDashboard = new PredictiveAnalyticsDashboard();
