import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Brain,
  Upload,
  FileText,
  Star,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
  Send,
  Bot,
  MessageSquare,
  UserCheck,
  Filter,
  Download,
  Plus,
  Heart
} from 'lucide-react';
// import { supabase } // Migrated from Supabase to Express API

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  location: string;
  experience: number;
  education: string;
  skills: string[];
  score: number;
  aiAnalysis: {
    strengths: string[];
    concerns: string[];
    cultureFit: number;
    technicalFit: number;
    recommendation: 'highly_recommended' | 'recommended' | 'maybe' | 'no';
  };
  status: 'new' | 'screening' | 'interview' | 'test' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  resume?: string;
  coverLetter?: string;
  portfolio?: string;
  testResults?: {
    technical: number;
    personality: string;
    cognitive: number;
  };
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  candidates: Candidate[];
  status: 'draft' | 'active' | 'closed';
  postedDate: Date;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  icon: React.ElementType;
  candidates: Candidate[];
}

// Composant pour les candidats draggables
const DraggableCandidate = ({ candidate, onView }: { candidate: Candidate; onView: (c: Candidate) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{candidate.name}</p>
            <p className="text-xs text-muted-foreground">{candidate.position}</p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ 
            color: candidate.score >= 80 ? '#10B981' : candidate.score >= 60 ? '#F59E0B' : '#EF4444'
          }}
        >
          {candidate.score}%
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {candidate.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {candidate.experience} ans
        </span>
      </div>
      <div className="flex gap-1 mt-2">
        {candidate.aiAnalysis.recommendation === 'highly_recommended' && (
          <Badge className="text-xs bg-green-100 text-green-800">
            <Star className="h-3 w-3 mr-1" />
            Top
          </Badge>
        )}
        {candidate.skills.slice(0, 2).map((skill, idx) => (
          <Badge key={idx} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        className="w-full mt-2"
        onClick={(e) => {
          e.stopPropagation();
          onView(candidate);
        }}
      >
        Voir Profil
      </Button>
    </div>
  );
};

export const SmartRecruitment: React.FC = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadRecruitmentData();
  }, []);

  const loadRecruitmentData = async () => {
    // Simuler des données de recrutement
    const mockJobs: JobPosting[] = [
      {
        id: '1',
        title: 'Senior Full Stack Developer',
        department: 'Tech',
        location: 'Paris / Remote',
        type: 'CDI',
        experience: '5+ ans',
        salary: '60-80k€',
        description: 'Nous recherchons un développeur full stack expérimenté...',
        requirements: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        candidates: generateMockCandidates(12),
        status: 'active',
        postedDate: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Product Manager',
        department: 'Product',
        location: 'Lyon',
        type: 'CDI',
        experience: '3-5 ans',
        salary: '50-70k€',
        description: 'Rejoignez notre équipe produit dynamique...',
        requirements: ['Agile', 'Data Analysis', 'User Research'],
        candidates: generateMockCandidates(8),
        status: 'active',
        postedDate: new Date('2024-01-20')
      }
    ];

    setJobPostings(mockJobs);
    if (mockJobs.length > 0) {
      setSelectedJob(mockJobs[0]);
      updatePipelineStages(mockJobs[0].candidates);
    }
    setLoading(false);
  };

  const generateMockCandidates = (count: number): Candidate[] => {
    const names = [
      'Sophie Martin', 'Jean Dupont', 'Marie Bernard', 'Pierre Lefebvre',
      'Amélie Rousseau', 'Thomas Petit', 'Julie Moreau', 'Lucas Simon'
    ];
    const locations = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux'];
    const statuses: Candidate['status'][] = ['new', 'screening', 'interview', 'test', 'offer'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `candidate-${i}`,
      name: names[i % names.length],
      email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@email.com`,
      phone: '+33 6 12 34 56 78',
      position: 'Senior Full Stack Developer',
      location: locations[i % locations.length],
      experience: Math.floor(Math.random() * 10 + 1),
      education: ['Master Informatique', 'École d\'Ingénieur', 'DUT + Expérience'][i % 3],
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'].slice(0, Math.floor(Math.random() * 3 + 2)),
      score: Math.floor(Math.random() * 40 + 60),
      aiAnalysis: {
        strengths: ['Solide expérience technique', 'Bon fit culturel', 'Projets pertinents'],
        concerns: ['Salaire demandé élevé', 'Disponibilité à confirmer'],
        cultureFit: Math.floor(Math.random() * 30 + 70),
        technicalFit: Math.floor(Math.random() * 30 + 70),
        recommendation: Math.random() > 0.7 ? 'highly_recommended' : Math.random() > 0.4 ? 'recommended' : 'maybe'
      },
      status: statuses[i % statuses.length],
      appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      testResults: i % 3 === 0 ? {
        technical: Math.floor(Math.random() * 30 + 70),
        personality: 'INTJ',
        cognitive: Math.floor(Math.random() * 30 + 70)
      } : undefined
    }));
  };

  const updatePipelineStages = (candidates: Candidate[]) => {
    const stages: PipelineStage[] = [
      { id: 'new', name: 'Nouvelles', color: '#6B7280', icon: FileText, candidates: [] },
      { id: 'screening', name: 'Présélection', color: '#3B82F6', icon: UserCheck, candidates: [] },
      { id: 'interview', name: 'Entretiens', color: '#8B5CF6', icon: Video, candidates: [] },
      { id: 'test', name: 'Tests', color: '#F59E0B', icon: Brain, candidates: [] },
      { id: 'offer', name: 'Offres', color: '#10B981', icon: Award, candidates: [] }
    ];

    candidates.forEach(candidate => {
      const stage = stages.find(s => s.id === candidate.status);
      if (stage) {
        stage.candidates.push(candidate);
      }
    });

    setPipelineStages(stages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !selectedJob) return;

    const candidateId = active.id as string;
    const newStatus = over.id as Candidate['status'];

    // Mettre à jour le statut du candidat
    const updatedCandidates = selectedJob.candidates.map(c => 
      c.id === candidateId ? { ...c, status: newStatus } : c
    );

    const updatedJob = { ...selectedJob, candidates: updatedCandidates };
    setSelectedJob(updatedJob);
    updatePipelineStages(updatedCandidates);
  };

  const calculateJobStats = (job: JobPosting) => {
    const total = job.candidates.length;
    const interviewed = job.candidates.filter(c => ['interview', 'test', 'offer', 'hired'].includes(c.status)).length;
    const offers = job.candidates.filter(c => ['offer', 'hired'].includes(c.status)).length;
    const hired = job.candidates.filter(c => c.status === 'hired').length;
    const avgScore = job.candidates.reduce((acc, c) => acc + c.score, 0) / total || 0;

    return { total, interviewed, offers, hired, avgScore };
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recrutement Intelligent
          </h1>
          <p className="text-muted-foreground mt-1">
            Pipeline de recrutement avec IA et automatisation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importer CVs
          </Button>
          <Dialog open={isCreatingJob} onOpenChange={setIsCreatingJob}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="h-4 w-4" />
                Nouvelle Offre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une Offre d'Emploi</DialogTitle>
                <DialogDescription>
                  L'IA vous aidera à rédiger une offre attractive
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job-title">Titre du Poste</Label>
                    <Input id="job-title" placeholder="ex: Senior Full Stack Developer" />
                  </div>
                  <div>
                    <Label htmlFor="department">Département</Label>
                    <Select>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">RH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Décrivez le poste et vos attentes..."
                    className="min-h-[100px]"
                  />
                  <Button size="sm" variant="outline" className="mt-2 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Générer avec IA
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingJob(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Publier l'Offre
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Postes Ouverts</p>
                <p className="text-2xl font-bold">{jobPostings.filter(j => j.status === 'active').length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Candidats</p>
                <p className="text-2xl font-bold">
                  {jobPostings.reduce((acc, job) => acc + job.candidates.length, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Moyen IA</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps Moyen</p>
                <p className="text-2xl font-bold">12j</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sélection du Poste */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="job-select" className="whitespace-nowrap">Poste:</Label>
            <Select
              value={selectedJob?.id}
              onValueChange={(value) => {
                const job = jobPostings.find(j => j.id === value);
                if (job) {
                  setSelectedJob(job);
                  updatePipelineStages(job.candidates);
                }
              }}
            >
              <SelectTrigger id="job-select" className="flex-1">
                <SelectValue placeholder="Sélectionner un poste" />
              </SelectTrigger>
              <SelectContent>
                {jobPostings.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{job.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {job.candidates.length} candidats
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedJob && (
              <div className="flex gap-2">
                <Badge variant="outline">{selectedJob.location}</Badge>
                <Badge variant="outline">{selectedJob.type}</Badge>
                <Badge variant="outline">{selectedJob.salary}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline de Recrutement */}
      {selectedJob && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pipeline de Recrutement</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bot className="h-4 w-4" />
                Assistant IA
              </Button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {pipelineStages.map(stage => {
                const Icon = stage.icon;
                return (
                  <div key={stage.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" style={{ color: stage.color }} />
                        <h3 className="font-medium">{stage.name}</h3>
                      </div>
                      <Badge variant="outline">{stage.candidates.length}</Badge>
                    </div>
                    <SortableContext
                      items={stage.candidates.map(c => c.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="space-y-2 min-h-[200px]">
                        {stage.candidates.map(candidate => (
                          <DraggableCandidate
                            key={candidate.id}
                            candidate={candidate}
                            onView={setSelectedCandidate}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>
          </DndContext>
        </div>
      )}

      {/* Dialog Détails Candidat */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Profil du Candidat</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="ai-analysis">Analyse IA</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px] mt-4">
                <TabsContent value="profile" className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback>
                        {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{selectedCandidate.name}</h3>
                      <p className="text-muted-foreground">{selectedCandidate.position}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {selectedCandidate.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedCandidate.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedCandidate.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{
                        color: selectedCandidate.score >= 80 ? '#10B981' : 
                               selectedCandidate.score >= 60 ? '#F59E0B' : '#EF4444'
                      }}>
                        {selectedCandidate.score}%
                      </div>
                      <p className="text-sm text-muted-foreground">Score Global</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Expérience
                      </h4>
                      <p>{selectedCandidate.experience} ans d'expérience</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Formation
                      </h4>
                      <p>{selectedCandidate.education}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Compétences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      Télécharger CV
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Lettre de Motivation
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="ai-analysis" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Adéquation Technique</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">
                            {selectedCandidate.aiAnalysis.technicalFit}%
                          </span>
                          <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <Progress value={selectedCandidate.aiAnalysis.technicalFit} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Adéquation Culturelle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">
                            {selectedCandidate.aiAnalysis.cultureFit}%
                          </span>
                          <Heart className="h-5 w-5 text-pink-600" />
                        </div>
                        <Progress value={selectedCandidate.aiAnalysis.cultureFit} />
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Points Forts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedCandidate.aiAnalysis.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        Points d'Attention
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedCandidate.aiAnalysis.concerns.map((concern, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-orange-600 mt-0.5" />
                            <span className="text-sm">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className={
                    selectedCandidate.aiAnalysis.recommendation === 'highly_recommended' ? 'border-green-500' :
                    selectedCandidate.aiAnalysis.recommendation === 'recommended' ? 'border-blue-500' :
                    selectedCandidate.aiAnalysis.recommendation === 'maybe' ? 'border-orange-500' :
                    'border-red-500'
                  }>
                    <CardHeader>
                      <CardTitle className="text-base">Recommandation IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={
                        selectedCandidate.aiAnalysis.recommendation === 'highly_recommended' ? 'bg-green-100 text-green-800' :
                        selectedCandidate.aiAnalysis.recommendation === 'recommended' ? 'bg-blue-100 text-blue-800' :
                        selectedCandidate.aiAnalysis.recommendation === 'maybe' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {selectedCandidate.aiAnalysis.recommendation === 'highly_recommended' ? 'Hautement Recommandé' :
                         selectedCandidate.aiAnalysis.recommendation === 'recommended' ? 'Recommandé' :
                         selectedCandidate.aiAnalysis.recommendation === 'maybe' ? 'À Considérer' :
                         'Non Recommandé'}
                      </Badge>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tests" className="space-y-4">
                  {selectedCandidate.testResults ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Résultats des Tests</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Test Technique</span>
                              <span className="text-sm font-bold">{selectedCandidate.testResults.technical}%</span>
                            </div>
                            <Progress value={selectedCandidate.testResults.technical} />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Test Cognitif</span>
                              <span className="text-sm font-bold">{selectedCandidate.testResults.cognitive}%</span>
                            </div>
                            <Progress value={selectedCandidate.testResults.cognitive} />
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Profil de Personnalité</span>
                              <Badge variant="outline">{selectedCandidate.testResults.personality}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Aucun test complété</p>
                        <Button className="gap-2">
                          <Send className="h-4 w-4" />
                          Envoyer Tests
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="gap-2">
                      <Video className="h-4 w-4" />
                      Planifier Entretien
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Envoyer Message
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Générer Rapport
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <UserCheck className="h-4 w-4" />
                      Références
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Décision Finale</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button className="gap-2 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Accepter
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Clock className="h-4 w-4" />
                        En Attente
                      </Button>
                      <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartRecruitment;