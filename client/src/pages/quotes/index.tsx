import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Download, Eye, Send, FileText, Calendar, Building2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Quote {
  id: string;
  number: string;
  company_id: string;
  company?: {
    name: string;
    email: string;
  };
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  valid_until: string;
  object: string;
  notes?: string;
  original_amount?: number;
}

export function QuotesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch quotes from API
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const response = await fetch('/api/quotes');
      if (!response.ok) throw new Error('Failed to fetch quotes');
      return response.json();
    }
  });

  // Delete quote mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete quote');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Devis supprimé');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  // Convert to invoice mutation
  const convertToInvoiceMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const response = await fetch(`/api/quotes/${quoteId}/convert-to-invoice`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to convert to invoice');
      return response.json();
    },
    onSuccess: (data) => {
      toast.success('Devis converti en facture');
      navigate(`/invoices/${data.invoiceId}`);
    },
    onError: () => {
      toast.error('Erreur lors de la conversion');
    }
  });

  // Generate PDF
  const generatePDF = async (quote: Quote) => {
    try {
      // Create quote template HTML
      const quoteHTML = `
        <div id="quote-${quote.id}" style="padding: 40px; font-family: Arial, sans-serif;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
              <h1 style="color: #333; margin: 0;">DEVIS</h1>
              <p style="color: #666; margin: 5px 0;">#${quote.number}</p>
            </div>
            <div style="text-align: right;">
              <img src="/arcadis-logo.svg" alt="Logo" style="height: 60px;" />
              <p style="margin: 5px 0;">Arcadis Technologies</p>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div>
              <h3>Client:</h3>
              <p>${quote.company?.name || 'N/A'}</p>
              <p>${quote.company?.email || ''}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Date:</strong> ${formatDate(quote.created_at)}</p>
              <p><strong>Valide jusqu'au:</strong> ${formatDate(quote.valid_until)}</p>
              <p><strong>Statut:</strong> ${quote.status}</p>
            </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Description</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${quote.object}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(quote.amount)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 10px; text-align: right; font-weight: bold;">Total HT:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2em;">${formatCurrency(quote.amount)}</td>
              </tr>
            </tfoot>
          </table>
          
          ${quote.notes ? `<div style="margin-top: 30px;"><h4>Notes:</h4><p>${quote.notes}</p></div>` : ''}
        </div>
      `;

      // Create temporary div
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = quoteHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Generate PDF
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement);
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save(`devis-${quote.number}.pdf`);

      // Clean up
      document.body.removeChild(tempDiv);
      toast.success('PDF généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };

  // Filter quotes
  const filteredQuotes = quotes.filter((quote: Quote) => {
    const matchesSearch = quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
      draft: "secondary",
      sent: "default",
      accepted: "success",
      rejected: "destructive",
      expired: "warning"
    };
    
    const labels: Record<string, string> = {
      draft: "Brouillon",
      sent: "Envoyé",
      accepted: "Accepté",
      rejected: "Rejeté",
      expired: "Expiré"
    };

    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  // Calculate stats
  const stats = {
    total: quotes.length,
    totalAmount: quotes.reduce((sum: number, q: Quote) => sum + q.amount, 0),
    accepted: quotes.filter((q: Quote) => q.status === 'accepted').length,
    pending: quotes.filter((q: Quote) => q.status === 'sent').length,
    conversion: quotes.length > 0 ? Math.round((quotes.filter((q: Quote) => q.status === 'accepted').length / quotes.length) * 100) : 0
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Devis</h1>
          <p className="text-muted-foreground">Gérez vos propositions commerciales</p>
        </div>
        <Button onClick={() => navigate('/quotes/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Devis
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} en attente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Opportunités commerciales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptés</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">
              Prêts à facturer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Conversion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion}%</div>
            <p className="text-xs text-muted-foreground">
              Devis acceptés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Devis</CardTitle>
          <CardDescription>
            Tous vos devis avec suivi commercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher par numéro, client ou objet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Rejeté</option>
              <option value="expired">Expiré</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Validité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote: Quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.number}</TableCell>
                    <TableCell>{quote.company?.name || 'N/A'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{quote.object}</TableCell>
                    <TableCell>{formatCurrency(quote.amount)}</TableCell>
                    <TableCell>{formatDate(quote.created_at)}</TableCell>
                    <TableCell>{formatDate(quote.valid_until)}</TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">•••</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate(`/quotes/${quote.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => generatePDF(quote)}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer par email
                          </DropdownMenuItem>
                          {quote.status === 'accepted' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => convertToInvoiceMutation.mutate(quote.id)}
                                className="text-green-600"
                              >
                                Convertir en facture
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteMutation.mutate(quote.id)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}