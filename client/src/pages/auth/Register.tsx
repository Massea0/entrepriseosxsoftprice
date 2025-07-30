import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Shield, 
  CheckCircle, 
  Eye,
  UserCheck,
  Building2
} from 'lucide-react';

// 🚀 REVOLUTIONARY DESIGN SYSTEM IMPORTS
import {
  FloatingParticles,
  MorphingBlob,
  TypewriterText,
  GlowText,
  StaggeredList,
  StaggeredItem,
  HoverZone,
  MagneticButton,
  EnhancedCard
} from '@/components/design-system/RevolutionaryDesignSystem';

import { MultiStepForm } from '@/components/ui/MultiStepForm';
import { EnhancedInput } from '@/components/ui/EnhancedInput';

function Register() {
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🌟 REVOLUTIONARY MULTI-STEP REGISTRATION FORM
  const revolutionarySteps = [
    {
      id: 'personal-info',
      title: 'Informations Personnelles',
      description: 'Commençons par vous connaître',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <GlowText className="text-lg">
              Bienvenue dans l'écosystème Enterprise OS ! 🚀
            </GlowText>
          </div>
          
          <StaggeredList className="space-y-4">
            <StaggeredItem>
              <EnhancedInput
                label="Prénom"
                placeholder="Jean"
                variant="floating"
                icon={<User className="h-4 w-4" />}
                value={registrationData.firstName}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </StaggeredItem>
            <StaggeredItem>
              <EnhancedInput
                label="Nom de famille"
                placeholder="Dupont"
                variant="floating"
                icon={<User className="h-4 w-4" />}
                value={registrationData.lastName}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </StaggeredItem>
            <StaggeredItem>
              <EnhancedInput
                label="Adresse email"
                type="email"
                placeholder="jean.dupont@entreprise.com"
                variant="floating"
                icon={<Mail className="h-4 w-4" />}
                value={registrationData.email}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </StaggeredItem>
          </StaggeredList>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Sécurité & Accès',
      description: 'Protégez votre compte avec un mot de passe fort',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <GlowText className="text-lg flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité renforcée
            </GlowText>
          </div>
          
          <StaggeredList className="space-y-4">
            <StaggeredItem>
              <EnhancedInput
                label="Mot de passe"
                type="password"
                placeholder="••••••••••"
                variant="floating"
                icon={<Lock className="h-4 w-4" />}
                showPasswordToggle
                value={registrationData.password}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <div className="text-xs text-muted-foreground mt-1">
                Minimum 6 caractères
              </div>
            </StaggeredItem>
            <StaggeredItem>
              <EnhancedInput
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••••"
                variant="floating"
                icon={<CheckCircle className="h-4 w-4" />}
                showPasswordToggle
                value={registrationData.confirmPassword}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                error={registrationData.confirmPassword && registrationData.password !== registrationData.confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined}
              />
            </StaggeredItem>
          </StaggeredList>
        </div>
      )
    },
    {
      id: 'role-selection',
      title: 'Rôle & Permissions',
      description: 'Choisissez votre rôle dans l\'organisation',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <GlowText className="text-lg flex items-center justify-center gap-2">
              <Briefcase className="h-5 w-5" />
              Quel est votre rôle ?
            </GlowText>
          </div>
          
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StaggeredItem>
              <HoverZone>
                <div 
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    registrationData.role === 'client' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setRegistrationData(prev => ({ ...prev, role: 'client' }))}
                >
                  <div className="text-center">
                    <Building2 className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                    <h3 className="font-semibold mb-2">Client</h3>
                    <p className="text-sm text-muted-foreground">
                      Accès aux projets, factures et support client
                    </p>
                  </div>
                </div>
              </HoverZone>
            </StaggeredItem>
            <StaggeredItem>
              <HoverZone>
                <div 
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    registrationData.role === 'employee' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setRegistrationData(prev => ({ ...prev, role: 'employee' }))}
                >
                  <div className="text-center">
                    <UserCheck className="h-8 w-8 mx-auto mb-3 text-green-500" />
                    <h3 className="font-semibold mb-2">Employé</h3>
                    <p className="text-sm text-muted-foreground">
                      Gestion des tâches, planning et ressources
                    </p>
                  </div>
                </div>
              </HoverZone>
            </StaggeredItem>
            <StaggeredItem>
              <HoverZone>
                <div 
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    registrationData.role === 'manager' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setRegistrationData(prev => ({ ...prev, role: 'manager' }))}
                >
                  <div className="text-center">
                    <Briefcase className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                    <h3 className="font-semibold mb-2">Manager</h3>
                    <p className="text-sm text-muted-foreground">
                      Management d'équipes et supervision
                    </p>
                  </div>
                </div>
              </HoverZone>
            </StaggeredItem>
            <StaggeredItem>
              <HoverZone>
                <div 
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    registrationData.role === 'admin' 
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                  onClick={() => setRegistrationData(prev => ({ ...prev, role: 'admin' }))}
                >
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-3 text-red-500" />
                    <h3 className="font-semibold mb-2">Administrateur</h3>
                    <p className="text-sm text-muted-foreground">
                      Accès complet et configuration système
                    </p>
                  </div>
                </div>
              </HoverZone>
            </StaggeredItem>
          </StaggeredList>
        </div>
      )
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Vérifiez vos informations avant de créer le compte',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <GlowText className="text-2xl font-bold text-green-600">
              <CheckCircle className="h-8 w-8 inline mr-2" />
              Prêt à rejoindre Enterprise OS !
            </GlowText>
          </div>
          
          <EnhancedCard className="p-6"  >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Récapitulatif de votre compte
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <strong>Nom complet:</strong> 
                <span>{registrationData.firstName} {registrationData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <strong>Email:</strong> 
                <span>{registrationData.email}</span>
              </div>
              <div className="flex justify-between">
                <strong>Rôle:</strong> 
                <span className="capitalize">{registrationData.role}</span>
              </div>
              <div className="flex justify-between">
                <strong>Mot de passe:</strong> 
                <span>••••••••</span>
              </div>
            </div>
          </EnhancedCard>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            En créant votre compte, vous acceptez nos conditions d'utilisation
          </div>
        </div>
      )
    }
  ];

  const handleRegistrationComplete = async (formData: any) => {
    setLoading(true);
    setError('');

    if (registrationData.password !== registrationData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (registrationData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    const { error } = await signUp(
      registrationData.email, 
      registrationData.password, 
      registrationData.firstName, 
      registrationData.lastName, 
      registrationData.role
    );

    if (error) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message
      });
    } else {
      toast({
        title: "Compte créé !",
        description: "Bienvenue dans Enterprise OS Genesis Framework",
        variant: "default",
      });
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex-1 relative min-h-screen overflow-hidden">
      {/* 🌟 REVOLUTIONARY BACKGROUND LAYER */}
      <FloatingParticles 
        count={30} 
        className="absolute inset-0 z-0" 
      />
      <MorphingBlob 
        className="absolute top-10 right-20 w-96 h-96 opacity-25 z-0 from-purple-400/20 to-pink-600/20" 
      />
      <MorphingBlob 
        className="absolute bottom-10 left-20 w-80 h-80 opacity-20 z-0 from-blue-400/20 to-cyan-400/20" 
      />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header Révolutionnaire */}
        <div className="mb-8 text-center">
          <TypewriterText 
            text="Inscription Révolutionnaire"
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            speed={60}
          />
          <GlowText className="text-muted-foreground mt-2">
            Rejoignez l'écosystème Enterprise OS Genesis Framework ✨
          </GlowText>
        </div>

        {/* Formulaire Multi-Étapes Révolutionnaire */}
        <EnhancedCard className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90"  >
          <div className="p-8">
            <MultiStepForm
              steps={revolutionarySteps}
              onComplete={handleRegistrationComplete}
            />
          </div>
        </EnhancedCard>

        {/* Link to Login */}
        <div className="text-center mt-6">
          <GlowText className="text-sm">
            Vous avez déjà un compte ?{' '}
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Se connecter
            </Link>
          </GlowText>
        </div>
      </div>
    </div>
  );
}

export default Register;
