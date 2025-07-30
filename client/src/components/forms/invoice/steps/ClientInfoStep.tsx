import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClientInfoStepProps {
  data: any;
  onChange: (data: any) => void;
}

export function ClientInfoStep({ data, onChange }: ClientInfoStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await fetch('/api/companies');
      if (!response.ok) throw new Error('Failed to fetch companies');
      return response.json();
    }
  });

  const filteredCompanies = companies.filter((company: any) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectClient = (company: any) => {
    onChange({
      client_id: company.id,
      client: company
    });
  };

  if (showNewClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">Nouveau Client</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewClient(false)}
          >
            Retour à la liste
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom de l'entreprise</Label>
            <Input
              id="name"
              placeholder="Entreprise SARL"
              onChange={(e) => onChange({ 
                ...data, 
                newClient: { ...data.newClient, name: e.target.value } 
              })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@entreprise.com"
              onChange={(e) => onChange({ 
                ...data, 
                newClient: { ...data.newClient, email: e.target.value } 
              })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              placeholder="+33 1 23 45 67 89"
              onChange={(e) => onChange({ 
                ...data, 
                newClient: { ...data.newClient, phone: e.target.value } 
              })}
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="123 Rue de la Paix"
              onChange={(e) => onChange({ 
                ...data, 
                newClient: { ...data.newClient, address: e.target.value } 
              })}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredCompanies.map((company: any) => (
          <Card
            key={company.id}
            className={cn(
              "cursor-pointer transition-colors",
              data.client_id === company.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            )}
            onClick={() => selectClient(company)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{company.name}</h4>
                  <p className="text-sm text-muted-foreground">{company.email}</p>
                  {company.phone && (
                    <p className="text-sm text-muted-foreground">{company.phone}</p>
                  )}
                </div>
                {data.client_id === company.id && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowNewClient(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Créer un nouveau client
      </Button>
    </div>
  );
}