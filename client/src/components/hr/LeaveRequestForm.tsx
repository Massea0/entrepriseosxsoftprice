import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, FileText, Send, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  totalDays: number;
}

export default function LeaveRequestForm({ onClose }: { onClose?: () => void }) {
  const [formData, setFormData] = useState<LeaveRequest>({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    totalDays: 0
  });
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    { value: 'vacation', label: 'Congés payés', color: 'bg-blue-100 text-blue-800' },
    { value: 'sick', label: 'Arrêt maladie', color: 'bg-red-100 text-red-800' },
    { value: 'personal', label: 'Congé personnel', color: 'bg-purple-100 text-purple-800' },
    { value: 'maternity', label: 'Congé maternité', color: 'bg-pink-100 text-pink-800' },
    { value: 'paternity', label: 'Congé paternité', color: 'bg-green-100 text-green-800' },
    { value: 'unpaid', label: 'Congé sans solde', color: 'bg-gray-100 text-gray-800' }
  ];

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    newFormData.totalDays = calculateDays(newFormData.startDate, newFormData.endDate);
    setFormData(newFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Envoyer la demande via API
      console.log('Demande de congé soumise:', formData);
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser le formulaire
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        totalDays: 0
      });

      if (onClose) onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          {onClose && (
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          )}
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Demande de Congé</h1>
                <p className="text-blue-100">Planifiez vos absences facilement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nouvelle Demande
            </CardTitle>
            <CardDescription>
              Remplissez les informations de votre demande de congé
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type de congé */}
              <div className="space-y-2">
                <Label htmlFor="leaveType">Type de congé *</Label>
                <Select value={formData.leaveType} onValueChange={(value) => 
                  setFormData({ ...formData, leaveType: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de congé" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={type.color} variant="secondary">
                            {type.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    min={formData.startDate}
                    required
                  />
                </div>
              </div>

              {/* Durée calculée */}
              {formData.totalDays > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Durée totale: {formData.totalDays} jour{formData.totalDays > 1 ? 's' : ''}
                    </span>
                  </div>
                  {selectedLeaveType && (
                    <Badge className={`mt-2 ${selectedLeaveType.color}`} variant="secondary">
                      {selectedLeaveType.label}
                    </Badge>
                  )}
                </div>
              )}

              {/* Motif */}
              <div className="space-y-2">
                <Label htmlFor="reason">Motif (optionnel)</Label>
                <Textarea
                  id="reason"
                  placeholder="Décrivez brièvement le motif de votre demande..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.leaveType || !formData.startDate || !formData.endDate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className=" rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Soumettre la demande
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      leaveType: '',
                      startDate: '',
                      endDate: '',
                      reason: '',
                      totalDays: 0
                    });
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Réinitialiser
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informations utiles */}
        <Card className="mt-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
              📋 Informations importantes
            </h3>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>• Les demandes doivent être soumises au moins 15 jours à l'avance</li>
              <li>• Votre manager recevra une notification automatique</li>
              <li>• Vous recevrez une réponse sous 3 jours ouvrés</li>
              <li>• Les congés sont déduits automatiquement de votre solde</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}