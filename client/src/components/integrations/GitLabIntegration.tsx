import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  Users, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Bug,
  AlertTriangle,
  Zap,
  Settings,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

interface GitLabProject {
  id: number;
  name: string;
  description: string;
  web_url: string;
  default_branch: string;
  star_count: number;
  forks_count: number;
  last_activity_at: string;
  visibility: 'private' | 'public' | 'internal';
}

interface GitLabMergeRequest {
  id: number;
  title: string;
  description: string;
  state: 'opened' | 'closed' | 'merged';
  source_branch: string;
  target_branch: string;
  author: {
    name: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  web_url: string;
}

interface GitLabIssue {
  id: number;
  title: string;
  description: string;
  state: 'opened' | 'closed';
  labels: string[];
  author: {
    name: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  web_url: string;
}

interface GitLabPipeline {
  id: number;
  status: 'running' | 'pending' | 'success' | 'failed' | 'canceled' | 'skipped';
  ref: string;
  created_at: string;
  updated_at: string;
  web_url: string;
}

interface GitLabIntegrationProps {
  className?: string;
  onConnect?: (token: string, url: string) => Promise<boolean>;
  onDisconnect?: () => Promise<void>;
  isConnected?: boolean;
  projectId?: string;
}

export const GitLabIntegration = memo(function GitLabIntegration({
  className,
  onConnect,
  onDisconnect,
  isConnected = false,
  projectId
}: GitLabIntegrationProps) {
  const [gitlabToken, setGitlabToken] = useState('');
  const [gitlabUrl, setGitlabUrl] = useState('https://gitlab.com');
  const [projects, setProjects] = useState<GitLabProject[]>([]);
  const [mergeRequests, setMergeRequests] = useState<GitLabMergeRequest[]>([]);
  const [issues, setIssues] = useState<GitLabIssue[]>([]);
  const [pipelines, setPipelines] = useState<GitLabPipeline[]>([]);
  const [selectedProject, setSelectedProject] = useState<GitLabProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Mock data pour démonstration
  useEffect(() => {
    if (isConnected) {
      // Simuler le chargement de données GitLab
      const mockProjects: GitLabProject[] = [
        {
          id: 1,
          name: 'enterprise-frontend',
          description: 'Application frontend React pour la plateforme enterprise',
          web_url: 'https://gitlab.com/arcadis/enterprise-frontend',
          default_branch: 'main',
          star_count: 12,
          forks_count: 3,
          last_activity_at: new Date().toISOString(),
          visibility: 'private'
        },
        {
          id: 2,
          name: 'api-backend',
          description: 'API backend Node.js avec Express et PostgreSQL',
          web_url: 'https://gitlab.com/arcadis/api-backend',
          default_branch: 'main',
          star_count: 8,
          forks_count: 2,
          last_activity_at: new Date(Date.now() - 86400000).toISOString(),
          visibility: 'private'
        }
      ];

      const mockMergeRequests: GitLabMergeRequest[] = [
        {
          id: 101,
          title: 'feat: Add performance optimization components',
          description: 'Implementation of PerformanceOptimizer and DynamicWidget components',
          state: 'opened',
          source_branch: 'feature/performance-components',
          target_branch: 'main',
          author: {
            name: 'Mamadou Diouf',
            avatar_url: '/placeholder.svg'
          },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 1800000).toISOString(),
          web_url: 'https://gitlab.com/arcadis/enterprise-frontend/-/merge_requests/101'
        },
        {
          id: 102,
          title: 'fix: Resolve GitLab integration authentication',
          description: 'Fixed token validation and API connection issues',
          state: 'merged',
          source_branch: 'bugfix/gitlab-auth',
          target_branch: 'main',
          author: {
            name: 'Sarah Johnson',
            avatar_url: '/placeholder.svg'
          },
          created_at: new Date(Date.now() - 7200000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          web_url: 'https://gitlab.com/arcadis/enterprise-frontend/-/merge_requests/102'
        }
      ];

      const mockIssues: GitLabIssue[] = [
        {
          id: 201,
          title: 'Performance bottleneck in dashboard loading',
          description: 'Dashboard takes too long to load when there are many widgets',
          state: 'opened',
          labels: ['bug', 'performance', 'high-priority'],
          author: {
            name: 'Tech Team',
            avatar_url: '/placeholder.svg'
          },
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 43200000).toISOString(),
          web_url: 'https://gitlab.com/arcadis/enterprise-frontend/-/issues/201'
        }
      ];

      const mockPipelines: GitLabPipeline[] = [
        {
          id: 301,
          status: 'success',
          ref: 'main',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          updated_at: new Date(Date.now() - 900000).toISOString(),
          web_url: 'https://gitlab.com/arcadis/enterprise-frontend/-/pipelines/301'
        },
        {
          id: 302,
          status: 'running',
          ref: 'feature/performance-components',
          created_at: new Date(Date.now() - 600000).toISOString(),
          updated_at: new Date(Date.now() - 300000).toISOString(),
          web_url: 'https://gitlab.com/arcadis/enterprise-frontend/-/pipelines/302'
        }
      ];

      setProjects(mockProjects);
      setMergeRequests(mockMergeRequests);
      setIssues(mockIssues);
      setPipelines(mockPipelines);
      setSelectedProject(mockProjects[0]);
      setLastSync(new Date());
    }
  }, [isConnected]);

  const handleConnect = async () => {
    if (!gitlabToken || !gitlabUrl) return;
    
    setIsLoading(true);
    try {
      const success = await onConnect?.(gitlabToken, gitlabUrl);
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
      setMergeRequests([]);
      setIssues([]);
      setPipelines([]);
      setSelectedProject(null);
      setLastSync(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'merged':
      case 'closed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'running':
      case 'opened':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'merged':
        return CheckCircle;
      case 'failed':
        return XCircle;
      case 'running':
        return RefreshCw;
      case 'pending':
        return Clock;
      default:
        return Activity;
    }
  };

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
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <GitBranch className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">GitLab Integration</h3>
              <p className="text-muted-foreground">Connectez votre instance GitLab pour synchroniser vos projets</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="gitlab-url">URL de l'instance GitLab</Label>
              <Input
                id="gitlab-url"
                value={gitlabUrl}
                onChange={(e) => setGitlabUrl(e.target.value)}
                placeholder="https://gitlab.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="gitlab-token">Token d'accès personnel</Label>
              <Input
                id="gitlab-token"
                type="password"
                value={gitlabToken}
                onChange={(e) => setGitlabToken(e.target.value)}
                placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Créez un token avec les permissions: api, read_user, read_repository
              </p>
            </div>

            <Button 
              onClick={handleConnect}
              disabled={!gitlabToken || !gitlabUrl || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <GitBranch className="h-4 w-4 mr-2" />
              )}
              Se connecter à GitLab
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
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <GitBranch className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">GitLab Integration</h3>
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
                <Code className="h-5 w-5" />
                {selectedProject.name}
              </h4>
              <p className="text-muted-foreground mt-1">{selectedProject.description}</p>
            </div>
            
            <Button variant="outline" size="sm" asChild>
              <a href={selectedProject.web_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir sur GitLab
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Stars', value: selectedProject.star_count, icon: '⭐' },
              { label: 'Forks', value: selectedProject.forks_count, icon: '🍴' },
              { label: 'Branch', value: selectedProject.default_branch, icon: '🌿' },
              { label: 'Visibilité', value: selectedProject.visibility, icon: '👁️' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 bg-background/50 rounded-lg"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-lg font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </InteractiveCard>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="merge-requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="merge-requests">
            <GitMerge className="h-4 w-4 mr-2" />
            Merge Requests
          </TabsTrigger>
          <TabsTrigger value="issues">
            <Bug className="h-4 w-4 mr-2" />
            Issues
          </TabsTrigger>
          <TabsTrigger value="pipelines">
            <Zap className="h-4 w-4 mr-2" />
            Pipelines
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Code className="h-4 w-4 mr-2" />
            Projets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="merge-requests" className="space-y-4">
          <AnimatePresence>
            {mergeRequests.map((mr, index) => {
              const StatusIcon = getStatusIcon(mr.state);
              return (
                <motion.div
                  key={mr.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon className="h-4 w-4" />
                          <h4 className="font-medium">{mr.title}</h4>
                          <Badge variant="outline" className={getStatusColor(mr.state)}>
                            {mr.state}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{mr.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {mr.source_branch} → {mr.target_branch}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {mr.author.name}
                          </span>
                          <span>{new Date(mr.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" asChild>
                        <a href={mr.web_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <AnimatePresence>
            {issues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Bug className="h-4 w-4" />
                        <h4 className="font-medium">{issue.title}</h4>
                        <Badge variant="outline" className={getStatusColor(issue.state)}>
                          {issue.state}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {issue.labels.map(label => (
                          <Badge key={label} variant="secondary" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {issue.author.name}
                        </span>
                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href={issue.web_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <AnimatePresence>
            {pipelines.map((pipeline, index) => {
              const StatusIcon = getStatusIcon(pipeline.status);
              return (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={cn(
                          "h-5 w-5",
                          pipeline.status === 'running' && "animate-spin"
                        )} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Pipeline #{pipeline.id}</span>
                            <Badge variant="outline" className={getStatusColor(pipeline.status)}>
                              {pipeline.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Branch: {pipeline.ref} • {new Date(pipeline.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" asChild>
                        <a href={pipeline.web_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
                        <Code className="h-5 w-5" />
                        <h4 className="font-medium">{project.name}</h4>
                      </div>
                      
                      <Badge variant="outline" className={getStatusColor(project.visibility)}>
                        {project.visibility}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>⭐ {project.star_count}</span>
                        <span>🍴 {project.forks_count}</span>
                      </div>
                      <span>{new Date(project.last_activity_at).toLocaleDateString()}</span>
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

export default GitLabIntegration;