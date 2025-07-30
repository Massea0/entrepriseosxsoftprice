import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckSquare, 
  Circle, 
  Square, 
  Users, 
  Calendar,

  Bug,
  Lightbulb,
  AlertTriangle,
  Clock,
  Activity,
  Settings,
  RefreshCw,
  ExternalLink,
  User,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description: string;
  status: {
    name: string;
    category: 'new' | 'indeterminate' | 'done';
  };
  priority: {
    name: string;
    level: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  };
  issueType: {
    name: string;
    iconUrl: string;
  };
  assignee: {
    displayName: string;
    avatarUrls: {
      '48x48': string;
    };
  } | null;
  reporter: {
    displayName: string;
    avatarUrls: {
      '48x48': string;
    };
  };
  created: string;
  updated: string;
  dueDate: string | null;
  project: {
    key: string;
    name: string;
  };
}

interface JiraProject {
  id: string;
  key: string;
  name: string;
  description: string;
  projectTypeKey: string;
  lead: {
    displayName: string;
  };
  issueTypes: Array<{
    id: string;
    name: string;
    iconUrl: string;
  }>;
}

interface JiraIntegrationProps {
  className?: string;
  onConnect?: (url: string, email: string, token: string) => Promise<boolean>;
  onDisconnect?: () => Promise<void>;
  isConnected?: boolean;
  projectKey?: string;
}

