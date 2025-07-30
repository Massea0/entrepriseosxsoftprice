import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Rocket, 
  Shield, 
  Users, 
  Zap,
  Building2,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enterprise OS
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/register">S'inscrire</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link to="/onboarding">
                Essai gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              L'ERP/CRM 360° propulsé par l'IA
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transformez votre entreprise avec une plateforme unifiée qui automatise, 
              optimise et révolutionne tous vos processus métier grâce à l'intelligence artificielle
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">
                <Link to="/onboarding">
                  Démarrer votre transformation
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/login">
                  Voir une démo
                  <Brain className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ✨ Onboarding personnalisé en 5 minutes • 🚀 Déploiement immédiat • 🛡️ Sans engagement
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Une plateforme, tous vos besoins</h2>
            <p className="text-xl text-gray-600">
              Tout ce dont votre entreprise a besoin, unifié et augmenté par l'IA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à révolutionner votre entreprise ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'entreprises qui ont déjà transformé leur façon de travailler
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Setup en 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>IA pré-configurée</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Support 24/7</span>
            </div>
          </div>

          <Button asChild size="lg" variant="secondary" className="mt-8 text-lg px-8">
            <Link to="/onboarding">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Enterprise OS. Tous droits réservés. Fait avec ❤️ et 🤖 au Sénégal
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Brain,
    title: "IA Intégrée",
    description: "Assistant intelligent, prédictions, automatisation et insights en temps réel"
  },
  {
    icon: Building2,
    title: "Gestion Complète",
    description: "Projets, factures, devis, contrats, RH - tout centralisé"
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Travaillez ensemble efficacement avec des outils modernes"
  },
  {
    icon: Shield,
    title: "Sécurité Maximum",
    description: "Vos données protégées avec les derniers standards de sécurité"
  },
  {
    icon: Zap,
    title: "Automatisation",
    description: "Workflows intelligents qui s'adaptent à vos besoins"
  },
  {
    icon: Rocket,
    title: "Évolutivité",
    description: "Grandissez sans limites avec une architecture scalable"
  }
];