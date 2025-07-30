// Export des étapes existantes
export { CompanyInfoStep } from './CompanyInfoStep';
export { ContactInfoStep } from './ContactInfoStep';
export { PhilosophyStep } from './PhilosophyStep';

// Stubs temporaires pour les autres étapes
import { Button } from '@/components/ui/button';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}

// Business Context Step
export function BusinessContextStep({ onNext, onPrev }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contexte Business</h2>
      <p className="text-gray-600 mb-6">
        Cette section sera bientôt disponible. Elle permettra de capturer :
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
        <li>Secteur d'activité</li>
        <li>Taille de l'entreprise</li>
        <li>Chiffre d'affaires annuel</li>
        <li>Année de création</li>
      </ul>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Retour</Button>
        <Button onClick={() => onNext({})}>Continuer</Button>
      </div>
    </div>
  );
}

// Services Step
export function ServicesStep({ onNext, onPrev }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Services & Marchés</h2>
      <p className="text-gray-600 mb-6">
        Cette section sera bientôt disponible. Elle permettra de définir :
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
        <li>Services proposés</li>
        <li>Marchés cibles</li>
        <li>Principaux concurrents</li>
      </ul>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Retour</Button>
        <Button onClick={() => onNext({})}>Continuer</Button>
      </div>
    </div>
  );
}

// Objectives Step
export function ObjectivesStep({ onNext, onPrev }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Objectifs</h2>
      <p className="text-gray-600 mb-6">
        Cette section sera bientôt disponible. Elle permettra de capturer :
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
        <li>Objectifs principaux</li>
        <li>Points de douleur actuels</li>
        <li>Résultats attendus</li>
        <li>Timeline et budget</li>
      </ul>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Retour</Button>
        <Button onClick={() => onNext({})}>Continuer</Button>
      </div>
    </div>
  );
}

// Technical Context Step
export function TechnicalContextStep({ onNext, onPrev }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contexte Technique</h2>
      <p className="text-gray-600 mb-6">
        Cette section sera bientôt disponible. Elle permettra de définir :
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
        <li>Outils actuellement utilisés</li>
        <li>Intégrations nécessaires</li>
        <li>Volume de données</li>
        <li>Structure de l'équipe</li>
      </ul>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Retour</Button>
        <Button onClick={() => onNext({})}>Continuer</Button>
      </div>
    </div>
  );
}

// AI Context Step
export function AIContextStep({ onNext, onPrev }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Maturité IA</h2>
      <p className="text-gray-600 mb-6">
        Cette section sera bientôt disponible. Elle permettra d'évaluer :
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
        <li>Niveau de maturité IA</li>
        <li>Cas d'usage IA souhaités</li>
        <li>Qualité des données</li>
      </ul>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Retour</Button>
        <Button onClick={() => onNext({})}>Continuer</Button>
      </div>
    </div>
  );
}

// Review Step
export function ReviewStep({ data, onNext, onPrev, isSubmitting }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Révision & Soumission</h2>
      <p className="text-gray-600 mb-6">
        Vérifiez vos informations avant de soumettre :
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Entreprise</h3>
          <p>Nom : {data.company_name || 'Non renseigné'}</p>
          <p>Email : {data.company_email || 'Non renseigné'}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p>Nom : {data.contact_first_name} {data.contact_last_name}</p>
          <p>Fonction : {data.contact_position || 'Non renseigné'}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Philosophie</h3>
          <p>Mission : {data.company_mission ? '✓ Renseignée' : '✗ Non renseignée'}</p>
          <p>Vision : {data.company_vision ? '✓ Renseignée' : '✗ Non renseignée'}</p>
          <p>Méthodologie : {data.work_methodology || 'Non renseignée'}</p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Retour</Button>
        <Button 
          onClick={() => onNext({})} 
          disabled={isSubmitting}
          className="min-w-[150px]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Soumission...
            </>
          ) : (
            'Soumettre'
          )}
        </Button>
      </div>
    </div>
  );
}