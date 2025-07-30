import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Brain, 
  Workflow, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Save, 
  Download,
  Upload,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { aiService } from '@/services/aiService';
import type { GeneratedWorkflow as AIGeneratedWorkflow, WorkflowStep as AIWorkflowStep } from '@/services/aiService';

export default function WorkflowDesigner() {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<AIGeneratedWorkflow | null>(null);
  const [savedWorkflows, setSavedWorkflows] = useState<AIGeneratedWorkflow[]>([]);

  useEffect(() => {
    loadSavedWorkflows();
  }, []);

  const loadSavedWorkflows = async () => {
    try {
      const workflows = await aiService.getWorkflows();
      setSavedWorkflows(workflows);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les workflows sauvegardés",
        variant: "destructive",
      });
    }
  };

  const generateWorkflow = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    try {
      const workflow = await aiService.generateWorkflow({
        description: userInput,
        context: 'enterprise-management'
      });
      
      setGeneratedWorkflow(workflow);
      toast({
        title: "Workflow généré !",
        description: `Workflow "${workflow.name}" créé avec ${workflow.confidence}% de confiance`,
      });
    } catch (error) {
      console.error('Error generating workflow:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le workflow. Utilisation des données de démonstration.",
        variant: "destructive",
      });
      
      // Fallback vers données mock
      generateMockWorkflow();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockWorkflow = () => {
    const mockWorkflow: AIGeneratedWorkflow = {
      id: `wf-${Date.now()}`,
      name: 'Traitement automatique des demandes client',
      description: 'Workflow généré automatiquement pour traiter les demandes clients entrants',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          name: 'Réception email client',
          description: 'Déclenché quand un email arrive dans support@entreprise.com',
          config: { email: 'support@entreprise.com', filters: ['urgent', 'support'] },
          position: { x: 100, y: 100 }
        },
        {
          id: 'step-2',
          type: 'condition',
          name: 'Analyse priorité',
          description: 'Détermine la priorité basée sur le contenu et l\'expéditeur',
          config: { rules: ['vip_client', 'keywords_urgent', 'sla_time'] },
          position: { x: 300, y: 100 }
        },
        {
          id: 'step-3',
          type: 'action',
          name: 'Création ticket',
          description: 'Crée automatiquement un ticket dans le système',
          config: { system: 'support', auto_assign: true },
          position: { x: 500, y: 100 }
        },
        {
          id: 'step-4',
          type: 'action',
          name: 'Notification équipe',
          description: 'Notifie l\'équipe support selon la priorité déterminée',
          config: { channels: ['slack', 'email'], escalation: 'manager' },
          position: { x: 700, y: 100 }
        }
      ],
      estimatedTime: '< 2 minutes',
      complexity: 'medium',
      confidence: 94
    };
    
    setGeneratedWorkflow(mockWorkflow);
  };

  const saveWorkflow = async () => {
    if (!generatedWorkflow) return;

    try {
      await aiService.saveWorkflow(generatedWorkflow);
      await loadSavedWorkflows();
      toast({
        title: "Workflow sauvegardé !",
        description: `"${generatedWorkflow.name}" a été ajouté à vos workflows`,
      });
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le workflow",
        variant: "destructive",
      });
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'complex': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Auto-Workflow Designer IA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Décrivez votre processus métier en langage naturel et laissez l'IA créer automatiquement 
            un workflow optimisé pour votre entreprise.
          </p>
        </div>

        {/* Input Section */}
        <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Décrivez votre workflow
            </CardTitle>
            <CardDescription>
              Exemple: "Quand un client envoie un email, créer automatiquement un ticket de support, 
              assigner au bon département et envoyer une confirmation"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Décrivez le workflow que vous souhaitez automatiser..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-32"
            />
            <div className="flex gap-2">
              <Button 
                onClick={generateWorkflow}
                disabled={!userInput.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 " />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Générer le Workflow IA
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importer Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Workflow */}
        {generatedWorkflow && (
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-green-500" />
                  {generatedWorkflow.name}
                </div>
                <div className="flex items-center gap-2">
                  <Badge>
                    <span className={getComplexityColor(generatedWorkflow.complexity)}>
                      {generatedWorkflow.complexity}
                    </span>
                  </Badge>
                  <Badge variant="outline">
                    <span className="bg-blue-50 text-blue-700 border-blue-200 px-1 rounded">
                      {generatedWorkflow.confidence}% confiance
                    </span>
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                {generatedWorkflow.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Workflow Steps */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Étapes du Workflow
                </h3>
                <div className="grid gap-3">
                  {generatedWorkflow.steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-white dark:bg-slate-900"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{step.name}</h4>
                          <Badge variant={step.type === 'trigger' ? 'default' : 'secondary'}>
                            {step.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {step.type === 'condition' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {step.type === 'action' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {step.type === 'trigger' && <Zap className="h-4 w-4 text-blue-500" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{generatedWorkflow.steps.length}</div>
                  <div className="text-xs text-muted-foreground">Étapes générées</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{generatedWorkflow.estimatedTime}</div>
                  <div className="text-xs text-muted-foreground">Temps estimé</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{generatedWorkflow.confidence}%</div>
                  <div className="text-xs text-muted-foreground">Confiance IA</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button onClick={saveWorkflow} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Tester
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Workflows */}
        {savedWorkflows.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Workflows Sauvegardés</CardTitle>
              <CardDescription>
                Vos workflows générés et sauvegardés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{workflow.name}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {workflow.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        <Badge>
                          <span className={getComplexityColor(workflow.complexity)}>
                            {workflow.complexity}
                          </span>
                        </Badge>
                        <Badge variant="outline">
                          <span className="text-xs">{workflow.steps.length} étapes</span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
