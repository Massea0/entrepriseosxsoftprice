import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  UserCheck,
  Activity,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react';
import { format, eachDayOfInterval, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  skills: string[];
  availability: number; // Pourcentage de disponibilité
  current_workload: number; // Pourcentage de charge actuelle
  tasks: Array<{
    id: string;
    title: string;
    hours: number;
    priority: string;
    due_date: string;
  }>;
}

interface ResourceAllocationProps {
  project: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    team_members: TeamMember[];
    tasks: Array<{
      id: string;
      title: string;
      assigned_to?: string;
      estimated_hours: number;
      actual_hours: number;
      status: string;
      priority: string;
    }>;
  };
}

export function ResourceAllocation({ project }: ResourceAllocationProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'workload'>('grid');

  // Calculer les statistiques globales
  const stats = useMemo(() => {
    const totalCapacity = project.team_members.reduce((acc, member) => 
      acc + (member.availability * 40), 0 // 40h par semaine
    );
    
    const totalAllocated = project.team_members.reduce((acc, member) => 
      acc + member.tasks.reduce((sum, task) => sum + task.hours, 0), 0
    );

    const overloadedMembers = project.team_members.filter(m => m.current_workload > 100).length;
    const underutilizedMembers = project.team_members.filter(m => m.current_workload < 50).length;

    return {
      totalCapacity,
      totalAllocated,
      utilizationRate: (totalAllocated / totalCapacity) * 100,
      overloadedMembers,
      underutilizedMembers,
      averageWorkload: project.team_members.reduce((acc, m) => acc + m.current_workload, 0) / project.team_members.length
    };
  }, [project]);

  // Obtenir les recommandations IA
  const getRecommendations = () => {
    const recommendations = [];

    if (stats.overloadedMembers > 0) {
      recommendations.push({
        type: 'warning',
        message: `${stats.overloadedMembers} membre(s) surchargé(s). Redistribuez les tâches.`,
        action: 'Équilibrer la charge'
      });
    }

    if (stats.underutilizedMembers > 2) {
      recommendations.push({
        type: 'info',
        message: `${stats.underutilizedMembers} membres sous-utilisés. Optimisez l'allocation.`,
        action: 'Assigner plus de tâches'
      });
    }

    if (stats.utilizationRate > 90) {
      recommendations.push({
        type: 'warning',
        message: 'Capacité presque maximale. Risque de retards.',
        action: 'Augmenter l\'équipe'
      });
    }

    return recommendations;
  };

  const getWorkloadColor = (workload: number) => {
    if (workload > 100) return 'text-red-600 bg-red-50';
    if (workload > 80) return 'text-orange-600 bg-orange-50';
    if (workload > 60) return 'text-yellow-600 bg-yellow-50';
    if (workload > 40) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getWorkloadStatus = (workload: number) => {
    if (workload > 100) return { label: 'Surchargé', color: 'destructive' };
    if (workload > 80) return { label: 'Chargé', color: 'warning' };
    if (workload > 60) return { label: 'Optimal', color: 'success' };
    if (workload > 40) return { label: 'Disponible', color: 'default' };
    return { label: 'Sous-utilisé', color: 'secondary' };
  };

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.team_members.length}</div>
            <p className="text-xs text-muted-foreground">membres actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Charge Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageWorkload)}%</div>
            <Progress value={stats.averageWorkload} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Utilisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.utilizationRate)}%</div>
            <p className="text-xs text-muted-foreground">de la capacité totale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-lg font-bold text-red-600">{stats.overloadedMembers}</div>
                <p className="text-xs text-muted-foreground">surchargés</p>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">{stats.underutilizedMembers}</div>
                <p className="text-xs text-muted-foreground">sous-utilisés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations IA */}
      {getRecommendations().length > 0 && (
        <Alert className="border-purple-200 bg-purple-50">
          <Zap className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-purple-900">Recommandations IA</p>
              {getRecommendations().map((rec, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm">{rec.message}</p>
                  <Button size="sm" variant="outline" className="ml-4">
                    {rec.action}
                  </Button>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Vue principale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Allocation des Ressources</CardTitle>
            <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <TabsList>
                <TabsTrigger value="grid">
                  <Users className="h-4 w-4 mr-2" />
                  Grille
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="workload">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Charge
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {project.team_members.map((member) => {
                const status = getWorkloadStatus(member.current_workload);
                
                return (
                  <Card 
                    key={member.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedMember === member.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedMember(member.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Badge variant={status.color as any}>
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Charge de travail</span>
                            <span className="font-medium">{member.current_workload}%</span>
                          </div>
                          <Progress 
                            value={member.current_workload} 
                            className={cn(
                              "h-2",
                              member.current_workload > 100 && "[&>div]:bg-red-500",
                              member.current_workload > 80 && member.current_workload <= 100 && "[&>div]:bg-orange-500"
                            )}
                          />
                        </div>

                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Disponibilité</span>
                            <span>{member.availability * 100}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tâches assignées</span>
                            <span>{member.tasks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Heures allouées</span>
                            <span>{member.tasks.reduce((sum, t) => sum + t.hours, 0)}h</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Compétences</p>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{member.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Vue timeline des allocations sur la durée du projet
              </p>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="space-y-3">
                  {project.team_members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4">
                      <div className="w-32 flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">{member.name}</span>
                      </div>
                      <div className="flex-1 h-12 bg-white rounded border relative">
                        {/* Simulation de timeline - à implémenter avec données réelles */}
                        <div 
                          className="absolute top-1 bottom-1 bg-blue-500 rounded opacity-60"
                          style={{
                            left: '10%',
                            width: `${member.current_workload * 0.8}%`
                          }}
                        />
                      </div>
                      <span className={cn("text-sm font-medium w-16 text-right", getWorkloadColor(member.current_workload))}>
                        {member.current_workload}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'workload' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Distribution de la Charge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.team_members
                        .sort((a, b) => b.current_workload - a.current_workload)
                        .map((member) => (
                          <div key={member.id} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{member.name}</span>
                              <span className={cn("font-bold", getWorkloadColor(member.current_workload))}>
                                {member.current_workload}%
                              </span>
                            </div>
                            <Progress value={member.current_workload} className="h-2" />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Heures par Priorité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['high', 'medium', 'low'].map((priority) => {
                        const hours = project.tasks
                          .filter(t => t.priority === priority)
                          .reduce((sum, t) => sum + t.estimated_hours, 0);
                        
                        return (
                          <div key={priority} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                priority === 'high' ? 'destructive' :
                                priority === 'medium' ? 'default' : 'secondary'
                              }>
                                {priority === 'high' ? 'Haute' :
                                 priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </Badge>
                            </div>
                            <span className="font-medium">{hours}h</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions d'optimisation */}
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <UserCheck className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Actions d'optimisation disponibles
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Équilibrer automatiquement
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Suggérer des renforts
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Replanifier les tâches
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}