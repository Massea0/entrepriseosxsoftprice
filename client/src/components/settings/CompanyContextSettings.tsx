import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  Users,
  MessageSquare,
  Heart,
  Cog,
  Target,
  Save,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Globe,
  Link2,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
// import { supabase } // Migrated from Supabase to Express API
import { toast } from '@/hooks/use-toast';

interface CompanyContext {
  id?: string;
  company_name: string;
  industry: string;
  company_size: string;
  founded_year: number | null;
  website_url: string;
  linkedin_url: string;
  offering_type: 'products' | 'services' | 'both';
  main_offerings: string[];
  target_market: string;
  unique_value_proposition: string;
  organizational_structure: 'flat' | 'hierarchical' | 'matrix';
  departments: string[];
  average_team_size: number | null;
  remote_policy: string;
  primary_communication_channel: string;
  communication_tools: string[];
  working_languages: string[];
  meeting_frequency: string;
  company_values: string[];
  culture_description: string;
  benefits_offered: string[];
  work_life_balance_score: number;
  key_processes: string[];
  automation_level: number;
  main_challenges: string[];
  tech_stack: string[];
  company_vision: string;
  strategic_objectives: string[];
  tracked_kpis: string[];
  objectives_timeline: string;
}

const defaultContext: CompanyContext = {
  company_name: '',
  industry: '',
  company_size: '',
  founded_year: null,
  website_url: '',
  linkedin_url: '',
  offering_type: 'both',
  main_offerings: [],
  target_market: '',
  unique_value_proposition: '',
  organizational_structure: 'hierarchical',
  departments: [],
  average_team_size: null,
  remote_policy: '',
  primary_communication_channel: '',
  communication_tools: [],
  working_languages: [],
  meeting_frequency: '',
  company_values: [],
  culture_description: '',
  benefits_offered: [],
  work_life_balance_score: 50,
  key_processes: [],
  automation_level: 50,
  main_challenges: [],
  tech_stack: [],
  company_vision: '',
  strategic_objectives: [],
  tracked_kpis: [],
  objectives_timeline: ''
};

