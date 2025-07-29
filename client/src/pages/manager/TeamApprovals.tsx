import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  X, 
  Clock, 
  Calendar, 
  FileText, 
  User,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingApproval {
  id: string;
  type: 'leave' | 'sick_leave' | 'expense' | 'overtime';
  employeeName: string;
  employeeId: string;
  requestDate: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  reason?: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  description: string;
}

const TeamApprovals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('pending');

  // Fetch pending approvals
  const { data: approvals = [], isLoading } = useQuery({
    queryKey: ['/api/manager/approvals'],
    initialData: [
      {
        id: '1',
        type: 'leave' as const,
        employeeName: 'Aminata Diallo',
        employeeId: '1',
        requestDate: '2025-01-20',
        startDate: '2025-01-25',
        endDate: '2025-01-27',
        duration: 3,
        reason: 'Congé personnel',
        status: 'pending' as const,
        priority: 'medium' as const,
        description: 'Demande de congé pour raisons personnelles'
      },
      {
        id: '2',
        type: 'sick_leave' as const,
        employeeName: 'Omar Ndiaye',
        employeeId: '2',
        requestDate: '2025-01-21',
        startDate: '2025-01-21',
        endDate: '2025-01-23',
        duration: 3,
        reason: 'Arrêt maladie',
        status: 'pending' as const,
        priority: 'high' as const,
        description: 'Arrêt maladie avec certificat médical'
      },
      {
        id: '3',
        type: 'expense' as const,
        employeeName: 'Fatou Sow',
        employeeId: '3',
        requestDate: '2025-01-19',
        amount: 45000,
        reason: 'Frais de déplacement',
        status: 'pending' as const,
        priority: 'low' as const,
        description: 'Remboursement frais de transport pour mission client'
      }
    ] as PendingApproval[]
  });

  // Mutation for approval/rejection
  const approveMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'approve' | 'reject' }) => {
      const response = await fetch(`/api/manager/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!response.ok) throw new Error('Failed to update approval');
      return response.json();
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/manager/approvals'] });
      toast({
        title: action === 'approve' ? 'Demande approuvée' : 'Demande rejetée',
        description: `La demande a été ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès.`,
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de traiter la demande. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'leave': return 'Congé';
      case 'sick_leave': return 'Arrêt maladie';
      case 'expense': return 'Note de frais';
      case 'overtime': return 'Heures supplémentaires';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'leave': return 'bg-blue-100 text-blue-800';
      case 'sick_leave': return 'bg-red-100 text-red-800';
      case 'expense': return 'bg-green-100 text-green-800';
      case 'overtime': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Urgente';
      case 'medium': return 'Normale';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const handleApprove = (id: string) => {
    approveMutation.mutate({ id, action: 'approve' });
  };

  const handleReject = (id: string) => {
    approveMutation.mutate({ id, action: 'reject' });
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const processedApprovals = approvals.filter(a => a.status !== 'pending');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', { 
      style: 'currency', 
      currency: 'XOF' 
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Validations d'Équipe</h1>
          <p className="text-muted-foreground">Gérez les demandes d'approbation de votre équipe</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{pendingApprovals.length} en attente</span>
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En Attente</p>
                <p className="text-2xl font-bold">{pendingApprovals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Approuvées</p>
                <p className="text-2xl font-bold">
                  {processedApprovals.filter(a => a.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Rejetées</p>
                <p className="text-2xl font-bold">
                  {processedApprovals.filter(a => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{approvals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approvals List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            En Attente ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Traitées ({processedApprovals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande en attente</h3>
                <p className="text-muted-foreground">Toutes les demandes ont été traitées.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <Card key={approval.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {approval.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{approval.employeeName}</CardTitle>
                          <CardDescription>{approval.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(approval.type)}>
                          {getTypeLabel(approval.type)}
                        </Badge>
                        <Badge className={getPriorityColor(approval.priority)}>
                          {getPriorityLabel(approval.priority)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Date de demande:</span>
                        <p className="font-medium">
                          {new Date(approval.requestDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {approval.startDate && (
                        <div>
                          <span className="text-muted-foreground">Date de début:</span>
                          <p className="font-medium">
                            {new Date(approval.startDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                      {approval.endDate && (
                        <div>
                          <span className="text-muted-foreground">Date de fin:</span>
                          <p className="font-medium">
                            {new Date(approval.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                      {approval.duration && (
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <p className="font-medium">{approval.duration} jour(s)</p>
                        </div>
                      )}
                      {approval.amount && (
                        <div>
                          <span className="text-muted-foreground">Montant:</span>
                          <p className="font-medium">{formatCurrency(approval.amount)}</p>
                        </div>
                      )}
                    </div>

                    {approval.reason && (
                      <div>
                        <span className="text-muted-foreground text-sm">Motif:</span>
                        <p className="font-medium">{approval.reason}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Button
                        onClick={() => handleApprove(approval.id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(approval.id)}
                        disabled={approveMutation.isPending}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Rejeter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedApprovals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande traitée</h3>
                <p className="text-muted-foreground">Les demandes traitées apparaîtront ici.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {processedApprovals.map((approval) => (
                <Card key={approval.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {approval.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{approval.employeeName}</CardTitle>
                          <CardDescription>{approval.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(approval.type)}>
                          {getTypeLabel(approval.type)}
                        </Badge>
                        <Badge 
                          className={approval.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        >
                          {approval.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamApprovals;