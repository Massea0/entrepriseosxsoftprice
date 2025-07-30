import { db } from '../../db';
import { employees, projects, tasks, users } from '../../db/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { geminiService } from './gemini-service';

interface EmployeeSkills {
  id: string;
  full_name: string;
  skills: string[];
  currentWorkload: number;
  availability: number;
  successRate: number;
  specialties: string[];
}

interface ProjectRequirements {
  id: string;
  name: string;
  requiredSkills: string[];
  priority: string;
  complexity: number;
  estimatedHours: number;
}

interface AssignmentRecommendation {
  employeeId: string;
  employeeName: string;
  score: number;
  reasons: string[];
  workloadAfter: number;
}

export class AutoAssignmentService {
  // Analyze employee skills and workload
  async analyzeEmployeeCapacity(): Promise<EmployeeSkills[]> {
    try {
      // Get all active employees with their current tasks
      const employeesData = await db
        .select({
          employee: employees,
          activeTasks: sql<number>`
            COUNT(DISTINCT ${tasks.id}) FILTER (
              WHERE ${tasks.status} IN ('in_progress', 'todo')
              AND ${tasks.assigned_to} = ${employees.id}
            )
          `.as('active_tasks'),
          completedTasks: sql<number>`
            COUNT(DISTINCT ${tasks.id}) FILTER (
              WHERE ${tasks.status} = 'completed'
              AND ${tasks.assigned_to} = ${employees.id}
            )
          `.as('completed_tasks'),
          totalTasks: sql<number>`
            COUNT(DISTINCT ${tasks.id}) FILTER (
              WHERE ${tasks.assigned_to} = ${employees.id}
            )
          `.as('total_tasks')
        })
        .from(employees)
        .leftJoin(tasks, eq(tasks.assigned_to, employees.id))
        .where(eq(employees.status, 'active'))
        .groupBy(employees.id);

      return employeesData.map(({ employee, activeTasks, completedTasks, totalTasks }) => {
        // Extract skills from employee data
        const skills = this.extractSkills(employee);
        const specialties = this.identifySpecialties(employee.position);
        
        // Calculate success rate
        const successRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 100;
        
        // Calculate availability (100% - current workload)
        const maxTasksPerPerson = 10; // Configuration parameter
        const currentWorkload = (activeTasks / maxTasksPerPerson) * 100;
        const availability = Math.max(0, 100 - currentWorkload);

        return {
          id: employee.id,
          full_name: employee.full_name,
          skills,
          currentWorkload,
          availability,
          successRate,
          specialties
        };
      });
    } catch (error) {
      console.error('Error analyzing employee capacity:', error);
      return [];
    }
  }

  // Extract skills from employee profile
  private extractSkills(employee: any): string[] {
    const skills: string[] = [];
    
    // Extract from position
    const position = employee.position?.toLowerCase() || '';
    if (position.includes('frontend')) skills.push('frontend', 'react', 'ui/ux');
    if (position.includes('backend')) skills.push('backend', 'api', 'database');
    if (position.includes('fullstack')) skills.push('frontend', 'backend', 'fullstack');
    if (position.includes('mobile')) skills.push('mobile', 'react-native', 'flutter');
    if (position.includes('devops')) skills.push('devops', 'ci/cd', 'cloud');
    if (position.includes('design')) skills.push('design', 'ui/ux', 'figma');
    if (position.includes('manager')) skills.push('management', 'leadership', 'planning');
    
    // Extract from department
    const department = employee.department?.toLowerCase() || '';
    if (department.includes('tech')) skills.push('technical');
    if (department.includes('product')) skills.push('product', 'planning');
    if (department.includes('design')) skills.push('design', 'creative');
    
    return [...new Set(skills)]; // Remove duplicates
  }

  // Identify specialties based on position
  private identifySpecialties(position: string): string[] {
    const specialties: string[] = [];
    const pos = position?.toLowerCase() || '';
    
    if (pos.includes('senior')) specialties.push('senior', 'mentoring');
    if (pos.includes('lead')) specialties.push('leadership', 'architecture');
    if (pos.includes('principal')) specialties.push('architecture', 'strategy');
    
    return specialties;
  }

