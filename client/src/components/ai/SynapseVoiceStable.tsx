import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Brain, Loader2, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { GeminiLiveClient, GeminiResponse } from '../../lib/gemini-live-client';
import { SynapseAudioVisualizer } from './SynapseAudioVisualizer';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const SynapseVoiceStable: React.FC = () => {
  // États de l'interface
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  
  // Refs
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialisation du client Gemini Live
  const initializeClient = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      setError(null);

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Clé API Gemini manquante');
      }

      // Créer le client avec configuration d'entreprise CONFORME à l'API Live
      const client = new GeminiLiveClient(apiKey, {
        generationConfig: {
          responseModalities: ["TEXT"] // ⚠️ Configuration minimale pour test
        }
        // 🧪 Suppression temporaire systemInstruction et tools pour test
      });

      // Configuration des handlers d'événements
      client
        .on_open(() => {
          console.log('🔌 Connexion établie');
        })
        .on_handshake(() => {
          console.log('🤝 Handshake terminé - Prêt !');
          setConnectionStatus('connected');
        })
        .on_close((reason) => {
          console.log('🔌 Connexion fermée:', reason);
          setConnectionStatus('disconnected');
        })
        .on_error((error) => {
          console.error('❌ Erreur client:', error);
          setError(error);
          setConnectionStatus('error');
        });

      // Handler temps réel pour les réponses
      client.realtime((response: GeminiResponse) => {
        console.log('📥 Réponse reçue:', response.type);
        
        if (response.type === 'text' && response.text) {
          setResponse(prev => prev + response.text);
        }
        
        if (response.type === 'audio' && response.audio && audioEnabled) {
          playAudioResponse(response.audio.data);
        }
        
        if (response.type === 'function' && response.functionCall) {
          handleFunctionCall(response.functionCall);
        }
        
        if (response.type === 'error') {
          setError(response.error || 'Erreur inconnue');
        }
      });

      // Connexion
      await client.connect();
      clientRef.current = client;

    } catch (error) {
      console.error('❌ Erreur initialisation:', error);
      setError(error instanceof Error ? error.message : 'Erreur de connexion');
      setConnectionStatus('error');
    }
  }, [audioEnabled]);

  // Lecture audio
  const playAudioResponse = useCallback((audioData: string) => {
    try {
      const audioBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
      
      // Nettoyage
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error('❌ Erreur lecture audio:', error);
    }
  }, []);

  // Gestion des function calls
  const handleFunctionCall = useCallback((functionCall: unknown) => {
    console.log('🔧 Function call:', functionCall);
    // Ici vous pouvez implémenter la logique métier
    // Par exemple, créer une tâche, obtenir des stats, etc.
  }, []);

  // Démarrer l'enregistrement
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToGemini(audioBlob);
      };

      mediaRecorderRef.current.start(100); // Enregistrer par chunks de 100ms
      setIsListening(true);
      setTranscript('🎤 Écoute en cours...');
      
    } catch (error) {
      console.error('❌ Erreur microphone:', error);
      setError('Impossible d\'accéder au microphone');
    }
  }, []);

  // Arrêter l'enregistrement
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setTranscript('');
  }, []);

  // Envoyer audio à Gemini
  const sendAudioToGemini = useCallback(async (audioBlob: Blob) => {
    if (!clientRef.current?.isReady()) {
      setError('Client non connecté');
      return;
    }

    try {
      // Conversion en base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      setResponse(''); // Reset de la réponse
      
      // Envoi à Gemini Live
      await clientRef.current.send({ audio: base64Audio });
      
    } catch (error) {
      console.error('❌ Erreur envoi audio:', error);
      setError('Erreur lors de l\'envoi audio');
    }
  }, []);

  // Test textuel
  const sendTestMessage = useCallback(async () => {
    if (!clientRef.current?.isReady()) {
      await initializeClient();
      return;
    }

    try {
      setResponse('');
      await clientRef.current.send({ 
        prompt: "Bonjour ! Peux-tu me donner un aperçu des fonctionnalités d'Enterprise OS ?" 
      });
    } catch (error) {
      console.error('❌ Erreur test:', error);
      setError('Erreur lors du test');
    }
  }, [initializeClient]);

  // Initialisation au montage
  useEffect(() => {
    initializeClient();

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [initializeClient]);

  // Icônes de statut
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting': return <Loader2 className="h-4 w-4 text-blue-500 " />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connecté';
      case 'connecting': return 'Connexion...';
      case 'error': return 'Erreur';
      default: return 'Déconnecté';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Synapse Voice Stable
                  {getStatusIcon()}
                </CardTitle>
                <CardDescription>
                  Assistant IA vocal pour Enterprise OS • {getStatusText()}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
                Gemini Live API
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contrôles vocaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contrôles Vocaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopListening : startListening}
                disabled={connectionStatus !== 'connected'}
                className="h-20 w-20 rounded-full"
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </div>

            {transcript && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{transcript}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={sendTestMessage}
                disabled={connectionStatus !== 'connected'}
                className="flex-1"
              >
                Test Vocal
              </Button>
              <Button
                variant="outline"
                onClick={initializeClient}
                disabled={connectionStatus === 'connecting'}
                className="flex-1"
              >
                Reconnecter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualisation audio */}
        <Card>
          <CardHeader>
            <CardTitle>Visualisation Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <SynapseAudioVisualizer isActive={isListening} />
          </CardContent>
        </Card>
      </div>

      {/* Réponse de l'IA */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Réponse Synapse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erreurs */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Erreur:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 