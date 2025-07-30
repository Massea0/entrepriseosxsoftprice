import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Save } from 'lucide-react';

const invoiceSchema = z.object({
  client_id: z.string().min(1, 'Sélectionnez un client'),
  invoice_number: z.string().min(1, 'Numéro de facture requis'),
  issue_date: z.string().min(1, 'Date d\'émission requise'),
  due_date: z.string().min(1, 'Date d\'échéance requise'),
  tax_rate: z.number().min(0).max(100).default(20),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, 'Description requise'),
    quantity: z.number().min(1),
    unit_price: z.number().min(0)
  })).min(1, 'Ajoutez au moins un article')
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface SimpleInvoiceFormProps {
  onClose?: () => void;
  initialData?: Partial<InvoiceFormData>;
}

export function SimpleInvoiceForm({ onClose, initialData }: SimpleInvoiceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState(initialData?.items || [{
    description: '',
    quantity: 1,
    unit_price: 0
  }]);

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await fetch('/api/clients');
      if (!response.ok) throw new Error('Erreur lors du chargement des clients');
      return response.json();
    }
  });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      ...initialData,
      issue_date: initialData?.issue_date || new Date().toISOString().split('T')[0],
      due_date: initialData?.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tax_rate: initialData?.tax_rate || 20,
      items: items
    }
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const tax_amount = subtotal * (data.tax_rate / 100);
      const total = subtotal + tax_amount;

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subtotal,
          tax_amount,
          total,
          status: 'draft'
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de la création de la facture');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès."
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onClose?.();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture.",
        variant: "destructive"
      });
    }
  });

  const addItem = () => {
    const newItems = [...items, { description: '', quantity: 1, unit_price: 0 }];
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const taxRate = form.watch('tax_rate') || 0;
    const tax = subtotal * (taxRate / 100);
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  const onSubmit = (data: InvoiceFormData) => {
    createInvoiceMutation.mutate(data);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Nouvelle Facture</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informations Client */}
            <div className="space-y-2">
              <Label htmlFor="client_id">Client</Label>
              <Select onValueChange={(value) => form.setValue('client_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Numéro de Facture */}
            <div className="space-y-2">
              <Label htmlFor="invoice_number">Numéro de Facture</Label>
              <Input
                id="invoice_number"
                {...form.register('invoice_number')}
                placeholder="FAC-2024-001"
              />
            </div>

            {/* Date d'émission */}
            <div className="space-y-2">
              <Label htmlFor="issue_date">Date d'émission</Label>
              <Input
                id="issue_date"
                type="date"
                {...form.register('issue_date')}
              />
            </div>

            {/* Date d'échéance */}
            <div className="space-y-2">
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Input
                id="due_date"
                type="date"
                {...form.register('due_date')}
              />
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Articles</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Prix unitaire"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totaux */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>TVA</span>
                <Input
                  type="number"
                  className="w-20"
                  {...form.register('tax_rate', { valueAsNumber: true })}
                  placeholder="20"
                />
                <span>%</span>
              </div>
              <span>{tax.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Notes additionnelles..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createInvoiceMutation.isPending}>
              <Save className="h-4 w-4 mr-1" />
              {createInvoiceMutation.isPending ? 'Création...' : 'Créer la facture'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}