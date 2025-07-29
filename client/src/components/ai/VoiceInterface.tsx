
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
// import { supabase } // Migrated from Supabase to Express API
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  Loader2,
  Languages,
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface VoiceInterfaceProps {
  onInsight?: (insight: unknown) => void;
  currentModule?: string;
  userId?: string;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onInsight,
  currentModule = 'dashboard',
  userId
}) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [volume, setVolume] = useState(0.8);
  const [isEnabled, setIsEnabled] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialisation des API vocales
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'fr' ? 'fr-FR' : 'en-US';
      
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = () => {
        console.log('🔇 Reconnaissance vocale arrêtée');
        // Redémarrer seulement si l'utilisateur est en mode conversation continue
        if (isListening && isEnabled) {
          console.log('🔄 Redémarrage automatique pour conversation continue...');
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.log('🛑 Impossible de redémarrer - utilisateur a arrêté');
                setIsListening(false);
              }
            }
          }, 500); // Petit délai pour éviter les conflicts
        } else {
          setIsListening(false);
        }
      };
    }

    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Initialiser AudioContext pour l'analyse audio
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (AudioContextConstructor) {
      audioContextRef.current = new AudioContextConstructor();
    }

    return () => {
      stopListening();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [language]);

  const handleSpeechResult = async (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');

    if (event.results[event.results.length - 1].isFinal) {
      setIsProcessing(true);
      
      try {
        // Envoyer à l'IA pour traitement
        const response = await fetch('/api/voice-ai-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript,
            language,
            currentModule,
            userId,
            context: {
              timestamp: new Date().toISOString(),
              sessionId: `voice_${Date.now()}`
            }
          })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        if (data?.response) {
          await speakResponse(data.response, language);
          
          // Si c'est un insight, le transmettre
          if (data.insight) {
            onInsight?.(data.insight);
          }
        }
      } catch (error) {
        console.error('Erreur traitement vocal:', error);
        await speakResponse(
          language === 'fr' 
            ? "Désolé, je n'ai pas pu traiter votre demande."
            : "Sorry, I couldn't process your request.",
          language
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSpeechError = (event: SpeechRecognitionErrorEvent) => {
    console.error('Erreur reconnaissance vocale:', event.error);
    setIsListening(false);
    setIsProcessing(false);
    
    if (event.error === 'not-allowed') {
      toast({
        variant: "destructive",
        title: "Microphone requis",
        description: "Veuillez autoriser l'accès au microphone pour utiliser l'assistant vocal"
      });
    } else if (event.error === 'aborted') {
      console.log('🛑 Reconnaissance vocale interrompue par l\'utilisateur');
    } else if (event.error === 'network') {
      toast({
        variant: "destructive",
        title: "Erreur réseau",
        description: "Problème de connexion pour la reconnaissance vocale"
      });
    }
  };

  // Fonction pour nettoyer le texte avant la synthèse vocale
  const cleanTextForSpeech = (text: string): string => {
    return text
      // Remplacer les astérisques par des pauses ou les supprimer
      .replace(/\*+/g, ' ')
      // Nettoyer les caractères markdown
      .replace(/#{1,6}\s/g, '') // Titres markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Gras
      .replace(/\*(.*?)\*/g, '$1') // Italique
      .replace(/`(.*?)`/g, '$1') // Code inline
      .replace(/```[\s\S]*?```/g, ' ') // Blocs de code
      // Nettoyer les caractères spéciaux courants
      .replace(/[_~`|<>]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Liens markdown [texte](url) -> texte
      // Nettoyer les emojis optionnellement (garde les principaux pour l'expressivité)
      .replace(/[^\w\s\u00C0-\u017F\u0100-\u024F.,!?;:()€$£¥%°'"«»""''–—…]/g, ' ')
      // Nettoyer les espaces multiples
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speakResponse = async (text: string, lang: 'fr' | 'en') => {
    if (!synthesisRef.current) return;

    setIsSpeaking(true);
    
    // Nettoyer le texte avant la synthèse
    const cleanedText = cleanTextForSpeech(text);
    
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    utterance.volume = volume;
    utterance.rate = 0.85; // Légèrement plus lent pour plus de naturel
    utterance.pitch = 1.05; // Légèrement plus aigu pour plus de vivacité

    // Sélectionner la meilleure voix disponible (ordre de préférence)
    const voices = synthesisRef.current.getVoices();
    let selectedVoice = null;
    
    if (lang === 'fr') {
      // Ordre de préférence pour français
      selectedVoice = voices.find(v => v.name.includes('Amélie')) ||         // macOS/iOS (très naturelle)
                     voices.find(v => v.name.includes('Virginie')) ||        // macOS/iOS
                     voices.find(v => v.name.includes('Marie')) ||           // Windows
                     voices.find(v => v.name.includes('Google français')) || // Chrome
                     voices.find(v => v.name.includes('Hortense')) ||        // Windows
                     voices.find(v => v.lang === 'fr-FR' && v.name.includes('Natural')) ||
                     voices.find(v => v.lang === 'fr-FR' && !v.name.includes('eSpeak')) ||
                     voices.find(v => v.lang.startsWith('fr'));
    } else {
      // Ordre de préférence pour anglais
      selectedVoice = voices.find(v => v.name.includes('Samantha')) ||       // macOS/iOS (très naturelle)
                     voices.find(v => v.name.includes('Karen')) ||           // macOS/iOS
                     voices.find(v => v.name.includes('Zira')) ||            // Windows
                     voices.find(v => v.name.includes('Google US English')) || // Chrome
                     voices.find(v => v.lang === 'en-US' && v.name.includes('Natural')) ||
                     voices.find(v => v.lang === 'en-US' && !v.name.includes('eSpeak')) ||
                     voices.find(v => v.lang.startsWith('en'));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎵 Voix sélectionnée: ${selectedVoice.name} (${selectedVoice.lang})`);
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      toast({
        variant: "destructive",
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée sur ce navigateur"
      });
      return;
    }

    try {
      // Demander permission microphone
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognitionRef.current.start();
      setIsListening(true);
      setIsEnabled(true);
      
      toast({
        title: "🎤 Assistant vocal activé - Mode Conversation",
        description: "Conversation continue activée. Dites 'Arcadis' suivi de votre question"
      });
    } catch (error) {
      console.error('Erreur démarrage écoute:', error);
      toast({
        variant: "destructive",
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
    
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang === 'fr' ? 'fr-FR' : 'en-US';
    }
    
    toast({
              title: "🇫🇷 Français activé",
      description: "L'assistant parle maintenant en français"
    });
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-2xl border-primary/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold">Assistant Vocal IA</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="h-8 w-8 p-0"
              >
                <Languages className="h-4 w-4" />
              </Button>
              <Badge variant={language === 'fr' ? 'default' : 'secondary'}>
                {language === 'fr' ? '🇫🇷' : '🇺🇸'}
              </Badge>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center mb-4">
            {isProcessing ? (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Traitement IA...</span>
              </div>
            ) : isListening ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">À l'écoute...</span>
              </div>
            ) : isSpeaking ? (
              <div className="flex items-center gap-2 text-purple-600">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Assistant parle...</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Prêt à vous aider' : 'Ready to help'}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isListening ? (
              <Button 
                onClick={startListening} 
                className="flex-1"
                disabled={isProcessing}
              >
                <Mic className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Activer' : 'Activate'}
              </Button>
            ) : (
              <Button 
                onClick={stopListening} 
                variant="destructive" 
                className="flex-1"
              >
                <MicOff className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Arrêter' : 'Stop'}
              </Button>
            )}

            {isSpeaking && (
              <Button onClick={stopSpeaking} variant="outline" size="sm">
                <Pause className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Instructions améliorées */}
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 text-xs">
            <div className="text-center font-medium text-blue-800 mb-1">
              {language === 'fr' ? '💬 Mode Conversation Continue' : '💬 Continuous Conversation Mode'}
            </div>
            <div className="text-center text-blue-600">
              {language === 'fr' ? (
                <>Dites <strong>"Arcadis"</strong> puis votre question. L'assistant restera à l'écoute pour des interactions naturelles.</>
              ) : (
                <>Say <strong>"Arcadis"</strong> then your question. The assistant will keep listening for natural interactions.</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
