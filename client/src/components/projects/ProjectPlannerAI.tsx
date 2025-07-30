import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
// import { supabase } // Migrated from Supabase to Express API
import { 
  Bot, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  Target, 
  Sparkles,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface ProjectPlannerProps {
  onProjectCreated: (project: any) => void;
  onClose?: () => void;
  companies: unknown[];
  employees: unknown[];
}

interface AIGeneratedPlan {
  phases: Array<{
    name: string;
    description: string;
    duration: number;
    tasks: Array<{
      title: string;
      description: string;
      estimatedHours: number;
      requiredSkills: string[];
      assignedEmployee?: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
    }>;
  }>;
  totalDuration: number;
  estimatedBudget: number;
  recommendedTeam: string[];
  riskAssessment: string[];
  timeline: string;
}

export const ProjectPlannerAI: React.FC<ProjectPlannerProps> = ({
  onProjectCreated,
  companies,
  employees
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    clientId: '',
    description: '',
    priority: 'medium'
  });
  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedPlan | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const generateAIPlan = async () => {
    if (!projectData.name || !projectData.clientId) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez saisir le nom du projet et sélectionner un client"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Récupérer les données de l'équipe pour optimiser l'assignation
      const teamResponse = await fetch('/api/employees?status=active');
      const teamData = await teamResponse.json();

      const aiPlanResponse = await fetch('/api/ai/project-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: projectData.name,
          clientId: projectData.clientId,
          description: projectData.description || `Projet ${projectData.name} pour le client`,
          priority: projectData.priority,
          availableTeam: teamData || [],
          companyContext: {
            totalEmployees: teamData?.length || 0,
            skills: teamData?.flatMap(emp => emp.skills || []) || []
          }
        })
      });

      const aiPlan = await aiPlanResponse.json();

      if (!aiPlanResponse.ok) {
        throw new Error('Erreur lors de la génération du plan IA');
      }

      if (aiPlan?.success && aiPlan?.data) {
        // Mapper les données de l'API vers le format attendu par le frontend
        const mappedPlan = {
          // Mapper totalEstimatedDuration -> totalDuration avec validation
          totalDuration: typeof aiPlan.data.totalEstimatedDuration === 'number' && 
                        !isNaN(aiPlan.data.totalEstimatedDuration) && 
                        aiPlan.data.totalEstimatedDuration > 0 
                        ? aiPlan.data.totalEstimatedDuration 
                        : 30, // fallback 30 jours
          
          // Mapper estimatedBudget avec validation
          estimatedBudget: typeof aiPlan.data.estimatedBudget === 'number' && 
                          !isNaN(aiPlan.data.estimatedBudget) && 
                          aiPlan.data.estimatedBudget >= 0
                          ? aiPlan.data.estimatedBudget 
                          : 1000000, // fallback 1M XOF
          
          // Mapper les phases avec validation
          phases: Array.isArray(aiPlan.data.phases) ? aiPlan.data.phases.map(phase => ({
            name: phase.name || 'Phase sans nom',
            description: phase.description || 'Description non disponible',
            // Mapper estimatedDuration -> duration avec validation  
            duration: typeof phase.estimatedDuration === 'number' && 
                     !isNaN(phase.estimatedDuration) && 
                     phase.estimatedDuration > 0
                     ? phase.estimatedDuration 
                     : 7, // fallback 7 jours
            
            // Mapper les tâches avec validation
            tasks: Array.isArray(phase.tasks) ? phase.tasks.map(task => ({
              title: task.title || 'Tâche sans nom',
              description: task.description || 'Description non disponible',
              estimatedHours: typeof task.estimatedHours === 'number' && 
                             !isNaN(task.estimatedHours) && 
                             task.estimatedHours > 0
                             ? task.estimatedHours 
                             : 8, // fallback 8h
              requiredSkills: Array.isArray(task.requiredSkills) ? task.requiredSkills : [],
              priority: ['low', 'medium', 'high', 'urgent'].includes(task.priority) 
                       ? task.priority 
                       : 'medium',
              assignedEmployee: task.assignedEmployee || null
            })) : []
          })) : [],
          
          // Mapper les autres champs avec validation
          recommendedTeam: Array.isArray(aiPlan.data.recommendedTeam) 
                          ? aiPlan.data.recommendedTeam 
                          : [],
          riskAssessment: Array.isArray(aiPlan.data.recommendations) 
                         ? aiPlan.data.recommendations 
                         : Array.isArray(aiPlan.data.riskAssessment) 
                         ? aiPlan.data.riskAssessment 
                         : [],
          timeline: aiPlan.data.timeline || 'Timeline non disponible'
        };

        console.log('Plan mappé:', mappedPlan);
        setGeneratedPlan(mappedPlan);
        setCurrentStep(2);
        
        toast({
          title: "🤖 Plan généré avec succès",
          description: "Synapse a analysé votre projet et créé un plan détaillé automatiquement"
        });
      } else {
        throw new Error('Format de réponse invalide de l\'API');
      }
    } catch (error) {
      console.error('Erreur génération IA:', error);
      toast({
        variant: "destructive",
        title: "Erreur Synapse",
        description: "Impossible de générer le plan automatiquement"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const createProjectWithPlan = async () => {
    if (!generatedPlan) return;

    try {
      console.log('Création projet avec plan:', generatedPlan);
      
      // Validation finale des données avant création
      const validatedPlan = {
        ...generatedPlan,
        totalDuration: typeof generatedPlan.totalDuration === 'number' && 
                      !isNaN(generatedPlan.totalDuration) && 
                      generatedPlan.totalDuration > 0
                      ? generatedPlan.totalDuration 
                      : 30,
        estimatedBudget: typeof generatedPlan.estimatedBudget === 'number' && 
                        !isNaN(generatedPlan.estimatedBudget) && 
                        generatedPlan.estimatedBudget >= 0
                        ? generatedPlan.estimatedBudget 
                        : 1000000
      };

      // Créer le projet avec les données dans custom_fields - conversion JSON explicite
      const customFields = JSON.parse(JSON.stringify({
        aiGenerated: true,
        aiPlan: validatedPlan,
        priority: projectData.priority
      }));

      // Calcul sécurisé des dates
      const startDate = new Date();
      const durationDays = validatedPlan.totalDuration;
      const endDate = new Date(startDate.getTime() + (durationDays * 24 * 60 * 60 * 1000));
      
      // Validation des dates avant toISOString()
      if (!startDate || isNaN(startDate.getTime())) {
        throw new Error('Date de début invalide');
      }
      if (!endDate || isNaN(endDate.getTime())) {
        throw new Error('Date de fin invalide');
      }

      console.log('Dates calculées:', { startDate, endDate, durationDays });

      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description,
          client_company_id: projectData.clientId,
          status: 'planning',
          budget: validatedPlan.estimatedBudget,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          custom_fields: customFields
        })
      });

      if (!projectResponse.ok) {
        throw new Error('Erreur lors de la création du projet');
      }

      const project = await projectResponse.json();

      // Créer les tâches automatiquement avec validation
      const tasksToCreate = (validatedPlan.phases || []).flatMap((phase, phaseIndex) =>
        (phase.tasks || []).map((task, taskIndex) => ({
          title: task.title || 'Tâche sans nom',
          description: task.description || 'Description non disponible',
          project_id: project.id,
          estimated_hours: typeof task.estimatedHours === 'number' && 
                          !isNaN(task.estimatedHours) && 
                          task.estimatedHours > 0
                          ? task.estimatedHours 
                          : 8,
          priority: ['low', 'medium', 'high', 'urgent'].includes(task.priority) 
                   ? task.priority 
                   : 'medium',
          status: 'todo',
          assignee_id: task.assignedEmployee || null,
          custom_fields: JSON.parse(JSON.stringify({
            phase: phase.name || 'Phase sans nom',
            phaseIndex,
            taskIndex,
            requiredSkills: Array.isArray(task.requiredSkills) ? task.requiredSkills : [],
            aiGenerated: true
          })),
          position: phaseIndex * 1000 + taskIndex
        }))
      );

      console.log('Tâches à créer:', tasksToCreate.length);

      if (tasksToCreate.length > 0) {
        const tasksResponse = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tasksToCreate)
        });

        if (!tasksResponse.ok) {
          throw new Error('Erreur lors de la création des tâches');
        }
      }

      toast({
        title: "🎉 Projet créé avec succès !",
        description: `${tasksToCreate.length} tâches générées automatiquement par Synapse`
      });

      onProjectCreated(project);
      
      // Reset
      setProjectData({ name: '', clientId: '', description: '', priority: 'medium' });
      setGeneratedPlan(null);
      setCurrentStep(1);

    } catch (error) {
      console.error('Erreur création projet:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de créer le projet: ${error.message}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec progression */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">🧠 Synapse - Planificateur IA</h2>
                <p className="text-muted-foreground">
                  Synapse analyse votre équipe et génère automatiquement tout le plan projet
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                Étape {currentStep}/2
              </Badge>
              <Progress value={currentStep * 50} className="w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Étape 1: Informations projet */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Informations du Projet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Nom du projet *</Label>
                <Input
                  id="projectName"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  placeholder="Ex: Site web e-commerce"
                />
              </div>

              <div>
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={projectData.clientId}
                  onValueChange={(value) => setProjectData({ ...projectData, clientId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {(companies || []).map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                placeholder="Décrivez brièvement le projet... (Synapse s'occupera du reste)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={projectData.priority}
                onValueChange={(value) => setProjectData({ ...projectData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Magie de Synapse
              </h4>
              <p className="text-blue-800 text-sm">
                Une fois ces informations saisies, Synapse va automatiquement :
              </p>
              <ul className="list-disc list-inside text-blue-700 text-sm mt-2 space-y-1">
                <li>Analyser les compétences de votre équipe</li>
                <li>Générer toutes les tâches et phases du projet</li>
                <li>Assigner les tâches aux bonnes personnes</li>
                <li>Estimer les durées et le budget</li>
                <li>Créer un planning optimisé</li>
              </ul>
            </div>

            <Button 
              onClick={generateAIPlan}
              disabled={isGenerating || !projectData.name || !projectData.clientId}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className=" rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Synapse en cours de génération...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  🚀 Générer le plan complet avec Synapse
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Plan généré */}
      {currentStep === 2 && generatedPlan && (
        <div className="space-y-6">
          {/* Résumé du plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Plan Généré par Synapse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">{generatedPlan.totalDuration} jours</div>
                  <div className="text-sm text-muted-foreground">Durée totale</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">{generatedPlan.estimatedBudget.toLocaleString()} XOF</div>
                  <div className="text-sm text-muted-foreground">Budget estimé</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold">{(generatedPlan.recommendedTeam || []).length}</div>
                  <div className="text-sm text-muted-foreground">Personnes recommandées</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Target className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <div className="font-semibold">{(generatedPlan.phases || []).length}</div>
                  <div className="text-sm text-muted-foreground">Phases</div>
                </div>
              </div>

              {/* Phases détaillées */}
              <div className="space-y-4">
                {(generatedPlan.phases || []).map((phase, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Phase {index + 1}: {phase.name}</h4>
                        <Badge variant="outline">{phase.duration} jours</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                      
                      <div className="space-y-2">
                        {(phase.tasks || []).map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{task.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {task.estimatedHours}h • {(task.requiredSkills || []).join(', ')}
                              </div>
                            </div>
                            <Badge variant={
                              task.priority === 'urgent' ? 'destructive' :
                              task.priority === 'high' ? 'default' :
                              task.priority === 'medium' ? 'secondary' : 'outline'
                            }>
                              {task.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Risques identifiés */}
              {(generatedPlan.riskAssessment || []).length > 0 && (
                <Card className="mt-6 border-orange-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Risques identifiés par Synapse
                    </h4>
                    <ul className="space-y-1">
                      {(generatedPlan.riskAssessment || []).map((risk, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-orange-600 font-bold mt-1">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 mt-6">
                <Button onClick={() => setCurrentStep(1)} variant="outline">
                  Retour
                </Button>
                <Button onClick={createProjectWithPlan} className="flex-1" size="lg">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Créer le projet avec ce plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
