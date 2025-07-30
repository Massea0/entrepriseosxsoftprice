import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Rocket, 
  Mail, 
  FileText,
  Clock,
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubmissionData {
  company_name: string;
  contact_first_name: string;
  submission_status: string;
  ai_context?: any;
}

export default function OnboardingSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lancer les confettis
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Charger les données de soumission
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/onboarding/submissions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className=" rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Félicitations {submission?.contact_first_name} ! 🎉
          </h1>
          
          <p className="text-xl text-gray-600">
            Votre demande pour <strong>{submission?.company_name}</strong> a été soumise avec succès
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  IA en action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Notre IA analyse actuellement votre profil pour créer une expérience personnalisée
                </p>
                <Progress value={75} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  Prochaines étapes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Validation sous 24h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>Email de confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span>Documents contractuels</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center">
                <Rocket className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Prêt à transformer votre entreprise ?
                </h2>
                <p className="text-gray-600 mb-6">
                  Enterprise OS va révolutionner votre façon de travailler grâce à l'IA et l'automatisation
                </p>

                <div className="bg-white/80 backdrop-blur p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold mb-3">Ce qui vous attend :</h3>
                  <div className="grid gap-3 text-left max-w-md mx-auto">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Tableau de bord personnalisé avec insights IA</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Automatisation des workflows métier</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Gestion unifiée de tous vos processus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Support dédié et formation personnalisée</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
          <Button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2"
          >
            Se connecter
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-sm text-gray-500"
        >
          <p>
            Numéro de référence : <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
          </p>
          <p className="mt-2">
            Des questions ? Contactez-nous à{' '}
            <a href="mailto:support@enterprise-os.com" className="text-blue-600 hover:underline">
              support@enterprise-os.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}