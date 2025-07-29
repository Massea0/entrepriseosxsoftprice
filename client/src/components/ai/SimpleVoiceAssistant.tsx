import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIContext } from './AIContextProvider';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qlqgyrfqiflnqknbtycw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscWd5cmZxaWZsbnFrbmJ0eWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDI0NTEsImV4cCI6MjA2NTY3ODQ1MX0.ODLjlo-8mvt_Y75LETySScpOQui-MaCBrszWRA2oyrE'
);

interface SimpleVoiceAssistantProps {
  className?: string;
  language?: 'fr' | 'en';
  userId?: string;
}

export const SimpleVoiceAssistant: React.FC<SimpleVoiceAssistantProps> = ({
  className = '',
  language = 'fr',
  userId
}) => {
  const { toast } = useToast();
  const { contextData } = useAIContext();
  
  // États simples
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.8);
  
  // Références
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialisation Web Speech API native
  useEffect(() => {
    // Vérifier support Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configuration simple et fiable
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'fr' ? 'fr-FR' : 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      
      // Gestionnaire de résultat
      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 Transcript:', transcript);
        await processVoiceCommand(transcript);
      };
      
      // Gestionnaire d'erreur simple
      recognitionRef.current.onerror = (event) => {
        console.error('❌ Erreur reconnaissance:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast({
            variant: "destructive",
            title: "Microphone requis",
            description: "Veuillez autoriser l'accès au microphone"
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur vocale",
            description: `Problème: ${event.error}`
          });
        }
      };
      
      // Fin de reconnaissance
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialiser Speech Synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      // Nettoyage simple
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, toast]);

  // Traitement de commande vocale
  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      // Traitement simple via Supabase Edge Function (API REST)
      const response = await fetch('voice-ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript: command,
          language,
          currentModule: 'dashboard',
          userId,
          context: {
            timestamp: new Date().toISOString(),
            sessionId: `simple_voice_${Date.now()}`,
            contextData
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors du traitement');

      const aiResponse = data?.response || "Je n'ai pas pu traiter votre demande.";
      setLastResponse(aiResponse);
      
              // Synthèse vocale de la réponse
        await speakResponse(aiResponse);
      
      toast({
        title: "🎤 Commande traitée",
        description: `"${command}"`,
      });
      
    } catch (error) {
      console.error('❌ Erreur traitement:', error);
      const errorMessage = language === 'fr' 
        ? "Désolé, je n'ai pas pu traiter votre demande."
        : "Sorry, I couldn't process your request.";
      
      setLastResponse(errorMessage);
      await speakResponse(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter la commande vocale"
      });
    } finally {
      setIsProcessing(false);
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

  // Synthèse vocale simple
  const speakResponse = async (text: string): Promise<void> => {
    if (!synthesisRef.current || !text) return;

    return new Promise((resolve) => {
      // Nettoyer le texte avant la synthèse
      const cleanedText = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.volume = volume;
      utterance.rate = 0.85; // Plus naturel
      utterance.pitch = 1.05; // Plus vivant

      // Sélectionner la meilleure voix disponible (ordre de préférence)
      const voices = synthesisRef.current!.getVoices();
      let selectedVoice = null;
      
      if (language === 'fr') {
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

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      synthesisRef.current!.speak(utterance);
    });
  };

  // Démarrer l'écoute
  const startListening = async () => {
    if (!recognitionRef.current) {
      toast({
        variant: "destructive",
        title: "Non supporté",
        description: "Reconnaissance vocale non disponible sur ce navigateur"
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
        title: "🎤 Assistant vocal activé",
        description: language === 'fr' 
          ? "Parlez maintenant..." 
          : "Speak now..."
      });
      
    } catch (error) {
      console.error('❌ Erreur microphone:', error);
      toast({
        variant: "destructive",
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone"
      });
    }
  };

  // Arrêter l'écoute
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Interface utilisateur simple et claire
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Synapse Voice
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Activé" : "Inactif"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contrôles principaux */}
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "default"}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Arrêter
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Parler
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
          >
            {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* État visuel */}
        {isListening && (
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700 font-medium">
              🎤 En écoute...
            </span>
          </div>
        )}

        {/* Dernière réponse */}
        {lastResponse && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Dernière réponse :
            </p>
            <p className="text-sm">{lastResponse}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground text-center">
          {language === 'fr' 
            ? "Cliquez sur 'Parler' et posez votre question"
            : "Click 'Speak' and ask your question"
          }
        </div>
      </CardContent>
    </Card>
  );
};