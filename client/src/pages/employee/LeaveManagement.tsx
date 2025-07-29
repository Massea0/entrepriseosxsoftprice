import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, Sparkles, Zap, Rocket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  EnhancedCard,
  AnimatedMetricCard,
  LiquidContainer,
  WaveformVisualizer
} from '@/components/design-system/RevolutionaryDesignSystem';

interface LeaveType {
  id: string;
  name: string;
  description: string;
  defaultDays: number;
  color: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  managerComment?: string;
  createdAt: string;
}

interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export default function LeaveManagement() {
  const { user } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loadLeaveData();
  }, []);

  const loadLeaveData = async () => {
    try {
      setLoading(true);
      
      const [typesRes, requestsRes, balancesRes] = await Promise.all([
        fetch('/api/leave/types'),
        fetch(`/api/leave/requests?employeeId=${user?.id}`),
        fetch(`/api/leave/balances/${user?.id}?year=${new Date().getFullYear()}`)
      ]);

      // Vérifier les statuts HTTP et extraire les données seulement si OK
      const types = typesRes.ok ? await typesRes.json() : [];
      const requests = requestsRes.ok ? await requestsRes.json() : [];
      const balances = balancesRes.ok ? await balancesRes.json() : [];

      // Vérifier que les données sont bien des tableaux
      setLeaveTypes(Array.isArray(types) ? types : []);
      setLeaveRequests(Array.isArray(requests) ? requests : []);
      setLeaveBalances(Array.isArray(balances) ? balances : []);
    } catch (error) {
      console.error('Error loading leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'cancelled': return 'Annulé';
      default: return 'En attente';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <GlowText className="text-2xl font-bold mb-4">
            Chargement de vos congés...
          </GlowText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={20} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-10 right-10 w-72 h-72 opacity-25 z-0" />
      <MorphingBlob className="absolute bottom-10 left-10 w-64 h-64 opacity-20 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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
                    <GlowText className="text-lg text-teal-100">
                      Gérez vos demandes de congés et consultez vos soldes 🌴
                    </GlowText>
                  </div>
                </div>
                <MagneticButton 
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                  onClick={() => setShowRequestForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Demande
                </MagneticButton>
              </div>
              <WaveformVisualizer className="w-full h-12 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Métriques des Soldes */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaveBalances.map((balance, index) => {
            const leaveType = leaveTypes?.find(lt => lt.id === balance.leaveTypeId);
            const gradients = [
              "from-teal-500 to-cyan-500",
              "from-cyan-500 to-blue-500",
              "from-blue-500 to-indigo-500",
              "from-indigo-500 to-purple-500"
            ];
            return (
              <StaggeredItem key={balance.id} index={index}>
                <AnimatedMetricCard
                  title={leaveType?.name || 'Type inconnu'}
                  value={`${balance.remainingDays}j`}
                  icon={Calendar}
                  trend={balance.remainingDays > 0 ? "Disponible" : "Épuisé"}
                  gradient={gradients[index % gradients.length]}
                />
              </StaggeredItem>
            );
          })}
        </StaggeredList>

        {/* Demandes de Congés */}
        <HoverZone effect="lift">
          <EnhancedCard variant="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <GlowText>Mes Demandes de Congés</GlowText>
              </CardTitle>
              <CardDescription>
                Historique de vos demandes et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
            {leaveRequests.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Aucune demande de congé pour le moment</p>
              </div>
            ) : (
              <StaggeredList className="space-y-4">
                {leaveRequests.map((request) => {
                  const leaveType = leaveTypes?.find(lt => lt.id === request.leaveTypeId);
                  return (
                    <StaggeredItem key={request.id}>
                      <HoverZone effect="lift">
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: leaveType?.color || '#3B82F6' }}
                            />
                            <div>
                              <h4 className="font-semibold">{leaveType?.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.startDate).toLocaleDateString('fr-FR')} - {new Date(request.endDate).toLocaleDateString('fr-FR')}
                              </p>
                              {request.reason && (
                                <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(request.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(request.status)}
                                <span>{getStatusLabel(request.status)}</span>
                              </div>
                            </Badge>
                            <div className="text-right">
                              <p className="text-sm font-medium">{request.totalDays} jours</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </HoverZone>
                    </StaggeredItem>
                  );
                })}
              </StaggeredList>
            )}
          </CardContent>
        </EnhancedCard>
      </HoverZone>
      </div>
    </div>
  );
}