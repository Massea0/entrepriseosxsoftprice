import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Briefcase, 
  AlertCircle, 
  User, 
  CreditCard, 
  CheckCircle
} from 'lucide-react';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  company_type?: string;
  tax_id?: string;
  registration_number?: string;
  industry?: string;
  notes?: string;
}

const INDUSTRIES = [
  'Technologies de l\'information',
  'Finance et Banque',
  'Santé',
  'Éducation',
  'Construction',
  'Commerce de détail',
  'Manufacture',
  'Services professionnels',
  'Télécommunications',
  'Immobilier',
  'Transport et Logistique',
  'Énergie',
  'Agriculture',
  'Tourisme et Hôtellerie',
  'Autre'
];

const COMPANY_TYPES = [
  { value: 'sarl', label: 'SARL' },
  { value: 'sa', label: 'SA' },
  { value: 'sasu', label: 'SASU' },
  { value: 'ei', label: 'Entreprise Individuelle' },
  { value: 'association', label: 'Association' },
  { value: 'gie', label: 'GIE' },
  { value: 'autre', label: 'Autre' }
];

export default function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientData, setClientData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    company_type: '',
    tax_id: '',
    registration_number: '',
    industry: '',
    notes: ''
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // API call to save client data
      const response = await fetch(`/api/companies${isEdit ? `/${id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      toast({
        title: "Succès !",
        description: `Client ${isEdit ? 'mis à jour' : 'créé'} avec succès`,
        variant: "default",
      });
      navigate('/business/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le client",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/business/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Modifier' : 'Nouveau'} Client
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Mettez à jour les informations client' : 'Créez un nouveau client'}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du client</CardTitle>
          <CardDescription>
            Remplissez les informations de base du client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'entreprise *</Label>
                <Input
                  id="name"
                  placeholder="Arcadis Technologies"
                  value={clientData.name}
                  onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@entreprise.com"
                  value={clientData.email}
                  onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                  value={clientData.phone}
                  onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.entreprise.com"
                  value={clientData.website || ''}
                  onChange={(e) => setClientData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_type">Type d'entreprise</Label>
                <Select 
                  value={clientData.company_type || ''} 
                  onValueChange={(value) => setClientData(prev => ({ ...prev, company_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Secteur d'activité</Label>
                <Select 
                  value={clientData.industry || ''} 
                  onValueChange={(value) => setClientData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">Numéro TVA / SIRET</Label>
                <Input
                  id="tax_id"
                  placeholder="FR12345678901"
                  value={clientData.tax_id || ''}
                  onChange={(e) => setClientData(prev => ({ ...prev, tax_id: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_number">Numéro d'enregistrement</Label>
                <Input
                  id="registration_number"
                  placeholder="123 456 789 RCS Paris"
                  value={clientData.registration_number || ''}
                  onChange={(e) => setClientData(prev => ({ ...prev, registration_number: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                placeholder="123 Rue de la Innovation&#10;75001 Paris&#10;France"
                className="min-h-[100px]"
                value={clientData.address}
                onChange={(e) => setClientData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes et commentaires</Label>
              <Textarea
                id="notes"
                placeholder="Informations supplémentaires, historique, préférences..."
                className="min-h-[120px]"
                value={clientData.notes || ''}
                onChange={(e) => setClientData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className=" rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Mettre à jour' : 'Créer'} le client
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/business/clients')}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}