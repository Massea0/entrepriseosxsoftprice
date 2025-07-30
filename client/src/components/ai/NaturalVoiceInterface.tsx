import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
// import { supabase } // Migrated from Supabase to Express API

interface NaturalVoiceInterfaceProps {
  userId?: string;
  currentModule?: string;
  onInsight?: (insight: any) => void;
}

// Voix disponibles
const VOICE_OPTIONS = {
  fr: [
    { id: 'Kore', name: 'Kore', description: 'Voix féminine douce' },
    { id: 'Aoede', name: 'Aoede', description: 'Voix féminine énergique' },
    { id: 'Charon', name: 'Charon', description: 'Voix masculine professionnelle' }
  ],
  en: [
    { id: 'Puck', name: 'Puck', description: 'Male energetic voice' },
    { id: 'Sage', name: 'Sage', description: 'Female calm voice' }
  ]
};

export const NaturalVoiceInterface: React.FC<NaturalVoiceInterfaceProps> = ({
  userId,
  currentModule = 'enterprise',
  onInsight
}) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(80);
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [language, setLanguage] = useState('fr');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  const recognitionRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'fr' ? 'fr-FR' : 'en-US';
      
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = () => setIsListening(false);
    }

    // Initialiser l'AudioContext
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [language]);

  // Connexion WebSocket à Gemini Live Voice
  const connectToGemini = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      
      // URL de la fonction Edge avec authentification
      const wsUrl = process.env.NEXT_PUBLIC_GEMINI_VOICE_WS_URL || 
                    'wss://qlqgyrfqiflnqknbtycw.// supabase.co/functions/v1/gemini-live-voice-enhanced';
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connecté à Gemini Live Voice');
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Envoyer la configuration initiale
        wsRef.current?.send(JSON.stringify({
          type: 'init',
          context: {
            userId,
            language,
            voicePreference: selectedVoice,
            module: currentModule
          }
        }));

        toast({
          title: "Connecté",
          description: "Assistant vocal prêt avec voix naturelle",
          variant: "default",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Gérer les différents types de messages de Gemini
          if (data.serverContent?.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
              if (part.inlineData?.mimeType === 'audio/pcm') {
                // Audio reçu de Gemini - Jouer avec la voix naturelle
                await playAudioChunk(part.inlineData.data);
              } else if (part.text) {
                // Texte de la réponse (pour affichage)
                console.log('Réponse Gemini:', part.text);
              }
            }
          }
          
          // Gérer les messages d'erreur
          if (data.error) {
            console.error('Erreur Gemini:', data.error);
            toast({
              title: "Erreur",
              description: data.error.message || "Erreur de communication",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Erreur parsing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        setConnectionStatus('error');
        setIsConnected(false);
        
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à l'assistant vocal",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket fermé');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Reconnexion automatique après 5 secondes
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
              connectToGemini();
            }
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Erreur connexion:', error);
      setConnectionStatus('error');
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la connexion",
        variant: "destructive",
      });
    }
  }, [userId, language, selectedVoice, currentModule, toast]);

  // Se connecter automatiquement au montage
  useEffect(() => {
    connectToGemini();
  }, [connectToGemini]);

  // Jouer les chunks audio reçus
  const playAudioChunk = async (base64Data: string) => {
    if (!audioContextRef.current) return;

    try {
      setIsSpeaking(true);
      
      // Décoder le base64 en ArrayBuffer
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Ajouter à la queue audio
      audioQueueRef.current.push(bytes.buffer);
      
      // Jouer si pas déjà en cours
      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    } catch (error) {
      console.error('Erreur décodage audio:', error);
      setIsSpeaking(false);
    }
  };

  // Jouer le prochain chunk dans la queue
  const playNextInQueue = async () => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;

    try {
      // Créer un AudioBuffer à partir des données PCM 16-bit
      const audioBuffer = audioContextRef.current.createBuffer(
        1, // Mono
        audioData.byteLength / 2, // 16-bit = 2 bytes par échantillon
        24000 // Sample rate de Gemini
      );

      // Convertir PCM 16-bit en float32
      const channelData = audioBuffer.getChannelData(0);
      const dataView = new DataView(audioData);
      for (let i = 0; i < channelData.length; i++) {
        const sample = dataView.getInt16(i * 2, true) / 32768.0;
        channelData[i] = sample;
      }

      // Créer et configurer la source audio
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      // Créer un gain node pour le contrôle du volume
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = volume / 100;
      
      // Connecter : source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Jouer et passer au suivant quand terminé
      source.onended = () => {
        playNextInQueue();
      };
      
      source.start();
    } catch (error) {
      console.error('Erreur lecture audio:', error);
      playNextInQueue();
    }
  };

  // Gérer les résultats de reconnaissance vocale
  const handleSpeechResult = async (event: any) => {
    const results = event.results;
    const transcript = results[results.length - 1][0].transcript;
    
    if (results[results.length - 1].isFinal) {
      console.log('Transcription finale:', transcript);
      setIsProcessing(true);
      
      try {
        // Envoyer au backend pour traitement IA
        const response = await fetch('voice-ai-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transcript,
            userId,
            language,
            conversationMode: true,
            bypassKeyword: true,
            context: {
              module: currentModule
            }
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erreur lors du traitement');

        // Envoyer la réponse à Gemini pour génération audio
        if (data?.response && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'client_content',
            turns: [{
              role: 'user',
              parts: [{ text: data.response }]
            }]
          }));
        }

        // Notifier les insights
        if (onInsight && data) {
          onInsight(data);
        }
      } catch (error) {
        console.error('Erreur traitement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de traiter votre demande",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Gérer les erreurs de reconnaissance
  const handleSpeechError = (event: any) => {
    console.error('Erreur reconnaissance:', event.error);
    setIsListening(false);
    
    if (event.error === 'no-speech') {
      toast({
        title: "Aucune parole détectée",
        description: "Veuillez réessayer",
        variant: "default",
      });
    }
  };

  // Démarrer/arrêter l'écoute
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Non disponible",
        description: "La reconnaissance vocale n'est pas disponible dans votre navigateur",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Changer de voix
  const changeVoice = (newVoice: string) => {
    setSelectedVoice(newVoice);
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'change_voice',
        voicePreference: newVoice
      }));
    }
  };

  // Changer de langue
  const changeLanguage = (newLang: string) => {
    setLanguage(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang === 'fr' ? 'fr-FR' : 'en-US';
    }
    
    // Reconnecter avec la nouvelle langue
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  return (
    <Card className="w-full max-w-md p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="space-y-4">
        {/* En-tête avec statut de connexion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Assistant Vocal Naturel</h3>
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Connecté
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 " />
                  Connexion...
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Déconnecté
                </>
              )}
            </Badge>
          </div>
          
          {/* Bouton de reconnexion */}
          {!isConnected && connectionStatus !== 'connecting' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={connectToGemini}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Contrôles de voix */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={language} onValueChange={changeLanguage}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedVoice} onValueChange={changeVoice}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICE_OPTIONS[language as keyof typeof VOICE_OPTIONS].map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contrôle du volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-gray-600" />
          <Slider
            value={[volume]}
            onValueChange={([v]) => setVolume(v)}
            max={100}
            step={10}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-10">{volume}%</span>
        </div>

        {/* Bouton principal */}
        <Button
          size="lg"
          onClick={toggleListening}
          disabled={!isConnected || isProcessing}
          className={`w-full transition-all ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5 mr-2" />
              Arrêter l'écoute
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 mr-2" />
              Parler à l'assistant
            </>
          )}
        </Button>

        {/* État actuel */}
        <div className="text-center text-sm text-gray-600">
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 " />
              Traitement en cours...
            </span>
          ) : isSpeaking ? (
            <span className="flex items-center justify-center gap-2">
              <Volume2 className="h-4 w-4" />
              L'assistant vous parle...
            </span>
          ) : isListening ? (
            <span className="text-red-600 font-medium">À l'écoute...</span>
          ) : (
            <span>Prêt à vous assister</span>
          )}
        </div>
      </div>
    </Card>
  );
};