import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  Brain,
  UserCheck,
  UserX,
  Award,
  BarChart3,
  Zap,
  Settings,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Star,
  Calendar,
  DollarSign,
  BookOpen,
  Shield
} from 'lucide-react';
// Migrated from Supabase to Express API

// Types pour HRAgent
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position_applied: string;
  cv_url?: string;
  cover_letter?: string;
  ai_score: number;
  skills_match: number;
  experience_years: number;
  salary_expectation?: number;
  status: 'NEW' | 'SCREENED' | 'INTERVIEW_SCHEDULED' | 'INTERVIEWED' | 'OFFER_SENT' | 'HIRED' | 'REJECTED';
  ai_notes: string[];
  skills_detected: string[];
  red_flags: string[];
  strengths: string[];
  created_at: string;
  last_action: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  hire_date: string;
  salary: number;
  performance_score: number;
  satisfaction_score: number;
  skills: string[];
  turnover_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  ai_recommendations: string[];
  next_review: string;
}

interface HRMetrics {
  total_candidates: number;
  screened_today: number;
  avg_screening_time: number;
  top_talent_identified: number;
  turnover_predictions: number;
  cost_savings: number;
  automation_rate: number;
}

interface TeamOptimization {
  team_name: string;
  current_size: number;
  recommended_size: number;
  skill_gaps: string[];
  collaboration_score: number;
  productivity_score: number;
  recommendations: string[];
}

