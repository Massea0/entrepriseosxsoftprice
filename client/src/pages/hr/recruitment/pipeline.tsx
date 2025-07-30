import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult 
} from '@hello-pangea/dnd';
import { 
  ArrowLeft,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  Star,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  Plus,
  Zap,
  TrendingUp,
  UserCheck,
  UserX,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  job_id: string;
  job_title: string;
  application_date: string;
  status: string;
  rating?: number;
  notes_count: number;
  attachments_count: number;
  experience_years: number;
  skills_match: number;
  next_interview?: {
    date: string;
    type: string;
  };
}

interface PipelineStage {
  id: string;
  title: string;
  color: string;
  candidates: Candidate[];
}

const PIPELINE_STAGES = [
  { id: 'new', title: 'Nouvelles', color: 'bg-gray-500' },
  { id: 'screening', title: 'Présélection', color: 'bg-blue-500' },
  { id: 'interview_1', title: 'Entretien RH', color: 'bg-purple-500' },
  { id: 'interview_2', title: 'Entretien Technique', color: 'bg-indigo-500' },
  { id: 'interview_3', title: 'Entretien Final', color: 'bg-orange-500' },
  { id: 'offer', title: 'Offre', color: 'bg-green-500' },
  { id: 'hired', title: 'Embauché', color: 'bg-green-600' },
  { id: 'rejected', title: 'Refusé', color: 'bg-red-500' }
];

export default function RecruitmentPipeline() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Charger les candidats
  const { data: candidates, isLoading } = useQuery({
    queryKey: ['recruitment-candidates', jobFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (jobFilter !== 'all') params.append('job_id', jobFilter);
      
      const response = await fetch(`/api/recruitment/candidates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch candidates');
      return response.json() as Promise<Candidate[]>;
    }
  });

  // Charger les offres d'emploi actives pour le filtre
  const { data: activeJobs } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const response = await fetch('/api/recruitment/jobs?status=published');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    }
  });

  // Mutation pour déplacer un candidat
  const moveCandidate = useMutation({
    mutationFn: async ({ candidateId, newStatus }: { candidateId: string; newStatus: string }) => {
      const response = await fetch(`/api/recruitment/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update candidate status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-candidates'] });
    }
  });

  // Organiser les candidats par étape
  const pipelineStages: PipelineStage[] = PIPELINE_STAGES.map(stage => ({
    ...stage,
    candidates: (candidates || [])
      .filter(candidate => 
        candidate.status === stage.id &&
        (searchTerm === '' || 
         candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         candidate.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  }));

  // Statistiques
  const stats = {
    total: candidates?.length || 0,
    newThisWeek: candidates?.filter(c => {
      const appDate = new Date(c.application_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appDate > weekAgo;
    }).length || 0,
    inProcess: candidates?.filter(c => 
      !['new', 'hired', 'rejected'].includes(c.status)
    ).length || 0,
    avgTimeInPipeline: 12 // Mock
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceStageId = result.source.droppableId;
    const destStageId = result.destination.droppableId;
    const candidateId = result.draggableId;

    if (sourceStageId === destStageId) return;

    moveCandidate.mutate({
      candidateId,
      newStatus: destStageId
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={cn(
          "h-3 w-3",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/hr/recruitment">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Pipeline de Recrutement</h1>
            <p className="text-muted-foreground">
              Gérez vos candidats à travers les étapes du processus
            </p>
          </div>
        </div>
        
        <Link to="/hr/recruitment/import">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Importer CV
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">dans le pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.newThisWeek}</div>
            <p className="text-xs text-muted-foreground">cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.inProcess}</div>
            <p className="text-xs text-muted-foreground">en entretien</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTimeInPipeline}j</div>
            <p className="text-xs text-muted-foreground">dans le pipeline</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommandation IA */}
      <Alert className="border-purple-200 bg-purple-50">
        <Zap className="h-4 w-4 text-purple-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-purple-900">Analyse IA du Pipeline</p>
              <p className="text-sm">
                3 candidats en "Entretien RH" depuis plus de 5 jours. 
                Recommandation: planifier les prochaines étapes rapidement.
              </p>
            </div>
            <Button size="sm" variant="outline" className="ml-4">
              Voir détails
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un candidat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Toutes les offres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les offres</SelectItem>
                {activeJobs?.map((job: any) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 overflow-x-auto min-h-[600px]">
          {pipelineStages.map((stage) => (
            <div key={stage.id} className="min-w-[300px]">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                    <h3 className="font-semibold">{stage.title}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stage.candidates.length}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "space-y-2 min-h-[500px] p-2 rounded-lg transition-colors",
                      snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50"
                    )}
                  >
                    {stage.candidates.map((candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "bg-white p-4 rounded-lg shadow-sm border transition-all",
                              snapshot.isDragging ? "shadow-lg rotate-2" : "hover:shadow-md"
                            )}
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={candidate.avatar_url} />
                                    <AvatarFallback>
                                                                              {candidate.name 
                                          ? candidate.name.split(' ').map(n => n[0]).join('')
                                          : 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <Link 
                                      to={`/hr/recruitment/candidates/${candidate.id}`}
                                      className="font-medium hover:text-primary transition-colors"
                                    >
                                      {candidate.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                      {candidate.job_title}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {candidate.rating && (
                                <div className="flex items-center gap-1">
                                  {getRatingStars(candidate.rating)}
                                </div>
                              )}

                              <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3" />
                                  <span>{candidate.experience_years} ans d'exp.</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{candidate.skills_match}% match</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {format(new Date(candidate.application_date), 'dd MMM', { locale: fr })}
                                  </span>
                                </div>
                              </div>

                              {candidate.next_interview && (
                                <Alert className="p-2">
                                  <AlertDescription className="text-xs">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {candidate.next_interview.type} - {' '}
                                        {format(new Date(candidate.next_interview.date), 'dd/MM à HH:mm', { locale: fr })}
                                      </span>
                                    </div>
                                  </AlertDescription>
                                </Alert>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {candidate.notes_count}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {candidate.attachments_count}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions Recommandées</CardTitle>
          <CardDescription>
            Basées sur l'analyse IA du pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Relancer 5 candidats</p>
                    <p className="text-sm text-muted-foreground">
                      En attente depuis plus de 7 jours
                    </p>
                  </div>
                  <Button size="sm">
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Planifier entretiens</p>
                    <p className="text-sm text-muted-foreground">
                      3 candidats présélectionnés
                    </p>
                  </div>
                  <Button size="sm">
                    Planifier
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Exporter rapport</p>
                    <p className="text-sm text-muted-foreground">
                      Pipeline de ce mois
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Exporter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}