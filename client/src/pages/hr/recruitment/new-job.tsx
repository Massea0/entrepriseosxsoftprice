import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Send,
  Plus,
  X,
  Zap,
  Sparkles,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Target,
  FileText,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const jobSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  department: z.string().min(1, 'Sélectionnez un département'),
  location: z.string().min(1, 'Indiquez la localisation'),
  type: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  experience_level: z.enum(['junior', 'mid', 'senior', 'lead']),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  closing_date: z.string().optional(),
  description: z.string().min(50, 'La description doit contenir au moins 50 caractères'),
  responsibilities: z.array(z.string()).min(1, 'Ajoutez au moins une responsabilité'),
  requirements: z.array(z.string()).min(1, 'Ajoutez au moins une exigence'),
  benefits: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, 'Ajoutez au moins une compétence'),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function NewJobPosting() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basics');
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: 'full_time',
      experience_level: 'mid',
      requirements: [],
      responsibilities: [],
      benefits: [],
      skills: []
    }
  });

  const watchedFields = watch();

  // Mutation pour créer l'offre
  const createJob = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await fetch('/api/recruitment/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create job posting');
      return response.json();
    },
    onSuccess: (data) => {
      navigate(`/hr/recruitment/jobs/${data.id}`);
    }
  });

  // Simulation de suggestions IA
  const getAISuggestions = async () => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAiSuggestions({
      description: `Nous recherchons un ${watchedFields.title} passionné pour rejoindre notre équipe ${watchedFields.department}. Vous serez responsable de développer et maintenir des solutions innovantes, collaborer avec des équipes multidisciplinaires et contribuer à l'excellence technique de nos produits.`,
      requirements: [
        'Diplôme en informatique ou domaine connexe',
        '3+ années d\'expérience en développement web',
        'Maîtrise de React, TypeScript et Node.js',
        'Expérience avec les bases de données SQL',
        'Excellentes compétences en communication'
      ],
      responsibilities: [
        'Développer et maintenir des applications web modernes',
        'Collaborer avec l\'équipe produit pour définir les exigences',
        'Participer aux revues de code et mentorat',
        'Optimiser les performances des applications',
        'Contribuer à l\'architecture technique'
      ],
      benefits: [
        'Télétravail flexible (2-3 jours/semaine)',
        'Formation continue et certifications',
        'Assurance santé complète',
        'Budget équipement à domicile',
        '25 jours de congés + RTT'
      ],
      skills: [
        'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git',
        'Docker', 'CI/CD', 'Agile/Scrum'
      ]
    });
  };

  const onSubmit = async (data: JobFormData) => {
    createJob.mutate(data);
  };

  const addItem = (type: 'requirements' | 'responsibilities' | 'benefits' | 'skills', value: string) => {
    if (!value.trim()) return;
    
    const currentItems = watchedFields[type] || [];
    setValue(type, [...currentItems, value.trim()]);
    
    // Reset input
    if (type === 'requirements') setNewRequirement('');
    else if (type === 'responsibilities') setNewResponsibility('');
    else if (type === 'benefits') setNewBenefit('');
    else if (type === 'skills') setNewSkill('');
  };

  const removeItem = (type: 'requirements' | 'responsibilities' | 'benefits' | 'skills', index: number) => {
    const currentItems = watchedFields[type] || [];
    setValue(type, currentItems.filter((_, i) => i !== index));
  };

  const applySuggestion = (field: keyof typeof aiSuggestions) => {
    if (!aiSuggestions) return;
    setValue(field as any, aiSuggestions[field]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/hr/recruitment">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Nouvelle Offre d'Emploi</h1>
            <p className="text-muted-foreground">
              Créez une offre attractive pour attirer les meilleurs talents
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions IA */}
      {!aiSuggestions && (
        <Alert className="mb-6 border-purple-200 bg-purple-50">
          <Zap className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-purple-900">Assistant IA disponible</p>
                <p className="text-sm">
                  Obtenez des suggestions pour optimiser votre offre d'emploi
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={getAISuggestions}
                disabled={!watchedFields.title || !watchedFields.department}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Générer suggestions
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Informations</TabsTrigger>
            <TabsTrigger value="details">Description</TabsTrigger>
            <TabsTrigger value="requirements">Exigences</TabsTrigger>
            <TabsTrigger value="benefits">Avantages</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
                <CardDescription>
                  Détails essentiels de l'offre d'emploi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du poste</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Développeur Full Stack Senior"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-xs text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <Select 
                      value={watchedFields.department}
                      onValueChange={(value) => setValue('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">RH</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="operations">Opérations</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-xs text-destructive">{errors.department.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      placeholder="Ex: Paris, France (Remote)"
                      {...register('location')}
                    />
                    {errors.location && (
                      <p className="text-xs text-destructive">{errors.location.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type de contrat</Label>
                    <Select 
                      value={watchedFields.type}
                      onValueChange={(value: any) => setValue('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Temps plein</SelectItem>
                        <SelectItem value="part_time">Temps partiel</SelectItem>
                        <SelectItem value="contract">Contrat</SelectItem>
                        <SelectItem value="internship">Stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Niveau d'expérience</Label>
                    <Select 
                      value={watchedFields.experience_level}
                      onValueChange={(value: any) => setValue('experience_level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
                        <SelectItem value="mid">Intermédiaire (3-5 ans)</SelectItem>
                        <SelectItem value="senior">Senior (6-10 ans)</SelectItem>
                        <SelectItem value="lead">Lead (10+ ans)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closing_date">Date de clôture</Label>
                    <Input
                      id="closing_date"
                      type="date"
                      {...register('closing_date')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fourchette salariale (optionnel)</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Min (€/an)"
                        {...register('salary_min', { valueAsNumber: true })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">—</span>
                      <Input
                        type="number"
                        placeholder="Max (€/an)"
                        {...register('salary_max', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Description du poste</CardTitle>
                <CardDescription>
                  Décrivez le rôle et les responsabilités
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiSuggestions?.description && (
                  <Alert className="mb-4">
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Suggestion IA</p>
                        <p className="text-sm">{aiSuggestions.description}</p>
                        <Button 
                          type="button"
                          size="sm" 
                          variant="outline"
                          onClick={() => applySuggestion('description')}
                        >
                          Utiliser cette suggestion
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={8}
                    placeholder="Décrivez le poste, l'équipe, les projets..."
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Responsabilités principales</Label>
                  {aiSuggestions?.responsibilities && (
                    <Button 
                      type="button"
                      size="sm" 
                      variant="outline"
                      className="mb-2"
                      onClick={() => applySuggestion('responsibilities')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Utiliser suggestions IA
                    </Button>
                  )}
                  
                  <div className="space-y-2">
                    {watchedFields.responsibilities?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex-1 justify-between">
                          {item}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 ml-2"
                            onClick={() => removeItem('responsibilities', index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une responsabilité..."
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem('responsibilities', newResponsibility);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addItem('responsibilities', newResponsibility)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.responsibilities && (
                    <p className="text-xs text-destructive">{errors.responsibilities.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Exigences et Compétences</CardTitle>
                <CardDescription>
                  Qualifications requises pour le poste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Exigences</Label>
                  {aiSuggestions?.requirements && (
                    <Button 
                      type="button"
                      size="sm" 
                      variant="outline"
                      className="mb-2"
                      onClick={() => applySuggestion('requirements')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Utiliser suggestions IA
                    </Button>
                  )}
                  
                  <div className="space-y-2">
                    {watchedFields.requirements?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex-1 justify-between">
                          {item}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 ml-2"
                            onClick={() => removeItem('requirements', index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une exigence..."
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem('requirements', newRequirement);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addItem('requirements', newRequirement)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.requirements && (
                    <p className="text-xs text-destructive">{errors.requirements.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Compétences recherchées</Label>
                  {aiSuggestions?.skills && (
                    <Button 
                      type="button"
                      size="sm" 
                      variant="outline"
                      className="mb-2"
                      onClick={() => applySuggestion('skills')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Utiliser suggestions IA
                    </Button>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {watchedFields.skills?.map((skill, index) => (
                      <Badge key={index} variant="default">
                        {skill}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeItem('skills', index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une compétence..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem('skills', newSkill);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addItem('skills', newSkill)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.skills && (
                    <p className="text-xs text-destructive">{errors.skills.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Avantages et Bénéfices</CardTitle>
                <CardDescription>
                  Ce qui rend votre offre attractive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Avantages</Label>
                  {aiSuggestions?.benefits && (
                    <Button 
                      type="button"
                      size="sm" 
                      variant="outline"
                      className="mb-2"
                      onClick={() => applySuggestion('benefits')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Utiliser suggestions IA
                    </Button>
                  )}
                  
                  <div className="space-y-2">
                    {watchedFields.benefits?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Badge variant="outline" className="flex-1 justify-between">
                          {item}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 ml-2"
                            onClick={() => removeItem('benefits', index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter un avantage..."
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem('benefits', newBenefit);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addItem('benefits', newBenefit)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/hr/recruitment')}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            disabled={createJob.isPending}
          >
            {createJob.isPending ? (
              <>Création...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Créer l'offre
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}