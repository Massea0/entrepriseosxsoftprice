import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceDetailsStepProps {
  data: any;
  onChange: (data: any) => void;
}

export function InvoiceDetailsStep({ data, onChange }: InvoiceDetailsStepProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const in30Days = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  // Générer un numéro de facture automatique
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FAC-${year}${month}-${random}`;
  };

  React.useEffect(() => {
    if (!data.invoice_number) {
      onChange({ invoice_number: generateInvoiceNumber() });
    }
    if (!data.issue_date) {
      onChange({ issue_date: today });
    }
    if (!data.due_date) {
      onChange({ due_date: in30Days });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoice_number">Numéro de facture</Label>
          <Input
            id="invoice_number"
            value={data.invoice_number || ''}
            onChange={(e) => onChange({ invoice_number: e.target.value })}
            placeholder="FAC-202401-001"
          />
        </div>
        
        <div>
          <Label htmlFor="tax_rate">Taux de TVA (%)</Label>
          <Select
            value={String(data.tax_rate || '20')}
            onValueChange={(value) => onChange({ tax_rate: parseFloat(value) })}
          >
            <SelectTrigger id="tax_rate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0% - Exonéré</SelectItem>
              <SelectItem value="5.5">5.5% - Taux réduit</SelectItem>
              <SelectItem value="10">10% - Taux intermédiaire</SelectItem>
              <SelectItem value="20">20% - Taux normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issue_date">Date d'émission</Label>
          <Input
            id="issue_date"
            type="date"
            value={data.issue_date || today}
            onChange={(e) => onChange({ issue_date: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="due_date">Date d'échéance</Label>
          <Input
            id="due_date"
            type="date"
            value={data.due_date || in30Days}
            onChange={(e) => onChange({ due_date: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="payment_terms">Conditions de paiement</Label>
        <Select
          value={data.payment_terms || 'net30'}
          onValueChange={(value) => onChange({ payment_terms: value })}
        >
          <SelectTrigger id="payment_terms">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Paiement immédiat</SelectItem>
            <SelectItem value="net15">Net 15 jours</SelectItem>
            <SelectItem value="net30">Net 30 jours</SelectItem>
            <SelectItem value="net45">Net 45 jours</SelectItem>
            <SelectItem value="net60">Net 60 jours</SelectItem>
            <SelectItem value="endofmonth">Fin du mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea
          id="notes"
          value={data.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Informations complémentaires, conditions particulières..."
          rows={3}
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Récapitulatif</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client :</span>
            <span className="font-medium">{data.client?.name || 'Non sélectionné'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Facture :</span>
            <span className="font-medium">{data.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Émission :</span>
            <span className="font-medium">
              {data.issue_date && format(new Date(data.issue_date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}