import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { supabase } // Migrated from Supabase to Express API
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit3, 
  FileText,
  Calendar,
  Building2,
  Mail,
  DollarSign,
  ScrollText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Receipt
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Quote {
  id: string;
  number: string;
  object: string;
  amount: number;
}

interface Contract {
  id: string;
  contract_number: string;
  title: string;
  object: string;
  client_id: string;
  devis_id?: string;
  amount: number;
  currency: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  signature_date?: string;
  status: string;
  auto_renewal: boolean;
  renewal_date?: string;
  next_review_date?: string;
  payment_terms?: string;
  contract_content?: string;
  clauses?: string;
  obligations?: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800', icon: '📝' },
  active: { label: 'Actif', color: 'bg-green-100 text-green-800', icon: '✅' },
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  signed: { label: 'Signé', color: 'bg-blue-100 text-blue-800', icon: '✍️' },
  completed: { label: 'Terminé', color: 'bg-purple-100 text-purple-800', icon: '🏁' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: '❌' },
  suspended: { label: 'Suspendu', color: 'bg-orange-100 text-orange-800', icon: '⏸️' }
};

const contractTypeConfig = {
  service: { label: 'Prestation de service', icon: '🛠️' },
  maintenance: { label: 'Contrat de maintenance', icon: '🔧' },
  license: { label: 'Licence logicielle', icon: '💻' },
  consultation: { label: 'Consultation', icon: '💡' },
  support: { label: 'Support technique', icon: '🆘' },
  partnership: { label: 'Partenariat', icon: '🤝' },
  other: { label: 'Autre', icon: '📄' }
};

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<Contract | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadContractDetails();
    }
  }, [id]);

  const loadContractDetails = async () => {
    try {
      setLoading(true);
      
      // Charger le contrat
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single();

      if (contractError) throw contractError;
      setContract(contractData);

      // Charger l'entreprise cliente
      if (contractData.client_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', contractData.client_id)
          .single();

        if (companyError) throw companyError;
        setCompany(companyData);
      }

      // Charger le devis source si applicable
      if (contractData.devis_id) {
        const { data: quoteData, error: quoteError } = await supabase
          .from('devis')
          .select('id, number, object, amount')
          .eq('id', contractData.devis_id)
          .single();

        if (quoteError) throw quoteError;
        setQuote(quoteData);
      }

    } catch (error) {
      console.error('Error loading contract details:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des détails du contrat"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const canGenerateInvoice = contract?.status === 'active' || contract?.status === 'signed';

  const getContractProgress = () => {
    if (!contract) return 0;
    const start = new Date(contract.start_date);
    const end = new Date(contract.end_date);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.round((current / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className=" rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <ScrollText className="h-16 w-16 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Contrat non trouvé</h3>
        <p className="text-gray-500">Le contrat demandé n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/business/contracts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const status = statusConfig[contract.status as keyof typeof statusConfig] || statusConfig.draft;
  const contractType = contractTypeConfig[contract.contract_type as keyof typeof contractTypeConfig];
  const progress = getContractProgress();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/business/contracts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contrat {contract.contract_number}
            </h1>
            <p className="text-gray-500">
              Créé le {formatDate(contract.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={status.color}>
            <span className="mr-1">{status.icon}</span>
            {status.label}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/business/contracts/${contract.id}/edit`)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          
          {canGenerateInvoice && (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/business/invoices/new?from_contract=${contract.id}`)}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Créer Facture
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vue en onglets */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails généraux</TabsTrigger>
              <TabsTrigger value="content">Contenu du contrat</TabsTrigger>
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
            </TabsList>

            {/* Détails généraux */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ScrollText className="w-5 h-5 mr-2" />
                    Informations du contrat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Numéro</label>
                      <p className="text-sm font-semibold">{contract.contract_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Titre</label>
                      <p className="text-sm">{contract.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type de contrat</label>
                      <p className="text-sm flex items-center">
                        <span className="mr-2">{contractType?.icon}</span>
                        {contractType?.label || contract.contract_type}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Montant</label>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(contract.amount, contract.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date de début</label>
                      <p className="text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(contract.start_date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date de fin</label>
                      <p className="text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(contract.end_date)}
                      </p>
                    </div>
                  </div>

                  {contract.signature_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date de signature</label>
                      <p className="text-sm flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                        {formatDate(contract.signature_date)}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Progression du contrat</label>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Avancement</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {contract.auto_renewal && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700 font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Renouvellement automatique activé
                        {contract.renewal_date && ` - Prochaine date: ${formatDate(contract.renewal_date)}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {quote && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Devis source
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-semibold">{quote.number}</p>
                        <p className="text-sm text-gray-600">{quote.object}</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(quote.amount, contract.currency)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/business/quotes/${quote.id}`)}
                      >
                        Voir le devis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Contenu du contrat */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Objet du contrat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                    {contract.object || 'Aucun objet défini'}
                  </p>
                </CardContent>
              </Card>

              {contract.contract_content && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contenu détaillé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                      {contract.contract_content}
                    </div>
                  </CardContent>
                </Card>
              )}

              {contract.clauses && (
                <Card>
                  <CardHeader>
                    <CardTitle>Clauses particulières</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap bg-yellow-50 p-4 rounded-md border border-yellow-200">
                      {contract.clauses}
                    </div>
                  </CardContent>
                </Card>
              )}

              {contract.obligations && (
                <Card>
                  <CardHeader>
                    <CardTitle>Obligations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap bg-blue-50 p-4 rounded-md border border-blue-200">
                      {contract.obligations}
                    </div>
                  </CardContent>
                </Card>
              )}

              {contract.payment_terms && (
                <Card>
                  <CardHeader>
                    <CardTitle>Conditions de paiement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap bg-green-50 p-4 rounded-md border border-green-200">
                      {contract.payment_terms}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Chronologie */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique du contrat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Contrat créé</p>
                        <p className="text-sm text-gray-600">{formatDate(contract.created_at)}</p>
                      </div>
                    </div>

                    {contract.signature_date && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-md">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Contrat signé</p>
                          <p className="text-sm text-gray-600">{formatDate(contract.signature_date)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Début d'exécution</p>
                        <p className="text-sm text-gray-600">{formatDate(contract.start_date)}</p>
                      </div>
                    </div>

                    {contract.next_review_date && (
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-md">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">Prochaine révision</p>
                          <p className="text-sm text-gray-600">{formatDate(contract.next_review_date)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Fin de contrat</p>
                        <p className="text-sm text-gray-600">{formatDate(contract.end_date)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company ? (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {company.email}
                    </div>
                    
                    {company.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2">📞</span>
                        {company.phone}
                      </div>
                    )}
                    
                    {company.address && (
                      <div className="text-sm text-gray-600">
                        <p className="mt-2">{company.address}</p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/business/clients/${company.id}`)}
                  >
                    Voir le profil client
                  </Button>
                </>
              ) : (
                <p className="text-gray-500">Aucune information client disponible</p>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/business/contracts/${contract.id}/edit`)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Modifier le contrat
              </Button>
              
              {canGenerateInvoice && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/business/invoices/new?from_contract=${contract.id}`)}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Créer une facture
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.print()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Imprimer / PDF
              </Button>
            </CardContent>
          </Card>

          {/* Résumé financier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Résumé financier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Valeur du contrat</span>
                <span className="font-semibold">
                  {formatCurrency(contract.amount, contract.currency)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Devise</span>
                <span className="font-semibold">{contract.currency}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Progression</span>
                <span className="font-semibold">{progress}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 