  // Analyze project requirements
  async analyzeProjectRequirements(projectId: string): Promise<ProjectRequirements | null> {
    try {
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!project.length) return null;

      const proj = project[0];
      const requiredSkills = this.extractProjectSkills(proj);
      const complexity = this.calculateComplexity(proj);
      const estimatedHours = this.estimateHours(proj, complexity);

      return {
        id: proj.id,
        name: proj.name,
        requiredSkills,
        priority: proj.priority || 'medium',
        complexity,
        estimatedHours
      };
    } catch (error) {
      console.error('Error analyzing project requirements:', error);
      return null;
    }
  }

  // Extract required skills from project
  private extractProjectSkills(project: any): string[] {
    const skills: string[] = [];
    const name = project.name?.toLowerCase() || '';
    const description = project.description?.toLowerCase() || '';
    const combined = `${name} ${description}`;
    
    // Technical skills
    if (combined.includes('web') || combined.includes('site')) skills.push('frontend', 'backend');
    if (combined.includes('mobile') || combined.includes('app')) skills.push('mobile');
    if (combined.includes('api') || combined.includes('integration')) skills.push('backend', 'api');
    if (combined.includes('design') || combined.includes('ui') || combined.includes('ux')) skills.push('design', 'ui/ux');
    if (combined.includes('database') || combined.includes('data')) skills.push('database', 'backend');
    if (combined.includes('cloud') || combined.includes('aws') || combined.includes('azure')) skills.push('cloud', 'devops');
    
    // Domain skills
    if (combined.includes('e-commerce') || combined.includes('shop')) skills.push('e-commerce', 'payment');
    if (combined.includes('cms') || combined.includes('content')) skills.push('cms', 'content-management');
    if (combined.includes('analytics') || combined.includes('dashboard')) skills.push('analytics', 'data-visualization');
    
    return [...new Set(skills)];
  }

  // Calculate project complexity
  private calculateComplexity(project: any): number {
    let complexity = 5; // Base complexity
    
    // Budget factor
    const budget = project.budget || 0;
    if (budget > 100000) complexity += 3;
    else if (budget > 50000) complexity += 2;
    else if (budget > 20000) complexity += 1;
    
    // Priority factor
    if (project.priority === 'critical') complexity += 3;
    else if (project.priority === 'high') complexity += 2;
    else if (project.priority === 'medium') complexity += 1;
    
    // Duration factor
    const duration = this.getProjectDuration(project);
    if (duration > 180) complexity += 2; // > 6 months
    else if (duration > 90) complexity += 1; // > 3 months
    
    return Math.min(10, complexity); // Cap at 10
  }

  // Calculate project duration in days
  private getProjectDuration(project: any): number {
    if (!project.start_date || !project.end_date) return 30; // Default 1 month
    
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Estimate hours based on project
  private estimateHours(project: any, complexity: number): number {
    const baseDuration = this.getProjectDuration(project);
    const workDaysPerWeek = 5;
    const hoursPerDay = 8;
    const utilizationRate = 0.7; // 70% productive time
    
    const workDays = (baseDuration / 7) * workDaysPerWeek;
    const totalHours = workDays * hoursPerDay * utilizationRate;
    
    // Adjust by complexity
    const complexityMultiplier = 1 + (complexity - 5) * 0.1; // ±10% per complexity point
    
    return Math.round(totalHours * complexityMultiplier);
  }

  // Get assignment recommendations
  async getAssignmentRecommendations(
    projectId: string,
    maxRecommendations: number = 5
  ): Promise<AssignmentRecommendation[]> {
    const projectReq = await this.analyzeProjectRequirements(projectId);
    if (!projectReq) return [];

    const employees = await this.analyzeEmployeeCapacity();
    
    // Score each employee
    const recommendations = employees.map(employee => {
      const score = this.calculateAssignmentScore(employee, projectReq);
      const reasons = this.generateReasons(employee, projectReq, score);
      const workloadAfter = employee.currentWorkload + (projectReq.estimatedHours / 160) * 100; // Assuming 160 hours/month
      
      return {
        employeeId: employee.id,
        employeeName: employee.full_name,
        score,
        reasons,
        workloadAfter
      };
    });

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations);
  }

  // Calculate assignment score
  private calculateAssignmentScore(
    employee: EmployeeSkills,
    project: ProjectRequirements
  ): number {
    let score = 0;
    
    // Skill match (40 points max)
    const skillMatch = project.requiredSkills.filter(skill => 
      employee.skills.includes(skill)
    ).length;
    const skillMatchRatio = project.requiredSkills.length > 0 
      ? skillMatch / project.requiredSkills.length 
      : 1;
    score += skillMatchRatio * 40;
    
    // Availability (30 points max)
    score += (employee.availability / 100) * 30;
    
    // Success rate (20 points max)
    score += (employee.successRate / 100) * 20;
    
    // Specialty bonus (10 points max)
    if (project.priority === 'critical' && employee.specialties.includes('senior')) {
      score += 10;
    } else if (project.complexity > 7 && employee.specialties.includes('architecture')) {
      score += 8;
    } else if (employee.specialties.includes('leadership')) {
      score += 5;
    }
    
    // Penalty for overload
    if (employee.currentWorkload > 80) {
      score *= 0.5; // 50% penalty for overloaded employees
    }
    
    return Math.round(score);
  }

  // Generate assignment reasons
  private generateReasons(
    employee: EmployeeSkills,
    project: ProjectRequirements,
    score: number
  ): string[] {
    const reasons: string[] = [];
    
    // Skill match
    const matchedSkills = project.requiredSkills.filter(skill => 
      employee.skills.includes(skill)
    );
    if (matchedSkills.length > 0) {
      reasons.push(`Compétences correspondantes: ${matchedSkills.join(', ')}`);
    }
    
    // Availability
    if (employee.availability > 70) {
      reasons.push(`Haute disponibilité (${Math.round(employee.availability)}%)`);
    } else if (employee.availability > 40) {
      reasons.push(`Disponibilité modérée (${Math.round(employee.availability)}%)`);
    }
    
    // Success rate
    if (employee.successRate > 90) {
      reasons.push(`Excellent taux de réussite (${Math.round(employee.successRate)}%)`);
    }
    
    // Specialties
    if (project.priority === 'critical' && employee.specialties.includes('senior')) {
      reasons.push('Expert senior pour projet critique');
    }
    if (project.complexity > 7 && employee.specialties.includes('architecture')) {
      reasons.push('Architecte pour projet complexe');
    }
    
    // Warnings
    if (employee.currentWorkload > 60) {
      reasons.push(`⚠️ Charge actuelle: ${Math.round(employee.currentWorkload)}%`);
    }
    
    return reasons;
  }

  // Auto-assign project to best candidate
  async autoAssignProject(projectId: string): Promise<{
    success: boolean;
    assignedTo?: string;
    employeeName?: string;
    reasons?: string[];
  }> {
    try {
      const recommendations = await this.getAssignmentRecommendations(projectId, 1);
      
      if (recommendations.length === 0 || recommendations[0].score < 30) {
        return {
          success: false,
          reasons: ['Aucun employé disponible avec les compétences requises']
        };
      }
      
      const bestMatch = recommendations[0];
      
      // Update project with assignment
      await db
        .update(projects)
        .set({
          assignedTo: bestMatch.employeeId,
          updatedAt: new Date()
        })
        .where(eq(projects.id, projectId));
      
      return {
        success: true,
        assignedTo: bestMatch.employeeId,
        employeeName: bestMatch.employeeName,
        reasons: bestMatch.reasons
      };
    } catch (error) {
      console.error('Error auto-assigning project:', error);
      return {
        success: false,
        reasons: ['Erreur lors de l\'assignation automatique']
      };
    }
  }

  // Get AI-powered recommendations using Gemini
  async getAIRecommendations(projectId: string): Promise<string> {
    const project = await this.analyzeProjectRequirements(projectId);
    const employees = await this.analyzeEmployeeCapacity();
    
    if (!project) return 'Projet introuvable';
    
    const prompt = `
    En tant qu'expert en gestion de projet, analyse cette situation et recommande la meilleure assignation:
    
    PROJET:
    - Nom: ${project.name}
    - Compétences requises: ${project.requiredSkills.join(', ')}
    - Priorité: ${project.priority}
    - Complexité: ${project.complexity}/10
    - Heures estimées: ${project.estimatedHours}h
    
    ÉQUIPE DISPONIBLE:
    ${employees.map(e => `
    - ${e.full_name}:
      * Compétences: ${e.skills.join(', ')}
      * Disponibilité: ${Math.round(e.availability)}%
      * Taux de réussite: ${Math.round(e.successRate)}%
      * Charge actuelle: ${Math.round(e.currentWorkload)}%
    `).join('\n')}
    
    Fournis une recommandation concise avec:
    1. La meilleure personne pour ce projet
    2. Les raisons principales (3 max)
    3. Les risques potentiels
    4. Une alternative si nécessaire
    `;
    
    try {
      const response = await geminiService.generateContent(prompt);
      return response || 'Impossible de générer des recommandations';
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return 'Erreur lors de la génération des recommandations';
    }
  }
}

export const autoAssignmentService = new AutoAssignmentService();