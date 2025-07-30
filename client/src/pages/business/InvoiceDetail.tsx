import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  CreditCard,
  DollarSign,
  Receipt
} from 'lucide-react';

interface InvoiceItem {
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

interface Invoice {
  id: string;
  invoice_number: string;
  object: string;
  company_id: string;
  amount: number;
  due_date: string;
  notes?: string;
  status: string;
  payment_method: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  sent: { label: 'Envoyée', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Payée', color: 'bg-green-100 text-green-800' },
  overdue: { label: 'En retard', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Annulée', color: 'bg-orange-100 text-orange-800' }
};

const paymentMethodConfig = {
  bank_transfer: { label: 'Virement bancaire', icon: '🏦' },
  credit_card: { label: 'Carte de crédit', icon: '💳' },
  cash: { label: 'Espèces', icon: '💵' },
  check: { label: 'Chèque', icon: '🏧' },
  mobile_money: { label: 'Mobile Money', icon: '📱' }
};

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadInvoiceDetails();
    }
  }, [id]);

  const loadInvoiceDetails = async () => {
    try {
      setLoading(true);
      
      // Charger la facture
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (invoiceError) throw invoiceError;
      setInvoice(invoiceData);

      // Charger l'entreprise cliente
      if (invoiceData.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', invoiceData.company_id)
          .single();

        if (companyError) throw companyError;
        setCompany(companyData);
      }

      // Charger les items de la facture
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', id)
        .order('id');

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

    } catch (error) {
      console.error('Error loading invoice details:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des détails de la facture"
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

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'paid' && new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className=" rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Receipt className="h-16 w-16 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Facture non trouvée</h3>
        <p className="text-gray-500">La facture demandée n'existe pas ou a été supprimée.</p>
        <Button onClick={() => navigate('/business/invoices')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const status = statusConfig[invoice.status as keyof typeof statusConfig] || statusConfig.draft;
  const paymentMethod = paymentMethodConfig[invoice.payment_method as keyof typeof paymentMethodConfig];
  const overdue = isOverdue(invoice.due_date, invoice.status);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/business/invoices')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Facture {invoice.invoice_number}
            </h1>
            <p className="text-gray-500">
              Créée le {formatDate(invoice.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={overdue ? 'bg-red-100 text-red-800' : status.color}>
            {overdue ? 'En retard' : status.label}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/business/invoices/edit/${invoice.id}`)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Détails de la facture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Détails de la facture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Numéro</label>
                  <p className="text-sm font-semibold">{invoice.invoice_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Objet</label>
                  <p className="text-sm">{invoice.object}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Montant total</label>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Échéance</label>
                  <p className={`text-sm flex items-center ${overdue ? 'text-red-600 font-semibold' : ''}`}>
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(invoice.due_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Méthode de paiement</label>
                  <p className="text-sm flex items-center">
                    <span className="mr-2">{paymentMethod?.icon}</span>
                    {paymentMethod?.label || invoice.payment_method}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Devise</label>
                  <p className="text-sm font-semibold">{invoice.currency}</p>
                </div>
              </div>
              
              {invoice.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items de la facture */}
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
                        {formatCurrency(item.unit_price, invoice.currency)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.total, invoice.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Separator className="my-4" />
              
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total {invoice.currency}</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(invoice.amount, invoice.currency)}
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
                onClick={() => navigate(`/business/invoices/edit/${invoice.id}`)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Modifier la facture
              </Button>
              
              {invoice.status === 'sent' && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Marquer comme payée
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

          {/* Statut de paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Statut financier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Statut</span>
                <Badge className={status.color}>
                  {status.label}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Montant</span>
                <span className="font-semibold">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </span>
              </div>
              
              {overdue && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ Facture en retard depuis {Math.floor((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 