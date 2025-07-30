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
import { Building2, Globe, Mail, Phone } from 'lucide-react';

const formSchema = z.object({
  company_name: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  company_email: z.string().email('Email invalide'),
  company_phone: z.string().optional(),
  website: z.string().url('URL invalide').or(z.literal('')).optional(),
});

interface CompanyInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export function CompanyInfoStep({ data, onNext }: CompanyInfoStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: data.company_name || '',
      company_email: data.company_email || '',
      company_phone: data.company_phone || '',
      website: data.website || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onNext(values);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Parlez-nous de votre entreprise</h2>
        <p className="text-gray-600">
          Ces informations nous permettront de personnaliser votre expérience
        </p>
      </div>

      <Form {...form}>
        <form id="step-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'entreprise *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Enterprise OS SARL" 
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Le nom officiel de votre entreprise
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email professionnel *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      type="email"
                      placeholder="contact@entreprise.com" 
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Email principal de contact pour votre entreprise
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input 
                        type="tel"
                        placeholder="+221 77 123 45 67" 
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
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input 
                        type="url"
                        placeholder="https://entreprise.com" 
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

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              Continuer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}