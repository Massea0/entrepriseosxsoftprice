import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  Users,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  ChevronRight,
  FileText,
  UserCheck,
  UserX,
  BarChart3,
  Target,
  Zap,
  ArrowUpRight,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience_level: 'junior' | 'mid' | 'senior' | 'lead';
  status: 'draft' | 'published' | 'closed' | 'on_hold';
  created_at: string;
  published_at?: string;
  closing_date?: string;
  salary_min?: number;
  salary_max?: number;
  applications_count: number;
  views_count: number;
  shortlisted_count: number;
  description: string;
  requirements: string[];
  benefits: string[];
}

export default function Recruitment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Charger les offres d'emploi
  const { data: jobPostings, isLoading } = useQuery({
    queryKey: ['job-postings', statusFilter, departmentFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (departmentFilter !== 'all') params.append('department', departmentFilter);
      
      const response = await fetch(`/api/recruitment/jobs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch job postings');
      return response.json() as Promise<JobPosting[]>;
    }
  });

  // Statistiques de recrutement
  const { data: stats } = useQuery({
    queryKey: ['recruitment-stats'],
    queryFn: async () => {
      // Simuler les stats pour l'instant
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        activeJobs: 12,
        totalApplications: 287,
        shortlisted: 45,
        hired: 8,
        avgTimeToHire: 23,
        conversionRate: 2.8,
        topSources: [
          { source: 'LinkedIn', count: 124 },
          { source: 'Site web', count: 89 },
          { source: 'Indeed', count: 45 },
          { source: 'Référence', count: 29 }
        ]
      };
    }
  });

  // Mutation pour changer le statut d'une offre
  const updateJobStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/recruitment/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update job status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'closed': return 'outline';
      case 'on_hold': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publiée';
      case 'draft': return 'Brouillon';
      case 'closed': return 'Fermée';
      case 'on_hold': return 'En pause';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time': return 'Temps plein';
      case 'part_time': return 'Temps partiel';
      case 'contract': return 'Contrat';
      case 'internship': return 'Stage';
      default: return type;
    }
  };

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case 'junior': return 'Junior';
      case 'mid': return 'Intermédiaire';
      case 'senior': return 'Senior';
      case 'lead': return 'Lead';
      default: return level;
    }
  };

  const filteredJobs = jobPostings?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Recrutement
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos offres d'emploi et suivez les candidatures
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/hr/recruitment/pipeline">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Pipeline
            </Button>
          </Link>
          <Link to="/hr/recruitment/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Offre
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Offres Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
            <p className="text-xs text-muted-foreground">postes ouverts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Candidatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
            <p className="text-xs text-muted-foreground">cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Présélectionnés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.shortlisted || 0}</div>
            <p className="text-xs text-muted-foreground">candidats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Embauchés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.hired || 0}</div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Temps Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgTimeToHire || 0}j</div>
            <p className="text-xs text-muted-foreground">pour embaucher</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taux Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">candidatures → embauches</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommandation IA */}
      <Alert className="border-purple-200 bg-purple-50">
        <Zap className="h-4 w-4 text-purple-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-purple-900">Optimisation IA détectée</p>
              <p className="text-sm">L'offre "Développeur Senior React" pourrait attirer 40% plus de candidats avec des ajustements mineurs</p>
            </div>
            <Button size="sm" variant="outline" className="ml-4">
              Voir suggestions
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher une offre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publiées</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="closed">Fermées</SelectItem>
                <SelectItem value="on_hold">En pause</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">RH</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des offres */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune offre trouvée</p>
                <Link to="/hr/recruitment/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une offre
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/hr/recruitment/jobs/${job.id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span>{getTypeLabel(job.type)}</span>
                          <span>{getExperienceLabel(job.experience_level)}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {getStatusLabel(job.status)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{job.applications_count} candidatures</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{job.views_count} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          <span>{job.shortlisted_count} présélectionnés</span>
                        </div>
                        {job.closing_date && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Calendar className="h-4 w-4" />
                            <span>Ferme le {format(new Date(job.closing_date), 'dd MMM', { locale: fr })}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to={`/hr/recruitment/jobs/${job.id}/applications`}>
                          <Button variant="outline" size="sm">
                            Voir candidatures
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                        {job.status === 'draft' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateJobStatus.mutate({ id: job.id, status: 'published' })}
                          >
                            Publier
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Sources des candidatures */}
      {stats?.topSources && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sources des Candidatures</CardTitle>
            <CardDescription>
              D'où viennent vos meilleurs candidats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topSources.map((source, index) => {
                const percentage = (source.count / stats.totalApplications) * 100;
                return (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        index === 0 ? "bg-purple-100 text-purple-700" :
                        index === 1 ? "bg-blue-100 text-blue-700" :
                        index === 2 ? "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all",
                              index === 0 ? "bg-purple-500" :
                              index === 1 ? "bg-blue-500" :
                              index === 2 ? "bg-green-500" :
                              "bg-gray-500"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {source.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}