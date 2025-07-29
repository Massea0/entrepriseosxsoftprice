import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Calendar,
  DollarSign,
  Send,
  CheckCircle,
  Building2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Users,
  Shield,
  Clock,
  Archive
} from 'lucide-react';

// Revolutionary Design System
import { 
  FloatingParticles, 
  MorphingBlob, 
  TypewriterText, 
  GlowText
} from '@/components/ui/EnhancedAnimations';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { MultiStepForm } from '@/components/ui/MultiStepForm';
import { EnhancedInput } from '@/components/ui/EnhancedInput';

interface Company {
  id: string;
  name: string;
  email: string;
}

interface Quote {
  id: string;
  number: string;
  object: string;
  amount: number;
  company_id: string;
  company?: { name: string };
}

interface FormStep {
  title: string;
  description?: string;
  component: React.ReactNode;
  validation?: () => boolean | Promise<boolean>;
}

const CONTRACT_STATUSES = [
  { value: 'draft', label: 'Brouillon', color: 'bg-gray-500', icon: FileText },
  { value: 'pending', label: 'En attente', color: 'bg-yellow-500', icon: Clock },
  { value: 'active', label: 'Actif', color: 'bg-green-500', icon: CheckCircle },
  { value: 'completed', label: 'Terminé', color: 'bg-blue-500', icon: Archive },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-500', icon: AlertTriangle }
];

const CONTRACT_TYPES = [
  { value: 'service', label: 'Prestation de service' },
  { value: 'maintenance', label: 'Contrat de maintenance' },
  { value: 'license', label: 'Licence logicielle' },
  { value: 'consulting', label: 'Conseil et expertise' },
  { value: 'development', label: 'Développement sur mesure' },
  { value: 'support', label: 'Support technique' }
];

const RENEWAL_TYPES = [
  { value: 'none', label: 'Pas de renouvellement' },
  { value: 'automatic', label: 'Renouvellement automatique' },
  { value: 'manual', label: 'Renouvellement manuel' }
];

export default function ContractForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
    const isEdit = id && id !== 'new';
  const fromQuoteId = searchParams.get('from_quote');
  
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [form, setForm] = useState({
    number: '',
    title: '',
    company_id: '',
    quote_id: '',
    amount: 0,
    start_date: '',
    end_date: '',
    type: 'service',
    status: 'draft',
    renewal_type: 'none',
    renewal_period: 12,
    payment_terms: '30',
    deliverables: '',
    terms_conditions: '',
    confidentiality: false,
    penalty_clause: false,
    warranty_period: 12,
    notes: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadCompanies();
    loadQuotes();
    if (isEdit) {
      loadContract();
    } else {
      generateContractNumber();
      setDefaultDates();
      if (fromQuoteId) {
        loadQuoteData(fromQuoteId);
      }
    }
  }, [id, fromQuoteId]);

  const loadCompanies = async () => {
    try {
      // TODO: Replace with actual API call
      const mockCompanies = [
        { id: '1', name: 'Entreprise ABC', email: 'contact@abc.com' },
        { id: '2', name: 'Société XYZ', email: 'info@xyz.com' },
        { id: '3', name: 'Cabinet Conseil', email: 'contact@conseil.com' }
      ];
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    }
  };

  const loadQuotes = async () => {
    try {
      // TODO: Replace with actual API call
      const mockQuotes = [
        { id: '1', number: 'DEVIS-2024-001', object: 'Développement app', amount: 25000, company_id: '1', company: { name: 'Entreprise ABC' } },
        { id: '2', number: 'DEVIS-2024-002', object: 'Maintenance système', amount: 15000, company_id: '2', company: { name: 'Société XYZ' } }
      ];
      setQuotes(mockQuotes);
    } catch (error) {
      console.error('Erreur lors du chargement des devis:', error);
    }
  };

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const number = `CTR-${year}${month}-${randomId}`;
    setForm(prev => ({ ...prev, number }));
  };

  const setDefaultDates = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    setForm(prev => ({
      ...prev,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    }));
  };

  const loadQuoteData = async (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
      setForm(prev => ({
        ...prev,
        quote_id: quoteId,
        company_id: quote.company_id,
        title: `Contrat - ${quote.object}`,
        amount: quote.amount
      }));
    }
  };

  const loadContract = async () => {
    // TODO: Implement contract loading for edit mode
    console.log('Loading contract for edit:', id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    return CONTRACT_STATUSES.find(s => s.value === status) || CONTRACT_STATUSES[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // TODO: Implement actual contract creation/update
      console.log('Submitting contract:', form);
      
      toast({
        title: "Succès",
        description: `Contrat ${isEdit ? 'modifié' : 'créé'} avec succès`,
      });
      
      navigate('/business/contracts');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contrat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Revolutionary Multi-Step Form Configuration
  const revolutionarySteps: FormStep[] = [
    {
      title: '📋 Informations générales',
      description: 'Détails de base du contrat',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="Numéro de contrat"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="CTR-2024-001"
              required
              disabled={!!isEdit}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Client *</label>
              <select
                value={form.company_id}
                onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              >
                <option value="">Sélectionner un client</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id} className="bg-gray-900">
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <EnhancedInput
            label="Titre du contrat"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Contrat de développement application mobile"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Type de contrat</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              >
                {CONTRACT_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-gray-900">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              >
                {CONTRACT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value} className="bg-gray-900">
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {fromQuoteId && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Devis de référence</label>
              <select
                value={form.quote_id}
                onChange={(e) => setForm({ ...form, quote_id: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              >
                <option value="">Aucun devis</option>
                {quotes.map((quote) => (
                  <option key={quote.id} value={quote.id} className="bg-gray-900">
                    {quote.number} - {quote.object} ({formatCurrency(quote.amount)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )
    },
    {
      title: '📅 Dates et durée',
      description: 'Période et conditions de renouvellement',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="Date de début"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
            
            <EnhancedInput
              label="Date de fin"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Type de renouvellement</label>
              <select
                value={form.renewal_type}
                onChange={(e) => setForm({ ...form, renewal_type: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              >
                {RENEWAL_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-gray-900">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {form.renewal_type !== 'none' && (
              <EnhancedInput
                label="Période de renouvellement (mois)"
                type="number"
                value={form.renewal_period.toString()}
                onChange={(e) => setForm({ ...form, renewal_period: parseInt(e.target.value) || 12 })}
                min="1"
                max="60"
              />
            )}
          </div>
        </div>
      )
    },
    {
      title: '💰 Conditions financières',
      description: 'Montant et modalités de paiement',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="Montant total"
              type="number"
              value={form.amount.toString()}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              required
            />

            <EnhancedInput
              label="Délai de paiement (jours)"
              type="number"
              value={form.payment_terms}
              onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
              min="1"
              max="120"
              placeholder="30"
            />
          </div>

          <EnhancedCard className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">💡 Résumé financier</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">{formatCurrency(form.amount)}</div>
                <div className="text-sm text-gray-400">Montant total</div>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">{form.payment_terms} jours</div>
                <div className="text-sm text-gray-400">Délai de paiement</div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{form.warranty_period} mois</div>
                <div className="text-sm text-gray-400">Garantie</div>
              </div>
            </div>
          </EnhancedCard>
        </div>
      )
    },
    {
      title: '📝 Clauses et conditions',
      description: 'Termes contractuels et livrables',
      component: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Livrables et objectifs</label>
            <textarea
              value={form.deliverables}
              onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
              placeholder="Décrivez les livrables attendus, les objectifs et les critères de réussite..."
              rows={4}
              className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Termes et conditions</label>
            <textarea
              value={form.terms_conditions}
              onChange={(e) => setForm({ ...form, terms_conditions: e.target.value })}
              placeholder="Conditions générales, responsabilités, limitations..."
              rows={4}
              className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="confidentiality"
                  checked={form.confidentiality}
                  onChange={(e) => setForm({ ...form, confidentiality: e.target.checked })}
                  className="w-4 h-4 text-purple-600 bg-gray-900 border-purple-500 rounded focus:ring-purple-500"
                />
                <label htmlFor="confidentiality" className="text-white">Clause de confidentialité</label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="penalty"
                  checked={form.penalty_clause}
                  onChange={(e) => setForm({ ...form, penalty_clause: e.target.checked })}
                  className="w-4 h-4 text-purple-600 bg-gray-900 border-purple-500 rounded focus:ring-purple-500"
                />
                <label htmlFor="penalty" className="text-white">Clause de pénalité</label>
              </div>
            </div>

            <EnhancedInput
              label="Période de garantie (mois)"
              type="number"
              value={form.warranty_period.toString()}
              onChange={(e) => setForm({ ...form, warranty_period: parseInt(e.target.value) || 12 })}
              min="0"
              max="60"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Notes internes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes pour l'équipe, rappels, informations complémentaires..."
              rows={3}
              className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
            />
          </div>
        </div>
      )
    },
    {
      title: '✅ Validation finale',
      description: 'Vérifiez et validez votre contrat',
      component: (
        <div className="space-y-6">
          <EnhancedCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Récapitulatif du contrat</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div><span className="text-gray-400">Numéro:</span> <span className="text-white font-medium">{form.number}</span></div>
                <div><span className="text-gray-400">Client:</span> <span className="text-white font-medium">{companies.find(c => c.id === form.company_id)?.name || 'Non sélectionné'}</span></div>
                <div><span className="text-gray-400">Titre:</span> <span className="text-white font-medium">{form.title || 'Non renseigné'}</span></div>
                <div><span className="text-gray-400">Type:</span> <span className="text-white font-medium">{CONTRACT_TYPES.find(t => t.value === form.type)?.label}</span></div>
                <div><span className="text-gray-400">Période:</span> <span className="text-white font-medium">{form.start_date} → {form.end_date}</span></div>
              </div>
              
              <div className="space-y-3">
                <div><span className="text-gray-400">Statut:</span> <span className="text-white font-medium">{getStatusConfig(form.status).label}</span></div>
                <div><span className="text-gray-400">Montant:</span> <span className="text-2xl font-bold text-purple-400">{formatCurrency(form.amount)}</span></div>
                <div><span className="text-gray-400">Paiement:</span> <span className="text-white font-medium">{form.payment_terms} jours</span></div>
                <div><span className="text-gray-400">Renouvellement:</span> <span className="text-white font-medium">{RENEWAL_TYPES.find(r => r.value === form.renewal_type)?.label}</span></div>
                <div><span className="text-gray-400">Garantie:</span> <span className="text-white font-medium">{form.warranty_period} mois</span></div>
              </div>
            </div>

            {form.deliverables && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Livrables</h4>
                <div className="p-4 bg-black/20 rounded-lg border border-purple-500/20 text-gray-300">
                  {form.deliverables}
                </div>
              </div>
            )}

            {(form.confidentiality || form.penalty_clause) && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Clauses spéciales</h4>
                <div className="flex gap-4">
                  {form.confidentiality && (
                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                      <Shield className="h-4 w-4 inline mr-1" />
                      Confidentialité
                    </div>
                  )}
                  {form.penalty_clause && (
                    <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      Pénalités
                    </div>
                  )}
                </div>
              </div>
            )}
          </EnhancedCard>
        </div>
      )
    }
  ];

  const handleContractComplete = async (data: any) => {
    try {
      setLoading(true);
      await handleSubmit({ preventDefault: () => {} } as any);
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      <FloatingParticles />
      <MorphingBlob />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Revolutionary Header */}
          <div className="text-center mb-12">
            <TypewriterText 
              text={isEdit ? "Modifier le contrat" : "Nouveau contrat révolutionnaire"}
              className="text-5xl font-bold mb-6"
            />
            <GlowText className="text-xl text-gray-300">
              {isEdit ? "Modifiez les termes de votre contrat" : "Créez un contrat professionnel et sécurisé"}
            </GlowText>
            {fromQuoteId && (
              <p className="text-purple-400 mt-2">✨ Généré automatiquement depuis un devis</p>
            )}
          </div>

          {/* Revolutionary Multi-Step Form */}
          <EnhancedCard className="p-8">
            <MultiStepForm
              steps={revolutionarySteps}
              onComplete={handleContractComplete}
            />
          </EnhancedCard>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/business/contracts')}
              className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-white hover:bg-purple-500/30 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux contrats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
