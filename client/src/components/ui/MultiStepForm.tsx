import React, { useState, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiStepFormContextType {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  setStepData: (stepIndex: number, data: any) => void;
  getStepData: (stepIndex: number) => any;
  formData: Record<number, any>;
}

const MultiStepFormContext = createContext<MultiStepFormContextType | null>(null);

export const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepForm');
  }
  return context;
};

interface Step {
  title: string;
  description?: string;
  component: ReactNode;
  validation?: () => boolean | Promise<boolean>;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete?: (data: Record<number, any>) => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'wizard' | 'progress-bar';
}

export function MultiStepForm({
  steps,
  onComplete,
  className,
  variant = 'default'
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<number, any>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isValidating, setIsValidating] = useState(false);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const setStepData = (stepIndex: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepIndex]: data
    }));
  };

  const getStepData = (stepIndex: number) => {
    return formData[stepIndex];
  };

  const nextStep = async () => {
    const currentStepData = steps[currentStep];
    
    if (currentStepData.validation) {
      setIsValidating(true);
      try {
        const isValid = await currentStepData.validation();
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch (error) {
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    setCompletedSteps(prev => new Set(prev).add(currentStep));

    if (isLastStep) {
      onComplete?.(formData);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const contextValue: MultiStepFormContextType = {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    setStepData,
    getStepData,
    formData
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          container: 'space-y-8',
          header: 'space-y-4',
          content: 'min-h-96'
        };
      case 'wizard':
        return {
          container: 'bg-gradient-to-br from-background to-muted/20 rounded-2xl border shadow-lg p-8 space-y-8',
          header: 'text-center space-y-4',
          content: 'min-h-96'
        };
      case 'progress-bar':
        return {
          container: 'space-y-6',
          header: 'space-y-6',
          content: 'min-h-96'
        };
      default:
        return {
          container: 'space-y-6',
          header: 'space-y-4',
          content: 'min-h-96'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      <div className={cn(styles.container, className)}>
        
        {/* Header */}
        <div className={styles.header}>
          {variant !== 'minimal' && (
            <div className="space-y-4">
              {/* Step Indicators */}
              {variant === 'wizard' ? (
                <div className="flex items-center justify-center space-x-4">
                  {steps.map((_, index) => (
                    <React.Fragment key={index}>
                      <motion.div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                          index === currentStep
                            ? 'bg-primary border-primary text-primary-foreground'
                            : completedSteps.has(index)
                            ? 'bg-green-500 border-green-500 text-white'
                            : index < currentStep
                            ? 'bg-muted border-muted-foreground text-muted-foreground'
                            : 'bg-background border-muted-foreground text-muted-foreground'
                        )}
                        animate={{
                          scale: index === currentStep ? 1.1 : 1
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        {completedSteps.has(index) ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </motion.div>
                      
                      {index < totalSteps - 1 && (
                        <div 
                          className={cn(
                            'h-1 w-12 rounded-full transition-all duration-300',
                            index < currentStep ? 'bg-primary' : 'bg-muted'
                          )}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={cn(
                        'flex-1 h-2 rounded-full transition-all duration-300',
                        index === currentStep
                          ? 'bg-primary'
                          : index < currentStep
                          ? 'bg-primary/60'
                          : 'bg-muted'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              {variant === 'progress-bar' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Étape {currentStep + 1} sur {totalSteps}</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              {/* Step Title */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <h2 className="text-2xl font-bold">{steps[currentStep]?.title}</h2>
                {steps[currentStep]?.description && (
                  <p className="text-muted-foreground">
                    {steps[currentStep].description}
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {steps[currentStep]?.component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{currentStep + 1}</span>
            <span>/</span>
            <span>{totalSteps}</span>
          </div>

          <Button
            onClick={nextStep}
            disabled={isValidating}
            className="gap-2"
          >
            {isValidating ? (
              <>
                <div className=" rounded-full h-4 w-4 border-b-2 border-white" />
                Validation...
              </>
            ) : isLastStep ? (
              <>
                <Check className="h-4 w-4" />
                Terminer
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </MultiStepFormContext.Provider>
  );
}

// Step Component for easier usage
interface StepProps {
  children: ReactNode;
  className?: string;
}

export function Step({ children, className }: StepProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
}