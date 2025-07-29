// 🚀 PHASE 6 - WORKFLOW BUILDER
import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Play, 
  Save, 
  Settings, 
  Zap,
  Clock,
  Database,
  Mail,
  Bell,
  GitBranch,
  Trash2,
  ArrowRight
} from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  from: string;
  to: string;
  condition?: string;
}

const TRIGGER_TYPES = [
  { id: 'entity_created', name: 'Entité créée', icon: Plus, description: 'Déclenché quand une nouvelle entité est créée' },
  { id: 'entity_updated', name: 'Entité modifiée', icon: Settings, description: 'Déclenché quand une entité est modifiée' },
  { id: 'schedule', name: 'Planifié', icon: Clock, description: 'Déclenché selon un planning' },
  { id: 'webhook', name: 'Webhook', icon: Database, description: 'Déclenché par un appel API externe' },
];

const ACTION_TYPES = [
  { id: 'send_email', name: 'Envoyer email', icon: Mail, description: 'Envoie un email personnalisé' },
  { id: 'send_notification', name: 'Notification', icon: Bell, description: 'Envoie une notification système' },
  { id: 'update_field', name: 'Mettre à jour', icon: Database, description: 'Met à jour un champ en base' },
  { id: 'create_task', name: 'Créer tâche', icon: Plus, description: 'Crée une nouvelle tâche' },
];

