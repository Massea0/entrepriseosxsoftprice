import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  User, 
  Target, 
  Briefcase,
  Brain,
  FileCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// Import des étapes
import {
  CompanyInfoStep,
  ContactInfoStep,
  BusinessContextStep,
  ServicesStep,
  PhilosophyStep,
  ObjectivesStep,
  TechnicalContextStep,
  AIContextStep,
  ReviewStep
} from './steps';

interface OnboardingData {
  // Company Info
  company_name: string;
  company_email: string;
  company_phone: string;
  website: string;
  
  // Contact Info
  contact_first_name: string;
  contact_last_name: string;
  contact_position: string;
  
  // Business Context
  industry: string;
  company_size: string;
  annual_revenue: string;
  founding_year: number;
  
  // Services
  services: string[];
  target_markets: string[];
  main_competitors: string[];
  
  // Philosophy
  company_mission: string;
  company_vision: string;
  company_values: string[];
  work_methodology: string;
  
  // Objectives
  primary_goals: string[];
  pain_points: string[];
  expected_outcomes: string[];
  timeline: string;
  budget_range: string;
  
  // Technical Context
  current_tools: string[];
  integrations_needed: string[];
  data_volume: string;
  team_structure: any;
  departments: string[];
  
  // AI Context
  ai_maturity: string;
  ai_use_cases: string[];
  data_quality: string;
}

const STEPS = [
  { id: 1, name: 'Informations Entreprise', icon: Building2, component: CompanyInfoStep },
  { id: 2, name: 'Contact Principal', icon: User, component: ContactInfoStep },
  { id: 3, name: 'Contexte Business', icon: Briefcase, component: BusinessContextStep },
  { id: 4, name: 'Services & Marchés', icon: Target, component: ServicesStep },
  { id: 5, name: 'Philosophie', icon: Sparkles, component: PhilosophyStep },
  { id: 6, name: 'Objectifs', icon: Target, component: ObjectivesStep },
  { id: 7, name: 'Contexte Technique', icon: FileCheck, component: TechnicalContextStep },
  { id: 8, name: 'Maturité IA', icon: Brain, component: AIContextStep },
  { id: 9, name: 'Révision', icon: CheckCircle2, component: ReviewStep }
];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep - 1].component;

  const handleNext = async (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    // Sauvegarder dans localStorage
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Soumettre le formulaire
      await handleSubmit(updatedData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: Partial<OnboardingData>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          submission_status: 'submitted'
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la soumission');

      const result = await response.json();
      
      // Générer le contexte IA
      await fetch('/api/ai/generate-company-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: result.id })
      });

      toast.success('Votre demande a été soumise avec succès !');
      localStorage.removeItem('onboardingData');
      navigate(`/onboarding/success/${result.id}`);
    } catch (error) {
      toast.error('Erreur lors de la soumission');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Charger les données sauvegardées
  useEffect(() => {
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            Bienvenue dans l'Expérience Enterprise OS
          </motion.h1>
          <p className="text-gray-600">
            Quelques questions pour personnaliser votre expérience
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">
              Étape {currentStep} sur {STEPS.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% complété
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between mb-8 overflow-x-auto">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                disabled={step.id > currentStep}
                className={`
                  flex flex-col items-center p-2 min-w-[100px] transition-all
                  ${isActive ? 'scale-110' : ''}
                  ${step.id > currentStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                  ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 
                    isCompleted ? 'bg-green-500 text-white' : 
                    'bg-gray-200 text-gray-500'}
                `}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <span className={`
                  text-xs text-center
                  ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600'}
                `}>
                  {step.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentStepComponent
                  data={formData}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isFirstStep={currentStep === 1}
                  isLastStep={currentStep === STEPS.length}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem('onboardingData', JSON.stringify(formData));
                toast.success('Progression sauvegardée');
              }}
            >
              Sauvegarder
            </Button>
            
            {currentStep < STEPS.length && (
              <Button
                onClick={() => {
                  const form = document.getElementById('step-form') as HTMLFormElement;
                  form?.requestSubmit();
                }}
                className="flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}