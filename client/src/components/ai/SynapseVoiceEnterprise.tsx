import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, Activity, Waves, TrendingUp, Wifi, WifiOff, Send } from 'lucide-react';
import { useAIContext } from './AIContextProvider';

interface AudioMetrics {
  volume: number;
  rms: number;
  peak: number;
  dominantFreq: number;
  noiseLevel: number;
}

export default function SynapseVoiceEnterprise() {
  const {
    geminiClient,
    isGeminiConnected,
    audioMetrics,
    isListening,
    isGeminiSpeaking,
    lastResponse,
    toggleListening,
    sendGeminiMessage
  } = useAIContext();

  // S'abonner aux réponses du client quand il est disponible
  useEffect(() => {
    if (geminiClient) {
      const handleResponse = (response: unknown) => {
        if (response.type === 'text') {
          console.log('🔊 Réponse reçue:', response.text);
        }
      };

      // Ajouter l'écouteur
      geminiClient.on('response', handleResponse);

      // Nettoyer lors du démontage
      return () => {
        if (geminiClient && geminiClient.off) {
          geminiClient.off('response', handleResponse);
        }
      };
    }
  }, [geminiClient]);

  const [lastUserTranscript, setLastUserTranscript] = useState('');

  const handleToggleListen = () => {
    toggleListening();
  };

  const handleTestMessage = () => {
    sendGeminiMessage("Bonjour Synapse, peux-tu me donner un résumé de mes projets actuels ?");
  };
  
  const getStatusComponent = () => (
    <div className="flex items-center gap-2">
      {isGeminiConnected && <Activity className="h-4 w-4 text-green-500" />}
      {!isGeminiConnected && <Activity className="h-4 w-4 text-red-500" />}
      <span className="capitalize">{isGeminiConnected ? 'Connecté' : 'Déconnecté'}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Synapse Voice Assistant</h1>
          <p className="text-sm text-muted-foreground">Interface vocale IA pour l'entreprise</p>
        </div>
        <div className="flex gap-2">
          {isGeminiSpeaking && (
            <Badge variant="default" className="animate-pulse">
              <Volume2 className="mr-1 h-3 w-3" />
              Synapse Parle...
            </Badge>
          )}
          <Badge variant={isGeminiConnected ? 'default' : 'secondary'}>
            {getStatusComponent()}
          </Badge>
        </div>
      </div>

      {/* Panneau principal */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Contrôles Vocaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section 1: Contrôles de connexion et d'écoute */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleToggleListen} 
              disabled={!isGeminiConnected} 
              className="flex-1"
              variant={isListening ? "destructive" : "default"}
            >
              {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isListening ? 'Arrêter l\'écoute' : 'Démarrer l\'écoute'}
            </Button>
          </div>

          {/* Section 2: Visualisation (uniquement si en écoute) */}
          {isListening && (
            <div className="p-4 border rounded-lg bg-slate-50 flex flex-col gap-4">
              <h4 className="font-medium text-sm text-slate-700">Analyse Audio Temps Réel</h4>
              
              {/* Grille des métriques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{audioMetrics.volume.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{audioMetrics.rms.toFixed(3)}</div>
                  <div className="text-xs text-slate-500">RMS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{audioMetrics.peak.toFixed(3)}</div>
                  <div className="text-xs text-slate-500">Pic</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{audioMetrics.dominantFreq.toFixed(0)} Hz</div>
                  <div className="text-xs text-slate-500">Fréq. dom.</div>
                </div>
              </div>

              {/* Barre de progression pour le niveau de voix */}
              <div>
                <span className="text-xs text-slate-500">Niveau de la voix</span>
                <Progress value={audioMetrics.volume * 100} className="w-full h-2 mt-1" />
              </div>
            </div>
          )}

          {/* Section 3: Zone de réponse et de test */}
          <div className="flex flex-col gap-4">
            <Button onClick={handleTestMessage} variant="outline" disabled={!isGeminiConnected}>
              <Send className="mr-2 h-4 w-4" /> Envoyer un message de test
            </Button>

            {lastResponse && (
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium text-sm text-blue-700 mb-2">Dernière réponse IA:</h4>
                <p className="text-sm text-blue-800">{lastResponse}</p>
              </div>
            )}

            {lastUserTranscript && (
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-medium text-sm text-green-700 mb-2">Vous avez dit:</h4>
                <p className="text-sm text-green-800">{lastUserTranscript}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 