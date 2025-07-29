export interface WorkOrganizationRequest {
  action: 'analyze_workload' | 'assign_tasks' | 'optimize_resources' | 'predict_bottlenecks';
  project_id?: string;
  employee_ids?: string[];
  time_period?: {
    start: string;
    end: string;
  };
  criteria?: {
    prioritize_skills?: boolean;
    balance_workload?: boolean;
    consider_availability?: boolean;
    optimize_cost?: boolean;
  };
}

export interface WorkloadAnalysis {
  summary: {
    total_employees: number;
    active_projects: number;
    pending_tasks: number;
    avg_workload: number;
  };
  employee_workloads: Array<{
    id: string;
    first_name: string;
    last_name: string;
    skills: string[];
    performance_score: number;
    workload: {
      total_hours: number;
      active_tasks: number;
      completion_rate: number;
    };
  }>;
  ai_analysis: string;
  recommendations: Array<{
    type: string;
    priority: 'low' | 'medium' | 'high';
    message: string;
    affected_employees?: string[];
    affected_tasks?: string[];
    action: string;
  }>;
}

export interface TaskAssignmentResult {
  assignments: Array<{
    task_id: string;
    employee_id: string;
    confidence: number;
    reasoning: string;
    status: 'assigned' | 'failed';
    task_data?: unknown;
    error?: string;
  }>;
  success_count: number;
  total_count: number;
}

export const workOrganizationApi = {
  async analyzeWorkload(request: Omit<WorkOrganizationRequest, 'action'>): Promise<WorkloadAnalysis> {
    try {
      const response = await fetch('/api/ai/work-organizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, action: 'analyze_workload' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing workload:', error);
      throw error;
    }
  },

  async assignTasks(request: Omit<WorkOrganizationRequest, 'action'>): Promise<TaskAssignmentResult> {
    try {
      const response = await fetch('/api/ai/work-organizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, action: 'assign_tasks' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error assigning tasks:', error);
      throw error;
    }
  },

  async optimizeResources(request: Omit<WorkOrganizationRequest, 'action'>): Promise<WorkloadAnalysis> {
    try {
      const response = await fetch('/api/ai/work-organizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, action: 'optimize_resources' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error optimizing resources:', error);
      throw error;
    }
  },

  async predictBottlenecks(request: Omit<WorkOrganizationRequest, 'action'>): Promise<WorkloadAnalysis> {
    try {
      const response = await fetch('/api/ai/work-organizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, action: 'predict_bottlenecks' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting bottlenecks:', error);
      throw error;
    }
  }
};