// Tenant configuration types
export interface TenantTheme {
  // Brand colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Typography
  fontFamily?: string;
  fontSizeScale?: number;
  
  // Spacing
  spacingScale?: number;
  
  // Components
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadowIntensity?: 'none' | 'sm' | 'md' | 'lg';
  
  // Assets
  logo?: string;
  favicon?: string;
  ogImage?: string;
  
  // Dark mode preference
  defaultTheme?: 'light' | 'dark' | 'system';
}

export interface TenantLimits {
  users: number;
  storage: number; // GB
  apiCalls: number; // per month
  customFields: number;
  integrations: number;
}

export interface ModuleConfig {
  enabled: boolean;
  settings?: Record<string, unknown>;
  customFields?: CustomField[];
}

export interface CustomField {
  id: string;
  moduleId: string;
  entityType: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'file' | 'email' | 'url' | 'textarea';
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  defaultValue?: unknown;
  showInList: boolean;
  showInForm: boolean;
  sortOrder: number;
  permissions: {
    view: string[];
    edit: string[];
  };
}

export interface ValidationRule {
  type: 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value: string | number;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
  icon?: string;
}

export interface TenantConfig {
  // Basic info
  id: string;
  name: string;
  domain: string;
  subdomain?: string;
  timezone: string;
  locale: string;
  currency: string;
  dateFormat: string;
  
  // Subscription
  plan: 'starter' | 'professional' | 'enterprise' | 'custom';
  planExpiry?: Date;
  trialEndsAt?: Date;
  limits: TenantLimits;
  
  // Modules
  modules: Record<string, ModuleConfig>;
  
  // Customization
  theme: TenantTheme;
  emailTemplates?: EmailTemplate[];
  workflows?: CustomWorkflow[];
  
  // Integrations
  integrations?: {
    slack?: IntegrationConfig;
    teams?: IntegrationConfig;
    google?: IntegrationConfig;
    github?: IntegrationConfig;
    jira?: IntegrationConfig;
    custom?: CustomIntegration[];
  };
  
  // Settings
  settings: {
    twoFactorRequired: boolean;
    ssoEnabled: boolean;
    ipWhitelist?: string[];
    passwordPolicy?: PasswordPolicy;
    sessionTimeout?: number; // minutes
    auditLogRetention?: number; // days
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;
  isActive: boolean;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'hr' | 'finance' | 'project' | 'sales' | 'marketing' | 'support' | 'analytics' | 'custom';
  icon: string;
  required: boolean;
  dependencies?: string[];
  permissions: string[];
  routes: ModuleRoute[];
  widgets?: ModuleWidget[];
  apiEndpoints?: string[];
  webhooks?: string[];
}

export interface ModuleRoute {
  path: string;
  label: string;
  icon?: string;
  component: string;
  permissions?: string[];
  showInNav: boolean;
}

export interface ModuleWidget {
  id: string;
  name: string;
  component: string;
  defaultSize: 'small' | 'medium' | 'large' | 'full';
  permissions?: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  type: 'welcome' | 'reset-password' | 'invite' | 'notification' | 'custom';
}

export interface CustomWorkflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  conditions?: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'webhook' | 'manual';
  config: Record<string, unknown>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: unknown;
}

export interface WorkflowAction {
  type: 'email' | 'notification' | 'webhook' | 'updateField' | 'createRecord' | 'custom';
  config: Record<string, unknown>;
}

export interface IntegrationConfig {
  enabled: boolean;
  credentials?: Record<string, string>;
  settings?: Record<string, unknown>;
  webhookUrl?: string;
}

export interface CustomIntegration {
  id: string;
  name: string;
  type: 'oauth2' | 'apiKey' | 'webhook';
  config: Record<string, unknown>;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays?: number;
  preventReuse?: number;
}

// User types with tenant context
export interface TenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  permissions: string[];
  tenantId: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Billing types
export interface TenantBilling {
  tenantId: string;
  plan: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: PaymentMethod;
  invoices: Invoice[];
  usage: UsageMetrics;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'invoice';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void';
  dueDate: Date;
  paidAt?: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface UsageMetrics {
  users: {
    current: number;
    limit: number;
  };
  storage: {
    current: number; // GB
    limit: number;
  };
  apiCalls: {
    current: number;
    limit: number;
    period: 'day' | 'month';
  };
}

// Module registry
export const AVAILABLE_MODULES: Record<string, Module> = {
  // Core modules (always enabled)
  'dashboard': {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard and analytics',
    category: 'core',
    icon: 'dashboard',
    required: true,
    permissions: ['dashboard.view'],
    routes: [{
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      component: 'Dashboard',
      showInNav: true
    }],
    widgets: [{
      id: 'metrics-overview',
      name: 'Metrics Overview',
      component: 'MetricsWidget',
      defaultSize: 'large'
    }]
  },
  
  // HR modules
  'employees': {
    id: 'employees',
    name: 'Employees',
    description: 'Employee management and directory',
    category: 'hr',
    icon: 'people',
    required: false,
    permissions: ['employees.view', 'employees.create', 'employees.edit', 'employees.delete'],
    routes: [{
      path: '/employees',
      label: 'Employees',
      icon: 'people',
      component: 'EmployeeList',
      showInNav: true
    }]
  },
  
  'leave-management': {
    id: 'leave-management',
    name: 'Leave Management',
    description: 'Manage employee time off and vacations',
    category: 'hr',
    icon: 'calendar',
    required: false,
    dependencies: ['employees'],
    permissions: ['leave.view', 'leave.request', 'leave.approve'],
    routes: [{
      path: '/leave',
      label: 'Leave',
      icon: 'calendar',
      component: 'LeaveManagement',
      showInNav: true
    }]
  },
  
  // Project modules
  'projects': {
    id: 'projects',
    name: 'Projects',
    description: 'Project management and tracking',
    category: 'project',
    icon: 'folder',
    required: false,
    permissions: ['projects.view', 'projects.create', 'projects.edit', 'projects.delete'],
    routes: [{
      path: '/projects',
      label: 'Projects',
      icon: 'folder',
      component: 'ProjectList',
      showInNav: true
    }]
  },
  
  'tasks': {
    id: 'tasks',
    name: 'Tasks',
    description: 'Task management and assignment',
    category: 'project',
    icon: 'task',
    required: false,
    dependencies: ['projects'],
    permissions: ['tasks.view', 'tasks.create', 'tasks.edit', 'tasks.assign'],
    routes: [{
      path: '/tasks',
      label: 'Tasks',
      icon: 'task',
      component: 'TaskList',
      showInNav: true
    }]
  },
  
  // Finance modules
  'invoicing': {
    id: 'invoicing',
    name: 'Invoicing',
    description: 'Create and manage invoices',
    category: 'finance',
    icon: 'receipt',
    required: false,
    permissions: ['invoices.view', 'invoices.create', 'invoices.edit', 'invoices.send'],
    routes: [{
      path: '/invoices',
      label: 'Invoices',
      icon: 'receipt',
      component: 'InvoiceList',
      showInNav: true
    }]
  }
};