import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageInsight {
  id: string;
  pageContext: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'critical';
  confidence: number;
  timestamp: string;
  data?: any;
}

const INSIGHTS_STORAGE_KEY = 'synapse_page_insights';

export const usePageInsights = () => {
  const location = useLocation();
  const [insights, setInsights] = useState<PageInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const getCurrentPageContext = () => {
    if (location.pathname.includes('/devis') || location.pathname.includes('/business/quotes')) return 'devis';
    if (location.pathname.includes('/projects')) return 'projects';
    if (location.pathname.includes('/invoices') || location.pathname.includes('/business/invoices')) return 'invoices';
    if (location.pathname.includes('/employees') || location.pathname.includes('/hr')) return 'hr';
    if (location.pathname.includes('/dashboard')) return 'dashboard';
    if (location.pathname.includes('/clients') || location.pathname.includes('/business/clients')) return 'clients';
    if (location.pathname.includes('/support')) return 'support';
    return 'general';
  };

  const getStoredInsights = () => {
    try {
      const stored = localStorage.getItem(INSIGHTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Erreur lecture insights stockés:', error);
      return {};
    }
  };

  const storeInsights = (pageContext: string, pageInsights: PageInsight[]) => {
    try {
      const stored = getStoredInsights();
      stored[pageContext] = {
        insights: pageInsights,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.error('Erreur stockage insights:', error);
    }
  };

  const generatePageSpecificInsights = async (pageContext: string): Promise<PageInsight[]> => {
    const newInsights: PageInsight[] = [];

    try {
      console.log(`Generating insights for context: ${pageContext}`);
      
      switch (pageContext) {
        case 'devis': {
          console.log('Fetching devis data...');
          try {
            const response = await fetch('/api/quotes');
            if (response.ok) {
              const devisData = await response.json();
              console.log('Devis data:', devisData);
              
              if (devisData && devisData.length > 0) {
                const pendingDevis = devisData.filter((d: any) => d.status === 'sent' || d.status === 'pending');
                const acceptedDevis = devisData.filter((d: any) => d.status === 'approved');
                const totalValue = devisData.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
                
                if (pendingDevis.length > 0) {
                  newInsights.push({
                    id: `devis-pending-${Date.now()}`,
                    pageContext: 'devis',
                    title: `💼 ${pendingDevis.length} devis en attente`,
                    description: `Valeur totale: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(pendingDevis.reduce((sum: number, d: any) => sum + (d.amount || 0), 0))}`,
                    type: 'warning',
                    confidence: 0.95,
                    timestamp: new Date().toISOString(),
                    data: { pendingCount: pendingDevis.length, pendingValue: pendingDevis.reduce((sum: number, d: any) => sum + (d.amount || 0), 0) }
                  });
                }

                if (acceptedDevis.length > 0) {
                  newInsights.push({
                    id: `devis-success-${Date.now()}`,
                    pageContext: 'devis',
                    title: `✅ ${acceptedDevis.length} devis acceptés`,
                    description: `Taux de conversion: ${Math.round(acceptedDevis.length / devisData.length * 100)}%`,
                    type: 'success',
                    confidence: 0.90,
                    timestamp: new Date().toISOString(),
                    data: { acceptedCount: acceptedDevis.length, conversionRate: acceptedDevis.length / devisData.length }
                  });
                }

                newInsights.push({
                  id: `devis-overview-${Date.now()}`,
                  pageContext: 'devis',
                  title: `📊 Portfolio devis actuel`,
                  description: `${devisData.length} devis totaux, valeur: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(totalValue)}`,
                  type: 'info',
                  confidence: 1.0,
                  timestamp: new Date().toISOString(),
                  data: { totalCount: devisData.length, totalValue }
                });
              }
            }
          } catch (error) {
            console.error('Error fetching devis:', error);
          }
          break;
        }

        case 'projects': {
          console.log('Fetching projects data...');
          try {
            const response = await fetch('/api/projects');
            if (response.ok) {
              const projectsData = await response.json();
              console.log('Projects data:', projectsData);
              
              if (projectsData && projectsData.length > 0) {
                const activeProjects = projectsData.filter((p: any) => p.status === 'active' || p.status === 'in_progress');
                const completedProjects = projectsData.filter((p: any) => p.status === 'completed');
                
                newInsights.push({
                  id: `projects-active-${Date.now()}`,
                  pageContext: 'projects',
                  title: `🚀 ${activeProjects.length} projets actifs`,
                  description: activeProjects.length > 0 
                    ? `Projets en cours de développement. ${completedProjects.length} projets terminés avec succès.`
                    : `Aucun projet actif pour le moment. ${completedProjects.length} projets terminés.`,
                  type: activeProjects.length > 0 ? 'success' : 'info',
                  confidence: 0.92,
                  timestamp: new Date().toISOString(),
                  data: { activeCount: activeProjects.length, completedCount: completedProjects.length }
                });
              } else {
                // Générer un insight même sans données
                newInsights.push({
                  id: `projects-empty-${Date.now()}`,
                  pageContext: 'projects',
                  title: `📋 Aucun projet trouvé`,
                  description: `Commencez par créer votre premier projet pour organiser vos tâches.`,
                  type: 'info',
                  confidence: 1.0,
                  timestamp: new Date().toISOString(),
                  data: { activeCount: 0, totalCount: 0 }
                });
              }
            }
          } catch (error) {
            console.error('Error fetching projects:', error);
          }
          break;
        }

        case 'invoices': {
          console.log('Fetching invoices data...');
          try {
            const response = await fetch('/api/invoices');
            if (response.ok) {
              const invoicesData = await response.json();
              console.log('Invoices data:', invoicesData);
              
              if (invoicesData && invoicesData.length > 0) {
                const unpaidInvoices = invoicesData.filter((i: any) => i.status === 'sent' || i.status === 'pending');
                const overdueInvoices = invoicesData.filter((i: any) => 
                  (i.status === 'sent' || i.status === 'pending') && 
                  new Date(i.due_date) < new Date()
                );
                
                if (overdueInvoices.length > 0) {
                  newInsights.push({
                    id: `invoices-overdue-${Date.now()}`,
                    pageContext: 'invoices',
                    title: `🚨 ${overdueInvoices.length} factures en retard`,
                    description: `Action requise pour le recouvrement. Montant total en souffrance.`,
                    type: 'critical',
                    confidence: 1.0,
                    timestamp: new Date().toISOString(),
                    data: { overdueCount: overdueInvoices.length }
                  });
                } else {
                  newInsights.push({
                    id: `invoices-status-${Date.now()}`,
                    pageContext: 'invoices',
                    title: `💰 ${invoicesData.length} factures`,
                    description: `${unpaidInvoices.length} en attente de paiement, ${invoicesData.length - unpaidInvoices.length} payées.`,
                    type: unpaidInvoices.length > 0 ? 'warning' : 'success',
                    confidence: 0.9,
                    timestamp: new Date().toISOString(),
                    data: { unpaidCount: unpaidInvoices.length, totalCount: invoicesData.length }
                  });
                }
              } else {
                // Générer un insight même sans données
                newInsights.push({
                  id: `invoices-empty-${Date.now()}`,
                  pageContext: 'invoices',
                  title: `📄 Aucune facture trouvée`,
                  description: `Commencez par créer vos premières factures.`,
                  type: 'info',
                  confidence: 1.0,
                  timestamp: new Date().toISOString(),
                  data: { totalCount: 0 }
                });
              }
            }
          } catch (error) {
            console.error('Error fetching invoices:', error);
          }
          break;
        }

        case 'hr': {
          console.log('Fetching employees data...');
          try {
            const response = await fetch('/api/employees');
            if (response.ok) {
              const employeesData = await response.json();
              console.log('Employees data:', employeesData);
              
              if (employeesData && employeesData.length > 0) {
                const activeEmployees = employeesData.filter((e: any) => e.employment_status === 'active');
                const avgPerformance = activeEmployees.length > 0 
                  ? activeEmployees.reduce((sum: number, e: any) => sum + (e.performance_score || 0), 0) / activeEmployees.length 
                  : 0;
                
                newInsights.push({
                  id: `hr-performance-${Date.now()}`,
                  pageContext: 'hr',
                  title: `👥 ${activeEmployees.length} employés actifs`,
                  description: `Score de performance moyen: ${avgPerformance.toFixed(1)}/10. ${employeesData.length - activeEmployees.length} inactifs.`,
                  type: avgPerformance > 7 ? 'success' : activeEmployees.length > 0 ? 'info' : 'warning',
                  confidence: 0.88,
                  timestamp: new Date().toISOString(),
                  data: { activeCount: activeEmployees.length, totalCount: employeesData.length, avgPerformance }
                });
              } else {
                // Générer un insight même sans données
                newInsights.push({
                  id: `hr-empty-${Date.now()}`,
                  pageContext: 'hr',
                  title: `👤 Aucun employé trouvé`,
                  description: `Commencez par ajouter votre équipe dans le système RH.`,
                  type: 'info',
                  confidence: 1.0,
                  timestamp: new Date().toISOString(),
                  data: { activeCount: 0, totalCount: 0 }
                });
              }
            }
          } catch (error) {
            console.error('Error fetching employees:', error);
          }
          break;
        }

        default:
          // Insight générique pour les pages non spécifiques
          newInsights.push({
            id: `general-${Date.now()}`,
            pageContext,
            title: `📊 Page ${pageContext}`,
            description: `Bienvenue dans la section ${pageContext}. Explorez les fonctionnalités disponibles.`,
            type: 'info',
            confidence: 0.7,
            timestamp: new Date().toISOString(),
            data: {}
          });
          break;
      }
    } catch (error) {
      console.error('Error generating page insights:', error);
      // Fallback insight en cas d'erreur
      newInsights.push({
        id: `error-${Date.now()}`,
        pageContext,
        title: `⚠️ Données indisponibles`,
        description: `Impossible de charger les données pour le moment. Veuillez réessayer.`,
        type: 'warning',
        confidence: 1.0,
        timestamp: new Date().toISOString(),
        data: { error: true }
      });
    }

    console.log(`Generated ${newInsights.length} insights for ${pageContext}`);
    return newInsights;
  };

  const generateInsights = async () => {
    const pageContext = getCurrentPageContext();
    
    if (!pageContext) return;

    console.log('🎯 Generating insights for page:', pageContext);
    setLoading(true);
    
    try {
      // Vérifier le cache d'abord
      const stored = getStoredInsights();
      const cached = stored[pageContext];
      
      // Si cache valide (moins de 5 minutes)
      if (cached && (Date.now() - new Date(cached.timestamp).getTime()) < 300000) {
        console.log('📦 Using cached insights for:', pageContext);
        setInsights(cached.insights);
        setLoading(false);
        return;
      }

      const newInsights = await generatePageSpecificInsights(pageContext);
      
      setInsights(newInsights);
      storeInsights(pageContext, newInsights);
      
      console.log('✅ Insights generated and cached:', newInsights.length);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [location.pathname]);

  const refreshInsights = () => {
    generateInsights();
  };

  return {
    insights,
    loading,
    refreshInsights,
    pageContext: getCurrentPageContext()
  };
};