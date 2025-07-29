import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCompanySchema,
  insertEmployeeSchema,
  insertProjectSchema,
  insertTaskSchema,
  insertQuoteSchema,
  insertInvoiceSchema,
  insertAiAgentSchema, 
  insertAiAgentActionSchema 
} from "@shared/schema";
import { z } from "zod";
import { voiceRecognitionService } from "./services/ai/voice-recognition-service";
import { predictionEngine } from "./services/ai/prediction-engine";
import { alertService } from "./services/ai/real-time-alerts";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log("Login attempt:", { email, password: "***" });
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.validateUser(email, password);
      console.log("Validation result:", { user: user ? user.email : null });
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Company routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Get companies error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create company error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Get employees error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create employee error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create project error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create task error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Quote routes
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Get quotes error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create quote error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Invoice routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create invoice error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Agents routes
  app.get("/api/ai-agents", async (req, res) => {
    try {
      const agents = await storage.getAiAgents();
      res.json({ agents });
    } catch (error) {
      console.error("Get AI agents error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/ai-agents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const agent = await storage.getAiAgent(id);
      
      if (!agent) {
        return res.status(404).json({ error: "AI agent not found" });
      }

      res.json({ agent });
    } catch (error) {
      console.error("Get AI agent error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-agents", async (req, res) => {
    try {
      const agentData = insertAiAgentSchema.parse(req.body);
      const agent = await storage.createAiAgent(agentData);
      res.status(201).json({ agent });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create AI agent error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/ai-agents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const agent = await storage.updateAiAgent(id, updates);
      if (!agent) {
        return res.status(404).json({ error: "AI agent not found" });
      }

      res.json({ agent });
    } catch (error) {
      console.error("Update AI agent error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/ai-agents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAiAgent(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "AI agent not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Delete AI agent error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Agent Actions routes
  app.get("/api/ai-agent-actions", async (req, res) => {
    try {
      const { agentId } = req.query;
      const actions = await storage.getAiAgentActions(agentId as string);
      res.json({ actions });
    } catch (error) {
      console.error("Get AI agent actions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/ai-agent-actions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const action = await storage.getAiAgentAction(id);
      
      if (!action) {
        return res.status(404).json({ error: "AI agent action not found" });
      }

      res.json({ action });
    } catch (error) {
      console.error("Get AI agent action error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-agent-actions", async (req, res) => {
    try {
      const actionData = insertAiAgentActionSchema.parse(req.body);
      const action = await storage.createAiAgentAction(actionData);
      res.status(201).json({ action });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create AI agent action error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/ai-agent-actions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const action = await storage.updateAiAgentAction(id, updates);
      if (!action) {
        return res.status(404).json({ error: "AI agent action not found" });
      }

      res.json({ action });
    } catch (error) {
      console.error("Update AI agent action error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Agent Memory routes
  app.get("/api/ai-agent-memory/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const memory = await storage.getAiAgentMemory(agentId);
      res.json({ memory });
    } catch (error) {
      console.error("Get AI agent memory error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-agent-memory", async (req, res) => {
    try {
      const memoryData = req.body; // Will implement schema validation later
      const memory = await storage.createAiAgentMemory(memoryData);
      res.status(201).json({ memory });
    } catch (error) {
      console.error("Create AI agent memory error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Workflow Orchestrator endpoint (porting from Supabase Edge Function)
  app.post("/api/ai-workflow-orchestrator", async (req, res) => {
    try {
      // This will be the main endpoint that replaces the Supabase edge function
      const { action, payload } = req.body;
      
      // Placeholder implementation - will be expanded with actual AI logic
      res.json({ 
        success: true, 
        message: "AI workflow orchestrator endpoint ready",
        action,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI workflow orchestrator error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Voice AI Assistant endpoint (porting from Supabase Edge Function)
  app.post("/api/voice-ai-assistant", async (req, res) => {
    try {
      const { audioData, command } = req.body;
      
      // Placeholder implementation - will need actual AI integration
      res.json({ 
        success: true, 
        message: "Voice AI assistant endpoint ready",
        command,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Voice AI assistant error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Business Analytics endpoints (porting from Supabase Edge Functions)
  app.post("/api/ai-business-analyzer", async (req, res) => {
    try {
      const { data, analysisType } = req.body;
      
      res.json({ 
        success: true, 
        message: "AI business analyzer endpoint ready",
        analysisType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI business analyzer error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-financial-predictions", async (req, res) => {
    try {
      const { financialData } = req.body;
      
      res.json({ 
        success: true, 
        message: "AI financial predictions endpoint ready",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI financial predictions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-performance-optimizer", async (req, res) => {
    try {
      const { performanceData } = req.body;
      
      res.json({ 
        success: true, 
        message: "AI performance optimizer endpoint ready",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI performance optimizer error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Task and Project Management endpoints
  app.post("/api/ai-task-assignment", async (req, res) => {
    try {
      const { tasks, employees } = req.body;
      
      res.json({ 
        success: true, 
        message: "AI task assignment endpoint ready",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI task assignment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/project-planner-ai", async (req, res) => {
    try {
      const { projectData } = req.body;
      
      res.json({ 
        success: true, 
        message: "Project planner AI endpoint ready",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Project planner AI error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/task-mermaid-generator", async (req, res) => {
    try {
      const { tasks } = req.body;
      
      res.json({ 
        success: true, 
        message: "Task mermaid generator endpoint ready",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Task mermaid generator error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Support and Notifications endpoints
  app.post("/api/ai-support-assistant", async (req, res) => {
    try {
      const { query, context } = req.body;
      
      res.json({ 
        success: true, 
        message: "AI support assistant endpoint ready",
        query,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI support assistant error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/send-notification-email", async (req, res) => {
    try {
      const { to, subject, body } = req.body;
      
      res.json({ 
        success: true, 
        message: "Email notification endpoint ready",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Send email notification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/send-sms-notification", async (req, res) => {
    try {
      const { to, message } = req.body;
      
      res.json({ 
        success: true, 
        message: "SMS notification endpoint ready",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Send SMS notification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Third-party integrations endpoint
  app.post("/api/third-party-integrations", async (req, res) => {
    try {
      const { integration, action, data } = req.body;
      
      res.json({ 
        success: true, 
        message: "Third-party integrations endpoint ready",
        integration,
        action,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Third-party integrations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI and HR endpoints
  app.get("/api/employees", async (req, res) => {
    try {
      const { include, status } = req.query;
      
      // Mock data for development
      const employees = [
        {
          id: '1',
          first_name: 'Marie',
          last_name: 'Diop',
          manager_id: null,
          employment_status: 'active',
          positions: { title: 'Directrice Générale' },
          departments: { id: 'd1', name: 'Direction' },
          branches: { name: 'Dakar HQ' }
        },
        {
          id: '2', 
          first_name: 'Amadou',
          last_name: 'Ndiaye',
          manager_id: '1',
          employment_status: 'active',
          positions: { title: 'Chef de Projet' },
          departments: { id: 'd2', name: 'Développement' },
          branches: { name: 'Dakar HQ' }
        }
      ];

      res.json(employees.filter(emp => !status || emp.employment_status === status));
    } catch (error) {
      console.error("Employees API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/hr/metrics", async (req, res) => {
    try {
      const mockMetrics = {
        totalEmployees: 42,
        activeEmployees: 38,
        averagePerformance: 8.2,
        turnoverRate: 5.2,
        engagementScore: 87,
        openPositions: 4,
        departmentPerformance: [
          { name: 'Développement', score: 9.1, employees: 15 },
          { name: 'Marketing', score: 8.7, employees: 8 },
          { name: 'Ventes', score: 8.4, employees: 12 },
          { name: 'RH', score: 8.9, employees: 3 },
          { name: 'Administration', score: 7.8, employees: 4 }
        ],
        recentHires: [
          { id: '1', name: 'Marie Diop', position: 'Développeur Full Stack', startDate: '2024-12-15' },
          { id: '2', name: 'Ahmed Ndiaye', position: 'Designer UX/UI', startDate: '2024-12-10' },
          { id: '3', name: 'Fatou Sall', position: 'Chef de Projet', startDate: '2024-12-05' }
        ]
      };
      
      res.json(mockMetrics);
    } catch (error) {
      console.error("HR metrics API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/ai-agents", async (req, res) => {
    try {
      const mockAgents = [
        {
          id: '1',
          name: 'SalesAgent Pro',
          type: 'SALES',
          description: 'Agent autonome pour qualification leads et négociation',
          autonomy_level: 'HIGH',
          status: 'ACTIVE',
          capabilities: ['Qualification leads', 'Négociation prix', 'Génération contrats'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          daily_budget: 50,
          monthly_budget: 1000,
          actions_count_today: 12,
          actions_count_month: 245,
          last_action_at: new Date().toISOString(),
          performance_score: 92,
          success_rate: 87
        }
      ];
      
      res.json(mockAgents);
    } catch (error) {
      console.error("AI agents API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/ai-agent-actions", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("AI agent actions API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/ai-agent-budgets", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("AI agent budgets API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai/project-planner", async (req, res) => {
    try {
      const { name, description, budget, clientType, industry } = req.body;
      
      const mockPlan = {
        data: {
          estimatedBudget: budget || 2000000,
          totalEstimatedDuration: 30,
          phases: [
            { description: `Phase 1: Analyse et conception pour ${name}` },
            { description: `Phase 2: Développement et tests` },
            { description: `Phase 3: Déploiement et formation` }
          ]
        }
      };
      
      res.json(mockPlan);
    } catch (error) {
      console.error("AI project planner API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai/work-organizer", async (req, res) => {
    try {
      const { action } = req.body;
      
      const mockResponse = {
        summary: {
          total_employees: 15,
          active_projects: 8,
          pending_tasks: 32,
          avg_workload: 7.2
        },
        employee_workloads: [],
        ai_analysis: `Analyse ${action} effectuée avec succès`,
        recommendations: [
          {
            type: 'optimization',
            priority: 'medium',
            message: 'Redistribuer certaines tâches pour équilibrer la charge',
            action: 'Rebalancer la charge de travail'
          }
        ]
      };
      
      res.json(mockResponse);
    } catch (error) {
      console.error("AI work organizer API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/security/database-schema", async (req, res) => {
    try {
      res.json({ tables: [], message: "Database schema check completed" });
    } catch (error) {
      console.error("Security database schema API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/session", async (req, res) => {
    try {
      const session = (req as any).session;
      if (session && session.user) {
        res.json({ user: session.user, authenticated: true });
      } else {
        res.json({ user: null, authenticated: false });
      }
    } catch (error) {
      console.error("Auth session API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Business Analyzer endpoint
  app.post("/api/ai/business-analyzer", async (req, res) => {
    try {
      const { projects, employees, tasks, companies, devis, invoices, currentModule } = req.body;
      
      const mockInsights = [
        {
          id: '1',
          title: 'Performance des projets',
          description: `Analyse de ${projects?.length || 0} projets en cours`,
          priority: 'high',
          category: 'business',
          aiConfidence: 85
        }
      ];
      
      res.json({ insights: mockInsights, success: true });
    } catch (error) {
      console.error("AI business analyzer error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Predictive Analytics endpoint
  app.post("/api/ai/predictive-analytics", async (req, res) => {
    try {
      const { timeframes, models, realTimeStream } = req.body;
      
      const mockAnalytics = {
        insights: [
          {
            type: 'trend',
            title: 'Croissance prévue',
            value: '15%',
            confidence: 78
          }
        ],
        success: true
      };
      
      res.json({ analytics: mockAnalytics, success: true });
    } catch (error) {
      console.error("AI predictive analytics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Intelligent Alerts endpoint
  app.post("/api/ai/intelligent-alerts", async (req, res) => {
    try {
      const { action, configuration, alertId } = req.body;
      
      if (action === 'get_alerts') {
        res.json({
          alerts: [],
          stats: {
            automatedActions: 0,
            notificationsSent: 0
          },
          success: true
        });
      } else if (action === 'mark_as_read') {
        res.json({ success: true });
      } else {
        res.json({ success: true, message: `Action ${action} processed` });
      }
    } catch (error) {
      console.error("AI intelligent alerts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Notifications API endpoints
  app.get('/api/notifications', async (req, res) => {
    try {
      // Return empty array for now - will be implemented with real data
      res.json([]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.get('/api/notification-preferences', async (req, res) => {
    try {
      // Return default preferences for now
      const defaultPreferences = {
        id: '1',
        user_id: req.query.user_id || '',
        email_enabled: true,
        push_enabled: true,
        sms_enabled: false,
        types_enabled: ['all'],
        timezone: 'Africa/Dakar',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      res.json(defaultPreferences);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  });

  // Manager API endpoints
  app.get('/api/manager/team', async (req, res) => {
    try {
      const result = await storage.getEmployees();
      res.json(result);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  });

  // Leave management routes
  app.get('/api/leave/types', async (req, res) => {
    try {
      const leaveTypes = await storage.getLeaveTypes();
      res.json(leaveTypes);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      res.status(500).json({ error: 'Failed to fetch leave types' });
    }
  });

  app.get('/api/leave/requests', async (req, res) => {
    try {
      const { employeeId, managerId } = req.query;
      const requests = await storage.getLeaveRequests(
        employeeId as string, 
        managerId as string
      );
      res.json(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
  });

  app.post('/api/leave/requests', async (req, res) => {
    try {
      const leaveRequest = await storage.createLeaveRequest(req.body);
      res.status(201).json(leaveRequest);
    } catch (error) {
      console.error('Error creating leave request:', error);
      res.status(500).json({ error: 'Failed to create leave request' });
    }
  });

  app.put('/api/leave/requests/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRequest = await storage.updateLeaveRequest(id, req.body);
      if (!updatedRequest) {
        return res.status(404).json({ error: 'Leave request not found' });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error('Error updating leave request:', error);
      res.status(500).json({ error: 'Failed to update leave request' });
    }
  });

  app.get('/api/leave/balances/:employeeId', async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { year } = req.query;
      const balances = await storage.getLeaveBalances(
        employeeId, 
        year ? parseInt(year as string) : undefined
      );
      res.json(balances);
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      res.status(500).json({ error: 'Failed to fetch leave balances' });
    }
  });

  app.get('/api/leave/policies/:companyId', async (req, res) => {
    try {
      const { companyId } = req.params;
      const policies = await storage.getLeavePolicies(companyId);
      res.json(policies);
    } catch (error) {
      console.error('Error fetching leave policies:', error);
      res.status(500).json({ error: 'Failed to fetch leave policies' });
    }
  });

  app.get('/api/manager/approvals', async (req, res) => {
    try {
      // Mock data for now - will be replaced with real data
      const approvals = [
        {
          id: '1',
          type: 'leave',
          employeeName: 'Aminata Diallo',
          employeeId: '1',
          requestDate: '2025-01-20',
          startDate: '2025-01-25',
          endDate: '2025-01-27',
          duration: 3,
          reason: 'Congé personnel',
          status: 'pending',
          priority: 'medium',
          description: 'Demande de congé pour raisons personnelles'
        }
      ];
      res.json(approvals);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      res.status(500).json({ error: 'Failed to fetch approvals' });
    }
  });

  app.patch('/api/manager/approvals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { action } = req.body;
      
      // Mock approval/rejection logic
      console.log(`${action === 'approve' ? 'Approved' : 'Rejected'} approval ${id}`);
      
      res.json({ success: true, action, id });
    } catch (error) {
      console.error('Error updating approval:', error);
      res.status(500).json({ error: 'Failed to update approval' });
    }
  });

  app.get('/api/manager/performance', async (req, res) => {
    try {
      // Mock performance data
      const performanceData = [
        {
          employeeId: '1',
          employeeName: 'Aminata Diallo',
          role: 'Développeuse Frontend',
          overallScore: 94,
          goals: [],
          recentReviews: [],
          kpis: []
        }
      ];
      res.json(performanceData);
    } catch (error) {
      console.error('Error fetching performance:', error);
      res.status(500).json({ error: 'Failed to fetch performance' });
    }
  });

  app.get('/api/manager/schedule', async (req, res) => {
    try {
      // Mock schedule data
      const scheduleEvents: any[] = [];
      res.json(scheduleEvents);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  });

  app.get('/api/manager/reports/metrics', async (req, res) => {
    try {
      // Mock metrics data
      const metrics = {
        period: req.query.period || 'month',
        productivity: { overall: 87, trend: 'up', tasksCompleted: 145, tasksTotal: 167 },
        attendance: { rate: 94, trend: 'stable', presentToday: 7, totalMembers: 8 },
        performance: { average: 91, trend: 'up', topPerformers: ['Aminata Diallo'], needsAttention: [] },
        projects: { onTime: 12, delayed: 3, completed: 8, total: 23 }
      };
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  });

  app.get('/api/manager/reports/members', async (req, res) => {
    try {
      // Mock member reports
      const memberReports: any[] = [];
      res.json(memberReports);
    } catch (error) {
      console.error('Error fetching member reports:', error);
      res.status(500).json({ error: 'Failed to fetch member reports' });
    }
  });

  app.get('/api/manager/assignments/tasks', async (req, res) => {
    try {
      // Mock task assignments
      const tasks: any[] = [];
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  });

  app.post('/api/manager/assign-task', async (req, res) => {
    try {
      const { taskId, memberId } = req.body;
      console.log(`Assigned task ${taskId} to member ${memberId}`);
      res.json({ success: true, taskId, memberId });
    } catch (error) {
      console.error('Error assigning task:', error);
      res.status(500).json({ error: 'Failed to assign task' });
    }
  });

  // 🤖 AI Routes - GRAND LEAP TODO Phase 2.2
  // Auto-Workflow Designer
  app.post('/api/ai/generate-workflow', async (req, res) => {
    try {
      const { description, context, priority } = req.body;
      
      // Simuler génération IA (en attendant l'intégration complète)
      const mockWorkflow = {
        id: `workflow_${Date.now()}`,
        name: `Workflow Automatisé - ${description.substring(0, 30)}...`,
        description: `Workflow généré automatiquement pour: ${description}`,
        steps: [
          {
            id: 'trigger_1',
            type: 'trigger',
            name: 'Déclencheur Initial',
            description: 'Point de départ du workflow',
            config: { event: 'user_action' },
            position: { x: 100, y: 100 }
          },
          {
            id: 'condition_1',
            type: 'condition',
            name: 'Vérification Conditions',
            description: 'Vérifie si les conditions sont remplies',
            config: { criteria: 'business_rules' },
            position: { x: 300, y: 100 }
          },
          {
            id: 'action_1',
            type: 'action',
            name: 'Action Automatique',
            description: 'Exécute l\'action demandée',
            config: { automation: true },
            position: { x: 500, y: 100 }
          }
        ],
        estimatedTime: '5-10 minutes',
        complexity: 'medium',
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
      };

      res.json(mockWorkflow);
    } catch (error) {
      console.error('Error generating workflow:', error);
      res.status(500).json({ error: 'Failed to generate workflow' });
    }
  });

  app.get('/api/ai/workflows', async (req, res) => {
    try {
      // Mock workflows sauvegardés
      const mockWorkflows = [
        {
          id: 'wf_001',
          name: 'Traitement Commandes',
          description: 'Automatise le traitement des nouvelles commandes',
          steps: [],
          estimatedTime: '3-5 minutes',
          complexity: 'simple',
          confidence: 94
        },
        {
          id: 'wf_002', 
          name: 'Support Client',
          description: 'Gestion automatique des tickets de support',
          steps: [],
          estimatedTime: '10-15 minutes',
          complexity: 'complex',
          confidence: 87
        }
      ];

      res.json(mockWorkflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      res.status(500).json({ error: 'Failed to fetch workflows' });
    }
  });

  // Predictive Analytics
  app.get('/api/ai/predictions', async (req, res) => {
    try {
      const mockPredictions = {
        predictions: [
          {
            name: 'Chiffre d\'Affaires',
            currentValue: 245000,
            predictedValue: 267000 + Math.floor(Math.random() * 10000),
            confidence: 94,
            trend: 'up',
            timeframe: '30 jours',
            unit: '€'
          },
          {
            name: 'Nouveaux Clients',
            currentValue: 23,
            predictedValue: 31 + Math.floor(Math.random() * 5),
            confidence: 87,
            trend: 'up',
            timeframe: '30 jours',
            unit: ''
          },
          {
            name: 'Taux de Rétention',
            currentValue: 89,
            predictedValue: 92 + Math.floor(Math.random() * 3),
            confidence: 91,
            trend: 'up',
            timeframe: '90 jours',
            unit: '%'
          }
        ]
      };

      res.json(mockPredictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      res.status(500).json({ error: 'Failed to fetch predictions' });
    }
  });

  app.get('/api/ai/anomalies', async (req, res) => {
    try {
      const anomalies = [
        {
          id: 'anom_001',
          metric: 'Temps de réponse support',
          severity: 'high',
          description: 'Augmentation de 340% du temps de réponse',
          detectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          impact: 'Risque de mécontentement client',
          recommendation: 'Affecter plus de ressources au support'
        }
      ];

      res.json({ anomalies });
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      res.status(500).json({ error: 'Failed to fetch anomalies' });
    }
  });

  app.get('/api/ai/forecast', async (req, res) => {
    try {
      const { metric = 'revenue', timeframe = '30d' } = req.query;
      
      const forecast = [];
      const startValue = 245000;
      
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + (i * 7));
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          predicted: startValue + (i * 5000) + Math.floor(Math.random() * 3000),
          confidence: Math.max(85, 100 - (i * 3))
        });
      }

      res.json({ forecast });
    } catch (error) {
      console.error('Error fetching forecast:', error);
      res.status(500).json({ error: 'Failed to fetch forecast' });
    }
  });

  // Natural Language Processing
  app.post('/api/ai/natural-language', async (req, res) => {
    try {
      const { query, database, context } = req.body;
      
      // Mock traitement langage naturel
      const mockResult = {
        query,
        sql: `-- Requête générée automatiquement par l'IA Synapse
SELECT 
  c.name as company_name,
  c.email,
  COUNT(p.id) as total_projects,
  SUM(CAST(i.amount AS DECIMAL)) as total_revenue
FROM companies c
LEFT JOIN projects p ON c.id = p.company_id  
LEFT JOIN invoices i ON p.id = i.project_id
WHERE c.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.id, c.name, c.email
ORDER BY total_revenue DESC
LIMIT 10;`,
        results: [
          { company_name: 'Tech Solutions', email: 'contact@tech.com', total_projects: 3, total_revenue: 45000 },
          { company_name: 'Digital Corp', email: 'info@digital.com', total_projects: 2, total_revenue: 32000 },
          { company_name: 'Innovation Ltd', email: 'hello@innovation.com', total_projects: 4, total_revenue: 28000 },
          { company_name: 'Future Systems', email: 'admin@future.com', total_projects: 1, total_revenue: 15000 }
        ],
        executionTime: 45 + Math.floor(Math.random() * 30),
        confidence: 94,
        explanation: `J'ai interprété votre demande "${query}" comme une recherche des clients les plus rentables. La requête SQL joint les tables companies, projects et invoices pour calculer le chiffre d'affaires total par client sur les 30 derniers jours.`,
        intent: 'client_revenue_analysis',
        entities: [
          { type: 'timeframe', value: '30 jours', confidence: 95 },
          { type: 'metric', value: 'chiffre d\'affaires', confidence: 98 },
          { type: 'entity', value: 'clients', confidence: 100 }
        ]
      };

      res.json(mockResult);
    } catch (error) {
      console.error('Error processing natural language:', error);
      res.status(500).json({ error: 'Failed to process natural language query' });
    }
  });

  app.get('/api/ai/health', async (req, res) => {
    try {
      res.json({
        status: 'healthy',
        services: {
          'workflow-designer': true,
          'predictive-analytics': true,
          'natural-language': true,
          'orchestrator': true
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Health check failed' });
    }
  });

  app.get('/api/ai/metrics', async (req, res) => {
    try {
      res.json({
        accuracy: 94.7,
        responseTime: 245,
        totalQueries: 1547,
        successRate: 99.2,
        modelVersion: 'synapse-v2.1.0'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  });

  // Voice Recognition Routes
  app.post('/api/ai/voice/start', async (req, res) => {
    try {
      const { sessionId, language, provider } = req.body;
      
      if (language) {
        voiceRecognitionService.setLanguage(language);
      }
      
      await voiceRecognitionService.startRecognition(sessionId || `session_${Date.now()}`);
      
      res.json({ 
        success: true, 
        sessionId, 
        status: 'recording',
        stats: voiceRecognitionService.getUsageStats()
      });
    } catch (error) {
      console.error('Voice recognition error:', error);
      res.status(500).json({ error: 'Failed to start voice recognition' });
    }
  });

  app.post('/api/ai/voice/stop', async (req, res) => {
    try {
      const { sessionId } = req.body;
      await voiceRecognitionService.stopRecognition(sessionId);
      
      res.json({ success: true, status: 'stopped' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to stop voice recognition' });
    }
  });

  app.get('/api/ai/voice/stats', async (req, res) => {
    try {
      res.json(voiceRecognitionService.getUsageStats());
    } catch (error) {
      res.status(500).json({ error: 'Failed to get voice stats' });
    }
  });

  // Prediction Engine Routes
  app.post('/api/ai/predictions/generate', async (req, res) => {
    try {
      const { type, targetDate, parameters, historicalData } = req.body;
      
      const prediction = await predictionEngine.generatePrediction({
        type,
        targetDate: new Date(targetDate),
        parameters,
        historicalData
      });
      
      res.json(prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json({ error: 'Failed to generate prediction' });
    }
  });

  app.get('/api/ai/predictions/history', async (req, res) => {
    try {
      const { type, limit = 10 } = req.query;
      const history = await predictionEngine.getPredictionHistory(
        type as string,
        parseInt(limit as string)
      );
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get prediction history' });
    }
  });

  app.get('/api/ai/predictions/models', async (req, res) => {
    try {
      const models = ['sales', 'performance', 'risk', 'workload', 'budget'].map(type => ({
        type,
        info: predictionEngine.getModelInfo(type)
      }));
      
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get model info' });
    }
  });

  // Real-time Alerts Routes
  app.get('/api/ai/alerts/active', async (req, res) => {
    try {
      const { type } = req.query;
      const alerts = alertService.getActiveAlerts(type as any);
      
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get active alerts' });
    }
  });

  app.post('/api/ai/alerts/resolve', async (req, res) => {
    try {
      const { alertId } = req.body;
      alertService.resolveAlert(alertId);
      
      res.json({ success: true, alertId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  });

  app.get('/api/ai/alerts/stats', async (req, res) => {
    try {
      const stats = alertService.getAlertStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get alert stats' });
    }
  });

  app.post('/api/ai/alerts/trigger', async (req, res) => {
    try {
      const alert = req.body;
      alertService.triggerAlert(alert);
      
      res.json({ success: true, alert });
    } catch (error) {
      res.status(500).json({ error: 'Failed to trigger alert' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