export const JiraIntegration = memo(function JiraIntegration({
  className,
  onConnect,
  onDisconnect,
  isConnected = false,
  projectKey
}: JiraIntegrationProps) {
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [selectedProject, setSelectedProject] = useState<JiraProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data pour démonstration
  useEffect(() => {
    if (isConnected) {
      const mockProjects: JiraProject[] = [
        {
          id: '10000',
          key: 'ARC',
          name: 'Arcadis Enterprise OS',
          description: 'Plateforme de gestion d\'entreprise avec IA',
          projectTypeKey: 'software',
          lead: {
            displayName: 'Mamadou Diouf'
          },
          issueTypes: [
            { id: '1', name: 'Bug', iconUrl: '/placeholder.svg' },
            { id: '2', name: 'Story', iconUrl: '/placeholder.svg' },
            { id: '3', name: 'Task', iconUrl: '/placeholder.svg' },
            { id: '4', name: 'Epic', iconUrl: '/placeholder.svg' }
          ]
        },
        {
          id: '10001',
          key: 'HRM',
          name: 'HR Management Module',
          description: 'Module de gestion des ressources humaines',
          projectTypeKey: 'software',
          lead: {
            displayName: 'Sarah Johnson'
          },
          issueTypes: [
            { id: '1', name: 'Bug', iconUrl: '/placeholder.svg' },
            { id: '2', name: 'Story', iconUrl: '/placeholder.svg' },
            { id: '3', name: 'Task', iconUrl: '/placeholder.svg' }
          ]
        }
      ];

      const mockIssues: JiraIssue[] = [
        {
          id: '10001',
          key: 'ARC-123',
          summary: 'Optimiser les performances du dashboard admin',
          description: 'Le dashboard admin charge lentement avec beaucoup de widgets. Implémenter lazy loading et optimisation mémoire.',
          status: {
            name: 'In Progress',
            category: 'indeterminate'
          },
          priority: {
            name: 'High',
            level: 'high'
          },
          issueType: {
            name: 'Story',
            iconUrl: '/placeholder.svg'
          },
          assignee: {
            displayName: 'Mamadou Diouf',
            avatarUrls: {
              '48x48': '/placeholder.svg'
            }
          },
          reporter: {
            displayName: 'Product Owner',
            avatarUrls: {
              '48x48': '/placeholder.svg'
            }
          },
          created: new Date(Date.now() - 2 * 86400000).toISOString(),
          updated: new Date(Date.now() - 3600000).toISOString(),
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          project: {
            key: 'ARC',
            name: 'Arcadis Enterprise OS'
          }
        },
        {
          id: '10002',
          key: 'ARC-124',
          summary: 'Intégration GitLab avec synchronisation temps réel',
          description: 'Connecter l\'application avec GitLab pour synchroniser les projets, merge requests et pipelines.',
          status: {
            name: 'To Do',
            category: 'new'
          },
          priority: {
            name: 'Medium',
            level: 'medium'
          },
          issueType: {
            name: 'Epic',
            iconUrl: '/placeholder.svg'
          },
          assignee: {
            displayName: 'Dev Team',
            avatarUrls: {
              '48x48': '/placeholder.svg'
            }
          },
          reporter: {
            displayName: 'Mamadou Diouf',
            avatarUrls: {
              '48x48': '/placeholder.svg'
            }
          },
          created: new Date(Date.now() - 86400000).toISOString(),
          updated: new Date(Date.now() - 7200000).toISOString(),
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
          project: {
            key: 'ARC',
            name: 'Arcadis Enterprise OS'
          }
        },
        {
          id: '10003',
          key: 'ARC-125',
          summary: 'Bug: Dark mode icons not visible',
          description: 'En mode sombre, certains icônes ne sont pas visibles ou mal contrastés.',
          status: {
            name: 'Done',
            category: 'done'
          },
          priority: {
            name: 'Low',
            level: 'low'
          },
          issueType: {
            name: 'Bug',
            iconUrl: '/placeholder.svg'
          },
          assignee: {
            displayName: 'UI Designer',
            avatarUrls: {
              '48x48': '/placeholder.svg'
            }
          },
          reporter: {
            displayName: 'QA Team',
            avatarUrls: {
              '48x48': '/placeholder.svg'
            }
          },
          created: new Date(Date.now() - 3 * 86400000).toISOString(),
          updated: new Date(Date.now() - 86400000).toISOString(),
          dueDate: null,
          project: {
            key: 'ARC',
            name: 'Arcadis Enterprise OS'
          }
        }
      ];

      setProjects(mockProjects);
      setIssues(mockIssues);
      setSelectedProject(mockProjects[0]);
      setLastSync(new Date());
    }
  }, [isConnected]);

  const handleConnect = async () => {
    if (!jiraUrl || !jiraEmail || !jiraToken) return;
    
    setIsLoading(true);
    try {
      const success = await onConnect?.(jiraUrl, jiraEmail, jiraToken);
      if (success) {
        setLastSync(new Date());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await onDisconnect?.();
      setProjects([]);
      setIssues([]);
      setSelectedProject(null);
      setLastSync(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (category: string) => {
    switch (category) {
      case 'done':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'indeterminate':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'new':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'highest':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      case 'lowest':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (level: string) => {
    switch (level) {
      case 'highest':
      case 'high':
        return ArrowUp;
      case 'low':
      case 'lowest':
        return ArrowDown;
      default:
        return Minus;
    }
  };

  const getIssueTypeIcon = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case 'bug':
        return Bug;
      case 'story':
        return Lightbulb;
      case 'epic':
        return CheckSquare;
      case 'task':
        return Square;
      default:
        return Circle;
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filterStatus === 'all') return true;
    return issue.status.category === filterStatus;
  });

  if (!isConnected) {
    return (
      <motion.div
        className={cn('w-full', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InteractiveCard variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Jira Integration</h3>
              <p className="text-muted-foreground">Connectez votre instance Jira pour synchroniser vos tickets</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="jira-url">URL de l'instance Jira</Label>
              <Input
                id="jira-url"
                value={jiraUrl}
                onChange={(e) => setJiraUrl(e.target.value)}
                placeholder="https://votre-domaine.atlassian.net"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="jira-email">Email Atlassian</Label>
              <Input
                id="jira-email"
                type="email"
                value={jiraEmail}
                onChange={(e) => setJiraEmail(e.target.value)}
                placeholder="votre-email@domaine.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="jira-token">Token API Jira</Label>
              <Input
                id="jira-token"
                type="password"
                value={jiraToken}
                onChange={(e) => setJiraToken(e.target.value)}
                placeholder="ATATT3xFfGF0..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Créez un token API depuis les paramètres de sécurité Atlassian
              </p>
            </div>

            <Button 
              onClick={handleConnect}
              disabled={!jiraUrl || !jiraEmail || !jiraToken || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 " />
              ) : (
                <CheckSquare className="h-4 w-4 mr-2" />
              )}
              Se connecter à Jira
            </Button>
          </div>
        </InteractiveCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn('w-full space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <CheckSquare className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Jira Integration</h3>
            <p className="text-muted-foreground">
              Connecté • Dernière sync: {lastSync?.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastSync(new Date())}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
          >
            <Settings className="h-4 w-4 mr-2" />
            Déconnecter
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      {selectedProject && (
        <InteractiveCard variant="gradient" className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                {selectedProject.name}
              </h4>
              <p className="text-muted-foreground mt-1">{selectedProject.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Clé: {selectedProject.key}</span>
                <span>Lead: {selectedProject.lead.displayName}</span>
                <span>Type: {selectedProject.projectTypeKey}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir sur Jira
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { 
                label: 'Issues ouvertes', 
                value: issues.filter(i => i.status.category !== 'done').length, 
                icon: '📋',
                color: 'text-blue-600' 
              },
              { 
                label: 'En cours', 
                value: issues.filter(i => i.status.category === 'indeterminate').length, 
                icon: '⚡',
                color: 'text-orange-600' 
              },
              { 
                label: 'Terminées', 
                value: issues.filter(i => i.status.category === 'done').length, 
                icon: '✅',
                color: 'text-green-600' 
              },
              { 
                label: 'En retard', 
                value: issues.filter(i => i.dueDate && new Date(i.dueDate) < new Date()).length, 
                icon: '⏰',
                color: 'text-red-600' 
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 bg-background/50 rounded-lg"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </InteractiveCard>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="issues" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="issues">
              <CheckSquare className="h-4 w-4 mr-2" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Square className="h-4 w-4 mr-2" />
              Projets
            </TabsTrigger>
          </TabsList>

          {/* Filter buttons for issues */}
          <div className="flex items-center gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Toutes
            </Button>
            <Button
              variant={filterStatus === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('new')}
            >
              À faire
            </Button>
            <Button
              variant={filterStatus === 'indeterminate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('indeterminate')}
            >
              En cours
            </Button>
            <Button
              variant={filterStatus === 'done' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('done')}
            >
              Terminées
            </Button>
          </div>
        </div>

        <TabsContent value="issues" className="space-y-4">
          <AnimatePresence>
            {filteredIssues.map((issue, index) => {
              const IssueTypeIcon = getIssueTypeIcon(issue.issueType.name);
              const PriorityIcon = getPriorityIcon(issue.priority.level);
              
              return (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <IssueTypeIcon className="h-4 w-4" />
                          <span className="text-sm font-mono text-muted-foreground">{issue.key}</span>
                          <h4 className="font-medium">{issue.summary}</h4>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{issue.description}</p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline" className={getStatusColor(issue.status.category)}>
                            {issue.status.name}
                          </Badge>
                          
                          <div className={cn("flex items-center gap-1", getPriorityColor(issue.priority.level))}>
                            <PriorityIcon className="h-3 w-3" />
                            <span className="text-xs font-medium">{issue.priority.name}</span>
                          </div>
                          
                          {issue.assignee && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {issue.assignee.displayName}
                            </div>
                          )}
                          
                          {issue.dueDate && (
                            <div className={cn(
                              "flex items-center gap-1 text-xs",
                              new Date(issue.dueDate) < new Date() 
                                ? "text-red-600 dark:text-red-400" 
                                : "text-muted-foreground"
                            )}>
                              <Calendar className="h-3 w-3" />
                              {new Date(issue.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Créé: {new Date(issue.created).toLocaleDateString()}</span>
                          <span>Mis à jour: {new Date(issue.updated).toLocaleDateString()}</span>
                          <span>Projet: {issue.project.name}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredIssues.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune issue trouvée pour ce filtre</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={cn(
                      "p-4 cursor-pointer hover:shadow-md transition-all duration-200",
                      selectedProject?.id === project.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5" />
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <span className="text-sm text-muted-foreground">{project.key}</span>
                        </div>
                      </div>
                      
                      <Badge variant="outline">
                        {project.projectTypeKey}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Lead: {project.lead.displayName}</span>
                      <span>{project.issueTypes.length} types d'issues</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
});

export default JiraIntegration;