export function WorkflowBuilder() {
  const { toast } = useToast();
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowType, setWorkflowType] = useState("");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const addNode = useCallback((type: 'trigger' | 'action' | 'condition', nodeType: string) => {
    const nodeData = type === 'trigger' 
      ? TRIGGER_TYPES.find(t => t.id === nodeType)
      : ACTION_TYPES.find(a => a.id === nodeType);

    if (!nodeData) return;

    const newNode: WorkflowNode = {
      id: `${type}_${Date.now()}`,
      type,
      title: nodeData.name,
      config: { type: nodeType },
      position: { 
        x: 100 + (nodes.length * 200), 
        y: 100 + (Math.floor(nodes.length / 3) * 150) 
      }
    };

    setNodes(prev => [...prev, newNode]);
  }, [nodes.length]);

  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const updateNodeConfig = useCallback((nodeId: string, config: Record<string, unknown>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, config: { ...node.config, ...config } }
        : node
    ));
  }, []);

  const saveWorkflow = async () => {
    if (!workflowName.trim() || !workflowType || nodes.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs et ajouter au moins un nœud",
        variant: "destructive"
      });
      return;
    }

    try {
      const triggerNode = nodes.find(n => n.type === 'trigger');
      const actionNodes = nodes.filter(n => n.type === 'action');

      if (!triggerNode) {
        toast({
          title: "Erreur",
          description: "Un déclencheur est requis",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('workflows')
        .insert({
          name: workflowName,
          description: workflowDescription,
          workflow_type: workflowType,
          status: 'draft',
          trigger_config: triggerNode.config as unknown,
          actions_config: actionNodes.map(node => node.config) as unknown,
          conditions_config: {
            nodes: nodes.filter(n => n.type === 'condition').map(n => n.config),
            connections: connections.map(c => ({
              from: c.from,
              to: c.to,
              condition: c.condition || null
            }))
          } as unknown
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Workflow sauvegardé avec succès",
      });

      // Reset form
      setWorkflowName("");
      setWorkflowDescription("");
      setWorkflowType("");
      setNodes([]);
      setConnections([]);
      setSelectedNode(null);

    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le workflow",
        variant: "destructive"
      });
    }
  };

  const NodeComponent = React.memo(({ node }: { node: WorkflowNode }) => {
    const IconComponent = node.type === 'trigger' 
      ? TRIGGER_TYPES.find(t => t.id === node.config.type)?.icon || Zap
      : ACTION_TYPES.find(a => a.id === node.config.type)?.icon || Settings;

    const handleNodeClick = useCallback(() => {
      setSelectedNode(node.id);
    }, [node.id]);

    const handleRemoveClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      removeNode(node.id);
    }, [node.id]);

    return (
      <div
        className={`
          relative p-4 bg-card border rounded-lg shadow-sm cursor-pointer
          transition-all duration-200 hover:shadow-md hover:scale-105
          ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}
          ${node.type === 'trigger' ? 'border-green-500' : ''}
          ${node.type === 'action' ? 'border-blue-500' : ''}
          ${node.type === 'condition' ? 'border-orange-500' : ''}
        `}
        style={{ 
          position: 'absolute',
          left: node.position.x,
          top: node.position.y,
          width: '180px'
        }}
        onClick={handleNodeClick}
      >
        <div className="flex items-center space-x-2 mb-2">
          <IconComponent className="h-4 w-4" />
          <span className="text-sm font-medium truncate">{node.title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveClick}
            className="ml-auto h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        <Badge variant="outline" className="text-xs">
          {node.type}
        </Badge>
      </div>
    );
  });

  const renderNodeProperties = () => {
    if (!selectedNode) {
      return (
        <div className="text-center py-8">
          <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            Sélectionnez un nœud pour configurer ses propriétés
          </p>
        </div>
      );
    }

    const node = nodes.find(n => n.id === selectedNode);
    if (!node) {
      return (
        <div className="text-center py-8">
          <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            Nœud introuvable
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="font-medium mb-2">{node.title}</h4>
        <div className="space-y-3">
          {node.type === 'trigger' && node.config.type === 'schedule' && (
            <div>
              <Label>Expression Cron</Label>
              <Input
                placeholder="0 9 * * *"
                value={node.config.cron || ''}
                onChange={(e) => updateNodeConfig(node.id, { cron: e.target.value })}
              />
            </div>
          )}
          
          {node.type === 'action' && node.config.type === 'send_email' && (
            <>
              <div>
                <Label>Destinataire</Label>
                <Input
                  placeholder="email@example.com"
                  value={node.config.to || ''}
                  onChange={(e) => updateNodeConfig(node.id, { to: e.target.value })}
                />
              </div>
              <div>
                <Label>Sujet</Label>
                <Input
                  placeholder="Sujet de l'email"
                  value={node.config.subject || ''}
                  onChange={(e) => updateNodeConfig(node.id, { subject: e.target.value })}
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Contenu du message..."
                  value={node.config.message || ''}
                  onChange={(e) => updateNodeConfig(node.id, { message: e.target.value })}
                  rows={4}
                />
              </div>
            </>
          )}

          {node.type === 'action' && node.config.type === 'send_notification' && (
            <>
              <div>
                <Label>Titre</Label>
                <Input
                  placeholder="Titre de la notification"
                  value={node.config.title || ''}
                  onChange={(e) => updateNodeConfig(node.id, { title: e.target.value })}
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Contenu de la notification..."
                  value={node.config.message || ''}
                  onChange={(e) => updateNodeConfig(node.id, { message: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <GitBranch className="h-6 w-6" />
            <span>Créateur de Workflow</span>
          </h2>
          <p className="text-muted-foreground">
            Interface drag & drop pour créer des workflows personnalisés
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Tester
          </Button>
          <Button onClick={saveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Configuration */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workflow-name">Nom du workflow</Label>
                <Input
                  id="workflow-name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Mon workflow personnalisé"
                />
              </div>

              <div>
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Description du workflow..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="workflow-type">Type</Label>
                <Select value={workflowType} onValueChange={setWorkflowType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Projet</SelectItem>
                    <SelectItem value="invoice">Facture</SelectItem>
                    <SelectItem value="hr">RH</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Palette d'outils */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outils</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="triggers" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="triggers">Déclencheurs</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="triggers" className="space-y-2">
                  {TRIGGER_TYPES.map((trigger) => (
                    <Button
                      key={trigger.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => addNode('trigger', trigger.id)}
                    >
                      <div className="flex flex-col items-start space-y-1">
                        <div className="flex items-center space-x-2">
                          <trigger.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{trigger.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground text-left">
                          {trigger.description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="actions" className="space-y-2">
                  {ACTION_TYPES.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => addNode('action', action.id)}
                    >
                      <div className="flex flex-col items-start space-y-1">
                        <div className="flex items-center space-x-2">
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{action.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground text-left">
                          {action.description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Canvas de design */}
        <div className="col-span-6">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="text-lg">Canvas de design</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[520px] overflow-auto bg-muted/10 border-t">
                {nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      <GitBranch className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="text-lg font-medium">Canvas vide</h3>
                      <p className="text-muted-foreground">
                        Ajoutez des déclencheurs et actions depuis la palette
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {nodes.map((node) => (
                      <NodeComponent key={node.id} node={node} />
                    ))}
                    
                    {/* Connexions simplifiées */}
                    {nodes.length > 1 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {nodes.slice(0, -1).map((node, index) => {
                          const nextNode = nodes[index + 1];
                          return (
                            <div
                              key={`connection-${node.id}-${nextNode.id}`}
                              className="absolute flex items-center"
                              style={{
                                left: node.position.x + 180,
                                top: node.position.y + 30,
                                width: Math.max(20, nextNode.position.x - node.position.x - 180),
                              }}
                            >
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 h-px bg-border ml-2" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Propriétés */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Propriétés</CardTitle>
            </CardHeader>
            <CardContent>
              {renderNodeProperties()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}