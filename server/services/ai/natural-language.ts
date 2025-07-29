// 🗣️ Natural Language to SQL/Action - Interface en langage naturel
// GRAND LEAP TODO - Phase 2.2: AI Features Révolutionnaires

import { aiOrchestrator } from '../ai/orchestrator';
import { AITask } from '../ai/types';

export interface NLQuery {
  id: string;
  userInput: string;
  userId: string;
  timestamp: Date;
  context: QueryContext;
  intent: QueryIntent;
  entities: ExtractedEntity[];
  parsedQuery: ParsedQuery;
  executionResult?: ExecutionResult;
  confidence: number;
}

export interface QueryContext {
  currentPage?: string;
  userRole: 'admin' | 'manager' | 'employee' | 'client';
  userId?: string;
  companyId?: string;
  availableTables: string[];
  recentQueries: string[];
  businessContext: Record<string, any>;
}

export interface QueryIntent {
  type: 'select' | 'insert' | 'update' | 'delete' | 'action' | 'analysis' | 'report';
  confidence: number;
  subType?: string;
  requiresApproval: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ExtractedEntity {
  type: 'table' | 'column' | 'value' | 'date' | 'person' | 'number' | 'condition';
  value: string;
  confidence: number;
  position: [number, number];
  normalized?: any;
}

export interface ParsedQuery {
  sqlQuery?: string;
  actionType?: string;
  parameters: Record<string, any>;
  targetTables: string[];
  requiredPermissions: string[];
  estimatedComplexity: 'simple' | 'medium' | 'complex';
  safetyChecks: SafetyCheck[];
}

export interface SafetyCheck {
  type: 'permission' | 'data_sensitivity' | 'business_impact' | 'data_integrity';
  level: 'pass' | 'warning' | 'block';
  message: string;
  recommendation?: string;
}

export interface ExecutionResult {
  success: boolean;
  data?: any[];
  error?: string;
  rowsAffected?: number;
  executionTime: number;
  warnings: string[];
  explanation: string;
}

export interface QueryTemplate {
  pattern: RegExp;
  intent: string;
  sqlTemplate: string;
  requiredEntities: string[];
  examples: string[];
  permissions: string[];
}

export class NaturalLanguageProcessor {
  private queryTemplates: Map<string, QueryTemplate> = new Map();
  private entityPatterns: Map<string, RegExp> = new Map();
  private businessSchema: Map<string, TableSchema> = new Map();
  private queryHistory: Map<string, NLQuery[]> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeEntityPatterns();
    this.initializeBusinessSchema();
  }

  /**
   * 🎯 Traitement principal du langage naturel
   */
  async processNaturalLanguage(
    userInput: string,
    context: QueryContext
  ): Promise<NLQuery> {
    console.log(`🗣️ Processing natural language: "${userInput}"`);

    const queryId = `nl_${Date.now()}_${Math.random()}`;
    
    // 1. Préparation de la requête
    const baseQuery: NLQuery = {
      id: queryId,
      userInput: userInput.trim(),
      userId: context.userId || 'anonymous',
      timestamp: new Date(),
      context,
      intent: { type: 'select', confidence: 0, requiresApproval: false, riskLevel: 'low' },
      entities: [],
      parsedQuery: {
        parameters: {},
        targetTables: [],
        requiredPermissions: [],
        estimatedComplexity: 'simple',
        safetyChecks: []
      },
      confidence: 0
    };

    try {
      // 2. Analyse d'intention avec l'IA
      const intent = await this.analyzeIntent(userInput, context);
      baseQuery.intent = intent;

      // 3. Extraction d'entités
      const entities = await this.extractEntities(userInput, context);
      baseQuery.entities = entities;

      // 4. Génération de la requête
      const parsedQuery = await this.generateQuery(userInput, intent, entities, context);
      baseQuery.parsedQuery = parsedQuery;

      // 5. Validation de sécurité
      const safetyChecks = await this.performSafetyChecks(parsedQuery, context);
      baseQuery.parsedQuery.safetyChecks = safetyChecks;

      // 6. Calcul de confiance global
      baseQuery.confidence = this.calculateOverallConfidence(intent, entities, parsedQuery);

      // 7. Exécution si autorisée
      if (this.canExecuteQuery(baseQuery)) {
        const executionResult = await this.executeQuery(baseQuery);
        baseQuery.executionResult = executionResult;
      }

      // 8. Historique
      this.addToHistory(baseQuery);

      console.log(`✅ NL processing completed: ${baseQuery.confidence.toFixed(2)} confidence`);
      return baseQuery;

    } catch (error) {
      console.error('NL processing failed:', error);
      baseQuery.executionResult = {
        success: false,
        error: `Processing failed: ${error}`,
        executionTime: 0,
        warnings: [],
        explanation: 'The natural language processing encountered an error'
      };
      return baseQuery;
    }
  }