const HRAgent: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [metrics, setMetrics] = useState<HRMetrics>({
    total_candidates: 0,
    screened_today: 0,
    avg_screening_time: 2.5,
    top_talent_identified: 0,
    turnover_predictions: 0,
    cost_savings: 15000,
    automation_rate: 85
  });
  const [teamOptimizations, setTeamOptimizations] = useState<TeamOptimization[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('screening');

  // Configuration de l'agent
  const [agentConfig, setAgentConfig] = useState({
    min_cv_score: 75,
    auto_reject_threshold: 40,
    skills_weight: 0.4,
    experience_weight: 0.3,
    education_weight: 0.2,
    personality_weight: 0.1,
    turnover_alert_threshold: 0.7,
    auto_scheduling: true
  });

  // Charger les données
  const loadData = async () => {
    try {
      // Données mock pour les candidats
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'Alice Dupont',
          email: 'alice.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          position_applied: 'Développeur Full-Stack Senior',
          ai_score: 92,
          skills_match: 88,
          experience_years: 5,
          salary_expectation: 65000,
          status: 'SCREENED',
          ai_notes: [
            'Profil exceptionnel - React, Node.js, AWS',
            'Expérience startup + grande entreprise',
            'Leadership technique confirmé',
            'Soft skills excellents'
          ],
          skills_detected: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Agile'],
          red_flags: [],
          strengths: ['Leadership technique', 'Polyvalence', 'Communication'],
          created_at: new Date().toISOString(),
          last_action: 'CV analysé automatiquement'
        },
        {
          id: '2',
          name: 'Marc Martin',
          email: 'marc.martin@dev.com',
          position_applied: 'Data Scientist',
          ai_score: 78,
          skills_match: 82,
          experience_years: 3,
          salary_expectation: 55000,
          status: 'NEW',
          ai_notes: [
            'Profil technique solide',
            'Expérience limitée en production',
            'Formation continue active'
          ],
          skills_detected: ['Python', 'TensorFlow', 'SQL', 'Tableau', 'Statistics'],
          red_flags: ['Changement fréquent d\'emploi'],
          strengths: ['Innovation', 'Analyse'],
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          last_action: 'En attente de screening'
        },
        {
          id: '3',
          name: 'Sophie Chen',
          email: 'sophie.chen@designer.fr',
          position_applied: 'UX/UI Designer',
          ai_score: 85,
          skills_match: 90,
          experience_years: 4,
          salary_expectation: 48000,
          status: 'INTERVIEW_SCHEDULED',
          ai_notes: [
            'Portfolio exceptionnel',
            'Design system expertise',
            'Très créative et méthodique'
          ],
          skills_detected: ['Figma', 'Adobe Suite', 'Prototyping', 'User Research', 'Design Systems'],
          red_flags: [],
          strengths: ['Créativité', 'Méthode', 'User-centric'],
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          last_action: 'Entretien programmé pour demain'
        }
      ];

      // Données mock pour les employés
      const mockEmployees: Employee[] = [
        {
          id: '1',
          name: 'Jean Durand',
          department: 'Développement',
          position: 'Lead Developer',
          hire_date: '2020-03-15',
          salary: 70000,
          performance_score: 92,
          satisfaction_score: 78,
          skills: ['React', 'Node.js', 'Leadership', 'Architecture'],
          turnover_risk: 'MEDIUM',
          ai_recommendations: [
            'Proposer formation en cloud computing',
            'Évaluer pour promotion senior',
            'Améliorer work-life balance'
          ],
          next_review: '2025-03-15'
        },
        {
          id: '2',
          name: 'Marie Leblanc',
          department: 'Design',
          position: 'UX Designer',
          hire_date: '2021-06-01',
          salary: 45000,
          performance_score: 88,
          satisfaction_score: 95,
          skills: ['Figma', 'User Research', 'Prototyping'],
          turnover_risk: 'LOW',
          ai_recommendations: [
            'Candidat idéal pour lead UX',
            'Proposer mentorat junior designers',
            'Augmentation méritée'
          ],
          next_review: '2025-06-01'
        }
      ];

      setCandidates(mockCandidates);
      setEmployees(mockEmployees);

      // Calcul des métriques
      setMetrics({
        total_candidates: mockCandidates.length,
        screened_today: mockCandidates.filter(c => c.status !== 'NEW').length,
        avg_screening_time: 2.5,
        top_talent_identified: mockCandidates.filter(c => c.ai_score >= 85).length,
        turnover_predictions: mockEmployees.filter(e => e.turnover_risk !== 'LOW').length,
        cost_savings: 15000,
        automation_rate: 85
      });

      // Optimisations d'équipe
      setTeamOptimizations([
        {
          team_name: 'Développement Frontend',
          current_size: 4,
          recommended_size: 5,
          skill_gaps: ['Vue.js', 'Mobile Development'],
          collaboration_score: 85,
          productivity_score: 78,
          recommendations: [
            'Recruter 1 développeur Vue.js',
            'Formation mobile pour l\'équipe existante',
            'Améliorer outils de collaboration'
          ]
        },
        {
          team_name: 'Data Science',
          current_size: 2,
          recommended_size: 3,
          skill_gaps: ['MLOps', 'Big Data'],
          collaboration_score: 92,
          productivity_score: 88,
          recommendations: [
            'Recruter expert MLOps',
            'Investir en infrastructure Big Data',
            'Créer CoE Data Science'
          ]
        }
      ]);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Actions automatiques de l'agent
  const screenCandidate = async (candidateId: string) => {
    setProcessingId(candidateId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.id === candidateId && candidate.status === 'NEW') {
          // Simulation screening IA
          const screeningResults = performAIScreening(candidate);
          
          return {
            ...candidate,
            ai_score: screeningResults.score,
            skills_match: screeningResults.skillsMatch,
            status: screeningResults.score >= agentConfig.min_cv_score ? 'SCREENED' : 
                    screeningResults.score <= agentConfig.auto_reject_threshold ? 'REJECTED' : 'SCREENED',
            ai_notes: [
              ...candidate.ai_notes,
              `Screening IA complété: ${screeningResults.score}/100`,
              `Correspondance compétences: ${screeningResults.skillsMatch}%`,
              ...screeningResults.notes
            ],
            strengths: screeningResults.strengths,
            red_flags: screeningResults.redFlags,
            last_action: 'Screening automatique terminé'
          } as Candidate;
        }
        return candidate;
      });
      
      setCandidates(updatedCandidates);
      
    } catch (error) {
      console.error('Erreur screening:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const predictTurnover = async (employeeId: string) => {
    setProcessingId(employeeId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedEmployees = employees.map(employee => {
        if (employee.id === employeeId) {
          const turnoverAnalysis = analyzeTurnoverRisk(employee);
          
          return {
            ...employee,
            turnover_risk: turnoverAnalysis.riskLevel,
            ai_recommendations: [
              ...employee.ai_recommendations,
              `Analyse turnover: Risque ${turnoverAnalysis.riskLevel}`,
              ...turnoverAnalysis.recommendations
            ]
          };
        }
        return employee;
      });
      
      setEmployees(updatedEmployees);
      
    } catch (error) {
      console.error('Erreur prédiction turnover:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const optimizeTeam = async (teamName: string) => {
    setProcessingId(teamName);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulation optimisation d'équipe
      const optimizationResults = performTeamOptimization(teamName);
      
      setTeamOptimizations(prev => 
        prev.map(team => 
          team.team_name === teamName 
            ? { ...team, ...optimizationResults }
            : team
        )
      );
      
    } catch (error) {
      console.error('Erreur optimisation équipe:', error);
    } finally {
      setProcessingId(null);
    }
  };

  // Fonctions d'analyse IA
  const performAIScreening = (candidate: Candidate) => {
    // Simulation algorithme de screening
    const factors = {
      skillsScore: Math.min(100, candidate.skills_detected.length * 15 + Math.random() * 20),
      experienceScore: Math.min(100, candidate.experience_years * 20),
      educationScore: 70 + Math.random() * 30,
      communicationScore: 60 + Math.random() * 40
    };

    const weights = {
      skills: agentConfig.skills_weight,
      experience: agentConfig.experience_weight,
      education: agentConfig.education_weight,
      communication: agentConfig.personality_weight
    };

    const totalScore = Math.round(
      factors.skillsScore * weights.skills +
      factors.experienceScore * weights.experience +
      factors.educationScore * weights.education +
      factors.communicationScore * weights.communication
    );

    const skillsMatch = Math.round(factors.skillsScore * 0.9);

    return {
      score: totalScore,
      skillsMatch,
      notes: [
        `Compétences techniques: ${factors.skillsScore.toFixed(0)}/100`,
        `Expérience: ${factors.experienceScore.toFixed(0)}/100`,
        `Formation: ${factors.educationScore.toFixed(0)}/100`,
        `Communication: ${factors.communicationScore.toFixed(0)}/100`
      ],
      strengths: totalScore > 80 ? ['Profil exceptionnel', 'Compétences rares'] : ['Profil correct'],
      redFlags: totalScore < 60 ? ['Expérience insuffisante', 'Compétences limitées'] : []
    };
  };

  const analyzeTurnoverRisk = (employee: Employee) => {
    // Algorithme de prédiction turnover
    const riskFactors = {
      performance: employee.performance_score < 70 ? 0.3 : 0,
      satisfaction: employee.satisfaction_score < 60 ? 0.4 : employee.satisfaction_score < 80 ? 0.2 : 0,
      tenure: calculateTenureRisk(employee.hire_date),
      salary: employee.salary < 50000 ? 0.2 : 0
    };

    const totalRisk = Object.values(riskFactors).reduce((sum, risk) => sum + risk, 0);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    if (totalRisk < 0.3) riskLevel = 'LOW';
    else if (totalRisk < 0.6) riskLevel = 'MEDIUM';
    else riskLevel = 'HIGH';

    const recommendations = [];
    if (riskFactors.performance > 0) recommendations.push('Plan d\'amélioration performance');
    if (riskFactors.satisfaction > 0) recommendations.push('Entretien satisfaction urgent');
    if (riskFactors.salary > 0) recommendations.push('Révision salariale recommandée');

    return { riskLevel, recommendations };
  };

  const performTeamOptimization = (teamName: string) => {
    // Simulation optimisation
    return {
      productivity_score: Math.min(100, Math.round(Math.random() * 20 + 80)),
      collaboration_score: Math.min(100, Math.round(Math.random() * 15 + 85)),
      recommendations: [
        'Formation cross-fonctionnelle',
        'Amélioration process Agile',
        'Outils collaboration avancés'
      ]
    };
  };

  const calculateTenureRisk = (hireDate: string): number => {
    const yearsWorked = (Date.now() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsWorked < 1) return 0.3; // Nouveaux employés = risque
    if (yearsWorked > 5) return 0.1; // Anciens = stable
    return 0;
  };

  useEffect(() => {
    loadData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Initialisation HRAgent...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">HRAgent Assistant</h2>
            <p className="text-muted-foreground">Agent IA pour screening CV, prédiction turnover et optimisation équipes</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Brain className="w-3 h-3 mr-1" />
            ACTIF
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Config
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">CV Analysés</p>
                <p className="text-2xl font-bold">{metrics.screened_today}/{metrics.total_candidates}</p>
                <p className="text-xs text-green-600">{metrics.avg_screening_time}min moy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Top Talents</p>
                <p className="text-2xl font-bold">{metrics.top_talent_identified}</p>
                <p className="text-xs text-blue-600">Score 85+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Risques Turnover</p>
                <p className="text-2xl font-bold">{metrics.turnover_predictions}</p>
                <p className="text-xs text-orange-600">Prédictions IA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Économies</p>
                <p className="text-2xl font-bold">€{(metrics.cost_savings / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">{metrics.automation_rate}% auto</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="screening">Screening CV</TabsTrigger>
          <TabsTrigger value="turnover">Prédiction Turnover</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation Équipes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics RH</TabsTrigger>
        </TabsList>

        {/* Screening CV */}
        <TabsContent value="screening" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Pipeline de Candidats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium">{candidate.name}</h4>
                          <p className="text-sm text-muted-foreground">{candidate.position_applied}</p>
                        </div>
                        <Badge className={candidate.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                         candidate.status === 'HIRED' ? 'bg-green-100 text-green-800' :
                                         'bg-blue-100 text-blue-800'}>
                          {candidate.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(candidate.ai_score)}`}>
                            {candidate.ai_score}/100
                          </p>
                          <p className="text-xs text-muted-foreground">Score IA</p>
                        </div>
                        {candidate.status === 'NEW' && (
                          <Button 
                            size="sm"
                            onClick={() => screenCandidate(candidate.id)}
                            disabled={processingId === candidate.id}
                          >
                            {processingId === candidate.id ? (
                              <Clock className="w-4 h-4 animate-spin" />
                            ) : (
                              <Brain className="w-4 h-4" />
                            )}
                            Analyser
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Compétences détectées */}
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Compétences détectées:</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills_detected.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Correspondance et points forts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Correspondance compétences</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={candidate.skills_match} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{candidate.skills_match}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expérience</p>
                        <p className="font-medium">{candidate.experience_years} ans</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Salaire souhaité</p>
                        <p className="font-medium">
                          {candidate.salary_expectation ? `€${candidate.salary_expectation.toLocaleString()}` : 'Non précisé'}
                        </p>
                      </div>
                    </div>

                    {/* Points forts et alertes */}
                    {candidate.strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-green-700 mb-1">Points forts:</p>
                        <div className="space-y-1">
                          {candidate.strengths.map((strength, index) => (
                            <div key={index} className="text-sm text-green-600 flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {candidate.red_flags.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-red-700 mb-1">Points d'attention:</p>
                        <div className="space-y-1">
                          {candidate.red_flags.map((flag, index) => (
                            <div key={index} className="text-sm text-red-600 flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes IA */}
                    <div>
                      <p className="text-sm font-medium mb-2">Analyse IA:</p>
                      <div className="space-y-1">
                        {candidate.ai_notes.map((note, index) => (
                          <p key={index} className="text-sm text-muted-foreground">• {note}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prédiction Turnover */}
        <TabsContent value="turnover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Analyse de Turnover</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                        </div>
                        <Badge className={getRiskColor(employee.turnover_risk)}>
                          Risque {employee.turnover_risk}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => predictTurnover(employee.id)}
                          disabled={processingId === employee.id}
                        >
                          {processingId === employee.id ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <BarChart3 className="w-4 h-4" />
                          )}
                          Analyser
                        </Button>
                      </div>
                    </div>

                    {/* Métriques employé */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={employee.performance_score} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{employee.performance_score}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={employee.satisfaction_score} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{employee.satisfaction_score}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ancienneté</p>
                        <p className="font-medium">
                          {Math.round((Date.now() - new Date(employee.hire_date).getTime()) / (1000 * 60 * 60 * 24 * 365))} ans
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Salaire</p>
                        <p className="font-medium">€{employee.salary.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Compétences */}
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Compétences:</p>
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recommandations IA */}
                    <div>
                      <p className="text-sm font-medium mb-2">Recommandations IA:</p>
                      <div className="space-y-1">
                        {employee.ai_recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-blue-600 flex items-center space-x-1">
                            <Brain className="w-3 h-3" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimisation équipes */}
        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamOptimizations.map((team) => (
              <Card key={team.team_name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{team.team_name}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => optimizeTeam(team.team_name)}
                      disabled={processingId === team.team_name}
                    >
                      {processingId === team.team_name ? (
                        <Clock className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      Optimiser
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Taille équipe */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Taille actuelle</p>
                      <p className="text-2xl font-bold">{team.current_size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recommandée</p>
                      <p className="text-2xl font-bold text-blue-600">{team.recommended_size}</p>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Collaboration</span>
                        <span>{team.collaboration_score}%</span>
                      </div>
                      <Progress value={team.collaboration_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Productivité</span>
                        <span>{team.productivity_score}%</span>
                      </div>
                      <Progress value={team.productivity_score} className="h-2" />
                    </div>
                  </div>

                  {/* Gaps de compétences */}
                  <div>
                    <p className="text-sm font-medium mb-2">Compétences manquantes:</p>
                    <div className="flex flex-wrap gap-1">
                      {team.skill_gaps.map((skill, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommandations */}
                  <div>
                    <p className="text-sm font-medium mb-2">Recommandations:</p>
                    <div className="space-y-1">
                      {team.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm text-green-600 flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Efficacité du Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Temps moyen par CV</span>
                    <span className="font-medium">{metrics.avg_screening_time} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux d'automatisation</span>
                    <span className="font-medium">{metrics.automation_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Précision IA</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Économies mensuelles</span>
                    <span className="font-medium text-green-600">€{metrics.cost_savings.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prédictions Turnover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Employés analysés</span>
                    <span className="font-medium">{employees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risque élevé</span>
                    <span className="font-medium text-red-600">
                      {employees.filter(e => e.turnover_risk === 'HIGH').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risque moyen</span>
                    <span className="font-medium text-yellow-600">
                      {employees.filter(e => e.turnover_risk === 'MEDIUM').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Précision prédictive</span>
                    <span className="font-medium">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRAgent; 