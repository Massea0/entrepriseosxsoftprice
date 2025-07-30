import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
// import { supabase } // Migrated from Supabase to Express API
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit3, 
  FileText,
  Calendar,
  Building2,
  Mail,
  Calculator,
  ScrollText
} from 'lucide-react';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

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
  company_id: string;
  amount: number;
  valid_until: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Approuvé', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Expiré', color: 'bg-orange-100 text-orange-800' }
};

export default function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadQuoteDetails();
    }
  }, [id]);

  const loadQuoteDetails = async () => {
    try {
      setLoading(true);
      
      // Charger le devis
      const { data: quoteData, error: quoteError } = await supabase
        .from('devis')
        .select('*')
        .eq('id', id)
        .single();

      if (quoteError) throw quoteError;
      setQuote(quoteData);

      // Charger l'entreprise cliente
      if (quoteData.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', quoteData.company_id)
          .single();

        if (companyError) throw companyError;
        setCompany(companyData);
      }

      // Charger les items du devis
      const { data: itemsData, error: itemsError } = await supabase
        .from('devis_items')
        .select('*')
        .eq('devis_id', id)
        .order('id');

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

    } catch (error) {
      console.error('Error loading quote details:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des détails du devis"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const canGenerateContract = quote?.status === 'approved';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className=" rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <FileText className="h-16 w-16 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Devis non trouvé</h3>
        <p className="text-gray-500">Le devis demandé n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/business/quotes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const status = statusConfig[quote.status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/business/quotes')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Devis {quote.number}
            </h1>
            <p className="text-gray-500">
              Créé le {formatDate(quote.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={status.color}>
            {status.label}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/business/quotes/edit/${quote.id}`)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          
          {canGenerateContract && (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/business/contracts/new?from_quote=${quote.id}`)}
            >
              <ScrollText className="w-4 h-4 mr-2" />
              Générer Contrat
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Détails du devis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Détails du devis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Numéro</label>
                  <p className="text-sm font-semibold">{quote.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Objet</label>
                  <p className="text-sm">{quote.object}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Montant total</label>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(quote.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valable jusqu'au</label>
                  <p className="text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(quote.valid_until)}
                  </p>
                </div>
              </div>
              
              {quote.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {quote.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items du devis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Articles ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Quantité</TableHead>
                    <TableHead className="text-right">Prix unitaire</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Separator className="my-4" />
              
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total HT</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(quote.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations client */}
        <div className="space-y-6">
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
                onClick={() => navigate(`/business/quotes/edit/${quote.id}`)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Modifier le devis
              </Button>
              
              {canGenerateContract && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/business/contracts/new?from_quote=${quote.id}`)}
                >
                  <ScrollText className="w-4 h-4 mr-2" />
                  Générer un contrat
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
        </div>
      </div>
    </div>
  );
} 