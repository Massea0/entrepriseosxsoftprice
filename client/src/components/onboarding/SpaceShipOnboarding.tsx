import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Building2,
  Package,
  Users,
  MessageSquare,
  Heart,
  Cog,
  Target,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Globe,
  Shield,
  Zap,
  Star,
  Upload,
  Link2,
  ChevronRight,
  Loader2,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  missionControl: {
    companyName: string;
    industry: string;
    size: string;
    founded: string;
    website?: string;
    linkedinUrl?: string;
  };
  cargoBay: {
    type: 'products' | 'services' | 'both';
    mainOfferings: string[];
    targetMarket: string;
    uniqueValue: string;
  };
  navigation: {
    structure: 'flat' | 'hierarchical' | 'matrix';
    departments: string[];
    teamSize: number;
    remotePolicy: string;
  };
  communication: {
    primaryChannel: string;
    tools: string[];
    languages: string[];
    meetingFrequency: string;
  };
  crewQuarters: {
    values: string[];
    culture: string;
    benefits: string[];
    workLifeBalance: number;
  };
  engineRoom: {
    keyProcesses: string[];
    automationLevel: number;
    mainChallenges: string[];
    techStack: string[];
  };
  bridge: {
    vision: string;
    objectives: string[];
    kpis: string[];
    timeline: string;
  };
}

const SpaceShipOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [data, setData] = useState<OnboardingData>({
    missionControl: {
      companyName: '',
      industry: '',
      size: '',
      founded: '',
      website: '',
      linkedinUrl: ''
    },
    cargoBay: {
      type: 'both',
      mainOfferings: [],
      targetMarket: '',
      uniqueValue: ''
    },
    navigation: {
      structure: 'hierarchical',
      departments: [],
      teamSize: 0,
      remotePolicy: ''
    },
    communication: {
      primaryChannel: '',
      tools: [],
      languages: [],
      meetingFrequency: ''
    },
    crewQuarters: {
      values: [],
      culture: '',
      benefits: [],
      workLifeBalance: 50
    },
    engineRoom: {
      keyProcesses: [],
      automationLevel: 50,
      mainChallenges: [],
      techStack: []
    },
    bridge: {
      vision: '',
      objectives: [],
      kpis: [],
      timeline: ''
    }
  });

  const steps = [
    {
      id: 'missionControl',
      title: 'Mission Control',
      subtitle: "Centre de commandement",
      icon: Building2,
      description: "Définissons votre entreprise",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'cargoBay',
      title: 'Cargo Bay',
      subtitle: "Soute à marchandises",
      icon: Package,
      description: "Vos produits et services",
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'navigation',
      title: 'Navigation',
      subtitle: "Système de navigation",
      icon: Users,
      description: "Structure organisationnelle",
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'communication',
      title: 'Communication',
      subtitle: "Centre de communication",
      icon: MessageSquare,
      description: "Canaux et outils",
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'crewQuarters',
      title: 'Crew Quarters',
      subtitle: "Quartiers de l'équipage",
      icon: Heart,
      description: "Culture d'entreprise",
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'engineRoom',
      title: 'Engine Room',
      subtitle: "Salle des machines",
      icon: Cog,
      description: "Processus métiers",
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'bridge',
      title: 'Bridge',
      subtitle: "Pont de commandement",
      icon: Target,
      description: "Objectifs stratégiques",
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleComplete = async () => {
    setIsAnalyzing(true);
    // Simulation de l'analyse et configuration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // TODO: Sauvegarder les données en base
    console.log('Onboarding data:', data);
    
    // Rediriger vers le dashboard
    navigate('/dashboard');
  };

  const analyzeWebsite = async () => {
    if (!data.missionControl.website) return;
    
    // TODO: Implémenter l'analyse réelle du site web
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Données simulées
    setData(prev => ({
      ...prev,
      cargoBay: {
        ...prev.cargoBay,
        mainOfferings: ['Solutions Cloud', 'Consulting IT', 'Support 24/7'],
        targetMarket: 'Entreprises B2B',
        uniqueValue: 'Innovation et expertise technique'
      }
    }));
    setIsAnalyzing(false);
  };

  const analyzeLinkedIn = async () => {
    if (!data.missionControl.linkedinUrl) return;
    
    // TODO: Implémenter l'analyse réelle LinkedIn
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Données simulées
    setData(prev => ({
      ...prev,
      missionControl: {
        ...prev.missionControl,
        industry: 'Technologies de l\'information',
        size: '50-200'
      },
      crewQuarters: {
        ...prev.crewQuarters,
        values: ['Innovation', 'Collaboration', 'Excellence'],
        culture: 'Culture tech moderne avec focus sur l\'innovation'
      }
    }));
    setIsAnalyzing(false);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'missionControl':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom de l'entreprise *</Label>
                <Input
                  value={data.missionControl.companyName}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    missionControl: { ...prev.missionControl, companyName: e.target.value }
                  }))}
                  placeholder="Acme Corp"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Secteur d'activité *</Label>
                <Select
                  value={data.missionControl.industry}
                  onValueChange={(value) => setData(prev => ({
                    ...prev,
                    missionControl: { ...prev.missionControl, industry: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
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
                <Label>Taille de l'entreprise *</Label>
                <Select
                  value={data.missionControl.size}
                  onValueChange={(value) => setData(prev => ({
                    ...prev,
                    missionControl: { ...prev.missionControl, size: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
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
                  value={data.missionControl.founded}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    missionControl: { ...prev.missionControl, founded: e.target.value }
                  }))}
                  placeholder="2020"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Import Automatique (Optionnel)
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Site Web</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={data.missionControl.website}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        missionControl: { ...prev.missionControl, website: e.target.value }
                      }))}
                      placeholder="https://example.com"
                    />
                    <Button
                      onClick={analyzeWebsite}
                      disabled={!data.missionControl.website || isAnalyzing}
                      variant="outline"
                    >
                      {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                      Analyser
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Page LinkedIn</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={data.missionControl.linkedinUrl}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        missionControl: { ...prev.missionControl, linkedinUrl: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/company/..."
                    />
                    <Button
                      onClick={analyzeLinkedIn}
                      disabled={!data.missionControl.linkedinUrl || isAnalyzing}
                      variant="outline"
                    >
                      {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                      Analyser
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cargoBay':
        return (
          <div className="space-y-6">
            <div>
              <Label>Type d'offre</Label>
              <RadioGroup
                value={data.cargoBay.type}
                onValueChange={(value: 'products' | 'services' | 'both') => setData(prev => ({
                  ...prev,
                  cargoBay: { ...prev.cargoBay, type: value }
                }))}
                className="mt-2"
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
              <Label>Principales offres (séparées par des virgules)</Label>
              <Textarea
                value={data.cargoBay.mainOfferings.join(', ')}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  cargoBay: { 
                    ...prev.cargoBay, 
                    mainOfferings: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))}
                placeholder="Solution CRM, Support technique, Formation..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Marché cible</Label>
              <Input
                value={data.cargoBay.targetMarket}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  cargoBay: { ...prev.cargoBay, targetMarket: e.target.value }
                }))}
                placeholder="PME B2B en France"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Proposition de valeur unique</Label>
              <Textarea
                value={data.cargoBay.uniqueValue}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  cargoBay: { ...prev.cargoBay, uniqueValue: e.target.value }
                }))}
                placeholder="Ce qui vous différencie de la concurrence..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-6">
            <div>
              <Label>Structure organisationnelle</Label>
              <RadioGroup
                value={data.navigation.structure}
                onValueChange={(value: 'flat' | 'hierarchical' | 'matrix') => setData(prev => ({
                  ...prev,
                  navigation: { ...prev.navigation, structure: value }
                }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flat" id="flat" />
                  <Label htmlFor="flat">Plate (peu de niveaux hiérarchiques)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hierarchical" id="hierarchical" />
                  <Label htmlFor="hierarchical">Hiérarchique (structure traditionnelle)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="matrix" id="matrix" />
                  <Label htmlFor="matrix">Matricielle (double reporting)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Départements principaux (séparés par des virgules)</Label>
              <Textarea
                value={data.navigation.departments.join(', ')}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  navigation: { 
                    ...prev.navigation, 
                    departments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))}
                placeholder="RH, Finance, IT, Marketing, Ventes, Production..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Taille moyenne des équipes</Label>
              <Input
                type="number"
                value={data.navigation.teamSize}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  navigation: { ...prev.navigation, teamSize: parseInt(e.target.value) || 0 }
                }))}
                placeholder="8"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Politique de télétravail</Label>
              <Select
                value={data.navigation.remotePolicy}
                onValueChange={(value) => setData(prev => ({
                  ...prev,
                  navigation: { ...prev.navigation, remotePolicy: value }
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une politique" />
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
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <div>
              <Label>Canal de communication principal</Label>
              <Select
                value={data.communication.primaryChannel}
                onValueChange={(value) => setData(prev => ({
                  ...prev,
                  communication: { ...prev.communication, primaryChannel: value }
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un canal" />
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
                      checked={data.communication.tools.includes(tool)}
                      onCheckedChange={(checked) => {
                        setData(prev => ({
                          ...prev,
                          communication: {
                            ...prev.communication,
                            tools: checked 
                              ? [...prev.communication.tools, tool]
                              : prev.communication.tools.filter(t => t !== tool)
                          }
                        }));
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
                      checked={data.communication.languages.includes(lang)}
                      onCheckedChange={(checked) => {
                        setData(prev => ({
                          ...prev,
                          communication: {
                            ...prev.communication,
                            languages: checked 
                              ? [...prev.communication.languages, lang]
                              : prev.communication.languages.filter(l => l !== lang)
                          }
                        }));
                      }}
                    />
                    <Label>{lang}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Fréquence des réunions d'équipe</Label>
              <Select
                value={data.communication.meetingFrequency}
                onValueChange={(value) => setData(prev => ({
                  ...prev,
                  communication: { ...prev.communication, meetingFrequency: value }
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="biweekly">Bimensuelle</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'crewQuarters':
        return (
          <div className="space-y-6">
            <div>
              <Label>Valeurs de l'entreprise</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['Innovation', 'Collaboration', 'Excellence', 'Intégrité', 'Agilité', 'Responsabilité', 'Diversité', 'Transparence'].map(value => (
                  <div key={value} className="flex items-center space-x-2">
                    <Switch
                      checked={data.crewQuarters.values.includes(value)}
                      onCheckedChange={(checked) => {
                        setData(prev => ({
                          ...prev,
                          crewQuarters: {
                            ...prev.crewQuarters,
                            values: checked 
                              ? [...prev.crewQuarters.values, value]
                              : prev.crewQuarters.values.filter(v => v !== value)
                          }
                        }));
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
                value={data.crewQuarters.culture}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  crewQuarters: { ...prev.crewQuarters, culture: e.target.value }
                }))}
                placeholder="Décrivez votre culture d'entreprise..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Avantages offerts</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['Télétravail', 'Horaires flexibles', 'Formation continue', 'Assurance santé', 'Tickets restaurant', 'Sport/Bien-être', 'Stock options', 'Congés illimités'].map(benefit => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Switch
                      checked={data.crewQuarters.benefits.includes(benefit)}
                      onCheckedChange={(checked) => {
                        setData(prev => ({
                          ...prev,
                          crewQuarters: {
                            ...prev.crewQuarters,
                            benefits: checked 
                              ? [...prev.crewQuarters.benefits, benefit]
                              : prev.crewQuarters.benefits.filter(b => b !== benefit)
                          }
                        }));
                      }}
                    />
                    <Label>{benefit}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Équilibre vie pro/perso</Label>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm">Strict</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={data.crewQuarters.workLifeBalance}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    crewQuarters: { ...prev.crewQuarters, workLifeBalance: parseInt(e.target.value) }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm">Flexible</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {data.crewQuarters.workLifeBalance}% de flexibilité
              </p>
            </div>
          </div>
        );

      case 'engineRoom':
        return (
          <div className="space-y-6">
            <div>
              <Label>Processus clés (séparés par des virgules)</Label>
              <Textarea
                value={data.engineRoom.keyProcesses.join(', ')}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  engineRoom: { 
                    ...prev.engineRoom, 
                    keyProcesses: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))}
                placeholder="Vente, Support client, Développement produit, Marketing..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Niveau d'automatisation</Label>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm">Manuel</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={data.engineRoom.automationLevel}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    engineRoom: { ...prev.engineRoom, automationLevel: parseInt(e.target.value) }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm">Automatisé</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {data.engineRoom.automationLevel}% automatisé
              </p>
            </div>

            <div>
              <Label>Principaux défis (séparés par des virgules)</Label>
              <Textarea
                value={data.engineRoom.mainChallenges.join(', ')}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  engineRoom: { 
                    ...prev.engineRoom, 
                    mainChallenges: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))}
                placeholder="Scalabilité, Coûts, Temps de traitement, Qualité..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Stack technique</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['React', 'Node.js', 'Python', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis'].map(tech => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Switch
                      checked={data.engineRoom.techStack.includes(tech)}
                      onCheckedChange={(checked) => {
                        setData(prev => ({
                          ...prev,
                          engineRoom: {
                            ...prev.engineRoom,
                            techStack: checked 
                              ? [...prev.engineRoom.techStack, tech]
                              : prev.engineRoom.techStack.filter(t => t !== tech)
                          }
                        }));
                      }}
                    />
                    <Label>{tech}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'bridge':
        return (
          <div className="space-y-6">
            <div>
              <Label>Vision de l'entreprise</Label>
              <Textarea
                value={data.bridge.vision}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  bridge: { ...prev.bridge, vision: e.target.value }
                }))}
                placeholder="Où voyez-vous votre entreprise dans 5 ans ?"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Objectifs principaux (séparés par des virgules)</Label>
              <Textarea
                value={data.bridge.objectives.join(', ')}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  bridge: { 
                    ...prev.bridge, 
                    objectives: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))}
                placeholder="Croissance 50%, Expansion internationale, Nouveau produit..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>KPIs suivis (séparés par des virgules)</Label>
              <Textarea
                value={data.bridge.kpis.join(', ')}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  bridge: { 
                    ...prev.bridge, 
                    kpis: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))}
                placeholder="Chiffre d'affaires, NPS, Taux de conversion, CAC..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Timeline des objectifs</Label>
              <Select
                value={data.bridge.timeline}
                onValueChange={(value) => setData(prev => ({
                  ...prev,
                  bridge: { ...prev.bridge, timeline: value }
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="yearly">Annuel</SelectItem>
                  <SelectItem value="3years">3 ans</SelectItem>
                  <SelectItem value="5years">5 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          />
        ))}
      </div>

      {/* Intro screen */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="text-center space-y-8 max-w-2xl px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Rocket className="h-32 w-32 mx-auto text-purple-500" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-5xl font-bold text-white"
              >
                Bienvenue à bord, Commandant !
              </motion.h1>
              
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xl text-gray-300"
              >
                Préparez-vous pour un voyage de configuration unique.
                Votre vaisseau Enterprise OS vous attend.
              </motion.p>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowIntro(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Démarrer la Mission
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      {!showIntro && (
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Configuration du Vaisseau</h2>
              <Badge className="bg-purple-600 text-white">
                Étape {currentStep + 1} sur {steps.length}
              </Badge>
            </div>
            <Progress value={(currentStep + 1) * (100 / steps.length)} className="h-2" />
          </div>

          {/* Steps indicator */}
          <div className="flex justify-between mb-8 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center gap-2 min-w-[100px] cursor-pointer transition-all",
                    isActive && "scale-110",
                    !isActive && !isCompleted && "opacity-50"
                  )}
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                >
                  <div
                    className={cn(
                      "p-3 rounded-full transition-all",
                      isActive && `bg-gradient-to-br ${step.color}`,
                      isCompleted && "bg-green-500",
                      !isActive && !isCompleted && "bg-gray-700"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6 text-white" />
                    ) : (
                      <Icon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <span className="text-xs text-white text-center">{step.title}</span>
                </div>
              );
            })}
          </div>

          {/* Current step card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-800/90 backdrop-blur border-gray-700">
                <CardHeader className={cn(
                  "bg-gradient-to-r text-white",
                  steps[currentStep].color
                )}>
                  <CardTitle className="flex items-center gap-3">
                    {React.createElement(steps[currentStep].icon, { className: "h-6 w-6" })}
                    <div>
                      <h3 className="text-2xl font-bold">{steps[currentStep].title}</h3>
                      <p className="text-sm opacity-90">{steps[currentStep].subtitle}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-300 mb-6">{steps[currentStep].description}</p>
                  {renderStepContent()}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isAnimating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Décollage
                  <Rocket className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Analyzing overlay */}
      <AnimatePresence>
        {isAnalyzing && currentStep === steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          >
            <div className="text-center space-y-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="h-32 w-32 mx-auto text-purple-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">Décollage en cours...</h2>
              <p className="text-xl text-gray-300">Configuration de votre Enterprise OS</p>
              <Progress value={66} className="w-64 mx-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpaceShipOnboarding;