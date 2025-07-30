import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Building2, FileText, Calendar, CreditCard } from 'lucide-react';

interface ReviewStepProps {
  data: any;
  onChange: (data: any) => void;
}

export function ReviewStep({ data, onChange }: ReviewStepProps) {
  const subtotal = data.items?.reduce((sum: number, item: any) => 
    sum + (item.quantity * item.unit_price), 0
  ) || 0;
  const taxAmount = subtotal * (data.tax_rate || 20) / 100;
  const total = subtotal + taxAmount;

  const paymentTermsLabels: { [key: string]: string } = {
    immediate: 'Paiement immédiat',
    net15: 'Net 15 jours',
    net30: 'Net 30 jours',
    net45: 'Net 45 jours',
    net60: 'Net 60 jours',
    endofmonth: 'Fin du mois'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{data.client?.name}</p>
            <p className="text-sm text-muted-foreground">{data.client?.email}</p>
            {data.client?.phone && (
              <p className="text-sm text-muted-foreground">{data.client?.phone}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Facture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{data.invoice_number}</p>
            <p className="text-sm text-muted-foreground">
              TVA : {data.tax_rate || 20}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Émission : </span>
                <span className="font-medium">
                  {format(new Date(data.issue_date), 'dd MMM yyyy', { locale: fr })}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Échéance : </span>
                <span className="font-medium">
                  {format(new Date(data.due_date), 'dd MMM yyyy', { locale: fr })}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {paymentTermsLabels[data.payment_terms] || data.payment_terms}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-start pb-3 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {item.unit_price.toFixed(2)} €
                  </p>
                </div>
                <p className="font-medium">{(item.quantity * item.unit_price).toFixed(2)} €</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total HT</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TVA ({data.tax_rate || 20}%)</span>
              <span>{taxAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total TTC</span>
              <span className="text-primary">{total.toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="bg-muted/50 p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-2">
          En cliquant sur "Terminer", la facture sera créée en mode brouillon.
        </p>
        <p className="text-sm text-muted-foreground">
          Vous pourrez la modifier ou l'envoyer depuis la liste des factures.
        </p>
      </div>
    </div>
  );
}