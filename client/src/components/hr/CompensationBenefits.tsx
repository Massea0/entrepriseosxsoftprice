import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Area, AreaChart, ComposedChart
} from 'recharts';
import {
  DollarSign, TrendingUp, Calculator, Gift, Heart,
  Shield, Car, Home, Smartphone, Coffee, Dumbbell,
  BookOpen, Plane, Baby, Stethoscope, Brain, Sparkles,
  ChevronRight, AlertCircle, CheckCircle, Info,
  Download, Upload, BarChart3, Target
} from 'lucide-react';
// import { supabase } // Migrated from Supabase to Express API

interface Benefit {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  description: string;
  value: number;
  selected: boolean;
  flexible: boolean;
}

interface CompensationPackage {
  baseSalary: number;
  bonus: number;
  benefits: Benefit[];
  totalValue: number;
  marketPosition: 'below' | 'at' | 'above';
  percentile: number;
}

interface MarketData {
  position: string;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
}

interface SalarySimulation {
  currentSalary: number;
  proposedSalary: number;
  increase: number;
  increasePercent: number;
  netIncrease: number;
  benefits: number;
  totalPackage: number;
}

export const CompensationBenefits: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [compensationPackages, setCompensationPackages] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [simulation, setSimulation] = useState<SalarySimulation | null>(null);
  const [selectedBenefits, setSelectedBenefits] = useState<Benefit[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configuration des benefits disponibles
  const availableBenefits: Benefit[] = [
    {
      id: '1',
      name: 'Assurance Santé Premium',
      category: 'Santé',
      icon: Stethoscope,
      description: 'Couverture complète famille',
      value: 150000,
      selected: true,
      flexible: false
    },
    {
      id: '2',
      name: 'Voiture de Fonction',
      category: 'Transport',
      icon: Car,
      description: 'Avec carburant inclus',
      value: 300000,
      selected: false,
      flexible: true
    },
    {
      id: '3',
      name: 'Téléphone + Forfait',
      category: 'Tech',
      icon: Smartphone,
      description: 'iPhone 15 Pro + Data illimité',
      value: 50000,
      selected: true,
      flexible: true
    },
    {
      id: '4',
      name: 'Salle de Sport',
      category: 'Bien-être',
      icon: Dumbbell,
      description: 'Abonnement premium',
      value: 30000,
      selected: false,
      flexible: true
    },
    {
      id: '5',
      name: 'Formation Continue',
      category: 'Développement',
      icon: BookOpen,
      description: 'Budget annuel formation',
      value: 200000,
      selected: true,
      flexible: false
    },
    {
      id: '6',
      name: 'Congés Supplémentaires',
      category: 'Temps',
      icon: Plane,
      description: '5 jours en plus',
      value: 100000,
      selected: false,
      flexible: true
    },
    {
      id: '7',
      name: 'Crèche Entreprise',
      category: 'Famille',
      icon: Baby,
      description: 'Place garantie',
      value: 180000,
      selected: false,
      flexible: true
    },
    {
      id: '8',
      name: 'Restaurant + Café',
      category: 'Quotidien',
      icon: Coffee,
      description: 'Tickets restaurant premium',
      value: 60000,
      selected: true,
      flexible: false
    }
  ];

  useEffect(() => {
    loadCompensationData();
  }, []);

  const loadCompensationData = async () => {
    try {
      // Charger les données de compensation
      const { data: employees } = await supabase
        .from('employees')
        .select(`
          *,
          positions(title, salary_min, salary_max),
          departments(name)
        `);

      // Générer des packages de compensation
      const packages = employees?.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        position: emp.positions?.title,
        department: emp.departments?.name,
        baseSalary: emp.current_salary,
        bonus: Math.floor(emp.current_salary * 0.15),
        benefits: availableBenefits.filter(b => Math.random() > 0.5),
        totalValue: emp.current_salary * 1.3,
        marketPosition: Math.random() > 0.6 ? 'above' : Math.random() > 0.3 ? 'at' : 'below',
        percentile: Math.floor(Math.random() * 40 + 40)
      })) || [];

      setCompensationPackages(packages);

      // Générer des données de marché
      setMarketData(generateMarketData());

      setSelectedBenefits(availableBenefits.filter(b => b.selected));
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement compensation:', error);
      setLoading(false);
    }
  };

  const generateMarketData = (): MarketData[] => {
    const positions = ['Développeur Junior', 'Développeur Senior', 'Lead Developer', 'Manager', 'Directeur'];
    return positions.map(position => ({
      position,
      percentile25: Math.floor(Math.random() * 500000 + 800000),
      percentile50: Math.floor(Math.random() * 800000 + 1200000),
      percentile75: Math.floor(Math.random() * 1000000 + 1800000),
      percentile90: Math.floor(Math.random() * 1500000 + 2500000)
    }));
  };

  const calculateTotalPackageValue = (salary: number, benefits: Benefit[]): number => {
    const benefitsValue = benefits.reduce((sum, benefit) => sum + benefit.value, 0);
    return salary + benefitsValue;
  };

  const simulateSalaryIncrease = (currentSalary: number, increasePercent: number) => {
    const increase = currentSalary * (increasePercent / 100);
    const proposedSalary = currentSalary + increase;
    const benefitsValue = selectedBenefits.reduce((sum, b) => sum + b.value, 0);
    
    setSimulation({
      currentSalary,
      proposedSalary,
      increase,
      increasePercent,
      netIncrease: increase * 0.7, // Estimation après charges
      benefits: benefitsValue,
      totalPackage: proposedSalary + benefitsValue
    });
  };

  // Données pour les graphiques
  const salaryEvolution = [
    { year: '2019', salary: 1000000, market: 950000 },
    { year: '2020', salary: 1100000, market: 1000000 },
    { year: '2021', salary: 1250000, market: 1100000 },
    { year: '2022', salary: 1400000, market: 1250000 },
    { year: '2023', salary: 1600000, market: 1400000 },
    { year: '2024', salary: 1850000, market: 1600000 }
  ];

  const compensationBreakdown = [
    { name: 'Salaire de Base', value: 65, color: '#8B5CF6' },
    { name: 'Bonus', value: 15, color: '#EC4899' },
    { name: 'Avantages', value: 12, color: '#10B981' },
    { name: 'Formation', value: 5, color: '#F59E0B' },
    { name: 'Autres', value: 3, color: '#3B82F6' }
  ];

  const benefitsByCategory = [
    { category: 'Santé', count: 3, value: 250000 },
    { category: 'Transport', count: 2, value: 150000 },
    { category: 'Bien-être', count: 4, value: 120000 },
    { category: 'Famille', count: 2, value: 180000 },
    { category: 'Tech', count: 3, value: 80000 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Compensation & Avantages
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion intelligente de la rémunération et des benefits
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importer Grille
          </Button>
          <Dialog open={isSimulating} onOpenChange={setIsSimulating}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
                <Calculator className="h-4 w-4" />
                Simulateur Salaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Simulateur de Package de Rémunération</DialogTitle>
                <DialogDescription>
                  Créez et optimisez des packages personnalisés
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-salary">Salaire Actuel (XOF)</Label>
                    <Input 
                      id="current-salary" 
                      type="number" 
                      defaultValue="1500000"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          simulateSalaryIncrease(value, 10);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="increase">Augmentation (%)</Label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        id="increase"
                        defaultValue={[10]} 
                        max={50} 
                        step={1}
                        onValueChange={(value) => simulateSalaryIncrease(1500000, value[0])}
                      />
                      <span className="text-sm font-medium w-12">{10}%</span>
                    </div>
                  </div>
                  <div>
                    <Label>Avantages Flexibles</Label>
                    <ScrollArea className="h-[250px] mt-2 border rounded-lg p-3">
                      <div className="space-y-2">
                        {availableBenefits.map(benefit => {
                          const Icon = benefit.icon;
                          return (
                            <div key={benefit.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${benefit.selected ? 'bg-purple-100 dark:bg-purple-950' : 'bg-gray-100 dark:bg-gray-900'}`}>
                                  <Icon className={`h-4 w-4 ${benefit.selected ? 'text-purple-600' : 'text-gray-600'}`} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{benefit.name}</p>
                                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">
                                  {new Intl.NumberFormat('fr-FR').format(benefit.value)} XOF
                                </span>
                                <Switch 
                                  checked={benefit.selected}
                                  disabled={!benefit.flexible}
                                  onCheckedChange={(checked) => {
                                    const updated = availableBenefits.map(b => 
                                      b.id === benefit.id ? { ...b, selected: checked } : b
                                    );
                                    setSelectedBenefits(updated.filter(b => b.selected));
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {simulation && (
                    <>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Résumé de la Simulation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Salaire Actuel</span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('fr-FR').format(simulation.currentSalary)} XOF
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-green-600">
                            <span className="text-sm">Nouveau Salaire</span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('fr-FR').format(simulation.proposedSalary)} XOF
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Augmentation</span>
                            <Badge variant="outline" className="text-green-600">
                              +{simulation.increasePercent}% (+{new Intl.NumberFormat('fr-FR').format(simulation.increase)} XOF)
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Valeur des Avantages</span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('fr-FR').format(simulation.benefits)} XOF
                            </span>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Package Total</span>
                              <span className="text-lg font-bold text-purple-600">
                                {new Intl.NumberFormat('fr-FR').format(simulation.totalPackage)} XOF
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Positionnement Marché
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>25e Percentile</span>
                              <span>1.2M XOF</span>
                            </div>
                            <Progress value={25} className="h-2" />
                            <div className="flex items-center justify-between text-sm">
                              <span>Médiane (50e)</span>
                              <span>1.8M XOF</span>
                            </div>
                            <Progress value={50} className="h-2" />
                            <div className="flex items-center justify-between text-sm font-medium text-purple-600">
                              <span>Votre Position</span>
                              <span>{simulation.proposedSalary > 1800000 ? '65e' : '45e'} Percentile</span>
                            </div>
                            <Progress value={simulation.proposedSalary > 1800000 ? 65 : 45} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter Simulation
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Valider Package
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Masse Salariale</p>
                <p className="text-2xl font-bold">125M XOF</p>
                <p className="text-xs text-muted-foreground mt-1">+8.5% vs 2023</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-950">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coût Benefits</p>
                <p className="text-2xl font-bold">18.5M XOF</p>
                <p className="text-xs text-muted-foreground mt-1">14.8% du total</p>
              </div>
              <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-950">
                <Gift className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Salaire Moyen</p>
                <p className="text-2xl font-bold">1.85M XOF</p>
                <p className="text-xs text-muted-foreground mt-1">75e percentile marché</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-950">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-muted-foreground mt-1">Package global</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-950">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyses Détaillées */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="market">Comparaison Marché</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="equity">Équité Salariale</TabsTrigger>
          <TabsTrigger value="planning">Planification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de la Masse Salariale</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={salaryEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => new Intl.NumberFormat('fr-FR').format(value) + ' XOF'} />
                    <Legend />
                    <Bar dataKey="salary" fill="#8B5CF6" name="Entreprise" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="market" stroke="#EC4899" strokeWidth={2} name="Marché" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition de la Rémunération Globale</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={compensationBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {compensationBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {compensationBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Earners */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Packages de Rémunération</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compensationPackages.slice(0, 5).map((pkg, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.position} - {pkg.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {new Intl.NumberFormat('fr-FR').format(pkg.totalValue)} XOF
                      </p>
                      <Badge variant="outline" className={
                        pkg.marketPosition === 'above' ? 'text-green-600' :
                        pkg.marketPosition === 'at' ? 'text-blue-600' : 'text-orange-600'
                      }>
                        {pkg.percentile}e percentile
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Comparative du Marché</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={marketData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="position" type="category" width={120} />
                  <Tooltip formatter={(value: any) => new Intl.NumberFormat('fr-FR').format(value) + ' XOF'} />
                  <Legend />
                  <Bar dataKey="percentile25" fill="#EF4444" name="25e Percentile" />
                  <Bar dataKey="percentile50" fill="#F59E0B" name="Médiane" />
                  <Bar dataKey="percentile75" fill="#10B981" name="75e Percentile" />
                  <Bar dataKey="percentile90" fill="#8B5CF6" name="90e Percentile" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Positionnement vs Marché</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Développeurs', 'Managers', 'Commerciaux', 'Support'].map((role, index) => {
                    const position = Math.floor(Math.random() * 30 + 60);
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{role}</span>
                          <Badge variant={position > 75 ? 'default' : position > 50 ? 'secondary' : 'destructive'}>
                            {position}e percentile
                          </Badge>
                        </div>
                        <Progress value={position} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommandations IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500">
                  <p className="text-sm font-medium">Ajustement Urgent</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 postes clés sont 20% sous le marché
                  </p>
                  <Button size="sm" variant="link" className="h-auto p-0 mt-1 text-xs">
                    Voir détails →
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500">
                  <p className="text-sm font-medium">Opportunité</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Réallocation possible de 2.5M XOF
                  </p>
                  <Button size="sm" variant="link" className="h-auto p-0 mt-1 text-xs">
                    Optimiser →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Utilisation des Benefits par Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={benefitsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#EC4899" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="#8B5CF6" name="Nombre" radius={[8, 8, 0, 0]} />
                    <Bar yAxisId="right" dataKey="value" fill="#EC4899" name="Valeur (XOF)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Benefits Populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableBenefits.slice(0, 5).map((benefit, index) => {
                    const Icon = benefit.icon;
                    const usage = Math.floor(Math.random() * 30 + 60);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">{benefit.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={usage} className="h-2 w-20" />
                          <span className="text-xs font-medium w-10">{usage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Flexibles */}
          <Card>
            <CardHeader>
              <CardTitle>Programme Benefits Flexibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="p-4 rounded-lg border hover:border-purple-500 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${benefit.flexible ? 'bg-purple-100 dark:bg-purple-950' : 'bg-gray-100 dark:bg-gray-900'}`}>
                          <Icon className={`h-5 w-5 ${benefit.flexible ? 'text-purple-600' : 'text-gray-600'}`} />
                        </div>
                        {benefit.flexible && (
                          <Badge variant="outline" className="text-xs">Flexible</Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{benefit.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{benefit.description}</p>
                      <p className="text-sm font-semibold">
                        {new Intl.NumberFormat('fr-FR').format(benefit.value)} XOF
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse d'Équité Salariale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Par Genre</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Hommes</span>
                        <span className="text-sm font-medium">1.85M XOF</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Femmes</span>
                        <span className="text-sm font-medium">1.82M XOF</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Écart: 1.6% (Objectif: &lt;5%)
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Par Ancienneté</h4>
                  <div className="space-y-3">
                    {['0-2 ans', '2-5 ans', '5-10 ans', '+10 ans'].map((range, index) => {
                      const salary = 1200000 + (index * 400000);
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{range}</span>
                          <span className="text-sm font-medium">
                            {new Intl.NumberFormat('fr-FR').format(salary)} XOF
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matrice d'Équité */}
          <Card>
            <CardHeader>
              <CardTitle>Matrice d'Équité Position/Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 25 }, (_, i) => {
                  const row = Math.floor(i / 5);
                  const col = i % 5;
                  const value = Math.random() * 40 + 60;
                  const color = value > 90 ? '#10B981' : value > 80 ? '#F59E0B' : value > 70 ? '#3B82F6' : '#EF4444';
                  
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {Math.floor(value)}%
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs">
                <span>← Performance Faible</span>
                <span>Performance Élevée →</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planification Budgétaire 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Budget Augmentations</h4>
                    <span className="text-sm font-medium">12.5M XOF</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">65% alloué</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        <h5 className="text-sm font-medium">Mérite</h5>
                      </div>
                      <p className="text-2xl font-bold">5.2M</p>
                      <p className="text-xs text-muted-foreground">42% du budget</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <h5 className="text-sm font-medium">Promotions</h5>
                      </div>
                      <p className="text-2xl font-bold">3.8M</p>
                      <p className="text-xs text-muted-foreground">30% du budget</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <h5 className="text-sm font-medium">Ajustements</h5>
                      </div>
                      <p className="text-2xl font-bold">2.5M</p>
                      <p className="text-xs text-muted-foreground">20% du budget</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Scénarios de Simulation</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Conservateur (+3%)', impact: '+9.5M XOF', risk: 'low' },
                      { name: 'Modéré (+5%)', impact: '+15.8M XOF', risk: 'medium' },
                      { name: 'Agressif (+8%)', impact: '+25.2M XOF', risk: 'high' }
                    ].map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:border-purple-500 cursor-pointer">
                        <div>
                          <p className="font-medium text-sm">{scenario.name}</p>
                          <p className="text-xs text-muted-foreground">Impact: {scenario.impact}</p>
                        </div>
                        <Badge variant={
                          scenario.risk === 'low' ? 'secondary' :
                          scenario.risk === 'medium' ? 'outline' : 'destructive'
                        }>
                          Risque {scenario.risk}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Optimiser avec IA
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Valider Budget 2025
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompensationBenefits;