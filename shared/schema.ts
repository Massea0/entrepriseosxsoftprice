import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp, 
  json, 
  pgEnum,
  uuid,
  numeric,
  real
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const actionStatusEnum = pgEnum('action_status_enum', ['pending', 'approved', 'rejected', 'executing', 'completed', 'failed']);
export const memoryTypeEnum = pgEnum('memory_type_enum', ['experience', 'knowledge', 'preference', 'context']);
export const autonomyLevelEnum = pgEnum('autonomy_level_enum', ['low', 'medium', 'high', 'full']);
export const agentStatusEnum = pgEnum('agent_status_enum', ['active', 'inactive', 'training', 'error']);
export const employmentStatusEnum = pgEnum('employment_status_enum', ['active', 'inactive', 'on_leave', 'terminated']);
export const taskStatusEnum = pgEnum('task_status_enum', ['pending', 'in_progress', 'completed', 'cancelled']);
export const projectStatusEnum = pgEnum('project_status_enum', ['draft', 'active', 'completed', 'cancelled', 'on_hold']);
export const leaveStatusEnum = pgEnum('leave_status_enum', ['pending', 'approved', 'rejected', 'cancelled']);
export const performanceRatingEnum = pgEnum('performance_rating_enum', ['excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory']);

// Core Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("client"),
  companyId: uuid("company_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies table
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  siret: text("siret"),
  industry: text("industry"),
  website: text("website"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employees table
export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  companyId: uuid("company_id").references(() => companies.id),
  employeeNumber: text("employee_number"),
  department: text("department"),
  position: text("position"),
  employmentStatus: employmentStatusEnum("employment_status").default("active"),
  hireDate: timestamp("hire_date"),
  salary: numeric("salary"),
  manager: uuid("manager"),
  skills: json("skills").$type<string[]>(),
  workSchedule: json("work_schedule"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  companyId: uuid("company_id").references(() => companies.id),
  managerId: uuid("manager_id").references(() => users.id),
  status: projectStatusEnum("status").default("draft"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: numeric("budget"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  projectId: uuid("project_id").references(() => projects.id),
  assigneeId: uuid("assignee_id").references(() => users.id),
  assignedBy: uuid("assigned_by").references(() => users.id),
  status: taskStatusEnum("status").default("pending"),
  priority: integer("priority").default(1),
  dueDate: timestamp("due_date"),
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quotes table
export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  quotationNumber: text("quotation_number").notNull(),
  companyId: uuid("company_id").references(() => companies.id),
  title: text("title").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  status: text("status").default("draft"),
  validUntil: timestamp("valid_until"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: text("invoice_number").notNull(),
  companyId: uuid("company_id").references(() => companies.id),
  quoteId: uuid("quote_id").references(() => quotes.id),
  amount: numeric("amount").notNull(),
  status: text("status").default("draft"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Agents
export const aiAgents = pgTable("ai_agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  aiModel: text("ai_model").notNull(),
  autonomyLevel: autonomyLevelEnum("autonomy_level").notNull(),
  status: agentStatusEnum("status").default("active"),
  capabilities: json("capabilities"),
  permissions: json("permissions").$type<string[]>(),
  decisionBudget: numeric("decision_budget"),
  learningRate: real("learning_rate"),
  maxTokens: integer("max_tokens"),
  modelVersion: text("model_version"),
  responseFormat: text("response_format"),
  specializationData: json("specialization_data"),
  successRate: real("success_rate"),
  failedActions: integer("failed_actions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
  createdBy: uuid("created_by"),
});

// AI Agent Actions
export const aiAgentActions = pgTable("ai_agent_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => aiAgents.id),
  actionName: text("action_name").notNull(),
  actionType: text("action_type").notNull(),
  description: text("description"),
  inputData: json("input_data").notNull(),
  outputData: json("output_data"),
  parameters: json("parameters"),
  status: actionStatusEnum("status").default("pending"),
  requiresApproval: boolean("requires_approval").default(false),
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  executedAt: timestamp("executed_at"),
  completedAt: timestamp("completed_at"),
  executionDuration: integer("execution_duration"),
  estimatedCost: numeric("estimated_cost"),
  actualCost: numeric("actual_cost"),
  confidenceScore: real("confidence_score"),
  impactScore: real("impact_score"),
  reasoning: text("reasoning"),
  context: json("context"),
  relatedEntityType: text("related_entity_type"),
  relatedEntityId: uuid("related_entity_id"),
  retryCount: integer("retry_count").default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Agent Memory
export const aiAgentMemory = pgTable("ai_agent_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => aiAgents.id),
  memoryType: memoryTypeEnum("memory_type").notNull(),
  content: json("content").notNull(),
  summary: text("summary"),
  category: text("category"),
  tags: json("tags").$type<string[]>(),
  keywords: json("keywords").$type<string[]>(),
  importanceScore: real("importance_score"),
  relevanceScore: real("relevance_score"),
  accessCount: integer("access_count").default(0),
  sourceActionId: uuid("source_action_id"),
  sourceContext: json("source_context"),
  expiresAt: timestamp("expires_at"),
  autoArchive: boolean("auto_archive").default(true),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at"),
});

// AI Agent Sessions
export const aiAgentSessions = pgTable("ai_agent_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => aiAgents.id),
  userId: uuid("user_id"),
  sessionName: text("session_name"),
  status: text("status").default("active"),
  triggerType: text("trigger_type"),
  triggerData: json("trigger_data"),
  context: json("context"),
  conversationHistory: json("conversation_history"),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  totalDuration: integer("total_duration"),
  actionsPerformed: integer("actions_performed").default(0),
  decisionsMade: integer("decisions_made").default(0),
  budgetUsed: numeric("budget_used").default("0"),
  achievements: json("achievements"),
  sessionSummary: text("session_summary"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Agent Budgets
export const aiAgentBudgets = pgTable("ai_agent_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => aiAgents.id),
  periodType: text("period_type").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  allocatedBudget: numeric("allocated_budget").notNull(),
  remainingBudget: numeric("remaining_budget").notNull(),
  totalSpent: numeric("total_spent").default("0"),
  actionsCount: integer("actions_count").default(0),
  averageCostPerAction: numeric("average_cost_per_action"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Agent Learning
export const aiAgentLearning = pgTable("ai_agent_learning", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => aiAgents.id),
  patternType: text("pattern_type").notNull(),
  patternName: text("pattern_name").notNull(),
  patternData: json("pattern_data").notNull(),
  learnedAt: timestamp("learned_at").defaultNow(),
  confidenceScore: real("confidence_score"),
  successRate: real("success_rate"),
  applicationCount: integer("application_count").default(0),
  validationCount: integer("validation_count").default(0),
  lastAppliedAt: timestamp("last_applied_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Agent Coordination
export const aiAgentCoordination = pgTable("ai_agent_coordination", {
  id: uuid("id").primaryKey().defaultRandom(),
  primaryAgentId: uuid("primary_agent_id").notNull().references(() => aiAgents.id),
  secondaryAgentId: uuid("secondary_agent_id"),
  coordinationType: text("coordination_type").notNull(),
  topic: text("topic").notNull(),
  description: text("description"),
  status: text("status").default("active"),
  priority: integer("priority").default(1),
  sharedContext: json("shared_context"),
  conversation: json("conversation"),
  outcome: json("outcome"),
  resolution: text("resolution"),
  lessonsLearned: text("lessons_learned"),
  initiatedAt: timestamp("initiated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});



// Employee Performance Reviews table
export const performanceReviews = pgTable("performance_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  reviewerId: uuid("reviewer_id").notNull().references(() => users.id),
  reviewPeriodStart: timestamp("review_period_start").notNull(),
  reviewPeriodEnd: timestamp("review_period_end").notNull(),
  overallRating: performanceRatingEnum("overall_rating"),
  goals: json("goals"),
  achievements: json("achievements"),
  areasForImprovement: text("areas_for_improvement"),
  feedback: text("feedback"),
  nextReviewDate: timestamp("next_review_date"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Relations
export const aiAgentRelations = relations(aiAgents, ({ many, one }) => ({
  actions: many(aiAgentActions),
  memory: many(aiAgentMemory),
  sessions: many(aiAgentSessions),
  budgets: many(aiAgentBudgets),
  learning: many(aiAgentLearning),
  primaryCoordinations: many(aiAgentCoordination, { relationName: "primaryAgent" }),
  secondaryCoordinations: many(aiAgentCoordination, { relationName: "secondaryAgent" }),
  creator: one(users, { fields: [aiAgents.createdBy], references: [users.id] }),
}));

export const aiAgentActionRelations = relations(aiAgentActions, ({ one }) => ({
  agent: one(aiAgents, { fields: [aiAgentActions.agentId], references: [aiAgents.id] }),
  approver: one(users, { fields: [aiAgentActions.approvedBy], references: [users.id] }),
}));

export const aiAgentMemoryRelations = relations(aiAgentMemory, ({ one }) => ({
  agent: one(aiAgents, { fields: [aiAgentMemory.agentId], references: [aiAgents.id] }),
  sourceAction: one(aiAgentActions, { fields: [aiAgentMemory.sourceActionId], references: [aiAgentActions.id] }),
}));

export const aiAgentSessionRelations = relations(aiAgentSessions, ({ one }) => ({
  agent: one(aiAgents, { fields: [aiAgentSessions.agentId], references: [aiAgents.id] }),
  user: one(users, { fields: [aiAgentSessions.userId], references: [users.id] }),
}));

export const aiAgentBudgetRelations = relations(aiAgentBudgets, ({ one }) => ({
  agent: one(aiAgents, { fields: [aiAgentBudgets.agentId], references: [aiAgents.id] }),
}));

export const aiAgentLearningRelations = relations(aiAgentLearning, ({ one }) => ({
  agent: one(aiAgents, { fields: [aiAgentLearning.agentId], references: [aiAgents.id] }),
}));

export const aiAgentCoordinationRelations = relations(aiAgentCoordination, ({ one }) => ({
  primaryAgent: one(aiAgents, { 
    fields: [aiAgentCoordination.primaryAgentId], 
    references: [aiAgents.id],
    relationName: "primaryAgent" 
  }),
  secondaryAgent: one(aiAgents, { 
    fields: [aiAgentCoordination.secondaryAgentId], 
    references: [aiAgents.id],
    relationName: "secondaryAgent" 
  }),
}));

// Relations for new tables
export const userRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  employee: one(employees, { fields: [users.id], references: [employees.userId] }),
  managedProjects: many(projects, { relationName: "projectManager" }),
  assignedTasks: many(tasks, { relationName: "taskAssignee" }),
  createdTasks: many(tasks, { relationName: "taskCreator" }),
  createdQuotes: many(quotes),
  createdInvoices: many(invoices),
}));

export const companyRelations = relations(companies, ({ many }) => ({
  users: many(users),
  employees: many(employees),
  projects: many(projects),
  quotes: many(quotes),
  invoices: many(invoices),
}));

export const employeeRelations = relations(employees, ({ one }) => ({
  user: one(users, { fields: [employees.userId], references: [users.id] }),
  company: one(companies, { fields: [employees.companyId], references: [companies.id] }),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, { fields: [projects.companyId], references: [companies.id] }),
  manager: one(users, { 
    fields: [projects.managerId], 
    references: [users.id],
    relationName: "projectManager"
  }),
  tasks: many(tasks),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  assignee: one(users, { 
    fields: [tasks.assigneeId], 
    references: [users.id],
    relationName: "taskAssignee"
  }),
  creator: one(users, { 
    fields: [tasks.assignedBy], 
    references: [users.id],
    relationName: "taskCreator"
  }),
}));

export const quoteRelations = relations(quotes, ({ one, many }) => ({
  company: one(companies, { fields: [quotes.companyId], references: [companies.id] }),
  creator: one(users, { fields: [quotes.createdBy], references: [users.id] }),
  invoices: many(invoices),
}));

export const invoiceRelations = relations(invoices, ({ one }) => ({
  company: one(companies, { fields: [invoices.companyId], references: [companies.id] }),
  quote: one(quotes, { fields: [invoices.quoteId], references: [quotes.id] }),
  creator: one(users, { fields: [invoices.createdBy], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiAgentSchema = createInsertSchema(aiAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActiveAt: true,
});

export const insertAiAgentActionSchema = createInsertSchema(aiAgentActions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiAgentMemorySchema = createInsertSchema(aiAgentMemory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastAccessedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertAiAgent = z.infer<typeof insertAiAgentSchema>;
export type AiAgent = typeof aiAgents.$inferSelect;

export type InsertAiAgentAction = z.infer<typeof insertAiAgentActionSchema>;
export type AiAgentAction = typeof aiAgentActions.$inferSelect;

export type InsertAiAgentMemory = z.infer<typeof insertAiAgentMemorySchema>;
export type AiAgentMemory = typeof aiAgentMemory.$inferSelect;

// Leave Types table
export const leaveTypes = pgTable("leave_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  defaultDays: integer("default_days").default(25),
  color: text("color").default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leave Requests table
export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id),
  leaveTypeId: uuid("leave_type_id").references(() => leaveTypes.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalDays: numeric("total_days", { precision: 4, scale: 1 }).notNull(),
  reason: text("reason"),
  status: leaveStatusEnum("status").default("pending"),
  managerId: uuid("manager_id").references(() => employees.id),
  managerComment: text("manager_comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leave Balances table
export const leaveBalances = pgTable("leave_balances", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id),
  leaveTypeId: uuid("leave_type_id").references(() => leaveTypes.id),
  year: integer("year").notNull(),
  totalDays: numeric("total_days", { precision: 4, scale: 1 }).default("0"),
  usedDays: numeric("used_days", { precision: 4, scale: 1 }).default("0"),
  remainingDays: numeric("remaining_days", { precision: 4, scale: 1 }).generatedAlwaysAs(sql`total_days - used_days`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leave Policies table
export const leavePolicies = pgTable("leave_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id),
  leaveTypeId: uuid("leave_type_id").references(() => leaveTypes.id),
  daysPerYear: integer("days_per_year").default(25),
  maxConsecutiveDays: integer("max_consecutive_days"),
  minNoticeDays: integer("min_notice_days").default(14),
  requiresApproval: boolean("requires_approval").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employeeId],
    references: [employees.id],
  }),
  leaveType: one(leaveTypes, {
    fields: [leaveRequests.leaveTypeId],
    references: [leaveTypes.id],
  }),
  manager: one(employees, {
    fields: [leaveRequests.managerId],
    references: [employees.id],
  }),
}));

export const leaveBalancesRelations = relations(leaveBalances, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveBalances.employeeId],
    references: [employees.id],
  }),
  leaveType: one(leaveTypes, {
    fields: [leaveBalances.leaveTypeId],
    references: [leaveTypes.id],
  }),
}));

// Schemas
export const insertLeaveTypeSchema = createInsertSchema(leaveTypes);
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests);
export const insertLeaveBalanceSchema = createInsertSchema(leaveBalances);
export const insertLeavePolicySchema = createInsertSchema(leavePolicies);

// Types
export type InsertLeaveType = z.infer<typeof insertLeaveTypeSchema>;
export type LeaveType = typeof leaveTypes.$inferSelect;

export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;

export type InsertLeaveBalance = z.infer<typeof insertLeaveBalanceSchema>;
export type LeaveBalance = typeof leaveBalances.$inferSelect;

export type InsertLeavePolicy = z.infer<typeof insertLeavePolicySchema>;
export type LeavePolicy = typeof leavePolicies.$inferSelect;
