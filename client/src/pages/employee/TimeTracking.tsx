import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Play, 
  Square, 
  Calendar, 
  BarChart3, 
  Timer,
  Coffee,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  HoverZone,
  StaggeredList,
  StaggeredItem,
  MagneticButton,
  EnhancedCard,
  AnimatedMetricCard,
  LiquidContainer,
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  project?: string;
  task?: string;
  description: string;
  isRunning: boolean;
  totalHours: number;
  breakTime?: number;
}

export default function TimeTracking() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    project: '',
    task: '',
    description: '',
    startTime: ''
  });
  const [loading, setLoading] = useState(false);

  // Données mockées
  const mockEntries: TimeEntry[] = [
    {
      id: '1',
      date: '2025-01-21',
      startTime: '09:00',
      endTime: '12:30',
      project: 'Site E-commerce Arcadis',
      task: 'Développement Frontend',
      description: 'Implémentation des composants de panier',
      isRunning: false,
      totalHours: 3.5,
      breakTime: 0.5
    },
    {
      id: '2',
      date: '2025-01-21',
      startTime: '14:00',
      endTime: '17:30',
      project: 'Site E-commerce Arcadis',
      task: 'Intégration API',
      description: 'Configuration API Stripe pour paiements',
      isRunning: false,
      totalHours: 3.5
    },
    {
      id: '3',
      date: '2025-01-20',
      startTime: '09:30',
      endTime: '16:45',
      project: 'Support Client TechCorp',
      task: 'Debug et maintenance',
      description: 'Résolution bugs signalés par le client',
      isRunning: false,
      totalHours: 7.25,
      breakTime: 1
    }
  ];

  const projects = [
    'Site E-commerce Arcadis',
    'Support Client TechCorp',
    'Migration Base de Données',
    'Formation interne',
    'Autre'
  ];

  useEffect(() => {
    loadTimeEntries();
  }, []);

  const loadTimeEntries = async () => {
    try {
      setLoading(true);
      // TODO: Charger depuis l'API
      setTimeEntries(mockEntries);
    } catch (error) {
      console.error('Erreur lors du chargement des temps:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (!newEntry.project || !newEntry.description) {
      alert('Veuillez sélectionner un projet et ajouter une description');
      return;
    }

    const now = new Date();
    const entry: TimeEntry = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      startTime: now.toTimeString().slice(0, 5),
      project: newEntry.project,
      task: newEntry.task,
      description: newEntry.description,
      isRunning: true,
      totalHours: 0
    };

    setCurrentEntry(entry);
    setTimeEntries(prev => [entry, ...prev]);
  };

  const stopTimer = () => {
    if (currentEntry) {
      const now = new Date();
      const endTime = now.toTimeString().slice(0, 5);
      
      // Calculer les heures travaillées
      const start = new Date(`2000-01-01 ${currentEntry.startTime}`);
      const end = new Date(`2000-01-01 ${endTime}`);
      const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      const updatedEntry = {
        ...currentEntry,
        endTime,
        isRunning: false,
        totalHours: Math.round(totalHours * 100) / 100
      };

      setTimeEntries(prev => 
        prev.map(entry => 
          entry.id === currentEntry.id ? updatedEntry : entry
        )
      );
      setCurrentEntry(null);
      
      // Réinitialiser le formulaire
      setNewEntry({
        project: '',
        task: '',
        description: '',
        startTime: ''
      });
    }
  };

  const addManualEntry = () => {
    if (!newEntry.project || !newEntry.description || !newEntry.startTime) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const entry: TimeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: newEntry.startTime,
      endTime: new Date().toTimeString().slice(0, 5),
      project: newEntry.project,
      task: newEntry.task,
      description: newEntry.description,
      isRunning: false,
      totalHours: 1 // Valeur par défaut, à calculer
    };

    setTimeEntries(prev => [entry, ...prev]);
    setNewEntry({
      project: '',
      task: '',
      description: '',
      startTime: ''
    });
  };

  // Statistiques
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return entryDate >= weekStart;
  });

  const stats = {
    todayHours: timeEntries
      .filter(entry => entry.date === today && !entry.isRunning)
      .reduce((sum, entry) => sum + entry.totalHours, 0),
    weekHours: thisWeek
      .filter(entry => !entry.isRunning)
      .reduce((sum, entry) => sum + entry.totalHours, 0),
    totalEntries: timeEntries.filter(entry => !entry.isRunning).length,
    averageDaily: thisWeek.length > 0 
      ? thisWeek.reduce((sum, entry) => sum + entry.totalHours, 0) / 7 
      : 0
  };

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={25} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Clock className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Suivi du Temps"
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-cyan-100">
                      Gérez vos heures de travail et projets avec précision ⏱️
                    </GlowText>
                  </div>
                </div>
                
                <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StaggeredItem index={0}>
                    <AnimatedMetricCard
                      title="Aujourd'hui"
                      value={`${stats.todayHours.toFixed(1)}h`}
                      icon={Clock}
                      trend={stats.todayHours > 0 ? '+' : ''}
                      gradient="from-cyan-500 to-blue-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={1}>
                    <AnimatedMetricCard
                      title="Cette semaine"
                      value={`${stats.weekHours.toFixed(1)}h`}
                      icon={Calendar}
                      trend={stats.weekHours > 35 ? '+' : '-'}
                      gradient="from-blue-500 to-purple-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={2}>
                    <AnimatedMetricCard
                      title="Entrées"
                      value={stats.totalEntries.toString()}
                      icon={BarChart3}
                      gradient="from-purple-500 to-pink-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={3}>
                    <AnimatedMetricCard
                      title="Moyenne/jour"
                      value={`${stats.averageDaily.toFixed(1)}h`}
                      icon={TrendingUp}
                      trend={stats.averageDaily > 7 ? '+' : '-'}
                      gradient="from-pink-500 to-red-500"
                    />
                  </StaggeredItem>
                </StaggeredList>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Minuteur et saisie */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Minuteur actif */}
            {currentEntry && (
              <HoverZone effect="glow">
                <EnhancedCard variant="pulse" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Timer className="h-5 w-5 animate-pulse" />
                    En cours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {/* TODO: Afficher le temps en cours */}
                      00:00:00
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Démarré à {currentEntry.startTime}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">{currentEntry.project}</p>
                    {currentEntry.task && (
                      <p className="text-sm text-muted-foreground">{currentEntry.task}</p>
                    )}
                    <p className="text-sm">{currentEntry.description}</p>
                  </div>
                  
                  <MagneticButton 
                    onClick={stopTimer}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Arrêter
                  </MagneticButton>
                </CardContent>
              </EnhancedCard>
            </HoverZone>
            )}

            {/* Formulaire de saisie */}
            <HoverZone effect="lift">
              <EnhancedCard variant="glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {currentEntry ? 'Minuteur actif' : 'Nouveau suivi'}
                </CardTitle>
                <CardDescription>
                  {currentEntry ? 'Un minuteur est déjà en cours' : 'Démarrez un nouveau suivi de temps'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Projet *</Label>
                  <Select 
                    value={newEntry.project} 
                    onValueChange={(value) => setNewEntry({...newEntry, project: value})}
                    disabled={!!currentEntry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task">Tâche (optionnel)</Label>
                  <Input
                    id="task"
                    value={newEntry.task}
                    onChange={(e) => setNewEntry({...newEntry, task: e.target.value})}
                    placeholder="Ex: Développement, Debug, Réunion..."
                    disabled={!!currentEntry}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    placeholder="Décrivez le travail effectué..."
                    rows={3}
                    disabled={!!currentEntry}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime">Heure de début (saisie manuelle)</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newEntry.startTime}
                    onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                    disabled={!!currentEntry}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={startTimer}
                    disabled={!!currentEntry}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Démarrer
                  </Button>
                  
                  {newEntry.startTime && (
                    <MagneticButton 
                      onClick={addManualEntry}
                      variant="outline"
                      disabled={!!currentEntry}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Ajouter
                    </MagneticButton>
                  )}
                </div>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
          </div>

          {/* Historique des temps */}
          <div className="lg:col-span-2 space-y-6">
            <HoverZone effect="lift">
              <EnhancedCard variant="glow" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <GlowText>Historique des temps</GlowText>
                  </CardTitle>
                <CardDescription>
                  Vos dernières entrées de temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeEntries.filter(entry => !entry.isRunning).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{entry.project}</span>
                          {entry.task && (
                            <Badge variant="outline" className="text-xs">
                              {entry.task}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {entry.startTime} - {entry.endTime}
                          </span>
                          {entry.breakTime && (
                            <span className="flex items-center gap-1">
                              <Coffee className="h-3 w-3" />
                              {entry.breakTime}h pause
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {entry.totalHours}h
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Terminé
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {timeEntries.filter(entry => !entry.isRunning).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune entrée de temps pour le moment</p>
                      <p className="text-sm">Commencez à suivre votre temps de travail</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
          </div>
        </div>
      </div>
    </div>
  );
}