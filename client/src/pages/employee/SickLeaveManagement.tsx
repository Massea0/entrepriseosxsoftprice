import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  FileText, 
  Calendar, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  TrendingUp,
  User,
  Building2,
  Plus,
  Eye,
  Download,
  Sparkles,
  Zap,
  Rocket
} from 'lucide-react';
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
  WaveformVisualizer,
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface SickLeave {
  id: string;
  startDate: string;
  endDate?: string;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'ended';
  type: 'sick' | 'accident' | 'maternity' | 'surgery' | 'chronic';
  documents: string[];
  doctorName?: string;
  doctorPhone?: string;
  expectedReturn?: string;
  actualReturn?: string;
  createdAt: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export default function SickLeaveManagement() {
  const { user } = useAuth();
  const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    description: '',
    type: 'sick' as const,
    doctorName: '',
    doctorPhone: '',
    expectedReturn: ''
  });

  // Données mockées
  const mockSickLeaves: SickLeave[] = [
    {
      id: '1',
      startDate: '2025-01-18',
      endDate: '2025-01-20',
      reason: 'Grippe saisonnière',
      description: 'Symptômes grippaux avec fièvre élevée',
      status: 'ended',
      type: 'sick',
      documents: ['certificat_medical_1.pdf'],
      doctorName: 'Dr. Martin Sène',
      doctorPhone: '+221 77 123 45 67',
      expectedReturn: '2025-01-21',
      actualReturn: '2025-01-21',
      createdAt: '2025-01-18',
      approvedBy: 'Mohamed Diouf'
    },
    {
      id: '2',
      startDate: '2025-01-10',
      endDate: '2025-01-12',
      reason: 'Consultation médicale',
      description: 'Rendez-vous médical de routine et examens',
      status: 'approved',
      type: 'sick',
      documents: ['justificatif_rdv.pdf'],
      doctorName: 'Dr. Aïcha Fall',
      doctorPhone: '+221 77 987 65 43',
      expectedReturn: '2025-01-13',
      actualReturn: '2025-01-13',
      createdAt: '2025-01-09',
      approvedBy: 'Mohamed Diouf'
    },
    {
      id: '3',
      startDate: '2024-12-15',
      endDate: '2024-12-22',
      reason: 'Intervention chirurgicale mineure',
      description: 'Opération programmée avec convalescence',
      status: 'ended',
      type: 'surgery',
      documents: ['certificat_medical_2.pdf', 'rapport_operation.pdf'],
      doctorName: 'Dr. Mamadou Diop',
      doctorPhone: '+221 77 456 78 90',
      expectedReturn: '2024-12-23',
      actualReturn: '2024-12-23',
      createdAt: '2024-12-10',
      approvedBy: 'Mohamed Diouf'
    }
  ];

  useEffect(() => {
    loadSickLeaves();
  }, []);

  const loadSickLeaves = async () => {
    try {
      setLoading(true);
      // TODO: Charger depuis l'API
      setTimeout(() => {
        setSickLeaves(mockSickLeaves);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des arrêts maladie:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.reason || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newSickLeave: SickLeave = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      documents: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSickLeaves(prev => [newSickLeave, ...prev]);
    setShowForm(false);
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
      description: '',
      type: 'sick',
      doctorName: '',
      doctorPhone: '',
      expectedReturn: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sick':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'accident':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'maternity':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200';
      case 'surgery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      case 'chronic':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistiques
  const stats = {
    totalDays: sickLeaves
      .filter(leave => leave.status === 'ended' || leave.status === 'approved')
      .reduce((sum, leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate || leave.startDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return sum + days;
      }, 0),
    thisYear: sickLeaves.filter(leave => 
      new Date(leave.startDate).getFullYear() === new Date().getFullYear()
    ).length,
    pending: sickLeaves.filter(leave => leave.status === 'pending').length,
    approved: sickLeaves.filter(leave => leave.status === 'approved' || leave.status === 'ended').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className=" rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des arrêts maladie...</p>
        </div>
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
        <HoverZone>
          <EnhancedCard  className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <LiquidContainer className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Heart className="h-10 w-10 text-white" />
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text="Arrêts Maladie"
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-red-100">
                      Gestion de vos arrêts et certificats médicaux 🏥
                    </GlowText>
                  </div>
                </div>
                
                <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StaggeredItem index={0}>
                    <AnimatedMetricCard
                      title="Jours total"
                      value={stats.totalDays.toString()}
                      icon={Calendar}
                      gradient="from-red-500 to-pink-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={1}>
                    <AnimatedMetricCard
                      title="Cette année"
                      value={stats.thisYear.toString()}
                      icon={TrendingUp}
                      gradient="from-pink-500 to-purple-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={2}>
                    <AnimatedMetricCard
                      title="En attente"
                      value={stats.pending.toString()}
                      icon={Clock}
                      gradient="from-purple-500 to-indigo-500"
                    />
                  </StaggeredItem>
                  <StaggeredItem index={3}>
                    <AnimatedMetricCard
                      title="Approuvés"
                      value={stats.approved.toString()}
                      icon={CheckCircle2}
                      trend="+"
                      gradient="from-indigo-500 to-blue-500"
                    />
                  </StaggeredItem>
                </StaggeredList>
              </div>
              <WaveformVisualizer className="w-full h-16 mt-4" />
            </div>
          </EnhancedCard>
        </HoverZone>

        <Tabs defaultValue="history" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="declare">Déclarer un arrêt</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="history" className="space-y-6">
            <StaggeredList className="space-y-6">
              {sickLeaves.map((leave, index) => (
                <StaggeredItem key={leave.id} index={index}>
                  <HoverZone>
                    <EnhancedCard>
                      <CardContent className="p-6">
                  <div className="space-y-4">
                    
                    {/* En-tête */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                            <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{leave.reason}</h3>
                            <p className="text-sm text-muted-foreground">{leave.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(leave.status)}>
                          {leave.status === 'pending' ? 'En attente' :
                           leave.status === 'approved' ? 'Approuvé' :
                           leave.status === 'rejected' ? 'Refusé' :
                           leave.status === 'active' ? 'En cours' : 'Terminé'}
                        </Badge>
                        <Badge className={getTypeColor(leave.type)}>
                          {leave.type === 'sick' ? 'Maladie' :
                           leave.type === 'accident' ? 'Accident' :
                           leave.type === 'maternity' ? 'Maternité' :
                           leave.type === 'surgery' ? 'Chirurgie' : 'Chronique'}
                        </Badge>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Début: {new Date(leave.startDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {leave.endDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Fin: {new Date(leave.endDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {leave.expectedReturn && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Retour prévu: {new Date(leave.expectedReturn).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {leave.actualReturn && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Retour effectif: {new Date(leave.actualReturn).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>

                    {/* Médecin */}
                    {leave.doctorName && (
                      <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Dr. {leave.doctorName}
                            {leave.doctorPhone && ` - ${leave.doctorPhone}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {leave.documents.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="h-4 w-4" />
                          Documents joints
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {leave.documents.map((doc, index) => (
                            <Button key={index} variant="outline" size="sm" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              {doc}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Approbation */}
                    {leave.approvedBy && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Approuvé par {leave.approvedBy}</span>
                      </div>
                    )}

                    {/* Motif de rejet */}
                    {leave.rejectionReason && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Motif de rejet: {leave.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </EnhancedCard>
            </HoverZone>
          </StaggeredItem>
        ))}
      </StaggeredList>

      {sickLeaves.length === 0 && (
        <HoverZone>
          <EnhancedCard>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Aucun arrêt maladie</h3>
                  <p className="text-muted-foreground">Vous n'avez aucun arrêt maladie enregistré</p>
                </CardContent>
              </EnhancedCard>
            </HoverZone>
          )}
          </TabsContent>

          <TabsContent value="declare" className="space-y-6">
            <HoverZone>
              <EnhancedCard>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Déclarer un arrêt maladie
                </CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour déclarer un arrêt maladie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Type d'arrêt *</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value: any) => setFormData({...formData, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sick">Maladie</SelectItem>
                          <SelectItem value="accident">Accident</SelectItem>
                          <SelectItem value="surgery">Chirurgie</SelectItem>
                          <SelectItem value="maternity">Maternité</SelectItem>
                          <SelectItem value="chronic">Maladie chronique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Motif médical *</Label>
                      <Input
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        placeholder="Ex: Grippe, Entorse, Opération..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de début *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Date de fin (si connue)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expectedReturn">Date de retour prévue</Label>
                      <Input
                        id="expectedReturn"
                        type="date"
                        value={formData.expectedReturn}
                        onChange={(e) => setFormData({...formData, expectedReturn: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Nom du médecin</Label>
                      <Input
                        id="doctorName"
                        value={formData.doctorName}
                        onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                        placeholder="Dr. Nom Prénom"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctorPhone">Téléphone du médecin</Label>
                      <Input
                        id="doctorPhone"
                        value={formData.doctorPhone}
                        onChange={(e) => setFormData({...formData, doctorPhone: e.target.value})}
                        placeholder="+221 77 XXX XX XX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Décrivez les symptômes, la situation médicale..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Documents médicaux</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Glissez-déposez vos certificats médicaux ici
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Formats acceptés: PDF, JPG, PNG (max 5MB)
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Parcourir les fichiers
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Déclarer l'arrêt
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setFormData({
                        startDate: '',
                        endDate: '',
                        reason: '',
                        description: '',
                        type: 'sick',
                        doctorName: '',
                        doctorPhone: '',
                        expectedReturn: ''
                      })}
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </form>
              </CardContent>
            </EnhancedCard>
          </HoverZone>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}