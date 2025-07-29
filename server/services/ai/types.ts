// 🎯 Types pour le système IA
// GRAND LEAP TODO - Phase 2: AI TRANSFORMATION

export interface AITask {
  id?: string;
  type: AITaskType;
  input: string;
  attachments?: AIAttachment[];
  context?: AIContext;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  maxLatency?: number;
  minQuality?: number;
  costConstraint?: 'low' | 'medium' | 'high';
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface AIResult {
  data: any;
  metadata: {
    fromCache: boolean;
    timestamp: Date;
    confidence: number;
    processingTime: number;
    modelUsed: string;
  };
}

export interface AIContext {
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  previousTasks: AITask[];
  businessContext: BusinessContext;
  preferences: UserPreferences;
}

export interface BusinessContext {
  role?: 'admin' | 'manager' | 'employee' | 'client';
  company?: string;
  department?: string;
  currentProjects?: string[];
  teamMembers?: string[];
  permissions?: string[];
}

export interface UserPreferences {
  language?: string;
  responseStyle?: 'concise' | 'detailed' | 'technical';
  aiPersonality?: 'professional' | 'friendly' | 'direct';
  privacy?: 'strict' | 'balanced' | 'open';
}

export interface AIAttachment {
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  metadata?: Record<string, any>;
}

export type AITaskType = 
  | 'analysis'
  | 'generation'
  | 'summarization'
  | 'translation'
  | 'classification'
  | 'prediction'
  | 'planning'
  | 'optimization'
  | 'automation'
  | 'reporting'
  | 'support'
  | 'search';

export type AIModelType = 
  | 'general'
  | 'business'
  | 'creative'
  | 'technical'
  | 'analytical'
  | 'quick';

export interface AIModel {
  name: string;
  type: AIModelType;
  capabilities: string[];
  maxTokens: number;
  costPerToken: number;
  avgLatency: number;
  qualityScore: number;
  isAvailable?: boolean;
  process: (task: AITask) => Promise<any>;
}

export interface ModelSelectionCriteria {
  type: AITaskType;
  complexity: 'low' | 'medium' | 'high';
  latencyRequirement: number;
  qualityRequirement: number;
  cost: 'low' | 'medium' | 'high';
}

export interface VectorSearchResult {
  result: any;
  similarity: number;
  metadata: Record<string, any>;
}

export interface AIMetrics {
  totalRequests: number;
  averageLatency: number;
  cacheHitRate: number;
  errorRate: number;
  costPerDay: number;
  modelsUsage: Record<string, number>;
  taskTypes: Record<AITaskType, number>;
}

export interface QueueStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgWaitTime: number;
}

export interface CacheStats {
  entries: number;
  hitRate: number;
  missRate: number;
  storageUsed: number;
  lastCleanup: Date;
}
