import React from 'react';
import { MultiStepForm } from '../MultiStepForm';
import { ClientInfoStep } from './steps/ClientInfoStep';
import { InvoiceDetailsStep } from './steps/InvoiceDetailsStep';
import { LineItemsStep } from './steps/LineItemsStep';
import { ReviewStep } from './steps/ReviewStep';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface InvoiceMultiStepFormProps {
  onClose?: () => void;
  initialData?: any;
}

export function InvoiceMultiStepForm({ onClose, initialData }: InvoiceMultiStepFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create invoice');
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

  const steps = [
    {
      id: 'client',
      title: 'Informations Client',
      description: 'Sélectionnez ou créez un client',
      component: ClientInfoStep,
      validation: (data: any) => !!data.client_id
    },
    {
      id: 'details',
      title: 'Détails de la Facture',
      description: 'Numéro, dates et conditions',
      component: InvoiceDetailsStep,
      validation: (data: any) => !!data.invoice_number && !!data.issue_date
    },
    {
      id: 'items',
      title: 'Articles',
      description: 'Ajoutez les produits ou services',
      component: LineItemsStep,
      validation: (data: any) => data.items?.length > 0
    },
    {
      id: 'review',
      title: 'Vérification',
      description: 'Vérifiez et confirmez',
      component: ReviewStep
    }
  ];

  const handleComplete = (data: any) => {
    // Calculer les totaux
    const subtotal = data.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unit_price), 0
    );
    const tax_amount = subtotal * (data.tax_rate || 0) / 100;
    const total = subtotal + tax_amount;

    const invoiceData = {
      ...data,
      subtotal,
      tax_amount,
      total,
      status: 'draft'
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  return (
    <MultiStepForm
      steps={steps}
      initialData={initialData}
      onComplete={handleComplete}
      onCancel={onClose}
    />
  );
}