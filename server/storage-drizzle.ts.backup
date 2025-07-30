import { 
  users, 
  companies,
  employees,
  projects,
  tasks,
  quotes,
  invoices,
  aiAgents,
  aiAgentActions,
  aiAgentMemory,
  aiAgentSessions,
  aiAgentBudgets,
  aiAgentLearning,
  aiAgentCoordination,
  leaveTypes,
  leaveRequests,
  leaveBalances,
  leavePolicies,
  type User, 
  type InsertUser,
  type Company,
  type InsertCompany,
  type Employee,
  type InsertEmployee,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type Quote,
  type InsertQuote,
  type Invoice,
  type InsertInvoice,
  type AiAgent,
  type InsertAiAgent,
  type AiAgentAction,
  type InsertAiAgentAction,
  type AiAgentMemory,
  type InsertAiAgentMemory,
  type LeaveType,
  type InsertLeaveType,
  type LeaveRequest,
  type InsertLeaveRequest,
  type LeaveBalance,
  type InsertLeaveBalance,
  type LeavePolicy,
  type InsertLeavePolicy
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Company methods
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Employee methods
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  
  // Quote methods
  getQuotes(): Promise<Quote[]>;
  getQuote(id: string): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  
  // Invoice methods
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  
  // AI Agent methods
  getAiAgents(): Promise<AiAgent[]>;
  getAiAgent(id: string): Promise<AiAgent | undefined>;
  createAiAgent(agent: InsertAiAgent): Promise<AiAgent>;
  updateAiAgent(id: string, updates: Partial<InsertAiAgent>): Promise<AiAgent | undefined>;
  deleteAiAgent(id: string): Promise<boolean>;
  
  // AI Agent Action methods
  getAiAgentActions(agentId?: string): Promise<AiAgentAction[]>;
  getAiAgentAction(id: string): Promise<AiAgentAction | undefined>;
  createAiAgentAction(action: InsertAiAgentAction): Promise<AiAgentAction>;
  updateAiAgentAction(id: string, updates: Partial<InsertAiAgentAction>): Promise<AiAgentAction | undefined>;
  
  // AI Agent Memory methods
  getAiAgentMemory(agentId: string): Promise<AiAgentMemory[]>;
  createAiAgentMemory(memory: InsertAiAgentMemory): Promise<AiAgentMemory>;
  
  // Leave Type methods
  getLeaveTypes(): Promise<LeaveType[]>;
  getLeaveType(id: string): Promise<LeaveType | undefined>;
  createLeaveType(leaveType: InsertLeaveType): Promise<LeaveType>;
  
  // Leave Request methods
  getLeaveRequests(employeeId?: string, managerId?: string): Promise<LeaveRequest[]>;
  getLeaveRequest(id: string): Promise<LeaveRequest | undefined>;
  createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: string, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined>;
  
  // Leave Balance methods
  getLeaveBalances(employeeId: string, year?: number): Promise<LeaveBalance[]>;
  getLeaveBalance(id: string): Promise<LeaveBalance | undefined>;
  createLeaveBalance(leaveBalance: InsertLeaveBalance): Promise<LeaveBalance>;
  updateLeaveBalance(id: string, updates: Partial<InsertLeaveBalance>): Promise<LeaveBalance | undefined>;
  
  // Leave Policy methods
  getLeavePolicies(companyId: string): Promise<LeavePolicy[]>;
  getLeavePolicy(id: string): Promise<LeavePolicy | undefined>;
  createLeavePolicy(leavePolicy: InsertLeavePolicy): Promise<LeavePolicy>;
  updateLeavePolicy(id: string, updates: Partial<InsertLeavePolicy>): Promise<LeavePolicy | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = { ...user, password: hashedPassword };
    
    const result = await db.insert(users).values(userWithHashedPassword).returning();
    return result[0];
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // AI Agent methods
  async getAiAgents(): Promise<AiAgent[]> {
    return await db.select().from(aiAgents);
  }

  async getAiAgent(id: string): Promise<AiAgent | undefined> {
    const result = await db.select().from(aiAgents).where(eq(aiAgents.id, id)).limit(1);
    return result[0];
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    // Ensure permissions is an array or null
    const cleanAgent = {
      ...agent,
      permissions: agent.permissions ? (Array.isArray(agent.permissions) ? agent.permissions : []) : null
    };
    const result = await db.insert(aiAgents).values(cleanAgent).returning();
    return result[0];
  }

  async updateAiAgent(id: string, updates: Partial<InsertAiAgent>): Promise<AiAgent | undefined> {
    // Ensure permissions is an array or null if provided
    const cleanUpdates = {
      ...updates,
      ...(updates.permissions !== undefined && {
        permissions: updates.permissions ? (Array.isArray(updates.permissions) ? updates.permissions : []) : null
      })
    };
    const result = await db.update(aiAgents).set(cleanUpdates).where(eq(aiAgents.id, id)).returning();
    return result[0];
  }

  async deleteAiAgent(id: string): Promise<boolean> {
    const result = await db.delete(aiAgents).where(eq(aiAgents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // AI Agent Action methods
  async getAiAgentActions(agentId?: string): Promise<AiAgentAction[]> {
    if (agentId) {
      return await db.select().from(aiAgentActions).where(eq(aiAgentActions.agentId, agentId));
    }
    return await db.select().from(aiAgentActions);
  }

  async getAiAgentAction(id: string): Promise<AiAgentAction | undefined> {
    const result = await db.select().from(aiAgentActions).where(eq(aiAgentActions.id, id)).limit(1);
    return result[0];
  }

  async createAiAgentAction(action: InsertAiAgentAction): Promise<AiAgentAction> {
    const result = await db.insert(aiAgentActions).values(action).returning();
    return result[0];
  }

  async updateAiAgentAction(id: string, updates: Partial<InsertAiAgentAction>): Promise<AiAgentAction | undefined> {
    const result = await db.update(aiAgentActions).set(updates).where(eq(aiAgentActions.id, id)).returning();
    return result[0];
  }

  // AI Agent Memory methods
  async getAiAgentMemory(agentId: string): Promise<AiAgentMemory[]> {
    return await db.select().from(aiAgentMemory).where(eq(aiAgentMemory.agentId, agentId));
  }

  async createAiAgentMemory(memory: InsertAiAgentMemory): Promise<AiAgentMemory> {
    // Ensure tags and keywords are arrays or null
    const cleanMemory = {
      ...memory,
      tags: memory.tags ? (Array.isArray(memory.tags) ? memory.tags : []) : null,
      keywords: memory.keywords ? (Array.isArray(memory.keywords) ? memory.keywords : []) : null
    };
    const result = await db.insert(aiAgentMemory).values(cleanMemory).returning();
    return result[0];
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
    return result[0];
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const result = await db.insert(companies).values(company).returning();
    return result[0];
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
    return result[0];
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    // Ensure skills is an array or null
    const cleanEmployee = {
      ...employee,
      skills: employee.skills ? (Array.isArray(employee.skills) ? employee.skills : []) : null
    };
    const result = await db.insert(employees).values(cleanEmployee).returning();
    return result[0];
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTask(id: string): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    // Ensure tags is an array or null
    const cleanTask = {
      ...task,
      tags: task.tags ? (Array.isArray(task.tags) ? task.tags : []) : null
    };
    const result = await db.insert(tasks).values(cleanTask).returning();
    return result[0];
  }

  // Quote methods
  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes);
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    const result = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
    return result[0];
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const result = await db.insert(quotes).values(quote).returning();
    return result[0];
  }

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
    return result[0];
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(invoice).returning();
    return result[0];
  }

  // Leave Type methods
  async getLeaveTypes(): Promise<LeaveType[]> {
    return await db.select().from(leaveTypes);
  }

  async getLeaveType(id: string): Promise<LeaveType | undefined> {
    const result = await db.select().from(leaveTypes).where(eq(leaveTypes.id, id)).limit(1);
    return result[0];
  }

  async createLeaveType(leaveType: InsertLeaveType): Promise<LeaveType> {
    const result = await db.insert(leaveTypes).values(leaveType).returning();
    return result[0];
  }

  // Leave Request methods
  async getLeaveRequests(employeeId?: string, managerId?: string): Promise<LeaveRequest[]> {
    if (employeeId && managerId) {
      return await db.select()
        .from(leaveRequests)
        .where(eq(leaveRequests.employeeId, employeeId))
        .where(eq(leaveRequests.managerId, managerId));
    } else if (employeeId) {
      return await db.select()
        .from(leaveRequests)
        .where(eq(leaveRequests.employeeId, employeeId));
    } else if (managerId) {
      return await db.select()
        .from(leaveRequests)
        .where(eq(leaveRequests.managerId, managerId));
    }
    
    return await db.select().from(leaveRequests);
  }

  async getLeaveRequest(id: string): Promise<LeaveRequest | undefined> {
    const result = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id)).limit(1);
    return result[0];
  }

  async createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const result = await db.insert(leaveRequests).values(leaveRequest).returning();
    return result[0];
  }

  async updateLeaveRequest(id: string, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    const result = await db.update(leaveRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leaveRequests.id, id))
      .returning();
    return result[0];
  }

  // Leave Balance methods
  async getLeaveBalances(employeeId: string, year?: number): Promise<LeaveBalance[]> {
    if (year) {
      return await db.select()
        .from(leaveBalances)
        .where(eq(leaveBalances.employeeId, employeeId))
        .where(eq(leaveBalances.year, year));
    }
    
    return await db.select()
      .from(leaveBalances)
      .where(eq(leaveBalances.employeeId, employeeId));
  }

  async getLeaveBalance(id: string): Promise<LeaveBalance | undefined> {
    const result = await db.select().from(leaveBalances).where(eq(leaveBalances.id, id)).limit(1);
    return result[0];
  }

  async createLeaveBalance(leaveBalance: InsertLeaveBalance): Promise<LeaveBalance> {
    const result = await db.insert(leaveBalances).values(leaveBalance).returning();
    return result[0];
  }

  async updateLeaveBalance(id: string, updates: Partial<InsertLeaveBalance>): Promise<LeaveBalance | undefined> {
    const result = await db.update(leaveBalances)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leaveBalances.id, id))
      .returning();
    return result[0];
  }

  // Leave Policy methods
  async getLeavePolicies(companyId: string): Promise<LeavePolicy[]> {
    return await db.select().from(leavePolicies).where(eq(leavePolicies.companyId, companyId));
  }

  async getLeavePolicy(id: string): Promise<LeavePolicy | undefined> {
    const result = await db.select().from(leavePolicies).where(eq(leavePolicies.id, id)).limit(1);
    return result[0];
  }

  async createLeavePolicy(leavePolicy: InsertLeavePolicy): Promise<LeavePolicy> {
    const result = await db.insert(leavePolicies).values(leavePolicy).returning();
    return result[0];
  }

  async updateLeavePolicy(id: string, updates: Partial<InsertLeavePolicy>): Promise<LeavePolicy | undefined> {
    const result = await db.update(leavePolicies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leavePolicies.id, id))
      .returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private companies: Map<string, Company>;
  private employees: Map<string, Employee>;
  private projects: Map<string, Project>;
  private tasks: Map<string, Task>;
  private quotes: Map<string, Quote>;
  private invoices: Map<string, Invoice>;
  private aiAgents: Map<string, AiAgent>;
  private aiAgentActions: Map<string, AiAgentAction>;
  private aiAgentMemory: Map<string, AiAgentMemory>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.employees = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.quotes = new Map();
    this.invoices = new Map();
    this.aiAgents = new Map();
    this.aiAgentActions = new Map();
    this.aiAgentMemory = new Map();
    this.currentId = 1;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `user_${this.currentId++}`;
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      role: insertUser.role || null,
      companyId: insertUser.companyId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // AI Agent methods
  async getAiAgents(): Promise<AiAgent[]> {
    return Array.from(this.aiAgents.values());
  }

  async getAiAgent(id: string): Promise<AiAgent | undefined> {
    return this.aiAgents.get(id);
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    const id = `agent_${this.currentId++}`;
    const aiAgent: AiAgent = { 
      id,
      name: agent.name,
      aiModel: agent.aiModel,
      autonomyLevel: agent.autonomyLevel,
      description: agent.description ?? null,
      status: agent.status ?? null,
      capabilities: agent.capabilities ?? null,
      permissions: agent.permissions ?? null,
      decisionBudget: agent.decisionBudget ?? null,
      learningRate: agent.learningRate ?? null,
      maxTokens: agent.maxTokens ?? null,
      modelVersion: agent.modelVersion ?? null,
      responseFormat: agent.responseFormat ?? null,
      specializationData: agent.specializationData ?? null,
      successRate: agent.successRate ?? null,
      failedActions: agent.failedActions ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: null,
      createdBy: agent.createdBy ?? null,
    };
    this.aiAgents.set(id, aiAgent);
    return aiAgent;
  }

  async updateAiAgent(id: string, updates: Partial<InsertAiAgent>): Promise<AiAgent | undefined> {
    const existing = this.aiAgents.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.aiAgents.set(id, updated);
    return updated;
  }

  async deleteAiAgent(id: string): Promise<boolean> {
    return this.aiAgents.delete(id);
  }

  // AI Agent Action methods
  async getAiAgentActions(agentId?: string): Promise<AiAgentAction[]> {
    const actions = Array.from(this.aiAgentActions.values());
    return agentId ? actions.filter(action => action.agentId === agentId) : actions;
  }

  async getAiAgentAction(id: string): Promise<AiAgentAction | undefined> {
    return this.aiAgentActions.get(id);
  }

  async createAiAgentAction(action: InsertAiAgentAction): Promise<AiAgentAction> {
    const id = `action_${this.currentId++}`;
    const aiAgentAction: AiAgentAction = { 
      ...action, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.aiAgentActions.set(id, aiAgentAction);
    return aiAgentAction;
  }

  async updateAiAgentAction(id: string, updates: Partial<InsertAiAgentAction>): Promise<AiAgentAction | undefined> {
    const existing = this.aiAgentActions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.aiAgentActions.set(id, updated);
    return updated;
  }

  // AI Agent Memory methods
  async getAiAgentMemory(agentId: string): Promise<AiAgentMemory[]> {
    return Array.from(this.aiAgentMemory.values()).filter(memory => memory.agentId === agentId);
  }

  async createAiAgentMemory(memory: InsertAiAgentMemory): Promise<AiAgentMemory> {
    const id = `memory_${this.currentId++}`;
    const aiAgentMemory: AiAgentMemory = { 
      ...memory, 
      id,
      summary: memory.summary || null,
      category: memory.category || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: null,
    };
    this.aiAgentMemory.set(id, aiAgentMemory);
    return aiAgentMemory;
  }

  // Company methods for MemStorage
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const id = `company_${this.currentId++}`;
    const newCompany: Company = { 
      ...company, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  // Employee methods for MemStorage
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const id = `employee_${this.currentId++}`;
    const newEmployee: Employee = { 
      ...employee, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.employees.set(id, newEmployee);
    return newEmployee;
  }

  // Project methods for MemStorage
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = `project_${this.currentId++}`;
    const newProject: Project = { 
      ...project, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  // Task methods for MemStorage
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = `task_${this.currentId++}`;
    const newTask: Task = { 
      ...task, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  // Quote methods for MemStorage
  async getQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const id = `quote_${this.currentId++}`;
    const newQuote: Quote = { 
      ...quote, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quotes.set(id, newQuote);
    return newQuote;
  }

  // Invoice methods for MemStorage
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = `invoice_${this.currentId++}`;
    const newInvoice: Invoice = { 
      ...invoice, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  // Leave methods - Not implemented in MemStorage
  async getLeaveTypes(): Promise<LeaveType[]> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async getLeaveType(id: string): Promise<LeaveType | undefined> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async createLeaveType(leaveType: InsertLeaveType): Promise<LeaveType> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async getLeaveRequests(employeeId?: string, managerId?: string): Promise<LeaveRequest[]> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async getLeaveRequest(id: string): Promise<LeaveRequest | undefined> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async updateLeaveRequest(id: string, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async getLeaveBalances(employeeId: string, year?: number): Promise<LeaveBalance[]> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async getLeaveBalance(id: string): Promise<LeaveBalance | undefined> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async createLeaveBalance(leaveBalance: InsertLeaveBalance): Promise<LeaveBalance> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async updateLeaveBalance(id: string, updates: Partial<InsertLeaveBalance>): Promise<LeaveBalance | undefined> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async getLeavePolicies(companyId?: string): Promise<LeavePolicy[]> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async getLeavePolicy(id: string): Promise<LeavePolicy | undefined> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async createLeavePolicy(leavePolicy: InsertLeavePolicy): Promise<LeavePolicy> {
    throw new Error("Leave management not implemented in MemStorage");
  }

  async updateLeavePolicy(id: string, updates: Partial<InsertLeavePolicy>): Promise<LeavePolicy | undefined> {
    throw new Error("Leave management not implemented in MemStorage");
  }
}

// Use database storage since we have a real database
export const storage = new DatabaseStorage();
