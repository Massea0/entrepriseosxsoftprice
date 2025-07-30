import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Users, Brain } from 'lucide-react';

export default function AIAutoAssign() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assignation Automatique IA</h1>
        <p className="text-muted-foreground">
          L'IA assigne automatiquement les projets aux bonnes personnes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configuration de l'assignation automatique
          </CardTitle>
          <CardDescription>
            Cette fonctionnalité sera bientôt disponible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">En cours de développement</p>
            <p className="text-muted-foreground mb-6">
              L'algorithme d'assignation automatique analysera les compétences,
              la charge de travail et l'historique pour optimiser les attributions.
            </p>
            <Button disabled>
              <Users className="h-4 w-4 mr-2" />
              Activer l'assignation automatique
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}