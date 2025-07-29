import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  Calculator,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Building2
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

interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Company {
  id: string;
  name: string;
  email: string;
}

interface FormStep {
  title: string;
  description?: string;
  component: React.ReactNode;
  validation?: () => boolean | Promise<boolean>;
}

const QUOTE_STATUSES = [
  { value: 'draft', label: 'Brouillon', color: 'bg-gray-500', icon: FileText },
  { value: 'sent', label: 'Envoyé', color: 'bg-blue-500', icon: Clock },
  { value: 'accepted', label: 'Accepté', color: 'bg-green-500', icon: CheckCircle },
  { value: 'rejected', label: 'Refusé', color: 'bg-red-500', icon: FileText },
  { value: 'expired', label: 'Expiré', color: 'bg-gray-400', icon: Calendar }
];

export default function QuoteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({
    number: '',
    object: '',
    company_id: '',
    amount: 0,
    valid_until: '',
    notes: '',
    status: 'draft'
  });
  const [items, setItems] = useState<QuoteItem[]>([
    { description: '', quantity: 1, unit_price: 0, total: 0 }
  ]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadCompanies();
    if (isEdit) {
      loadQuote();
    } else {
      generateQuoteNumber();
      setDefaultValidUntil();
    }
  }, [id]);

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
      toast({
        title: "Erreur",
        description: "Impossible de charger les entreprises",
        variant: "destructive",
      });
    }
  };

  const generateQuoteNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const number = `DEVIS-${year}${month}-${randomId}`;
    setForm(prev => ({ ...prev, number }));
  };

  const setDefaultValidUntil = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    setForm(prev => ({
      ...prev,
      valid_until: date.toISOString().split('T')[0]
    }));
  };

  const loadQuote = async () => {
    // TODO: Implement quote loading for edit mode
    console.log('Loading quote for edit:', id);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    
    // Recalculate total
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setItems(newItems);
    
    // Update form amount
    const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
    setForm(prev => ({ ...prev, amount: totalAmount }));
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
    return QUOTE_STATUSES.find(s => s.value === status) || QUOTE_STATUSES[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // TODO: Implement actual quote creation/update
      console.log('Submitting quote:', { form, items });
      
      toast({
        title: "Succès",
        description: `Devis ${isEdit ? 'modifié' : 'créé'} avec succès`,
      });
      
      navigate('/business/quotes');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le devis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Revolutionary Multi-Step Form Configuration
  const revolutionarySteps: FormStep[] = [
    {
      title: '📋 Informations de base',
      description: 'Détails essentiels du devis',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="Numéro de devis"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="DEVIS-2024-001"
              required
              disabled={isEdit}
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
            label="Objet du devis"
            value={form.object}
            onChange={(e) => setForm({ ...form, object: e.target.value })}
            placeholder="Ex: Développement application mobile"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="Valide jusqu'au"
              type="date"
              value={form.valid_until}
              onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              >
                {QUOTE_STATUSES.map((status) => (
                  <option key={status.value} value={status.value} className="bg-gray-900">
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🛠️ Services et produits',
      description: 'Détail des prestations proposées',
      component: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Éléments du devis</h3>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-white hover:bg-purple-500/30 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <EnhancedCard key={index} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <EnhancedInput
                      label="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Description du service ou produit"
                      required
                    />
                  </div>
                  <EnhancedInput
                    label="Quantité"
                    type="number"
                    value={item.quantity.toString()}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                    min="1"
                    step="1"
                    required
                  />
                  <EnhancedInput
                    label="Prix unitaire"
                    type="number"
                    value={item.unit_price.toString()}
                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400">
                    Total: <span className="font-bold text-white">{formatCurrency(item.total)}</span>
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-xl text-white hover:bg-red-500/30 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </EnhancedCard>
            ))}
          </div>

          <EnhancedCard className="p-6">
            <div className="text-right">
              <div className="text-2xl font-bold flex items-center justify-end gap-2 text-white">
                <DollarSign className="h-6 w-6" />
                Total: {formatCurrency(form.amount)}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {items.length} élément{items.length > 1 ? 's' : ''}
              </p>
            </div>
          </EnhancedCard>
        </div>
      )
    },
    {
      title: '📝 Notes et conditions',
      description: 'Informations complémentaires',
      component: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Notes et conditions</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Conditions de réalisation, délais, garanties..."
              rows={6}
              className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
            />
          </div>

          <EnhancedCard className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">💡 Suggestions automatiques</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <strong>Délais de réalisation:</strong> À définir selon la complexité du projet
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <strong>Conditions de paiement:</strong> 30% à la commande, 70% à la livraison
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <strong>Garantie:</strong> 12 mois sur les défauts de fabrication
              </div>
            </div>
          </EnhancedCard>
        </div>
      )
    },
    {
      title: '✅ Confirmation',
      description: 'Vérifiez et validez votre devis',
      component: (
        <div className="space-y-6">
          <EnhancedCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Récapitulatif du devis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div><span className="text-gray-400">Numéro:</span> <span className="text-white font-medium">{form.number}</span></div>
                <div><span className="text-gray-400">Client:</span> <span className="text-white font-medium">{companies.find(c => c.id === form.company_id)?.name || 'Non sélectionné'}</span></div>
                <div><span className="text-gray-400">Objet:</span> <span className="text-white font-medium">{form.object || 'Non renseigné'}</span></div>
                <div><span className="text-gray-400">Valide jusqu'au:</span> <span className="text-white font-medium">{form.valid_until || 'Non renseignée'}</span></div>
              </div>
              
              <div className="space-y-3">
                <div><span className="text-gray-400">Statut:</span> <span className="text-white font-medium">{getStatusConfig(form.status).label}</span></div>
                <div><span className="text-gray-400">Total:</span> <span className="text-2xl font-bold text-purple-400">{formatCurrency(form.amount)}</span></div>
              </div>
            </div>

            {items.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Services proposés</h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-purple-500/20">
                      <div className="text-white">{item.description}</div>
                      <div className="text-gray-400">{item.quantity} × {formatCurrency(item.unit_price)} = <span className="text-white font-medium">{formatCurrency(item.total)}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {form.notes && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Notes et conditions</h4>
                <div className="p-4 bg-black/20 rounded-lg border border-purple-500/20 text-gray-300">
                  {form.notes}
                </div>
              </div>
            )}
          </EnhancedCard>
        </div>
      )
    }
  ];

  const handleQuoteComplete = async (data: any) => {
    try {
      setLoading(true);
      await handleSubmit({ preventDefault: () => {} } as any);
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
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
              text={isEdit ? "Modifier le devis" : "Nouveau devis révolutionnaire"}
              className="text-5xl font-bold mb-6"
            />
            <GlowText className="text-xl text-gray-300">
              {isEdit ? "Modifiez les informations de votre devis" : "Créez un devis professionnel et attractif"}
            </GlowText>
          </div>

          {/* Revolutionary Multi-Step Form */}
          <EnhancedCard className="p-8">
            <MultiStepForm
              steps={revolutionarySteps}
              onComplete={handleQuoteComplete}
            />
          </EnhancedCard>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/business/quotes')}
              className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-white hover:bg-purple-500/30 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux devis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
