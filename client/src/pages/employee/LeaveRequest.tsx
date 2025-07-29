import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Sparkles, Zap, Rocket } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  HoverZone,
  StaggeredList,
  StaggeredItem,
  MagneticButton,
  AnimatedMetricCard,
  LiquidContainer,
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface LeaveType {
  id: string;
  name: string;
  description: string;
  default_days: number;
  color: string;
}

interface LeaveBalance {
  id: string;
  leave_type_id: string;
  year: number;
  total_days: number;
  used_days: number;
  remaining_days: number;
}

interface LeaveRequest {
  id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  manager_comment?: string;
  created_at: string;
}

export default function LeaveRequest() {
  const { user } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les types de congés
      const typesResponse = await fetch('/api/leave/types');
      const typesData = await typesResponse.json();
      setLeaveTypes(typesData);

      // Charger les soldes de congés
      const balancesResponse = await fetch('/api/leave/balances');
      const balancesData = await balancesResponse.json();
      setLeaveBalances(balancesData);

      // Charger les demandes existantes
      const requestsResponse = await fetch('/api/leave/requests');
      const requestsData = await requestsResponse.json();
      setLeaveRequests(requestsData);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const calculateWorkingDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let workingDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclure samedi et dimanche
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return workingDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !startDate || !endDate || !reason) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const totalDays = calculateWorkingDays(startDate, endDate);
    if (totalDays <= 0) {
      toast.error('La période sélectionnée doit être valide');
      return;
    }

    // Vérifier le solde disponible
    const balance = leaveBalances.find(b => b.leave_type_id === selectedType);
    if (balance && totalDays > balance.remaining_days) {
      toast.error(`Solde insuffisant. Vous avez ${balance.remaining_days} jours disponibles`);
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch('/api/leave/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leave_type_id: selectedType,
          start_date: startDate,
          end_date: endDate,
          total_days: totalDays,
          reason: reason,
        }),
      });

      if (response.ok) {
        toast.success('Demande de congés envoyée avec succès !');
        setSelectedType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        loadData(); // Recharger les données
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={25} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Calendar className="h-10 w-10 text-white" />
                </LiquidContainer>
                <div>
                  <TypewriterText
                    text="Gestion des Congés"
                    className="text-3xl font-bold mb-1"
                    speed={50}
                  />
                  <GlowText className="text-lg text-emerald-100">
                    Demandez vos congés et suivez vos soldes 🏖️
                  </GlowText>
                </div>
              </div>
              <WaveformVisualizer className="w-full h-12 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Soldes de congés */}
        <HoverZone effect="lift">
          <EnhancedCard variant="glow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <GlowText>Mes Soldes de Congés</GlowText>
              </h2>
              <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaveBalances.map((balance, index) => {
                  const leaveType = leaveTypes.find(lt => lt.id === balance.leave_type_id);
                  const gradients = [
                    "from-emerald-500 to-teal-500",
                    "from-teal-500 to-cyan-500",
                    "from-cyan-500 to-blue-500"
                  ];
                  return (
                    <StaggeredItem key={balance.id} index={index}>
                      <AnimatedMetricCard
                        title={leaveType?.name || 'Type inconnu'}
                        value={`${balance.remaining_days}j`}
                        icon={Calendar}
                        trend={`${balance.remaining_days}/${balance.total_days} jours`}
                        gradient={gradients[index % gradients.length]}
                      />
                    </StaggeredItem>
                  );
                })}
              </StaggeredList>
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Formulaire de demande */}
        <EnhancedCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nouvelle Demande de Congés</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leaveType">Type de congés</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="totalDays">Jours ouvrés</Label>
                <Input
                  id="totalDays"
                  type="number"
                  value={startDate && endDate ? calculateWorkingDays(startDate, endDate) : ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Motif</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Décrivez le motif de votre demande..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </form>
        </EnhancedCard>

        {/* Historique des demandes */}
        <EnhancedCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mes Demandes</h2>
          <div className="space-y-4">
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune demande de congés pour le moment
              </p>
            ) : (
              leaveRequests.map((request) => {
                const leaveType = leaveTypes.find(lt => lt.id === request.leave_type_id);
                return (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(request.status)}
                      <div>
                        <h3 className="font-medium">{leaveType?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.total_days} jours • {request.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {getStatusText(request.status)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
} 