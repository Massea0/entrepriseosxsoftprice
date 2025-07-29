import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Brain,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  MessageSquare,
  Heart,
  Activity,
  Shield,
  Clock,
  Zap,
  ChevronRight,
  ChevronLeft,
  Bot,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  Mic,
  PlusCircle,
  Settings,
  Download,
  Share2,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  DollarSign,
  Rocket,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager: string;
  location: string;
  startDate: string;
  avatar?: string;
  salary: number;
  performanceScore: number;
  engagementScore: number;
  skills: Array<{
    name: string;
    level: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  projects: Array<{
    name: string;
    role: string;
    status: 'completed' | 'in-progress' | 'planned';
    performance: number;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  goals: Array<{
    title: string;
    progress: number;
    deadline: string;
    status: 'on-track' | 'at-risk' | 'completed' | 'overdue';
  }>;
  aiPredictions: {
    retentionRisk: number;
    promotionReadiness: number;
    skillGapScore: number;
    nextRole: string;
    estimatedTimeToPromotion: string;
    keyStrengths: string[];
    developmentAreas: string[];
    flightRisk: 'low' | 'medium' | 'high';
  };
}

const mockEmployee: Employee = {
  id: '1',
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@company.com',
  phone: '+33 6 12 34 56 78',
  position: 'Senior Developer',
  department: 'Engineering',
  manager: 'Jean Martin',
  location: 'Paris, France',
  startDate: '2020-03-15',
  salary: 65000,
  performanceScore: 88,
  engagementScore: 92,
  skills: [
    { name: 'React', level: 95, trend: 'up' },
    { name: 'TypeScript', level: 85, trend: 'up' },
    { name: 'Node.js', level: 80, trend: 'stable' },
    { name: 'Python', level: 70, trend: 'up' },
    { name: 'AWS', level: 65, trend: 'up' },
    { name: 'Leadership', level: 75, trend: 'up' }
  ],
  projects: [
    { name: 'Project Alpha', role: 'Lead Developer', status: 'completed', performance: 95 },
    { name: 'Project Beta', role: 'Developer', status: 'in-progress', performance: 88 },
    { name: 'Project Gamma', role: 'Tech Lead', status: 'planned', performance: 0 }
  ],
  certifications: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023-06', expiryDate: '2026-06' },
    { name: 'React Advanced', issuer: 'Meta', date: '2023-01' }
  ],
  goals: [
    { title: 'Complete AWS DevOps Certification', progress: 65, deadline: '2024-06', status: 'on-track' },
    { title: 'Lead 2 Major Projects', progress: 50, deadline: '2024-12', status: 'on-track' },
    { title: 'Mentor 3 Junior Developers', progress: 33, deadline: '2024-12', status: 'at-risk' }
  ],
  aiPredictions: {
    retentionRisk: 15,
    promotionReadiness: 85,
    skillGapScore: 20,
    nextRole: 'Tech Lead',
    estimatedTimeToPromotion: '6-8 months',
    keyStrengths: ['Technical Excellence', 'Problem Solving', 'Team Collaboration'],
    developmentAreas: ['Public Speaking', 'Strategic Thinking', 'Delegation'],
    flightRisk: 'low'
  }
};

const EmployeeView360: React.FC<{ employeeId?: string }> = ({ employeeId }) => {
  const [employee] = useState<Employee>(mockEmployee);
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; message: string }>>([
    { role: 'assistant', message: 'Bonjour ! Je suis votre assistant IA personnel. Comment puis-je vous aider aujourd\'hui ?' }
  ]);

  // Données pour les graphiques
  const performanceData = [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 84 },
    { month: 'Mar', score: 83 },
    { month: 'Apr', score: 86 },
    { month: 'May', score: 88 },
    { month: 'Jun', score: 88 }
  ];

  const engagementData = [
    { month: 'Jan', score: 88 },
    { month: 'Feb', score: 89 },
    { month: 'Mar', score: 90 },
    { month: 'Apr', score: 91 },
    { month: 'May', score: 92 },
    { month: 'Jun', score: 92 }
  ];

  const skillsRadarData = employee.skills.map(skill => ({
    skill: skill.name,
    level: skill.level,
    fullMark: 100
  }));

  const careerTimelineData = [
    { date: '2020-03', event: 'Rejoint l\'entreprise', type: 'join', role: 'Developer' },
    { date: '2021-01', event: 'Première promotion', type: 'promotion', role: 'Mid Developer' },
    { date: '2021-06', event: 'Certification AWS', type: 'achievement' },
    { date: '2022-01', event: 'Promotion Senior', type: 'promotion', role: 'Senior Developer' },
    { date: '2023-01', event: 'Lead Project Alpha', type: 'project' },
    { date: '2024-08', event: 'Prédiction: Tech Lead', type: 'prediction', role: 'Tech Lead' }
  ];

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user' as const, message: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');

    // Simulation de réponse IA
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        message: 'Je comprends votre question. Basé sur votre profil, je vous recommande de vous concentrer sur le développement de vos compétences en leadership pour accélérer votre progression vers le rôle de Tech Lead.'
      };
      setChatHistory([...newHistory, aiResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header avec informations principales */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  {employee.firstName[0]}{employee.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  {employee.firstName} {employee.lastName}
                  <Badge className={cn(
                    "ml-2",
                    employee.aiPredictions.flightRisk === 'low' ? "bg-green-100 text-green-800" :
                    employee.aiPredictions.flightRisk === 'medium' ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  )}>
                    Risque de départ: {employee.aiPredictions.flightRisk}
                  </Badge>
                </h1>
                <p className="text-lg text-gray-600">{employee.position} • {employee.department}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {employee.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {employee.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {employee.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CV
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Métriques clés */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className="text-2xl font-bold">{employee.performanceScore}%</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
              <Progress value={employee.performanceScore} className="mt-2 h-2" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold">{employee.engagementScore}%</p>
                </div>
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
              <Progress value={employee.engagementScore} className="mt-2 h-2" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promotion Ready</p>
                  <p className="text-2xl font-bold">{employee.aiPredictions.promotionReadiness}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={employee.aiPredictions.promotionReadiness} className="mt-2 h-2" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ancienneté</p>
                  <p className="text-2xl font-bold">
                    {new Date().getFullYear() - new Date(employee.startDate).getFullYear()} ans
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prédictions IA */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Prédictions IA & Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-purple-500" />
                Évolution de Carrière
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm">Prochain rôle prédit</span>
                  <Badge className="bg-purple-100 text-purple-800">{employee.aiPredictions.nextRole}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm">Temps estimé</span>
                  <span className="font-medium">{employee.aiPredictions.estimatedTimeToPromotion}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Points d'Attention
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm">Risque de rétention</span>
                  <div className="flex items-center gap-2">
                    <Progress value={100 - employee.aiPredictions.retentionRisk} className="w-20 h-2" />
                    <span className="text-sm font-medium">{100 - employee.aiPredictions.retentionRisk}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm">Écart de compétences</span>
                  <div className="flex items-center gap-2">
                    <Progress value={100 - employee.aiPredictions.skillGapScore} className="w-20 h-2" />
                    <span className="text-sm font-medium">{100 - employee.aiPredictions.skillGapScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Points Forts
              </h4>
              <div className="space-y-1">
                {employee.aiPredictions.keyStrengths.map((strength, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Axes de Développement
              </h4>
              <div className="space-y-1">
                {employee.aiPredictions.developmentAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets détaillés */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="career">Carrière</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
          <TabsTrigger value="assistant">Assistant IA</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Graphique de performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution de la Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPerf)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Graphique d'engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution de l'Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#ec4899" fillOpacity={1} fill="url(#colorEng)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Projets récents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projets Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employee.projects.map((project, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        project.status === 'completed' ? "bg-green-500" :
                        project.status === 'in-progress' ? "bg-blue-500" :
                        "bg-gray-400"
                      )} />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-600">{project.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {project.performance > 0 && (
                        <div className="flex items-center gap-2">
                          <Progress value={project.performance} className="w-20 h-2" />
                          <span className="text-sm font-medium">{project.performance}%</span>
                        </div>
                      )}
                      <Badge variant={
                        project.status === 'completed' ? 'default' :
                        project.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {project.status === 'completed' ? 'Terminé' :
                         project.status === 'in-progress' ? 'En cours' :
                         'Planifié'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline de carrière */}
        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Carrière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {careerTimelineData.map((event, i) => {
                  const isPrediction = event.type === 'prediction';
                  const Icon = event.type === 'join' ? Users :
                               event.type === 'promotion' ? TrendingUp :
                               event.type === 'achievement' ? Award :
                               event.type === 'project' ? Briefcase :
                               Sparkles;
                  
                  return (
                    <div key={i} className="relative flex items-start mb-8">
                      <div className={cn(
                        "absolute left-4 w-8 h-8 rounded-full flex items-center justify-center",
                        isPrediction ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                        event.type === 'promotion' ? "bg-green-500" :
                        event.type === 'achievement' ? "bg-yellow-500" :
                        "bg-blue-500"
                      )}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-16">
                        <div className={cn(
                          "p-4 rounded-lg",
                          isPrediction ? "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200" :
                          "bg-gray-50"
                        )}>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{event.event}</p>
                            {isPrediction && <Badge className="bg-purple-100 text-purple-800">Prédiction IA</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
                          {event.role && <p className="text-sm mt-1 font-medium text-purple-600">{event.role}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Certifications
                <Button size="sm" variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employee.certifications.map((cert, i) => (
                  <div key={i} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-sm text-gray-600">{cert.issuer} • {new Date(cert.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    {cert.expiryDate && (
                      <Badge variant={new Date(cert.expiryDate) > new Date() ? 'default' : 'destructive'}>
                        Expire: {new Date(cert.expiryDate).toLocaleDateString('fr-FR')}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compétences */}
        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Radar des compétences */}
            <Card>
              <CardHeader>
                <CardTitle>Profil de Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillsRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Niveau" dataKey="level" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Liste détaillée des compétences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Détail des Compétences
                  <Button size="sm" variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.skills.map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          {skill.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                          {skill.trend === 'down' && <ChevronRight className="h-3 w-3 text-red-500 rotate-90" />}
                        </div>
                        <span className="text-sm font-medium">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Recommandations de Formation
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium">Formation Leadership Avancé</p>
                      <p className="text-xs text-gray-600 mt-1">Pour accélérer votre progression vers Tech Lead</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium">Kubernetes & Orchestration</p>
                      <p className="text-xs text-gray-600 mt-1">Compétence clé pour votre évolution technique</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Performance Globale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employee.performanceScore}%</div>
                <p className="text-xs text-gray-600 mt-1">+5% vs trimestre précédent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Objectifs Atteints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8/10</div>
                <p className="text-xs text-gray-600 mt-1">80% de réussite</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Feedback 360°</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.5/5</div>
                <p className="text-xs text-gray-600 mt-1">Basé sur 12 évaluations</p>
              </CardContent>
            </Card>
          </div>

          {/* Feedback détaillé */}
          <Card>
            <CardHeader>
              <CardTitle>Évaluations Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">Revue Annuelle 2023</p>
                      <p className="text-sm text-gray-600">Par Jean Martin (Manager)</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <p className="text-sm">"Performance exceptionnelle sur tous les projets. Leadership naturel et excellente collaboration avec l'équipe."</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">Feedback Projet Alpha</p>
                      <p className="text-sm text-gray-600">Par l'équipe projet</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Très bien</Badge>
                  </div>
                  <p className="text-sm">"Excellente gestion technique. A su résoudre des problèmes complexes avec créativité."</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectifs */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Objectifs 2024
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nouvel Objectif
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.goals.map((goal, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{goal.title}</p>
                        <p className="text-sm text-gray-600">Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <Badge variant={
                        goal.status === 'completed' ? 'default' :
                        goal.status === 'on-track' ? 'secondary' :
                        goal.status === 'at-risk' ? 'outline' :
                        'destructive'
                      }>
                        {goal.status === 'completed' ? 'Complété' :
                         goal.status === 'on-track' ? 'En bonne voie' :
                         goal.status === 'at-risk' ? 'À risque' :
                         'En retard'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan de développement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Plan de Développement Personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium mb-2">Court terme (3-6 mois)</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                      Compléter la certification AWS DevOps
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="h-3 w-3 text-gray-400 mt-0.5" />
                      Améliorer les compétences en public speaking
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="h-3 w-3 text-gray-400 mt-0.5" />
                      Mentorer au moins 2 développeurs juniors
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2">Moyen terme (6-12 mois)</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <Circle className="h-3 w-3 text-gray-400 mt-0.5" />
                      Prendre le lead sur un projet stratégique
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="h-3 w-3 text-gray-400 mt-0.5" />
                      Développer des compétences en architecture système
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="h-3 w-3 text-gray-400 mt-0.5" />
                      Participer à des conférences tech
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assistant IA */}
        <TabsContent value="assistant" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-500" />
                Assistant IA Personnel
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[80%] p-3 rounded-lg",
                        msg.role === 'user' 
                          ? "bg-purple-600 text-white" 
                          : "bg-gray-100 text-gray-800"
                      )}>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Bot className="h-4 w-4" />
                            <span className="text-xs font-medium">Assistant IA</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatMessage("Comment puis-je améliorer mes chances de promotion ?")}
                  >
                    Conseils promotion
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatMessage("Quelles formations me recommandez-vous ?")}
                  >
                    Formations recommandées
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatMessage("Comment équilibrer vie pro/perso ?")}
                  >
                    Équilibre vie
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Posez votre question..."
                    className="flex-1"
                  />
                  <Button onClick={sendChatMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Import manquant
const Circle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 8 8">
    <circle cx="4" cy="4" r="3" />
  </svg>
);

export default EmployeeView360;