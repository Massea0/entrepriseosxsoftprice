import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { User, Briefcase } from 'lucide-react';

const formSchema = z.object({
  contact_first_name: z.string().min(2, 'Le prénom est requis'),
  contact_last_name: z.string().min(2, 'Le nom est requis'),
  contact_position: z.string().min(2, 'Le poste est requis'),
});

interface ContactInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export function ContactInfoStep({ data, onNext, onPrev }: ContactInfoStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_first_name: data.contact_first_name || '',
      contact_last_name: data.contact_last_name || '',
      contact_position: data.contact_position || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onNext(values);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contact principal</h2>
        <p className="text-gray-600">
          Qui sera notre interlocuteur privilégié ?
        </p>
      </div>

      <Form {...form}>
        <form id="step-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contact_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input 
                        placeholder="Jean" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input 
                        placeholder="Dupont" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contact_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fonction *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Directeur Général" 
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Votre rôle au sein de l'entreprise
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Conseil :</strong> Le contact principal recevra les accès 
              administrateur et pourra inviter d'autres utilisateurs par la suite.
            </p>
          </div>

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