  /**
   * 🧠 Analyse d'intention avec l'IA
   */
  private async analyzeIntent(userInput: string, context: QueryContext): Promise<QueryIntent> {
    const aiTask: AITask = {
      type: 'classification',
      input: `
        Analyze the intent of this user query in a business context:
        
        User Input: "${userInput}"
        User Role: ${context.userRole}
        Current Page: ${context.currentPage || 'Unknown'}
        Available Tables: ${context.availableTables.join(', ')}
        
        Determine:
        1. Primary intent type (select/insert/update/delete/action/analysis/report)
        2. Confidence level (0-1)
        3. Sub-type if applicable
        4. Whether approval is required
        5. Risk level (low/medium/high)
        
        Examples:
        - "Show me all clients" → select, high confidence, low risk
        - "Delete all invoices" → delete, high confidence, high risk, needs approval
        - "Create a new project for client ABC" → insert, medium confidence, medium risk
        - "Generate revenue report for last quarter" → report, high confidence, low risk
        
        Return JSON format with intent analysis.
      `,
      priority: 'high',
      maxLatency: 8000
    };

    try {
      const result = await aiOrchestrator.process(aiTask);
      const analysis = JSON.parse(result.data);
      
      return {
        type: analysis.type || 'select',
        confidence: analysis.confidence || 0.5,
        subType: analysis.subType,
        requiresApproval: analysis.requiresApproval || false,
        riskLevel: analysis.riskLevel || 'low'
      };
    } catch (error) {
      console.error('Intent analysis failed:', error);
      return this.getFallbackIntent(userInput);
    }
  }

  /**
   * 🏷️ Extraction d'entités
   */
  private async extractEntities(userInput: string, context: QueryContext): Promise<ExtractedEntity[]> {
    const entities: ExtractedEntity[] = [];
    
    // 1. Extraction par patterns regex
    const entityPatternsArray = Array.from(this.entityPatterns.entries());
    for (const [entityType, pattern] of entityPatternsArray) {
      const matches = Array.from(userInput.matchAll(pattern));
      for (const match of matches) {
        if (match.index !== undefined) {
          entities.push({
            type: entityType as ExtractedEntity['type'],
            value: match[0],
            confidence: 0.8,
            position: [match.index, match.index + match[0].length],
            normalized: this.normalizeEntity(entityType, match[0])
          });
        }
      }
    }

    // 2. Extraction avec l'IA pour entités complexes
    const aiTask: AITask = {
      type: 'classification',
      input: `
        Extract business entities from this query:
        
        Query: "${userInput}"
        Available Tables: ${context.availableTables.join(', ')}
        Business Schema: ${JSON.stringify(Array.from(this.businessSchema.keys()))}
        
        Find and extract:
        - Table names (exact or fuzzy matches)
        - Column names
        - Values and conditions
        - Date ranges
        - Person names
        - Numbers and amounts
        
        Return JSON array with entities: {type, value, confidence, normalized}
      `,
      priority: 'normal'
    };

    try {
      const result = await aiOrchestrator.process(aiTask);
      const aiEntities = JSON.parse(result.data);
      
      for (const entity of aiEntities) {
        if (!entities.some(e => e.value === entity.value)) {
          entities.push({
            ...entity,
            position: this.findEntityPosition(userInput, entity.value)
          });
        }
      }
    } catch (error) {
      console.error('AI entity extraction failed:', error);
    }

    return entities.sort((a, b) => a.position[0] - b.position[0]);
  }

  /**
   * 🔧 Génération de requête SQL/Action
   */
  private async generateQuery(
    userInput: string,
    intent: QueryIntent,
    entities: ExtractedEntity[],
    context: QueryContext
  ): Promise<ParsedQuery> {
    // 1. Essayer de matcher avec un template
    const template = this.findBestTemplate(userInput, intent, entities);
    
    if (template) {
      return this.generateFromTemplate(template, entities, context);
    }

    // 2. Génération avec l'IA
    const aiTask: AITask = {
      type: 'generation',
      input: `
        Generate SQL query or action from natural language:
        
        User Input: "${userInput}"
        Intent: ${JSON.stringify(intent)}
        Entities: ${JSON.stringify(entities)}
        
        Available Tables: ${context.availableTables.join(', ')}
        User Role: ${context.userRole}
        User Permissions: ${this.getUserPermissions(context.userRole)}
        
        Database Schema:
        ${this.getRelevantSchema(entities)}
        
        Requirements:
        1. Generate safe, efficient SQL
        2. Apply proper WHERE clauses for data isolation
        3. Respect user permissions
        4. Include proper JOINs if needed
        5. Add LIMIT for potentially large results
        
        If it's an action (not SQL), provide action details instead.
        
        Return JSON with:
        - sqlQuery OR actionType
        - parameters
        - targetTables
        - requiredPermissions
        - estimatedComplexity
      `,
      priority: 'high',
      maxLatency: 12000
    };

    try {
      const result = await aiOrchestrator.process(aiTask);
      const generated = JSON.parse(result.data);
      
      return {
        sqlQuery: generated.sqlQuery,
        actionType: generated.actionType,
        parameters: generated.parameters || {},
        targetTables: generated.targetTables || [],
        requiredPermissions: generated.requiredPermissions || [],
        estimatedComplexity: generated.estimatedComplexity || 'medium',
        safetyChecks: []
      };
    } catch (error) {
      console.error('Query generation failed:', error);
      throw new Error('Failed to generate query from natural language');
    }
  }

  /**
   * 🛡️ Vérifications de sécurité
   */
  private async performSafetyChecks(
    parsedQuery: ParsedQuery,
    context: QueryContext
  ): Promise<SafetyCheck[]> {
    const checks: SafetyCheck[] = [];

    // 1. Vérification des permissions
    const permissionCheck = this.checkPermissions(parsedQuery, context);
    checks.push(permissionCheck);

    // 2. Vérification de sensibilité des données
    const sensitivityCheck = this.checkDataSensitivity(parsedQuery);
    checks.push(sensitivityCheck);

    // 3. Vérification d'impact business
    const impactCheck = await this.checkBusinessImpact(parsedQuery);
    checks.push(impactCheck);

    // 4. Vérification d'intégrité des données
    const integrityCheck = this.checkDataIntegrity(parsedQuery);
    checks.push(integrityCheck);

    return checks.filter(check => check.level !== 'pass');
  }

  /**
   * ⚡ Exécution de la requête
   */
  private async executeQuery(query: NLQuery): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      if (query.parsedQuery.sqlQuery) {
        // Exécution SQL
        return await this.executeSQLQuery(query.parsedQuery.sqlQuery, query.context);
      } else if (query.parsedQuery.actionType) {
        // Exécution d'action
        return await this.executeAction(query.parsedQuery, query.context);
      } else {
        throw new Error('No executable query or action generated');
      }
    } catch (error) {
      return {
        success: false,
        error: `Execution failed: ${error}`,
        executionTime: Date.now() - startTime,
        warnings: [],
        explanation: 'The query could not be executed due to an error'
      };
    }
  }

  /**
   * 📊 Suggestions intelligentes
   */
  async getSuggestions(
    partialInput: string,
    context: QueryContext
  ): Promise<string[]> {
    const aiTask: AITask = {
      type: 'generation',
      input: `
        Suggest completion for this partial business query:
        
        Partial Input: "${partialInput}"
        User Role: ${context.userRole}
        Available Data: ${context.availableTables.join(', ')}
        Recent Queries: ${context.recentQueries.slice(0, 3).join(', ')}
        
        Provide 5 relevant, contextual suggestions that would help the user.
        Focus on common business questions for their role.
        
        Return JSON array of suggestion strings.
      `,
      priority: 'low'
    };

    try {
      const result = await aiOrchestrator.process(aiTask);
      return JSON.parse(result.data);
    } catch {
      return this.getFallbackSuggestions(partialInput, context);
    }
  }

  // Méthodes utilitaires privées
  private initializeTemplates(): void {
    // Templates pour requêtes communes
    this.queryTemplates.set('list_clients', {
      pattern: /show|list|get.*clients?/i,
      intent: 'select',
      sqlTemplate: 'SELECT * FROM companies WHERE type = "client" LIMIT 50',
      requiredEntities: [],
      examples: ['Show me all clients', 'List clients', 'Get client list'],
      permissions: ['read_companies']
    });

    this.queryTemplates.set('revenue_report', {
      pattern: /revenue|sales.*report|financial.*summary/i,
      intent: 'report',
      sqlTemplate: 'SELECT SUM(amount) as total_revenue FROM invoices WHERE status = "paid" AND date >= ?',
      requiredEntities: ['date'],
      examples: ['Revenue report for last month', 'Show sales summary'],
      permissions: ['read_financial']
    });
  }

  private initializeEntityPatterns(): void {
    this.entityPatterns.set('date', /\b(?:last|next|this)?\s*(?:week|month|quarter|year)\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/gi);
    this.entityPatterns.set('number', /\b\d+(?:\.\d+)?\b/g);
    this.entityPatterns.set('money', /[\$€£]\d+(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:euros?|dollars?|pounds?)\b/gi);
  }

  private initializeBusinessSchema(): void {
    // TODO: Charger le schéma depuis la base de données
    this.businessSchema.set('companies', {
      name: 'companies',
      columns: ['id', 'name', 'type', 'email', 'phone', 'created_at'],
      primaryKey: 'id',
      relationships: []
    });
  }

  private getFallbackIntent(userInput: string): QueryIntent {
    if (/show|list|get|find|search/i.test(userInput)) {
      return { type: 'select', confidence: 0.7, requiresApproval: false, riskLevel: 'low' };
    }
    if (/create|add|insert|new/i.test(userInput)) {
      return { type: 'insert', confidence: 0.6, requiresApproval: true, riskLevel: 'medium' };
    }
    if (/delete|remove/i.test(userInput)) {
      return { type: 'delete', confidence: 0.8, requiresApproval: true, riskLevel: 'high' };
    }
    return { type: 'select', confidence: 0.3, requiresApproval: false, riskLevel: 'low' };
  }

  private findEntityPosition(text: string, value: string): [number, number] {
    const index = text.toLowerCase().indexOf(value.toLowerCase());
    return index >= 0 ? [index, index + value.length] : [0, 0];
  }

  private normalizeEntity(type: string, value: string): any {
    switch (type) {
      case 'date':
        return this.parseDate(value);
      case 'number':
        return parseFloat(value.replace(/,/g, ''));
      case 'money':
        return this.parseMoney(value);
      default:
        return value.toLowerCase();
    }
  }

  private parseDate(dateStr: string): Date | null {
    // TODO: Implémenter un parsing de date robuste
    return new Date(dateStr);
  }

  private parseMoney(moneyStr: string): number {
    // TODO: Implémenter un parsing de montant robuste
    return parseFloat(moneyStr.replace(/[^\d.]/g, ''));
  }

  private canExecuteQuery(query: NLQuery): boolean {
    const blockers = query.parsedQuery.safetyChecks.filter(check => check.level === 'block');
    return blockers.length === 0 && query.confidence > 0.6;
  }

  private calculateOverallConfidence(
    intent: QueryIntent,
    entities: ExtractedEntity[],
    parsedQuery: ParsedQuery
  ): number {
    const intentWeight = 0.4;
    const entityWeight = 0.3;
    const queryWeight = 0.3;

    const entityConfidence = entities.length > 0 
      ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length 
      : 0.5;

    const queryConfidence = parsedQuery.sqlQuery || parsedQuery.actionType ? 0.8 : 0.3;

    return intentWeight * intent.confidence + 
           entityWeight * entityConfidence + 
           queryWeight * queryConfidence;
  }

  // Méthodes placeholder pour l'implémentation complète
  private findBestTemplate(userInput: string, intent: QueryIntent, entities: ExtractedEntity[]): QueryTemplate | null {
    // TODO: Implémenter la recherche de template
    return null;
  }

  private generateFromTemplate(template: QueryTemplate, entities: ExtractedEntity[], context: QueryContext): ParsedQuery {
    // TODO: Générer depuis template
    throw new Error('Template generation not implemented');
  }

  private getUserPermissions(role: string): string[] {
    // TODO: Récupérer les permissions depuis la DB
    return ['read_companies', 'read_projects'];
  }

  private getRelevantSchema(entities: ExtractedEntity[]): string {
    // TODO: Retourner le schéma pertinent
    return 'Schema placeholder';
  }

  private checkPermissions(parsedQuery: ParsedQuery, context: QueryContext): SafetyCheck {
    // TODO: Vérifier les permissions
    return { type: 'permission', level: 'pass', message: 'Permissions OK' };
  }

  private checkDataSensitivity(parsedQuery: ParsedQuery): SafetyCheck {
    // TODO: Vérifier la sensibilité
    return { type: 'data_sensitivity', level: 'pass', message: 'Data sensitivity OK' };
  }

  private async checkBusinessImpact(parsedQuery: ParsedQuery): Promise<SafetyCheck> {
    // TODO: Vérifier l'impact business
    return { type: 'business_impact', level: 'pass', message: 'Business impact OK' };
  }

  private checkDataIntegrity(parsedQuery: ParsedQuery): SafetyCheck {
    // TODO: Vérifier l'intégrité
    return { type: 'data_integrity', level: 'pass', message: 'Data integrity OK' };
  }

  private async executeSQLQuery(sql: string, context: QueryContext): Promise<ExecutionResult> {
    // TODO: Exécuter la requête SQL
    throw new Error('SQL execution not implemented');
  }

  private async executeAction(parsedQuery: ParsedQuery, context: QueryContext): Promise<ExecutionResult> {
    // TODO: Exécuter l'action
    throw new Error('Action execution not implemented');
  }

  private getFallbackSuggestions(partialInput: string, context: QueryContext): string[] {
    return [
      'Show me all clients',
      'Revenue report for last month',
      'List active projects',
      'Find employees in sales team',
      'Create new invoice'
    ];
  }

  private addToHistory(query: NLQuery): void {
    const userId = query.userId;
    if (!this.queryHistory.has(userId)) {
      this.queryHistory.set(userId, []);
    }
    
    const userHistory = this.queryHistory.get(userId)!;
    userHistory.unshift(query);
    
    // Garder seulement les 50 dernières requêtes
    if (userHistory.length > 50) {
      userHistory.splice(50);
    }
  }
}

interface TableSchema {
  name: string;
  columns: string[];
  primaryKey: string;
  relationships: any[];
}

export const naturalLanguageProcessor = new NaturalLanguageProcessor();
