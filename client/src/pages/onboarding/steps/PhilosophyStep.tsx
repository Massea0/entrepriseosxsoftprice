import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Target, Sparkles, Users, Zap, Plus, X } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  company_mission: z.string().min(10, 'La mission doit contenir au moins 10 caractères'),
  company_vision: z.string().min(10, 'La vision doit contenir au moins 10 caractères'),
  company_values: z.array(z.string()).min(1, 'Ajoutez au moins une valeur'),
  work_methodology: z.string().min(1, 'Sélectionnez une méthodologie'),
});

interface PhilosophyStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export function PhilosophyStep({ data, onNext, onPrev }: PhilosophyStepProps) {
  const [newValue, setNewValue] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_mission: data.company_mission || '',
      company_vision: data.company_vision || '',
      company_values: data.company_values || [],
      work_methodology: data.work_methodology || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onNext(values);
  };

  const addValue = () => {
    if (newValue.trim()) {
      const currentValues = form.getValues('company_values');
      form.setValue('company_values', [...currentValues, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeValue = (index: number) => {
    const currentValues = form.getValues('company_values');
    form.setValue('company_values', currentValues.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Philosophie & Culture</h2>
        <p className="text-gray-600">
          Aidez-nous à comprendre votre ADN d'entreprise
        </p>
      </div>

      <Form {...form}>
        <form id="step-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="company_mission"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Mission de l'entreprise *
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Quelle est la raison d'être de votre entreprise ? Quel problème résolvez-vous ?"
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Votre mission définit pourquoi votre entreprise existe
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_vision"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Vision à long terme *
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Où voyez-vous votre entreprise dans 5-10 ans ? Quel impact souhaitez-vous avoir ?"
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Votre vision inspire et guide vos décisions stratégiques
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_values"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Valeurs fondamentales *
                </FormLabel>
                <FormDescription>
                  Les principes qui guident vos actions et décisions
                </FormDescription>
                
                <div className="space-y-2 mt-2">
                  {field.value.map((value: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="flex-1">{value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeValue(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Ex: Innovation, Excellence, Transparence..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                  />
                  <Button type="button" onClick={addValue} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="work_methodology"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Méthodologie de travail *
                </FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    value={field.value}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-start space-x-3 border p-4 rounded-lg">
                      <RadioGroupItem value="agile" id="agile" />
                      <label htmlFor="agile" className="cursor-pointer">
                        <p className="font-medium">Agile</p>
                        <p className="text-sm text-gray-600">Itératif et flexible</p>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3 border p-4 rounded-lg">
                      <RadioGroupItem value="waterfall" id="waterfall" />
                      <label htmlFor="waterfall" className="cursor-pointer">
                        <p className="font-medium">Waterfall</p>
                        <p className="text-sm text-gray-600">Séquentiel et structuré</p>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3 border p-4 rounded-lg">
                      <RadioGroupItem value="hybrid" id="hybrid" />
                      <label htmlFor="hybrid" className="cursor-pointer">
                        <p className="font-medium">Hybride</p>
                        <p className="text-sm text-gray-600">Mix des deux approches</p>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3 border p-4 rounded-lg">
                      <RadioGroupItem value="lean" id="lean" />
                      <label htmlFor="lean" className="cursor-pointer">
                        <p className="font-medium">Lean</p>
                        <p className="text-sm text-gray-600">Optimisation continue</p>
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrev}>
              Retour
            </Button>
            <Button type="submit" size="lg">
              Continuer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}