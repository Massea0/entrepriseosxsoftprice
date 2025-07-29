import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { supabase } // Migrated from Supabase to Express API
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Eye,
  Edit,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  ArrowLeft,
  Globe,
  Calendar,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ClientForm from './ClientForm';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  company_type?: string;
  tax_id?: string;
  registration_number?: string;
  industry?: string;
  notes?: string;
  created_at: string;
  // Relations
  quotes?: any[];
  invoices?: any[];
  contracts?: any[];
}

function ClientDetail({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    totalContracts: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadClientDetails();
  }, [clientId]);

  const loadClientDetails = async () => {
    try {
      setLoading(true);
      
      // Charger les détails du client
      const { data: clientData, error: clientError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      
      // Charger les statistiques
      const [quotesResponse, invoicesResponse, contractsResponse] = await Promise.all([
        supabase.from('devis').select('amount').eq('company_id', clientId),
        supabase.from('invoices').select('amount').eq('company_id', clientId),
        supabase.from('contracts').select('value').eq('company_id', clientId)
      ]);

      const totalRevenue = (invoicesResponse.data || []).reduce((sum, inv) => sum + (inv.amount || 0), 0);
      
      setClient(clientData);
      setStats({
        totalQuotes: quotesResponse.data?.length || 0,
        totalInvoices: invoicesResponse.data?.length || 0,
        totalRevenue,
        totalContracts: contractsResponse.data?.length || 0
      });
    } catch (error) {
      console.error('Error loading client details:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails du client"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Client non trouvé</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/business/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">
              Client depuis {format(new Date(client.created_at), 'MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>
        <Link to={`/business/clients/${client.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContracts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Client Information Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:underline">
                      {client.email}
                    </a>
                  </div>
                </div>
                
                {client.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <a href={`tel:${client.phone}`} className="text-sm text-blue-600 hover:underline">
                        {client.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {client.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Site web</p>
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {client.website}
                      </a>
                    </div>
                  </div>
                )}
                
                {client.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">{client.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations légales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.company_type && (
                  <div>
                    <p className="text-sm font-medium">Type d'entreprise</p>
                    <Badge variant="outline" className="mt-1">{client.company_type.toUpperCase()}</Badge>
                  </div>
                )}
                
                {client.industry && (
                  <div>
                    <p className="text-sm font-medium">Secteur d'activité</p>
                    <p className="text-sm text-muted-foreground">{client.industry}</p>
                  </div>
                )}
                
                {client.tax_id && (
                  <div>
                    <p className="text-sm font-medium">NINEA</p>
                    <p className="text-sm text-muted-foreground">{client.tax_id}</p>
                  </div>
                )}
                
                {client.registration_number && (
                  <div>
                    <p className="text-sm font-medium">RCCM</p>
                    <p className="text-sm text-muted-foreground">{client.registration_number}</p>
                  </div>
                )}
              </div>
              
              {client.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Notes internes</p>
                  <p className="text-sm text-muted-foreground mt-1">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Historique des interactions avec ce client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                L'historique d'activité sera bientôt disponible
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents associés</CardTitle>
              <CardDescription>
                Devis, factures et contrats de ce client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Devis récents</h4>
                <Link to={`/business/quotes?client=${client.id}`}>
                  <Button variant="outline" size="sm">
                    Voir tous
                  </Button>
                </Link>
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Factures récentes</h4>
                <Link to={`/business/invoices?client=${client.id}`}>
                  <Button variant="outline" size="sm">
                    Voir toutes
                  </Button>
                </Link>
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Contrats actifs</h4>
                <Link to={`/business/contracts?client=${client.id}`}>
                  <Button variant="outline" size="sm">
                    Voir tous
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Clients() {
  const { id } = useParams();
  const location = useLocation();
  const isNew = location.pathname.includes('/new');
  const isEdit = location.pathname.includes('/edit');
  
  // Si on est sur une route de détail, formulaire ou édition
  if (id || isNew) {
    if (isNew || isEdit) {
      return <ClientForm />;
    }
    return <ClientDetail clientId={id} />;
  }

  // Sinon, afficher la liste des clients
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des clients"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Gérez votre portefeuille de clients
          </p>
        </div>
        <Link to="/business/clients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => {
                const created = new Date(c.created_at);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secteurs représentés</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(clients.map(c => c.industry).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Date d'ajout</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {client.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {client.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {client.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {client.industry && (
                      <Badge variant="outline">{client.industry}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(client.created_at), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/business/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/business/clients/${client.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun client trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}