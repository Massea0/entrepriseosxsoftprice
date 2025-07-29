import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
// import { supabase } // Migrated from Supabase to Express API
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Settings,
  Bot, 
  Loader2,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';

interface VoiceConfig {
  service: 'gemini' | 'elevenlabs' | 'google' | 'webspeech';
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
}

interface PremiumVoiceInterfaceProps {
  onInsight?: (insight: unknown) => void;
  currentModule?: string;
  userId?: string;
}

export const PremiumVoiceInterface: React.FC<PremiumVoiceInterfaceProps> = ({
  onInsight,
  currentModule = 'dashboard',
  userId
}) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Configuration vocale
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    service: 'gemini',
    voice: 'Aoede',
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8
  });

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Services vocaux disponibles
  const VOICE_SERVICES = {
    gemini: {
      name: 'Gemini Live Voice',
      icon: '🌟',
      quality: 'Excellente',
      voices: {
        'Aoede': 'Féminine naturelle',
        'Kore': 'Masculine',
        'Charon': 'Professionnelle'
      }
    },
    elevenlabs: {
      name: 'ElevenLabs Premium',
      icon: '👑',
      quality: 'Ultra-réaliste',
      voices: {
        'rachel': 'Rachel (Française)',
        'bella': 'Bella (Jeune)',
        'antoni': 'Antoni (Masculine)',
        'clyde': 'Clyde (Grave)'
      }
    },
    google: {
      name: 'Google Cloud TTS',
      icon: '☁️',
      quality: 'Très bonne',
      voices: {
        'fr-FR-Wavenet-A': 'Wavenet A (F)',
        'fr-FR-Wavenet-B': 'Wavenet B (M)',
        'fr-FR-Wavenet-C': 'Wavenet C (F)',
        'fr-FR-Wavenet-D': 'Wavenet D (M)'
      }
    },
    webspeech: {
      name: 'Navigateur',
      icon: '🌐',
      quality: 'Basique',
      voices: {
        'default': 'Voix système'
      }
    }
  };

  // Initialisation
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';
      
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Connexion au service vocal sélectionné
  const connectToVoiceService = useCallback(async () => {
    if (voiceConfig.service === 'gemini') {
      // Connexion WebSocket à Gemini Live Voice Enhanced
      const wsUrl = 'wss://qlqgyrfqiflnqknbtycw.// supabase.co/functions/v1/gemini-live-voice-enhanced';
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        // Envoyer la configuration initiale
        wsRef.current?.send(JSON.stringify({
          type: 'init',
          context: {
            userId,
            language: 'fr',
            voicePreference: voiceConfig.voice === 'Aoede' ? 'female' : 
                           voiceConfig.voice === 'Kore' ? 'male' : 'professional',
            module: currentModule
          }
        }));
        
        toast({
          title: "🌟 Gemini Voice connecté",
          description: `Voix ${voiceConfig.voice} activée`,
          duration: 3000,
        });
      };

      wsRef.current.onmessage = handleGeminiMessage;
    }
  }, [voiceConfig, userId, currentModule, toast]);

  // Gestion des messages Gemini
  const handleGeminiMessage = async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.serverContent?.modelTurn?.parts) {
        for (const part of data.serverContent.modelTurn.parts) {
          if (part.inlineData?.mimeType === 'audio/pcm') {
            await playAudioWithService('gemini', part.inlineData.data);
          }
        }
      }
    } catch (error) {
      console.error('Erreur parsing message:', error);
    }
  };

  // Reconnaissance vocale
  const handleSpeechResult = async (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');

    if (event.results[event.results.length - 1].isFinal) {
      setIsProcessing(true);
      
      // Envoyer à l'API backend pour traitement
      const response = await fetch('voice-ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript,
          language: 'fr',
          currentModule,
          userId,
          bypassKeyword: true,
          conversationMode: true
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors du traitement');

      if (data?.response) {
        await speakWithSelectedService(data.response);
      }
      
      setIsProcessing(false);
    }
  };

  const handleSpeechError = (event: SpeechRecognitionErrorEvent) => {
    console.error('Erreur reconnaissance vocale:', event.error);
    setIsListening(false);
  };

  // Synthèse vocale avec le service sélectionné
  const speakWithSelectedService = async (text: string) => {
    setIsSpeaking(true);

    try {
      switch (voiceConfig.service) {
        case 'gemini':
          // Envoyer le texte à Gemini pour génération audio
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              client_content: {
                turns: [{
                  role: "user",
                  parts: [{ text }]
                }],
                turn_complete: true
              }
            }));
          }
          break;

        case 'elevenlabs':
          // Utiliser ElevenLabs
          const response = await fetch('elevenlabs-voice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text,
              voice: voiceConfig.voice,
              language: 'fr',
              stream: false
            })
          });
          
          const elevenLabsData = await response.json();
          if (!response.ok) throw new Error(elevenLabsData.error || 'Erreur ElevenLabs');
          
          if (elevenLabsData?.audio) {
            await playAudioWithService('elevenlabs', elevenLabsData.audio);
          }
          break;

        case 'google':
          // Google Cloud TTS (à implémenter)
          toast({
            title: "Google Cloud TTS",
            description: "Service en cours d'implémentation",
            duration: 3000,
          });
          // Fallback to Web Speech API
          await speakWithWebSpeech(text);
          break;

        case 'webspeech':
        default:
          await speakWithWebSpeech(text);
          break;
      }
    } catch (error) {
      console.error('Erreur synthèse vocale:', error);
      // Fallback to Web Speech API
      await speakWithWebSpeech(text);
    }
  };

  // Jouer l'audio selon le service
  const playAudioWithService = async (service: string, audioData: string) => {
    if (!audioContextRef.current) return;

    try {
      let audioBuffer: AudioBuffer;

      if (service === 'gemini') {
        // Décoder PCM de Gemini
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768;
        }
        
        audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
        audioBuffer.getChannelData(0).set(float32);
      } else {
        // Décoder MP3 d'ElevenLabs
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audioData), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const arrayBuffer = await audioBlob.arrayBuffer();
        audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      }

      // Jouer avec contrôles
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = voiceConfig.volume;
      
      source.playbackRate.value = voiceConfig.speed;
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
      };
      
      source.start();

    } catch (error) {
      console.error('Erreur lecture audio:', error);
      setIsSpeaking(false);
    }
  };

  // Fallback Web Speech API
  const speakWithWebSpeech = async (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.volume = voiceConfig.volume;
    utterance.rate = voiceConfig.speed;
    utterance.pitch = voiceConfig.pitch;
    
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  // Démarrer/Arrêter l'écoute
  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Se connecter au service si nécessaire
      if (voiceConfig.service === 'gemini' && !wsRef.current) {
        await connectToVoiceService();
      }
      
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 shadow-2xl border-primary/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Assistant Vocal Premium
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Sélecteur de service vocal */}
          {showSettings && (
            <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-1 block">Service vocal</label>
                <Select 
                  value={voiceConfig.service} 
                  onValueChange={(value) => setVoiceConfig({...voiceConfig, service: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VOICE_SERVICES).map(([key, service]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{service.icon}</span>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-gray-500">{service.quality}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Voix</label>
                <Select
                  value={voiceConfig.voice}
                  onValueChange={(value) => setVoiceConfig({...voiceConfig, voice: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VOICE_SERVICES[voiceConfig.service].voices).map(([key, name]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Volume ({Math.round(voiceConfig.volume * 100)}%)
                </label>
                <Slider
                  value={[voiceConfig.volume]}
                  onValueChange={([value]) => setVoiceConfig({...voiceConfig, volume: value})}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Vitesse ({voiceConfig.speed}x)
                </label>
                <Slider
                  value={[voiceConfig.speed]}
                  onValueChange={([value]) => setVoiceConfig({...voiceConfig, speed: value})}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-center py-4">
            {isProcessing ? (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Traitement IA...</span>
              </div>
            ) : isListening ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
                  <div className="relative w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <span className="text-sm">À l'écoute...</span>
              </div>
            ) : isSpeaking ? (
              <div className="flex items-center gap-2 text-purple-600">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className="text-sm">
                  {voiceConfig.service === 'elevenlabs' ? 'Voix ultra-réaliste...' : 'En train de parler...'}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                Prêt à vous assister
              </span>
            )}
          </div>

          {/* Contrôles */}
          <Button 
            onClick={toggleListening}
            variant={isListening ? "destructive" : "default"}
            className="w-full"
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Arrêter l'écoute
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Commencer à parler
              </>
            )}
          </Button>

          {/* Badge qualité */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant={voiceConfig.service === 'elevenlabs' ? 'default' : 'secondary'}>
              {VOICE_SERVICES[voiceConfig.service].icon} {VOICE_SERVICES[voiceConfig.service].name}
            </Badge>
            {voiceConfig.service === 'elevenlabs' && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};