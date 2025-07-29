import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Award, 
  Edit3, 
  Save,
  Building,
  Clock,
  Star,
  Shield,
  FileText,
  Sparkles,
  Zap
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
  EnhancedInput
} from '@/components/design-system/RevolutionaryDesignSystem';

interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  position: string;
  department: string;
  employeeNumber: string;
  hireDate: string;
  manager?: string;
  skills: string[];
  bio?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile>({
    id: user?.id || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal',
    position: 'Développeur Full Stack',
    department: 'Développement',
    employeeNumber: 'ARC2025001',
    hireDate: '2024-03-15',
    manager: 'Mohamed Diouf',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    bio: 'Développeur passionné avec 3 ans d\'expérience en développement web moderne.',
    emergencyContact: {
      name: 'Marie Gamera',
      phone: '+221 77 987 65 43',
      relationship: 'Épouse'
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployeeProfile();
  }, []);

  const loadEmployeeProfile = async () => {
    try {
      setLoading(true);
      // TODO: Charger le profil depuis l'API
      // const response = await fetch(`/api/employees/profile/${user?.id}`);
      // const data = await response.json();
      // setProfile(data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Sauvegarder via API
      // await fetch(`/api/employees/profile/${user?.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles count={20} className="absolute inset-0 z-0" />
      <MorphingBlob className="absolute top-20 right-20 w-96 h-96 opacity-20 z-0" />
      <MorphingBlob className="absolute bottom-20 left-20 w-80 h-80 opacity-15 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Header Révolutionnaire */}
        <HoverZone effect="glow">
          <EnhancedCard variant="shimmer" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-6">
                  <LiquidContainer className="p-1">
                    <Avatar className="h-20 w-20 border-4 border-white/20">
                      <AvatarImage src="" alt={`${profile.firstName} ${profile.lastName}`} />
                      <AvatarFallback className="text-2xl bg-white/20 text-white">
                        {getInitials(profile.firstName, profile.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </LiquidContainer>
                  <div>
                    <TypewriterText
                      text={`${profile.firstName} ${profile.lastName}`}
                      className="text-3xl font-bold mb-1"
                      speed={50}
                    />
                    <GlowText className="text-lg text-blue-100">{profile.position}</GlowText>
                    <p className="text-blue-200 flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4" />
                      {profile.department}
                    </p>
                  </div>
                </div>
                
                <MagneticButton 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={loading}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : isEditing ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit3 className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Sauvegarde...' : isEditing ? 'Sauvegarder' : 'Modifier'}
                </MagneticButton>
              </div>
            </div>
          </EnhancedCard>
        </HoverZone>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Professionnel
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Compétences
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Informations personnelles */}
          <TabsContent value="personal" className="space-y-6">
            <StaggeredList className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StaggeredItem index={0}>
                <HoverZone effect="lift">
                  <EnhancedCard variant="glow" className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white">
                          <User className="h-5 w-5" />
                        </div>
                        <GlowText>Informations générales</GlowText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <EnhancedInput
                          label="Prénom"
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          disabled={!isEditing}
                          icon={User}
                        />
                        <EnhancedInput
                          label="Nom"
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          disabled={!isEditing}
                          icon={User}
                        />
                      </div>
                  
                      <EnhancedInput
                        label="Email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!isEditing}
                        icon={Mail}
                      />
                  
                      <EnhancedInput
                        label="Téléphone"
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!isEditing}
                        placeholder="+33 6 00 00 00 00"
                        icon={Phone}
                      />
                      
                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Adresse
                        </Label>
                        <Textarea
                          id="address"
                          value={profile.address || ''}
                          onChange={(e) => setProfile({...profile, address: e.target.value})}
                          disabled={!isEditing}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </EnhancedCard>
                </HoverZone>
              </StaggeredItem>

              <StaggeredItem index={1}>
                <HoverZone effect="lift">
                  <EnhancedCard variant="glow" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Contact d'urgence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Nom</Label>
                    <Input
                      id="emergencyName"
                      value={profile.emergencyContact?.name || ''}
                      onChange={(e) => setProfile({
                        ...profile, 
                        emergencyContact: {
                          ...profile.emergencyContact!,
                          name: e.target.value
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Téléphone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profile.emergencyContact?.phone || ''}
                      onChange={(e) => setProfile({
                        ...profile, 
                        emergencyContact: {
                          ...profile.emergencyContact!,
                          phone: e.target.value
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation">Relation</Label>
                    <Input
                      id="emergencyRelation"
                      value={profile.emergencyContact?.relationship || ''}
                      onChange={(e) => setProfile({
                        ...profile, 
                        emergencyContact: {
                          ...profile.emergencyContact!,
                          relationship: e.target.value
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                    </CardContent>
                  </EnhancedCard>
                </HoverZone>
              </StaggeredItem>
            </StaggeredList>
          </TabsContent>

          {/* Informations professionnelles */}
          <TabsContent value="professional" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informations professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Département</p>
                        <p className="text-sm text-muted-foreground">{profile.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Manager</p>
                        <p className="text-sm text-muted-foreground">{profile.manager}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Date d'embauche</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profile.hireDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <Badge variant="outline" className="font-mono">
                        {profile.employeeNumber}
                      </Badge>
                      <div>
                        <p className="font-medium">Matricule</p>
                        <p className="text-sm text-muted-foreground">Numéro employé</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Décrivez votre parcours professionnel..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compétences */}
          <TabsContent value="skills" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Compétences techniques
                </CardTitle>
                <CardDescription>
                  Vos expertises et technologies maîtrisées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 Fonctionnalité en développement : Ajout/suppression de compétences
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents personnels
                </CardTitle>
                <CardDescription>
                  Vos documents administratifs et professionnels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Gestion des documents en cours de développement</p>
                  <p className="text-sm">Contrat, CV, certificats seront bientôt disponibles</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}