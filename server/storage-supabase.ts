import { supabase } from "./db-supabase";
import bcrypt from "bcrypt";
import { 
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

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = { ...user, password: hashedPassword };
    
    const { data, error } = await supabase
      .from('users')
      .insert([userWithHashedPassword])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    return user;
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) throw new Error(`Failed to get companies: ${error.message}`);
    return data as Company[];
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Company;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create company: ${error.message}`);
    return data as Company;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get employees: ${error.message}`);
    return data as Employee[];
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create employee: ${error.message}`);
    return data as Employee;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get projects: ${error.message}`);
    return data as Project[];
  }

  async getProject(id: string): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create project: ${error.message}`);
    return data as Project;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get tasks: ${error.message}`);
    return data as Task[];
  }

  async getTask(id: string): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create task: ${error.message}`);
    return data as Task;
  }

  // Quote methods - NOTE: La table s'appelle 'devis' dans Supabase
  async getQuotes(): Promise<Quote[]> {
    const { data, error } = await supabase
      .from('devis')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get quotes: ${error.message}`);
    return data as Quote[];
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    const { data, error } = await supabase
      .from('devis')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Quote;
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const { data, error } = await supabase
      .from('devis')
      .insert([quote])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create quote: ${error.message}`);
    return data as Quote;
  }

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get invoices: ${error.message}`);
    return data as Invoice[];
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create invoice: ${error.message}`);
    return data as Invoice;
  }

  // AI Agent methods
  async getAiAgents(): Promise<AiAgent[]> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get AI agents: ${error.message}`);
    return data as AiAgent[];
  }

  async getAiAgent(id: string): Promise<AiAgent | undefined> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as AiAgent;
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    const { data, error } = await supabase
      .from('ai_agents')
      .insert([agent])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create AI agent: ${error.message}`);
    return data as AiAgent;
  }

  async updateAiAgent(id: string, updates: Partial<InsertAiAgent>): Promise<AiAgent | undefined> {
    const { data, error } = await supabase
      .from('ai_agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data as AiAgent;
  }

  async deleteAiAgent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // AI Agent Action methods
  async getAiAgentActions(agentId?: string): Promise<AiAgentAction[]> {
    let query = supabase
      .from('ai_agent_actions')
      .select('*');
    
    if (agentId) {
      query = query.eq('agent_id', agentId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get AI agent actions: ${error.message}`);
    return data as AiAgentAction[];
  }

  async getAiAgentAction(id: string): Promise<AiAgentAction | undefined> {
    const { data, error } = await supabase
      .from('ai_agent_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as AiAgentAction;
  }

  async createAiAgentAction(action: InsertAiAgentAction): Promise<AiAgentAction> {
    const { data, error } = await supabase
      .from('ai_agent_actions')
      .insert([action])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create AI agent action: ${error.message}`);
    return data as AiAgentAction;
  }

  async updateAiAgentAction(id: string, updates: Partial<InsertAiAgentAction>): Promise<AiAgentAction | undefined> {
    const { data, error } = await supabase
      .from('ai_agent_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data as AiAgentAction;
  }

  // AI Agent Memory methods
  async getAiAgentMemory(agentId: string): Promise<AiAgentMemory[]> {
    const { data, error } = await supabase
      .from('ai_agent_memory')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get AI agent memory: ${error.message}`);
    return data as AiAgentMemory[];
  }

  async createAiAgentMemory(memory: InsertAiAgentMemory): Promise<AiAgentMemory> {
    const { data, error } = await supabase
      .from('ai_agent_memory')
      .insert([memory])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create AI agent memory: ${error.message}`);
    return data as AiAgentMemory;
  }

  // Leave Type methods
  async getLeaveTypes(): Promise<LeaveType[]> {
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .order('name');
    
    if (error) throw new Error(`Failed to get leave types: ${error.message}`);
    return data as LeaveType[];
  }

  async getLeaveType(id: string): Promise<LeaveType | undefined> {
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as LeaveType;
  }

  async createLeaveType(leaveType: InsertLeaveType): Promise<LeaveType> {
    const { data, error } = await supabase
      .from('leave_types')
      .insert([leaveType])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create leave type: ${error.message}`);
    return data as LeaveType;
  }

  // Leave Request methods
  async getLeaveRequests(employeeId?: string, managerId?: string): Promise<LeaveRequest[]> {
    let query = supabase
      .from('leave_requests')
      .select('*');
    
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    
    if (managerId) {
      // TODO: Implémenter la logique pour filtrer par manager
      // Nécessite une jointure avec employees/departments
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get leave requests: ${error.message}`);
    return data as LeaveRequest[];
  }

  async getLeaveRequest(id: string): Promise<LeaveRequest | undefined> {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as LeaveRequest;
  }

  async createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const { data, error } = await supabase
      .from('leave_requests')
      .insert([leaveRequest])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create leave request: ${error.message}`);
    return data as LeaveRequest;
  }

  async updateLeaveRequest(id: string, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    const { data, error } = await supabase
      .from('leave_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data as LeaveRequest;
  }

  // Leave Balance methods
  async getLeaveBalances(employeeId: string, year?: number): Promise<LeaveBalance[]> {
    let query = supabase
      .from('leave_balances')
      .select('*')
      .eq('employee_id', employeeId);
    
    if (year) {
      query = query.eq('year', year);
    }
    
    const { data, error } = await query.order('year', { ascending: false });
    
    if (error) throw new Error(`Failed to get leave balances: ${error.message}`);
    return data as LeaveBalance[];
  }

  async getLeaveBalance(id: string): Promise<LeaveBalance | undefined> {
    const { data, error } = await supabase
      .from('leave_balances')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as LeaveBalance;
  }

  async createLeaveBalance(leaveBalance: InsertLeaveBalance): Promise<LeaveBalance> {
    const { data, error } = await supabase
      .from('leave_balances')
      .insert([leaveBalance])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create leave balance: ${error.message}`);
    return data as LeaveBalance;
  }

  async updateLeaveBalance(id: string, updates: Partial<InsertLeaveBalance>): Promise<LeaveBalance | undefined> {
    const { data, error } = await supabase
      .from('leave_balances')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data as LeaveBalance;
  }

  // Leave Policy methods
  async getLeavePolicies(companyId: string): Promise<LeavePolicy[]> {
    // Note: leave_policies n'existe pas dans votre structure actuelle
    // Retourner un tableau vide pour l'instant
    return [];
  }

  async getLeavePolicy(id: string): Promise<LeavePolicy | undefined> {
    // Note: leave_policies n'existe pas dans votre structure actuelle
    return undefined;
  }

  async createLeavePolicy(leavePolicy: InsertLeavePolicy): Promise<LeavePolicy> {
    // Note: leave_policies n'existe pas dans votre structure actuelle
    throw new Error("Leave policies not implemented");
  }

  async updateLeavePolicy(id: string, updates: Partial<InsertLeavePolicy>): Promise<LeavePolicy | undefined> {
    // Note: leave_policies n'existe pas dans votre structure actuelle
    return undefined;
  }
}

// Export l'instance
export const storage = new SupabaseStorage();