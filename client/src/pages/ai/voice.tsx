import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Headphones } from 'lucide-react';
import { useState } from 'react';

export default function AIVoice() {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Natural Voice AI</h1>
        <p className="text-muted-foreground">
          Contrôlez l'application avec votre voix
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Assistant Vocal Intelligent
          </CardTitle>
          <CardDescription>
            Parlez naturellement pour naviguer et créer du contenu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative inline-flex">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className="rounded-full h-24 w-24"
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? (
                  <MicOff className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>
              {isListening && (
                <span className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-destructive animate-ping" />
              )}
            </div>
            
            <p className="mt-6 text-lg font-medium">
              {isListening ? "J'écoute..." : "Cliquez pour commencer"}
            </p>
            
            <div className="mt-8 text-left max-w-md mx-auto">
              <h3 className="font-medium mb-3">Exemples de commandes :</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• "Montre-moi les factures en retard"</li>
                <li>• "Crée un nouveau projet pour Orange"</li>
                <li>• "Quel est le CA du mois dernier ?"</li>
                <li>• "Assigne cette tâche à Jean"</li>
                <li>• "Génère un rapport mensuel"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette fonctionnalité utilise l'API Gemini Live Voice pour une interaction 
            naturelle. La connexion WebSocket sera établie prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}