import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  validation?: (data: any) => boolean;
}

interface MultiStepFormProps {
  steps: FormStep[];
  initialData?: any;
  onComplete: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

export function MultiStepForm({
  steps,
  initialData = {},
  onComplete,
  onCancel,
  className
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleStepData = (stepData: any) => {
    setFormData({ ...formData, ...stepData });
  };

  const handleNext = () => {
    if (currentStepData.validation && !currentStepData.validation(formData)) {
      return;
    }

    setCompletedSteps(new Set([...completedSteps, currentStep]));

    if (isLastStep) {
      onComplete(formData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index <= Math.max(...completedSteps) + 1) {
      setCurrentStep(index);
    }
  };

  const StepComponent = currentStepData.component;

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => goToStep(index)}
                disabled={index > Math.max(...completedSteps) + 1}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200",
                  index === currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : completedSteps.has(index)
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-background border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {completedSteps.has(index) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors duration-200",
                    completedSteps.has(index)
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
          {currentStepData.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentStepData.description}
            </p>
          )}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          <StepComponent
            data={formData}
            onChange={handleStepData}
            onNext={handleNext}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={isFirstStep ? onCancel : handlePrevious}
          className="min-w-[100px]"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {isFirstStep ? 'Annuler' : 'Précédent'}
        </Button>

        <span className="text-sm text-muted-foreground">
          Étape {currentStep + 1} sur {steps.length}
        </span>

        <Button
          onClick={handleNext}
          className="min-w-[100px]"
        >
          {isLastStep ? 'Terminer' : 'Suivant'}
          {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}