import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Settings, 
  Plus, 
  Trash2, 
  Clock, 
  Bell,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Filter,
  Target,
  Calendar,
  Users,
  Mail
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    config: any;
  };
  actions: {
    type: 'notification' | 'task_creation' | 'assignment' | 'email' | 'status_update';
    config: any;
  }[];
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  executionCount: number;
}

interface WorkflowAutomationProps {
  className?: string;
}

export default function WorkflowAutomation({ className }: WorkflowAutomationProps) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    description: '',
    trigger: { type: 'event', config: {} },
    actions: [],
    enabled: true
  });

  // Initialiser avec des règles par défaut
  useEffect(() => {
    const defaultRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Rappel deadline projet',
        description: 'Notifier l\'équipe 3 jours avant l\'échéance',
        trigger: {
          type: 'schedule',
          config: { pattern: 'daily', time: '09:00' }
        },
        actions: [
          {
            type: 'notification',
            config: { message: 'Deadline approche pour {{project.name}}', recipients: 'team' }
          }
        ],
        enabled: true,
        executionCount: 15,
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Auto-assignment nouvelles tâches',
        description: 'Assigner automatiquement selon la charge de travail',
        trigger: {
          type: 'event',
          config: { event: 'task_created', conditions: { priority: 'high' } }
        },
        actions: [
          {
            type: 'assignment',
            config: { strategy: 'least_loaded', department: 'development' }
          },
          {
            type: 'notification',
            config: { message: 'Nouvelle tâche assignée: {{task.title}}' }
          }
        ],
        enabled: true,
        executionCount: 8,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Rapport hebdomadaire',
        description: 'Générer et envoyer le rapport de performance',
        trigger: {
          type: 'schedule',
          config: { pattern: 'weekly', day: 'friday', time: '17:00' }
        },
        actions: [
          {
            type: 'email',
            config: { 
              template: 'weekly_report', 
              recipients: ['management@arcadis.tech'],
              attachments: ['performance_metrics.pdf']
            }
          }
        ],
        enabled: false,
        executionCount: 12,
        nextRun: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      }
    ];
    
    setRules(defaultRules);
  }, []);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const addAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [
        ...(prev.actions || []),
        { type: 'notification', config: {} }
      ]
    }));
  };

  const removeAction = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index) || []
    }));
  };

  const saveRule = () => {
    if (newRule.name && newRule.description) {
      const rule: AutomationRule = {
        id: Date.now().toString(),
        name: newRule.name,
        description: newRule.description,
        trigger: newRule.trigger!,
        actions: newRule.actions || [],
        enabled: newRule.enabled || false,
        executionCount: 0
      };
      
      setRules(prev => [...prev, rule]);
      setNewRule({
        name: '',
        description: '',
        trigger: { type: 'event', config: {} },
        actions: [],
        enabled: true
      });
      setIsCreating(false);
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule': return Clock;
      case 'event': return Zap;
      case 'condition': return Filter;
      default: return Settings;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'notification': return Bell;
      case 'task_creation': return Plus;
      case 'assignment': return Users;
      case 'email': return Mail;
      case 'status_update': return CheckCircle;
      default: return Target;
    }
  };

  const formatNextRun = (date?: Date) => {
    if (!date) return 'Non programmé';
    
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Dans ${hours}h`;
    return 'Bientôt';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Automation des Workflows
            </CardTitle>
            <CardDescription>
              Configurez des règles automatiques pour vos processus
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle règle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Règles existantes */}
        <div className="space-y-4">
          {rules.map((rule) => {
            const TriggerIcon = getTriggerIcon(rule.trigger.type);
            
            return (
              <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                        {rule.enabled ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TriggerIcon className="h-3 w-3" />
                        {rule.trigger.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {rule.actions.length} action{rule.actions.length > 1 ? 's' : ''}
                      </div>
                      <div>Exécuté {rule.executionCount} fois</div>
                      {rule.nextRun && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatNextRun(rule.nextRun)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Actions preview */}
                <div className="flex items-center gap-2 flex-wrap">
                  {rule.actions.map((action, index) => {
                    const ActionIcon = getActionIcon(action.type);
                    return (
                      <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                        <ActionIcon className="h-3 w-3" />
                        {action.type.replace('_', ' ')}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Création de nouvelle règle */}
        {isCreating && (
          <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 space-y-4">
            <h4 className="font-semibold">Créer une nouvelle règle</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Nom de la règle</Label>
                <Input
                  id="rule-name"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Notification deadline"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule-trigger">Type de déclencheur</Label>
                <Select 
                  value={newRule.trigger?.type}
                  onValueChange={(value) => setNewRule(prev => ({
                    ...prev,
                    trigger: { type: value as any, config: {} }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">Planification</SelectItem>
                    <SelectItem value="event">Événement</SelectItem>
                    <SelectItem value="condition">Condition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rule-description">Description</Label>
              <Input
                id="rule-description"
                value={newRule.description || ''}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez ce que fait cette règle..."
              />
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Actions à exécuter</Label>
                <Button onClick={addAction} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              
              {newRule.actions?.map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Select 
                    value={action.type}
                    onValueChange={(value) => {
                      const updatedActions = [...(newRule.actions || [])];
                      updatedActions[index] = { ...action, type: value as any };
                      setNewRule(prev => ({ ...prev, actions: updatedActions }));
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="task_creation">Créer tâche</SelectItem>
                      <SelectItem value="assignment">Assignation</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="status_update">Mise à jour statut</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1">Configuration automatique</span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newRule.enabled}
                  onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, enabled: checked }))}
                />
                <Label>Activer immédiatement</Label>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
                <Button onClick={saveRule} disabled={!newRule.name || !newRule.description}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Créer la règle
                </Button>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{rules.length}</div>
            <div className="text-sm text-muted-foreground">Règles totales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {rules.filter(r => r.enabled).length}
            </div>
            <div className="text-sm text-muted-foreground">Actives</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {rules.reduce((sum, r) => sum + r.executionCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Exécutions</div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}