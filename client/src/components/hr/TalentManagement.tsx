import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Treemap,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import {
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Rocket,
  Zap,
  Star,
  ChevronRight,
  Search,
  Filter,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
// import { supabase } // Migrated from Supabase to Express API

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  targetLevel: number;
  demand: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  skills: Skill[];
  potential: number;
  performance: number;
  experience: number;
  avatar?: string;
  careerPath?: CareerPath;
}

interface CareerPath {
  current: string;
  next: string[];
  timeline: string;
  requirements: string[];
  probability: number;
}

interface SkillGap {
  skill: string;
  currentAvg: number;
  requiredAvg: number;
  gap: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  affectedRoles: string[];
}

export const TalentManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [loading, setLoading] = useState(true);

  // Couleurs pour les visualisations
  const COLORS = {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  };

  useEffect(() => {
    loadTalentData();
    analyzeSkillGaps();
  }, []);

  const loadTalentData = async () => {
    try {
      // Charger les données des employés avec leurs compétences
      const { data: employeesData } = await supabase
        .from('employees')
        .select(`
          *,
          departments(name),
          positions(title)
        `);

      // Simuler des données enrichies pour la démo
      const enrichedEmployees = employeesData?.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        position: emp.positions?.title || 'N/A',
        department: emp.departments?.name || 'N/A',
        skills: generateSkillsForEmployee(emp),
        potential: Math.floor(Math.random() * 30 + 70),
        performance: emp.performance_score * 10 || 75,
        experience: calculateExperience(emp.hire_date),
        careerPath: generateCareerPath(emp)
      })) || [];

      setEmployees(enrichedEmployees);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement talents:', error);
      setLoading(false);
    }
  };

  const generateSkillsForEmployee = (employee: any): Skill[] => {
    const skillCategories = {
      technique: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript'],
      leadership: ['Management', 'Communication', 'Stratégie', 'Négociation'],
      business: ['Finance', 'Marketing', 'Vente', 'Analyse de données'],
      soft: ['Créativité', 'Adaptabilité', 'Esprit d\'équipe', 'Résolution de problèmes']
    };

    const skills: Skill[] = [];
    const numSkills = Math.floor(Math.random() * 5 + 5);

    for (let i = 0; i < numSkills; i++) {
      const category = Object.keys(skillCategories)[Math.floor(Math.random() * 4)] as keyof typeof skillCategories;
      const skillName = skillCategories[category][Math.floor(Math.random() * skillCategories[category].length)];
      
      if (!skills.find(s => s.name === skillName)) {
        skills.push({
          id: `skill-${i}`,
          name: skillName,
          category,
          level: Math.floor(Math.random() * 50 + 50),
          targetLevel: Math.floor(Math.random() * 20 + 80),
          demand: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
        });
      }
    }

    return skills;
  };

  const calculateExperience = (hireDate: string): number => {
    const hire = new Date(hireDate);
    const now = new Date();
    return Math.floor((now.getTime() - hire.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  const generateCareerPath = (employee: any): CareerPath => {
    const paths = {
      'Développeur': ['Lead Developer', 'Architecte Solution', 'CTO'],
      'Commercial': ['Manager Commercial', 'Directeur Commercial', 'VP Sales'],
      'RH': ['Manager RH', 'Directeur RH', 'Chief People Officer'],
      'Finance': ['Contrôleur de Gestion', 'DAF', 'CFO']
    };

    const currentRole = employee.positions?.title || 'Développeur';
    const pathKey = Object.keys(paths).find(key => currentRole.includes(key)) || 'Développeur';

    return {
      current: currentRole,
      next: paths[pathKey as keyof typeof paths].slice(0, 2),
      timeline: '2-3 ans',
      requirements: [
        'Formation leadership avancée',
        'Certification métier',
        'Expérience projet stratégique'
      ],
      probability: Math.floor(Math.random() * 30 + 60)
    };
  };

  const analyzeSkillGaps = async () => {
    // Simuler l'analyse des écarts de compétences
    const gaps: SkillGap[] = [
      {
        skill: 'Machine Learning',
        currentAvg: 35,
        requiredAvg: 75,
        gap: 40,
        priority: 'critical',
        affectedRoles: ['Data Scientist', 'ML Engineer']
      },
      {
        skill: 'Leadership',
        currentAvg: 60,
        requiredAvg: 80,
        gap: 20,
        priority: 'high',
        affectedRoles: ['Team Lead', 'Manager']
      },
      {
        skill: 'Cloud Architecture',
        currentAvg: 55,
        requiredAvg: 70,
        gap: 15,
        priority: 'medium',
        affectedRoles: ['DevOps', 'Architecte']
      }
    ];

    setSkillGaps(gaps);
  };

  // Données pour la matrice 3D des compétences
  const generateSkillMatrix3D = () => {
    return employees.map(emp => ({
      x: emp.performance,
      y: emp.potential,
      z: emp.skills.reduce((acc, skill) => acc + skill.level, 0) / emp.skills.length,
      name: emp.name,
      department: emp.department
    }));
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gestion des Talents & Compétences
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyse IA des talents et développement des compétences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importer CV
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
            <Brain className="h-4 w-4" />
            Analyse IA Globale
          </Button>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher un talent</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, poste, compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="department">Département</Label>
              <select
                id="department"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">Tous les départements</option>
                <option value="Développement Logiciel">Développement</option>
                <option value="Commercial & Marketing">Commercial</option>
                <option value="Ressources Humaines">RH</option>
                <option value="Finance & Comptabilité">Finance</option>
              </select>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vue d'ensemble des talents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matrice Performance/Potentiel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Matrice Talents 9-Box
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Performance" 
                  unit="%" 
                  domain={[0, 100]}
                  label={{ value: 'Performance →', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Potentiel" 
                  unit="%" 
                  domain={[0, 100]}
                  label={{ value: 'Potentiel →', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Employés" 
                  data={generateSkillMatrix3D()} 
                  fill={COLORS.primary}
                >
                  {generateSkillMatrix3D().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.x > 70 && entry.y > 70 ? COLORS.success :
                        entry.x > 50 && entry.y > 50 ? COLORS.warning :
                        COLORS.danger
                      } 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Badge className="justify-center" style={{ backgroundColor: COLORS.success }}>
                Top Performers
              </Badge>
              <Badge className="justify-center" style={{ backgroundColor: COLORS.warning }}>
                Potentiels
              </Badge>
              <Badge className="justify-center" style={{ backgroundColor: COLORS.danger }}>
                À Développer
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alertes et Recommandations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Alertes Talents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500">
              <p className="text-sm font-medium">Risque de départ élevé</p>
              <p className="text-xs text-muted-foreground mt-1">
                3 top performers sans évolution depuis 18 mois
              </p>
              <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs">
                Voir les profils →
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500">
              <p className="text-sm font-medium">Compétences critiques</p>
              <p className="text-xs text-muted-foreground mt-1">
                Gap de 40% en Machine Learning
              </p>
              <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs">
                Plan de formation →
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500">
              <p className="text-sm font-medium">Opportunité</p>
              <p className="text-xs text-muted-foreground mt-1">
                5 employés prêts pour promotion
              </p>
              <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs">
                Évaluer →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyse des Compétences */}
      <Tabs defaultValue="gaps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gaps">Écarts de Compétences</TabsTrigger>
          <TabsTrigger value="development">Plans de Développement</TabsTrigger>
          <TabsTrigger value="succession">Succession Planning</TabsTrigger>
          <TabsTrigger value="matching">Matching IA</TabsTrigger>
        </TabsList>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Écarts de Compétences</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillGaps} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="skill" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="currentAvg" stackId="a" fill={COLORS.info} name="Niveau Actuel" />
                  <Bar dataKey="gap" stackId="a" fill={COLORS.danger} name="Écart" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex-1">
                      <p className="font-medium">{gap.skill}</p>
                      <p className="text-xs text-muted-foreground">
                        Affecte: {gap.affectedRoles.join(', ')}
                      </p>
                    </div>
                    <Badge variant={gap.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {gap.priority}
                    </Badge>
                    <Button size="sm" variant="outline" className="ml-2">
                      Former
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredEmployees.slice(0, 4).map(employee => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                      Potentiel: {employee.potential}%
                    </Badge>
                  </div>

                  {/* Plan de Carrière */}
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      Prochaine Étape: {employee.careerPath?.next[0]}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Timeline: {employee.careerPath?.timeline}
                    </p>
                    <Progress value={employee.careerPath?.probability} className="h-2 mt-2" />
                  </div>

                  {/* Compétences Clés */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Compétences</p>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.slice(0, 4).map(skill => (
                        <div key={skill.id} className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {skill.name}
                          </Badge>
                          {skill.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4" variant="outline">
                        Voir Plan Détaillé
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Plan de Développement - {employee.name}</DialogTitle>
                        <DialogDescription>
                          Parcours personnalisé basé sur l'analyse IA
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={employee.skills.map(s => ({
                            skill: s.name,
                            current: s.level,
                            target: s.targetLevel
                          }))}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="skill" />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} />
                            <Radar name="Niveau Actuel" dataKey="current" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                            <Radar name="Objectif" dataKey="target" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.3} />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold">Formations Recommandées</h4>
                          {['Formation Leadership Avancé', 'Certification AWS', 'Workshop Innovation'].map((formation, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium">{formation}</p>
                                  <p className="text-xs text-muted-foreground">Durée: 3 semaines</p>
                                </div>
                              </div>
                              <Button size="sm">S'inscrire</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="succession" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Succession Intelligent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Directeur Technique', 'Manager Commercial', 'Responsable RH'].map((poste, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{poste}</h4>
                      <Badge variant="outline">
                        {index === 0 ? 'Critique' : index === 1 ? 'Important' : 'Standard'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[1, 2, 3].map(num => (
                        <div key={num} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>C{num}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Candidat {num}</p>
                            <p className="text-xs text-muted-foreground">Prêt dans {num * 6} mois</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ 
                              borderColor: num === 1 ? COLORS.success : num === 2 ? COLORS.warning : COLORS.info,
                              color: num === 1 ? COLORS.success : num === 2 ? COLORS.warning : COLORS.info
                            }}
                          >
                            {num === 1 ? '95%' : num === 2 ? '78%' : '65%'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Matching IA Postes/Talents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 dark:bg-purple-950/20">
                  <p className="text-sm text-center text-muted-foreground">
                    Glissez un poste ici ou cliquez pour analyser les correspondances
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Postes Ouverts</h4>
                  {['Lead Developer Full Stack', 'Product Manager', 'Data Analyst'].map((poste, index) => (
                    <div key={index} className="p-4 rounded-lg border hover:border-purple-500 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{poste}</h5>
                        <Badge>Nouveau</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Département: {index === 0 ? 'Tech' : index === 1 ? 'Product' : 'Data'}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Top 3 Candidats Internes</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map(num => (
                            <div key={num} className="text-center">
                              <Avatar className="h-10 w-10 mx-auto mb-1">
                                <AvatarFallback>M{num}</AvatarFallback>
                              </Avatar>
                              <p className="text-xs font-medium">Match {100 - num * 5}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        <Zap className="h-3 w-3 mr-1" />
                        Analyser Correspondances
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentManagement;