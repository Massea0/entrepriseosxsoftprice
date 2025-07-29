import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle2, 
  Circle, 
  Rocket, 
  Target, 
  BarChart3, 
  Repeat, 
  Smartphone, 
  Link, 
  Zap, 
  TestTube,
  Award,
  Download
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface ChecklistSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
  description: string;
}

const InteractiveChecklist: React.FC = () => {
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      id: 'env',
      title: 'Environnement & Démarrage',
      icon: <Rocket className="h-5 w-5" />,
      description: 'Vérifications préliminaires essentielles',
      items: [
        { id: 'env-1', label: 'Serveur de développement lancé (npm run dev)', checked: false, priority: 'high' },
        { id: 'env-2', label: 'Base de données Supabase connectée', checked: false, priority: 'high' },
        { id: 'env-3', label: 'Aucune erreur TypeScript/ESLint dans la console', checked: false, priority: 'high' },
        { id: 'env-4', label: 'Application accessible sur http://localhost:8080', checked: false, priority: 'high' }
      ]
    },
    {
      id: 'voice',
      title: 'Synapse Voice Assistant',
      icon: <Target className="h-5 w-5" />,
      description: 'Interface vocale et commandes complexes',
      items: [
        { id: 'voice-1', label: 'Page Synapse accessible via navigation', checked: false, priority: 'high' },
        { id: 'voice-2', label: 'Bouton microphone visible et interactif', checked: false, priority: 'high' },
        { id: 'voice-3', label: 'Visualiseur audio fonctionne (animation lors de la parole)', checked: false, priority: 'medium' },
        { id: 'voice-4', label: 'Reconnaissance vocale se lance sans erreur', checked: false, priority: 'high' },
        { id: 'voice-5', label: 'Réponses vocales audibles et claires', checked: false, priority: 'high' },
        { id: 'voice-6', label: 'Commande "Créer un projet [nom]" fonctionne', checked: false, priority: 'high' },
        { id: 'voice-7', label: 'Commande "Montrer les tâches urgentes" fonctionne', checked: false, priority: 'medium' },
        { id: 'voice-8', label: 'Tool Calls exécutés automatiquement', checked: false, priority: 'high' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics Prédictives IA',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Dashboard et prédictions temps réel',
      items: [
        { id: 'analytics-1', label: 'Onglet "Analytics Prédictives" accessible', checked: false, priority: 'high' },
        { id: 'analytics-2', label: 'Modèles ML affichés avec métriques de performance', checked: false, priority: 'high' },
        { id: 'analytics-3', label: 'Précision >90% indiquée pour les modèles actifs', checked: false, priority: 'high' },
        { id: 'analytics-4', label: 'Streaming temps réel fonctionne (bouton Start/Stop)', checked: false, priority: 'medium' },
        { id: 'analytics-5', label: 'Insights temps réel générés automatiquement', checked: false, priority: 'high' },
        { id: 'analytics-6', label: 'Alertes prédictives affichées', checked: false, priority: 'medium' },
        { id: 'analytics-7', label: 'Recommandations actionables présentes', checked: false, priority: 'high' }
      ]
    },
    {
      id: 'workflows',
      title: 'Workflows IA',
      icon: <Repeat className="h-5 w-5" />,
      description: 'Automatisation intelligente',
      items: [
        { id: 'workflows-1', label: 'Onglet "Workflows IA" accessible', checked: false, priority: 'high' },
        { id: 'workflows-2', label: 'Orchestrateur IA opérationnel', checked: false, priority: 'high' },
        { id: 'workflows-3', label: 'Déclencheurs intelligents configurables', checked: false, priority: 'medium' },
        { id: 'workflows-4', label: 'Actions automatisées entre modules', checked: false, priority: 'high' },
        { id: 'workflows-5', label: 'Création de nouveaux workflows possible', checked: false, priority: 'medium' },
        { id: 'workflows-6', label: 'Exécution automatique selon conditions', checked: false, priority: 'high' }
      ]
    },
    {
      id: 'pwa',
      title: 'API Mobile & PWA',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Progressive Web App et interface mobile',
      items: [
        { id: 'pwa-1', label: 'Manifeste PWA détecté par le navigateur', checked: false, priority: 'high' },
        { id: 'pwa-2', label: 'Service Worker installé et actif', checked: false, priority: 'high' },
        { id: 'pwa-3', label: 'Installation PWA proposée (bouton "Installer")', checked: false, priority: 'high' },
        { id: 'pwa-4', label: 'Fonctionnement hors ligne basic', checked: false, priority: 'medium' },
        { id: 'pwa-5', label: 'Interface responsive sur mobile/tablette', checked: false, priority: 'high' },
        { id: 'pwa-6', label: 'Navigation mobile adaptée', checked: false, priority: 'medium' }
      ]
    },
    {
      id: 'integrations',
      title: 'Intégrations Tierces',
      icon: <Link className="h-5 w-5" />,
      description: 'Slack, Teams, WhatsApp et webhooks',
      items: [
        { id: 'integrations-1', label: 'Onglet "Intégrations" accessible', checked: false, priority: 'high' },
        { id: 'integrations-2', label: 'Configuration Slack disponible', checked: false, priority: 'medium' },
        { id: 'integrations-3', label: 'Configuration Microsoft Teams disponible', checked: false, priority: 'medium' },
        { id: 'integrations-4', label: 'Configuration WhatsApp Business disponible', checked: false, priority: 'medium' },
        { id: 'integrations-5', label: 'Test notifications cross-platform', checked: false, priority: 'high' },
        { id: 'integrations-6', label: 'Monitoring statut intégrations', checked: false, priority: 'medium' }
      ]
    },
    {
      id: 'performance',
      title: 'Performance & Sécurité',
      icon: <Zap className="h-5 w-5" />,
      description: 'Optimisations IA et conformité RGPD',
      items: [
        { id: 'performance-1', label: 'Onglet "Performance & Sécurité" accessible', checked: false, priority: 'high' },
        { id: 'performance-2', label: 'Cache intelligent multi-niveaux actif', checked: false, priority: 'medium' },
        { id: 'performance-3', label: 'Métriques performance visibles', checked: false, priority: 'high' },
        { id: 'performance-4', label: 'Gestion consentements RGPD implémentée', checked: false, priority: 'high' },
        { id: 'performance-5', label: 'Chiffrement AES-256-GCM actif', checked: false, priority: 'high' },
        { id: 'performance-6', label: 'Audit trail disponible', checked: false, priority: 'medium' }
      ]
    },
    {
      id: 'quality',
      title: 'Tests & Qualité',
      icon: <TestTube className="h-5 w-5" />,
      description: 'Validation fonctionnelle et performance',
      items: [
        { id: 'quality-1', label: 'Navigation entre tous les onglets fluide', checked: false, priority: 'high' },
        { id: 'quality-2', label: 'Aucune erreur console JavaScript', checked: false, priority: 'high' },
        { id: 'quality-3', label: 'Temps de chargement < 3 secondes', checked: false, priority: 'medium' },
        { id: 'quality-4', label: 'API responses < 1 seconde', checked: false, priority: 'medium' },
        { id: 'quality-5', label: 'Interface fluide sans lag', checked: false, priority: 'high' }
      ]
    }
  ]);

  const [totalProgress, setTotalProgress] = useState(0);
  const [validationScore, setValidationScore] = useState(0);

  // Charger la progression sauvegardée
  useEffect(() => {
    const savedProgress = localStorage.getItem('sprint3-checklist-progress');
    if (savedProgress) {
      try {
        const parsedSections = JSON.parse(savedProgress);
        setSections(parsedSections);
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
      }
    }
  }, []);

  // Calculer le progrès total
  useEffect(() => {
    const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
    const checkedItems = sections.reduce((acc, section) => 
      acc + section.items.filter(item => item.checked).length, 0
    );
    
    const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    setTotalProgress(progress);
    
    // Calculer le score avec pondération par priorité
    const weightedScore = sections.reduce((acc, section) => {
      return acc + section.items.reduce((sectionAcc, item) => {
        if (!item.checked) return sectionAcc;
        const weight = item.priority === 'high' ? 3 : item.priority === 'medium' ? 2 : 1;
        return sectionAcc + weight;
      }, 0);
    }, 0);
    
    const maxScore = sections.reduce((acc, section) => {
      return acc + section.items.reduce((sectionAcc, item) => {
        const weight = item.priority === 'high' ? 3 : item.priority === 'medium' ? 2 : 1;
        return sectionAcc + weight;
      }, 0);
    }, 0);
    
    setValidationScore(maxScore > 0 ? Math.round((weightedScore / maxScore) * 100) : 0);
    
    // Sauvegarder automatiquement
    localStorage.setItem('sprint3-checklist-progress', JSON.stringify(sections));
  }, [sections]);

  const toggleItem = (sectionId: string, itemId: string) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId 
                  ? { ...item, checked: !item.checked }
                  : item
              )
            }
          : section
      )
    );
  };

  const getSectionProgress = (section: ChecklistSection) => {
    const total = section.items.length;
    const checked = section.items.filter(item => item.checked).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const resetProgress = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toute la progression ?')) {
      setSections(prevSections => 
        prevSections.map(section => ({
          ...section,
          items: section.items.map(item => ({ ...item, checked: false }))
        }))
      );
      localStorage.removeItem('sprint3-checklist-progress');
    }
  };

  const exportProgress = () => {
    const exportData = {
      date: new Date().toISOString(),
      totalProgress,
      validationScore,
      sections: sections.map(section => ({
        title: section.title,
        progress: getSectionProgress(section),
        items: section.items.map(item => ({
          label: item.label,
          checked: item.checked,
          priority: item.priority
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint3-validation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSuccessLevel = () => {
    if (validationScore >= 85) return { level: 'Excellent', color: 'green', icon: <Award className="h-4 w-4" /> };
    if (validationScore >= 70) return { level: 'Bon', color: 'blue', icon: <CheckCircle2 className="h-4 w-4" /> };
    if (validationScore >= 50) return { level: 'Moyen', color: 'yellow', icon: <Circle className="h-4 w-4" /> };
    return { level: 'Insuffisant', color: 'red', icon: <Circle className="h-4 w-4" /> };
  };

  const success = getSuccessLevel();

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec progrès global */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-500" />
                Validation Sprint 3 - IA Avancée
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Checklist interactive de validation avec sauvegarde automatique
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{totalProgress}%</div>
              <Badge variant={success.color === 'green' ? 'default' : 'secondary'} className="mt-1">
                {success.icon}
                {success.level}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progrès global</span>
              <span>{sections.reduce((acc, s) => acc + s.items.filter(i => i.checked).length, 0)} / {sections.reduce((acc, s) => acc + s.items.length, 0)} éléments</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Score de validation pondéré</span>
              <span className="font-semibold">{validationScore}/100</span>
            </div>
            <Progress value={validationScore} className="h-2" />
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={resetProgress} variant="outline" size="sm">
              Réinitialiser
            </Button>
            <Button onClick={exportProgress} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Sections de validation */}
      <div className="grid gap-6">
        {sections.map((section) => {
          const sectionProgress = getSectionProgress(section);
          const isComplete = sectionProgress === 100;
          
          return (
            <Card key={section.id} className={isComplete ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {section.icon}
                    {section.title}
                    {isComplete && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  </CardTitle>
                  <div className="text-right">
                    <div className="font-semibold">{sectionProgress}%</div>
                    <div className="text-sm text-gray-600">
                      {section.items.filter(item => item.checked).length}/{section.items.length}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{section.description}</p>
                <Progress value={sectionProgress} className="h-2" />
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(section.id, item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          className={`cursor-pointer ${item.checked ? 'line-through text-gray-500' : ''}`}
                          onClick={() => toggleItem(section.id, item.id)}
                        >
                          {item.label}
                        </label>
                        <Badge 
                          variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                          className="ml-2 text-xs"
                        >
                          {item.priority === 'high' ? 'Critique' : item.priority === 'medium' ? 'Important' : 'Optionnel'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Résumé final */}
      {totalProgress > 0 && (
        <Card className={validationScore >= 85 ? 'border-green-200 bg-green-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Résultat de Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalProgress}%</div>
                <div className="text-sm text-gray-600">Progression</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{validationScore}</div>
                <div className="text-sm text-gray-600">Score Final</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {sections.reduce((acc, s) => acc + s.items.filter(i => i.checked).length, 0)}
                </div>
                <div className="text-sm text-gray-600">Éléments Validés</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${success.color === 'green' ? 'text-green-600' : success.color === 'blue' ? 'text-blue-600' : success.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {success.level}
                </div>
                <div className="text-sm text-gray-600">Niveau</div>
              </div>
            </div>
            
            {validationScore >= 85 && (
              <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">🎉 Sprint 3 Validé avec Succès !</span>
                </div>
                <p className="text-green-700 mt-1">
                  Félicitations ! Votre implémentation du Sprint 3 "IA Avancée" répond aux critères de qualité enterprise.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveChecklist; 