export default function CompanyContextSettings() {
  const [context, setContext] = useState<CompanyContext>(defaultContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    loadCompanyContext();
  }, []);

  const loadCompanyContext = async () => {
    try {
      const { data, error } = await supabase
        .from('company_context')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContext(data);
      }
    } catch (error) {
      console.error('Erreur chargement contexte:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le contexte de l'entreprise",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContext = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_context')
        .upsert({
          ...context,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le contexte de l'entreprise a été mis à jour",
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contexte",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const analyzeWebsite = async () => {
    if (!context.website_url) return;
    
    // TODO: Implémenter l'analyse réelle
    toast({
      title: "Analyse en cours",
      description: "L'analyse du site web est simulée pour cette démo",
    });
  };

  const analyzeLinkedIn = async () => {
    if (!context.linkedin_url) return;
    
    // TODO: Implémenter l'analyse réelle
    toast({
      title: "Analyse en cours",
      description: "L'analyse LinkedIn est simulée pour cette démo",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contexte de l'Entreprise</h2>
          <p className="text-muted-foreground">
            Configurez le contexte pour que l'IA comprenne mieux votre entreprise
          </p>
        </div>
        <Button 
          onClick={saveContext} 
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Sauvegarder
        </Button>
      </div>

      {/* Alert info */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          Ces informations permettent à l'IA de personnaliser ses recommandations et prédictions 
          selon votre contexte d'entreprise spécifique.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="offerings" className="gap-2">
            <Package className="h-4 w-4" />
            Offres
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2">
            <Users className="h-4 w-4" />
            Organisation
          </TabsTrigger>
          <TabsTrigger value="communication" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="culture" className="gap-2">
            <Heart className="h-4 w-4" />
            Culture
          </TabsTrigger>
          <TabsTrigger value="processes" className="gap-2">
            <Cog className="h-4 w-4" />
            Processus
          </TabsTrigger>
          <TabsTrigger value="strategy" className="gap-2">
            <Target className="h-4 w-4" />
            Stratégie
          </TabsTrigger>
        </TabsList>

        {/* Tab Entreprise */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
              <CardDescription>
                Informations de base sur votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom de l'entreprise</Label>
                  <Input
                    value={context.company_name}
                    onChange={(e) => setContext({...context, company_name: e.target.value})}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <Label>Secteur d'activité</Label>
                  <Select
                    value={context.industry}
                    onValueChange={(value) => setContext({...context, industry: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technologies</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Commerce</SelectItem>
                      <SelectItem value="health">Santé</SelectItem>
                      <SelectItem value="education">Éducation</SelectItem>
                      <SelectItem value="manufacturing">Industrie</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Taille de l'entreprise</Label>
                  <Select
                    value={context.company_size}
                    onValueChange={(value) => setContext({...context, company_size: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre d'employés" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employés</SelectItem>
                      <SelectItem value="11-50">11-50 employés</SelectItem>
                      <SelectItem value="51-200">51-200 employés</SelectItem>
                      <SelectItem value="201-500">201-500 employés</SelectItem>
                      <SelectItem value="500+">500+ employés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Année de création</Label>
                  <Input
                    type="number"
                    value={context.founded_year || ''}
                    onChange={(e) => setContext({...context, founded_year: parseInt(e.target.value) || null})}
                    placeholder="2020"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Import Automatique</h4>
                <div>
                  <Label>Site Web</Label>
                  <div className="flex gap-2">
                    <Input
                      value={context.website_url}
                      onChange={(e) => setContext({...context, website_url: e.target.value})}
                      placeholder="https://example.com"
                    />
                    <Button
                      variant="outline"
                      onClick={analyzeWebsite}
                      disabled={!context.website_url}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Analyser
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Page LinkedIn</Label>
                  <div className="flex gap-2">
                    <Input
                      value={context.linkedin_url}
                      onChange={(e) => setContext({...context, linkedin_url: e.target.value})}
                      placeholder="https://linkedin.com/company/..."
                    />
                    <Button
                      variant="outline"
                      onClick={analyzeLinkedIn}
                      disabled={!context.linkedin_url}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Analyser
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Offres */}
        <TabsContent value="offerings">
          <Card>
            <CardHeader>
              <CardTitle>Produits et Services</CardTitle>
              <CardDescription>
                Décrivez ce que votre entreprise offre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type d'offre</Label>
                <RadioGroup
                  value={context.offering_type}
                  onValueChange={(value: 'products' | 'services' | 'both') => 
                    setContext({...context, offering_type: value})
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="products" id="products" />
                    <Label htmlFor="products">Produits</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="services" id="services" />
                    <Label htmlFor="services">Services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Produits et Services</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Principales offres</Label>
                <Textarea
                  value={context.main_offerings.join(', ')}
                  onChange={(e) => setContext({
                    ...context, 
                    main_offerings: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Solution CRM, Support technique, Formation..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Séparez les offres par des virgules
                </p>
              </div>

              <div>
                <Label>Marché cible</Label>
                <Input
                  value={context.target_market}
                  onChange={(e) => setContext({...context, target_market: e.target.value})}
                  placeholder="PME B2B en France"
                />
              </div>

              <div>
                <Label>Proposition de valeur unique</Label>
                <Textarea
                  value={context.unique_value_proposition}
                  onChange={(e) => setContext({...context, unique_value_proposition: e.target.value})}
                  placeholder="Ce qui vous différencie de la concurrence..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Organisation */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Structure Organisationnelle</CardTitle>
              <CardDescription>
                Comment votre entreprise est organisée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type de structure</Label>
                <RadioGroup
                  value={context.organizational_structure}
                  onValueChange={(value: 'flat' | 'hierarchical' | 'matrix') => 
                    setContext({...context, organizational_structure: value})
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flat" id="flat" />
                    <Label htmlFor="flat">Plate (peu de niveaux)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hierarchical" id="hierarchical" />
                    <Label htmlFor="hierarchical">Hiérarchique</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="matrix" id="matrix" />
                    <Label htmlFor="matrix">Matricielle</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Départements</Label>
                <Textarea
                  value={context.departments.join(', ')}
                  onChange={(e) => setContext({
                    ...context, 
                    departments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="RH, Finance, IT, Marketing, Ventes..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Taille moyenne des équipes</Label>
                  <Input
                    type="number"
                    value={context.average_team_size || ''}
                    onChange={(e) => setContext({
                      ...context, 
                      average_team_size: parseInt(e.target.value) || null
                    })}
                    placeholder="8"
                  />
                </div>
                <div>
                  <Label>Politique de télétravail</Label>
                  <Select
                    value={context.remote_policy}
                    onValueChange={(value) => setContext({...context, remote_policy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">100% Présentiel</SelectItem>
                      <SelectItem value="hybrid">Hybride</SelectItem>
                      <SelectItem value="remote-first">Remote First</SelectItem>
                      <SelectItem value="full-remote">100% Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Communication */}
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication et Collaboration</CardTitle>
              <CardDescription>
                Comment vos équipes communiquent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Canal principal</Label>
                <Select
                  value={context.primary_communication_channel}
                  onValueChange={(value) => setContext({...context, primary_communication_channel: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Outils utilisés</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Zoom', 'Google Workspace', 'Office 365', 'Jira', 'Notion', 'Trello'].map(tool => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Switch
                        checked={context.communication_tools.includes(tool)}
                        onCheckedChange={(checked) => {
                          setContext({
                            ...context,
                            communication_tools: checked 
                              ? [...context.communication_tools, tool]
                              : context.communication_tools.filter(t => t !== tool)
                          });
                        }}
                      />
                      <Label>{tool}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Langues de travail</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Chinois'].map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Switch
                        checked={context.working_languages.includes(lang)}
                        onCheckedChange={(checked) => {
                          setContext({
                            ...context,
                            working_languages: checked 
                              ? [...context.working_languages, lang]
                              : context.working_languages.filter(l => l !== lang)
                          });
                        }}
                      />
                      <Label>{lang}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Fréquence des réunions</Label>
                <Select
                  value={context.meeting_frequency}
                  onValueChange={(value) => setContext({...context, meeting_frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="biweekly">Bimensuelle</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Culture */}
        <TabsContent value="culture">
          <Card>
            <CardHeader>
              <CardTitle>Culture d'Entreprise</CardTitle>
              <CardDescription>
                Les valeurs et l'environnement de travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Valeurs de l'entreprise</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Innovation', 'Collaboration', 'Excellence', 'Intégrité', 'Agilité', 'Responsabilité'].map(value => (
                    <div key={value} className="flex items-center space-x-2">
                      <Switch
                        checked={context.company_values.includes(value)}
                        onCheckedChange={(checked) => {
                          setContext({
                            ...context,
                            company_values: checked 
                              ? [...context.company_values, value]
                              : context.company_values.filter(v => v !== value)
                          });
                        }}
                      />
                      <Label>{value}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Description de la culture</Label>
                <Textarea
                  value={context.culture_description}
                  onChange={(e) => setContext({...context, culture_description: e.target.value})}
                  placeholder="Décrivez votre culture d'entreprise..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Avantages offerts</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Télétravail', 'Horaires flexibles', 'Formation continue', 'Assurance santé', 'Tickets restaurant', 'Sport/Bien-être'].map(benefit => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Switch
                        checked={context.benefits_offered.includes(benefit)}
                        onCheckedChange={(checked) => {
                          setContext({
                            ...context,
                            benefits_offered: checked 
                              ? [...context.benefits_offered, benefit]
                              : context.benefits_offered.filter(b => b !== benefit)
                          });
                        }}
                      />
                      <Label>{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Équilibre vie pro/perso ({context.work_life_balance_score}%)</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={context.work_life_balance_score}
                  onChange={(e) => setContext({...context, work_life_balance_score: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Strict</span>
                  <span>Flexible</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Processus */}
        <TabsContent value="processes">
          <Card>
            <CardHeader>
              <CardTitle>Processus Métiers</CardTitle>
              <CardDescription>
                Comment votre entreprise fonctionne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Processus clés</Label>
                <Textarea
                  value={context.key_processes.join(', ')}
                  onChange={(e) => setContext({
                    ...context, 
                    key_processes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Vente, Support client, Développement produit..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Niveau d'automatisation ({context.automation_level}%)</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={context.automation_level}
                  onChange={(e) => setContext({...context, automation_level: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Manuel</span>
                  <span>Automatisé</span>
                </div>
              </div>

              <div>
                <Label>Principaux défis</Label>
                <Textarea
                  value={context.main_challenges.join(', ')}
                  onChange={(e) => setContext({
                    ...context, 
                    main_challenges: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Scalabilité, Coûts, Temps de traitement..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Stack technique</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'].map(tech => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Switch
                        checked={context.tech_stack.includes(tech)}
                        onCheckedChange={(checked) => {
                          setContext({
                            ...context,
                            tech_stack: checked 
                              ? [...context.tech_stack, tech]
                              : context.tech_stack.filter(t => t !== tech)
                          });
                        }}
                      />
                      <Label>{tech}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Stratégie */}
        <TabsContent value="strategy">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs Stratégiques</CardTitle>
              <CardDescription>
                La vision et les objectifs de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Vision de l'entreprise</Label>
                <Textarea
                  value={context.company_vision}
                  onChange={(e) => setContext({...context, company_vision: e.target.value})}
                  placeholder="Où voyez-vous votre entreprise dans 5 ans ?"
                  rows={3}
                />
              </div>

              <div>
                <Label>Objectifs stratégiques</Label>
                <Textarea
                  value={context.strategic_objectives.join(', ')}
                  onChange={(e) => setContext({
                    ...context, 
                    strategic_objectives: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Croissance 50%, Expansion internationale..."
                  rows={2}
                />
              </div>

              <div>
                <Label>KPIs suivis</Label>
                <Textarea
                  value={context.tracked_kpis.join(', ')}
                  onChange={(e) => setContext({
                    ...context, 
                    tracked_kpis: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Chiffre d'affaires, NPS, Taux de conversion..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Timeline des objectifs</Label>
                <Select
                  value={context.objectives_timeline}
                  onValueChange={(value) => setContext({...context, objectives_timeline: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                    <SelectItem value="3years">3 ans</SelectItem>
                    <SelectItem value="5years">5 ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* IA Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Statut IA</h3>
                <p className="text-sm text-muted-foreground">
                  L'IA utilise ces informations pour personnaliser l'expérience
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Contexte traité
              </Badge>
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Personas générés
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}