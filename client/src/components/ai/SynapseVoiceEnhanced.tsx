import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAIContext } from '@/components/ai/AIContextProvider';
import { SynapseAudioOptimizer } from '@/lib/synapse-audio-optimizer';
import { SynapseAudioVisualizer } from './SynapseAudioVisualizer';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot,
  Loader2,
  Zap,
  Brain,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
  MessageSquare,
  Settings,
  Play,
  Square,
  Waves,
  Activity,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface GeminiLiveConfig {
  model: string;
  response_modalities: string[];
  speech_config?: {
    voice_config?: {
      prebuilt_voice_config?: {
        voice_name: string;
      };
    };
    language_code?: string;
  };
  system_instruction?: {
    role: string;
    parts: Array<{ text: string }>;
  };
  tools?: Array<{
    function_declarations: Array<{
      name: string;
      description: string;
      parameters: unknown;
    }>;
  }>;
  realtime_input_config?: {
    automatic_activity_detection?: {
      disabled?: boolean;
      start_of_speech_sensitivity?: string;
      end_of_speech_sensitivity?: string;
      prefix_padding_ms?: number;
      silence_duration_ms?: number;
    };
  };
  input_audio_transcription?: boolean;
  output_audio_transcription?: boolean;
}

interface AudioChunk {
  data: string;
  mime_type: string;
}

interface GeminiMessage {
  setup?: GeminiLiveConfig;
  client_content?: {
    turns: Array<{
      role: string;
      parts: Array<{ text: string }>;
    }>;
    turn_complete: boolean;
  };
  realtime_input?: {
    media_chunks?: AudioChunk[];
    audio_stream_end?: boolean;
  };
  tool_response?: {
    function_responses: Array<{
      id: string;
      name: string;
      response: unknown;
    }>;
  };
}

interface TranscriptionData {
  text: string;
  finished: boolean;
}

interface ToolCall {
  id: string;
  name: string;
  args: unknown;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: unknown;
}

export const SynapseVoiceEnhanced: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshContext } = useAIContext();

  // État de connexion
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // État audio optimisé
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioOptimizer, setAudioOptimizer] = useState<SynapseAudioOptimizer | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    latency: 0,
    bufferUnderruns: 0,
    averageVolume: 0,
    speechDetectionAccuracy: 0
  });

  // État conversation
  const [inputTranscription, setInputTranscription] = useState<string>('');
  const [outputTranscription, setOutputTranscription] = useState<string>('');
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  // Références
  const websocketRef = useRef<WebSocket | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Configuration Gemini Live optimisée
  const geminiConfig: GeminiLiveConfig = {
    model: "gemini-2.5-flash-preview-native-audio-dialog",
    response_modalities: ["AUDIO"],
    speech_config: {
      voice_config: {
        prebuilt_voice_config: {
          voice_name: "Kore"
        }
      },
      language_code: "fr-FR"
    },
    system_instruction: {
      role: "system",
      parts: [{
        text: `Tu es Synapse, l'assistant vocal intelligent de l'Enterprise OS Genesis Framework.

CONTEXTE UTILISATEUR:
- Nom: ${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}
- Rôle: ${user?.user_metadata?.role}
- Entreprise: ${user?.user_metadata?.company_name}

CAPACITÉS ENTERPRISE:
- Gestion projets et tâches
- Analyse des employés et RH  
- Business analytics et finance
- Intégrations tierces (Slack, Teams, WhatsApp)
- Automatisation workflows
- Suivi performance et métriques
- Gestion documents et clients

INSTRUCTIONS:
- Réponds en français naturellement et professionnellement
- Sois concis mais complet dans tes explications
- Utilise les outils pour effectuer des actions concrètes
- Confirme avant les actions importantes/irréversibles
- Adapte ton ton selon le contexte émotionnel
- Fournis des insights proactifs sur les données d'entreprise`
      }]
    },
    tools: [{
      function_declarations: [
        {
          name: "get_projects_dashboard",
          description: "Obtenir un dashboard complet des projets avec métriques",
          parameters: {
            type: "object",
            properties: {
              status_filter: { type: "string", enum: ["all", "active", "completed", "on_hold", "overdue"] },
              time_range: { type: "string", enum: ["week", "month", "quarter", "year"] }
            }
          }
        },
        {
          name: "get_employee_performance", 
          description: "Analyser la performance d'un employé ou équipe",
          parameters: {
            type: "object",
            properties: {
              employee_id: { type: "string", description: "ID employé ou 'all' pour l'équipe" },
              metrics: { type: "array", items: { type: "string", enum: ["productivity", "tasks_completed", "hours_worked", "projects_involved"] } },
              period: { type: "string", description: "Période d'analyse (ex: '30_days', '3_months')" }
            },
            required: ["employee_id"]
          }
        },
        {
          name: "create_task_with_ai",
          description: "Créer une tâche intelligente avec assignation automatique",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Titre de la tâche" },
              description: { type: "string", description: "Description détaillée" },
              auto_assign: { type: "boolean", description: "Assignation automatique basée sur les compétences" },
              priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
              project_id: { type: "string", description: "ID du projet associé" },
              estimated_hours: { type: "number", description: "Estimation en heures" }
            },
            required: ["title", "description"]
          }
        },
        {
          name: "get_business_insights",
          description: "Obtenir des insights business et analytics avancés",
          parameters: {
            type: "object",
            properties: {
              insight_type: { type: "string", enum: ["financial", "productivity", "client_satisfaction", "team_performance", "project_health"] },
              department: { type: "string", description: "Département spécifique ou 'all'" },
              include_predictions: { type: "boolean", description: "Inclure les prédictions IA" }
            },
            required: ["insight_type"]
          }
        },
        {
          name: "send_smart_notification",
          description: "Envoyer une notification intelligente multi-canal",
          parameters: {
            type: "object", 
            properties: {
              recipients: { type: "array", items: { type: "string" }, description: "Liste des destinataires" },
              message: { type: "string", description: "Message personnalisé" },
              channels: { type: "array", items: { type: "string", enum: ["email", "slack", "teams", "whatsapp", "in_app"] } },
              priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
              schedule: { type: "string", description: "Programmation (optionnel): 'now', '1hour', 'tomorrow_9am', etc." }
            },
            required: ["recipients", "message"]
          }
        },
        {
          name: "analyze_document",
          description: "Analyser un document avec IA (PDF, Excel, etc.)",
          parameters: {
            type: "object",
            properties: {
              document_path: { type: "string", description: "Chemin ou ID du document" },
              analysis_type: { type: "string", enum: ["summary", "key_points", "financial_data", "compliance_check"] },
              language: { type: "string", default: "fr" }
            },
            required: ["document_path", "analysis_type"]
          }
        }
      ]
    }],
    realtime_input_config: {
      automatic_activity_detection: {
        disabled: false,
        start_of_speech_sensitivity: "START_SENSITIVITY_LOW",
        end_of_speech_sensitivity: "END_SENSITIVITY_LOW", 
        prefix_padding_ms: 100,
        silence_duration_ms: 500
      }
    },
    input_audio_transcription: true,
    output_audio_transcription: true
  };

  // Initialisation de l'audio context optimisé
  useEffect(() => {
    const initOptimizedAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as unknown).webkitAudioContext)();
        setAudioContext(context);

        // Initialiser l'optimiseur audio
        const optimizer = new SynapseAudioOptimizer(context, {
          inputSampleRate: 16000,
          outputSampleRate: 24000,
          enableNoiseSuppression: true,
          enableEchoCancellation: true,
          enableAutoGainControl: true
        });
        setAudioOptimizer(optimizer);

        // Créer analyseur pour visualisation
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;
        setAnalyser(analyser);

        console.log('🎵 Audio contexte optimisé initialisé');
      } catch (error) {
        console.error('❌ Erreur initialisation audio optimisée:', error);
        setError('Impossible d\'initialiser l\'audio optimisé');
      }
    };

    initOptimizedAudio();

    return () => {
      if (audioOptimizer) {
        audioOptimizer.dispose();
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  // Connexion à Gemini Live avec retry intelligent
  const connectToGeminiLive = useCallback(async () => {
    if (connectionStatus === 'connecting') return;

    try {
      setConnectionStatus('connecting');
      setError(null);
      retryCountRef.current++;

      const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY manquante');
      }

      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      
      console.log('🔌 Connexion à Gemini Live API optimisée...');
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('✅ Connecté à Gemini Live');
        setConnectionStatus('connected');
        setError(null);
        retryCountRef.current = 0;

        const newSessionId = `synapse_enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);

        const setupMessage = { setup: geminiConfig };
        ws.send(JSON.stringify(setupMessage));

        toast({
          title: "🧠 Synapse Enhanced connecté",
          description: "Assistant vocal IA avec optimisations audio activé",
          duration: 3000
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleGeminiMessage(data);
        } catch (error) {
          console.error('❌ Erreur parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
        setConnectionStatus('error');
        setError('Erreur de connexion WebSocket');
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket fermé:', event.code, event.reason);
        setConnectionStatus('disconnected');
        setIsListening(false);
        setIsSpeaking(false);

        if (event.code !== 1000 && retryCountRef.current < maxRetries) {
          console.log(`🔄 Reconnexion automatique ${retryCountRef.current}/${maxRetries}`);
          setTimeout(() => connectToGeminiLive(), 2000 * retryCountRef.current);
        }
      };

      websocketRef.current = ws;

    } catch (error) {
      console.error('❌ Erreur connexion Gemini Live:', error);
      setConnectionStatus('error');
      setError(`Connexion échouée: ${error.message}`);
    }
  }, [connectionStatus, user, geminiConfig, toast]);

  // Déconnexion
  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close(1000, 'Déconnexion volontaire');
      websocketRef.current = null;
    }
    stopListening();
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }
    setConnectionStatus('disconnected');
    setError(null);
    setSessionId('');
    setToolCalls([]);
    
    toast({
      title: "Synapse déconnecté",
      description: "Assistant vocal désactivé",
      variant: "destructive"
    });
  }, []);

  // Gestion des messages Gemini avec optimisations
  const handleGeminiMessage = useCallback((data: unknown) => {
    console.log('📨 Message Gemini optimisé:', data);

    if (data.setupComplete) {
      console.log('✅ Configuration Gemini optimisée terminée');
      return;
    }

    if (data.serverContent) {
      const { serverContent } = data;

      if (serverContent.inputTranscription) {
        setInputTranscription(serverContent.inputTranscription.text || '');
      }

      if (serverContent.outputTranscription) {
        setOutputTranscription(serverContent.outputTranscription.text || '');
      }

      if (serverContent.interrupted) {
        console.log('⚠️ Génération interrompue');
        if (audioSourceRef.current) {
          audioSourceRef.current.stop();
        }
        setIsSpeaking(false);
      }

      if (serverContent.modelTurn?.parts) {
        for (const part of serverContent.modelTurn.parts) {
          if (part.inlineData?.data && part.inlineData?.mimeType?.includes('audio')) {
            playOptimizedAudio(part.inlineData.data);
          }
        }
      }

      if (serverContent.turnComplete) {
        console.log('✅ Tour optimisé terminé');
        setIsSpeaking(false);
      }
    }

    if (data.toolCall?.functionCalls) {
      handleEnhancedToolCalls(data.toolCall.functionCalls);
    }

    if (data.usageMetadata) {
      console.log('📊 Métrics d\'usage:', data.usageMetadata);
    }
  }, []);

  // Gestion avancée des outils entreprise
  const handleEnhancedToolCalls = useCallback(async (functionCalls: unknown[]) => {
    console.log('🔧 Exécution outils enterprise:', functionCalls);
    
    for (const call of functionCalls) {
      try {
        setToolCalls(prev => [...prev, { ...call, status: 'executing' }]);

        let result = {};
        
        switch (call.name) {
          case 'get_projects_dashboard':
            result = await simulateProjectDashboard(call.args);
            break;
          case 'get_employee_performance':
            result = await simulateEmployeePerformance(call.args);
            break;
          case 'create_task_with_ai':
            result = await simulateSmartTaskCreation(call.args);
            break;
          case 'get_business_insights':
            result = await simulateBusinessInsights(call.args);
            break;
          case 'send_smart_notification':
            result = await simulateSmartNotification(call.args);
            break;
          case 'analyze_document':
            result = await simulateDocumentAnalysis(call.args);
            break;
          default:
            throw new Error(`Outil non supporté: ${call.name}`);
        }

        setToolCalls(prev => prev.map(tc => 
          tc.id === call.id ? { ...tc, status: 'completed', result } : tc
        ));

        // Envoyer résultat à Gemini
        if (websocketRef.current) {
          const toolResponse = {
            tool_response: {
              function_responses: [{
                id: call.id,
                name: call.name,
                response: result
              }]
            }
          };
          websocketRef.current.send(JSON.stringify(toolResponse));
        }

      } catch (error) {
        console.error(`❌ Erreur outil ${call.name}:`, error);
        setToolCalls(prev => prev.map(tc => 
          tc.id === call.id ? { ...tc, status: 'failed', result: { error: error.message } } : tc
        ));
      }
    }
  }, []);

  // Simulations d'outils enterprise
  const simulateProjectDashboard = async (args: unknown) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      total_projects: 12,
      active_projects: 8,
      completed_this_month: 3,
      overdue_projects: 1,
      team_productivity: 87.5,
      budget_utilization: 76.2,
      top_performers: ["Marie D.", "Antoine L.", "Sophie M."]
    };
  };

  const simulateEmployeePerformance = async (args: unknown) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      employee: args.employee_id === 'all' ? 'Équipe complète' : `Employé ${args.employee_id}`,
      productivity_score: 92.3,
      tasks_completed: 47,
      hours_worked: 160,
      projects_involved: 5,
      performance_trend: 'positive',
      recommendations: ["Excellente productivité", "Leadership émergent", "Formation IA recommandée"]
    };
  };

  const simulateSmartTaskCreation = async (args: unknown) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const assignedTo = args.auto_assign ? "Auto-assigné à Sarah K. (expertise ML)" : "Non assigné";
    
    toast({
      title: "✅ Tâche créée avec IA",
      description: `"${args.title}" - ${assignedTo}`,
      duration: 5000
    });

    return {
      task_id: `task_${Date.now()}`,
      title: args.title,
      auto_assigned: args.auto_assign,
      assigned_to: assignedTo,
      estimated_completion: "3-5 jours",
      ai_insights: "Complexité moyenne, compétences ML requises"
    };
  };

  const simulateBusinessInsights = async (args: unknown) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const insights = {
      financial: {
        revenue_trend: "+12.3% vs mois dernier",
        profit_margin: "23.8%",
        prediction: "Croissance stable prévue",
        risk_factors: ["Retard projet Alpha", "Coût infrastructure cloud"]
      },
      productivity: {
        team_efficiency: "89.2% (+5.1%)",
        delivery_rate: "94.7%",
        bottlenecks: ["Code review", "Tests QA"],
        recommendations: ["Automatiser CI/CD", "Formation équipe junior"]
      }
    };

    return insights[args.insight_type] || insights.productivity;
  };

  const simulateSmartNotification = async (args: unknown) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const channels = args.channels || ['in_app', 'email'];
    toast({
      title: "📩 Notification multi-canal envoyée",
      description: `${args.recipients.length} destinataire(s) via ${channels.join(', ')}`,
      duration: 4000
    });

    return {
      sent: true,
      recipients_count: args.recipients.length,
      channels_used: channels,
      delivery_time: args.schedule || 'immediate',
      estimated_read_rate: "87%"
    };
  };

  const simulateDocumentAnalysis = async (args: unknown) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      document: args.document_path,
      analysis_type: args.analysis_type,
      summary: "Document analysé avec succès par l'IA",
      key_findings: [
        "Conformité RGPD: ✅ Conforme",
        "Données financières: Budget Q4 respecté",
        "Actions requises: 2 points d'attention mineurs"
      ],
      confidence_score: 94.7,
      processing_time: "1.8 secondes"
    };
  };

  // Démarrage de l'écoute avec optimisations
  const startListening = useCallback(async () => {
    if (!audioContext || !audioOptimizer || !websocketRef.current || connectionStatus !== 'connected') {
      toast({
        title: "Erreur",
        description: "Audio ou connexion non disponible",
        variant: "destructive"
      });
      return;
    }

    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Utiliser les contraintes optimisées
      const constraints = audioOptimizer.getOptimalMicrophoneConstraints();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Configurer MediaRecorder avec paramètres optimisés
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000 // Optimisé pour qualité/bande passante
      });

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && websocketRef.current) {
          try {
            // Conversion PCM optimisée
            const audioChunk = await audioOptimizer.convertToPCM(event.data);
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioChunk.data)));

            const message = {
              realtime_input: {
                media_chunks: [{
                  data: base64Audio,
                  mime_type: "audio/pcm;rate=16000"
                }]
              }
            };

            websocketRef.current.send(JSON.stringify(message));
          } catch (error) {
            console.error('❌ Erreur conversion audio optimisée:', error);
          }
        }
      };

      recorder.start(100); // Chunks de 100ms pour faible latence
      setMediaRecorder(recorder);
      setIsListening(true);

      // Connecter à l'analyseur pour visualisation
      if (analyser) {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        updateVolumeWithOptimization();
      }

      console.log('🎤 Écoute optimisée démarrée');

      // Mettre à jour les métriques de performance
      if (audioOptimizer) {
        const metrics = audioOptimizer.getPerformanceMetrics();
        setPerformanceMetrics(metrics);
      }

    } catch (error) {
      console.error('❌ Erreur démarrage écoute optimisée:', error);
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone optimisé",
        variant: "destructive"
      });
    }
  }, [audioContext, audioOptimizer, connectionStatus, analyser, toast]);

  // Arrêt de l'écoute
  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setMediaRecorder(null);
    setIsListening(false);
    setVolume(0);
    console.log('🎤 Écoute optimisée arrêtée');
  }, [mediaRecorder]);

  // Lecture audio optimisée
  const playOptimizedAudio = useCallback(async (base64Audio: string) => {
    if (!audioContext || !audioOptimizer) return;

    try {
      setIsSpeaking(true);

      // Conversion optimisée depuis Gemini PCM
      const audioBuffer = await audioOptimizer.convertFromGeminiPCM(base64Audio);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.onended = () => {
        setIsSpeaking(false);
      };

      source.start();
      audioSourceRef.current = source;

    } catch (error) {
      console.error('❌ Erreur lecture audio optimisée:', error);
      setIsSpeaking(false);
    }
  }, [audioContext, audioOptimizer]);

  // Arrêt de la lecture
  const stopSpeaking = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Mise à jour du volume avec optimisations
  const updateVolumeWithOptimization = useCallback(() => {
    if (!analyser || !isListening || !audioOptimizer) return;

    // Créer un stream mock pour l'analyse
    const mockStream = new MediaStream();
    const analysis = audioOptimizer.analyzeVolume(mockStream);
    
    setVolume(analysis.rms);

    if (isListening) {
      requestAnimationFrame(updateVolumeWithOptimization);
    }
  }, [isListening, analyser, audioOptimizer]);

  // Envoi message texte
  const sendTextMessage = useCallback((message: string) => {
    if (!websocketRef.current || connectionStatus !== 'connected') return;

    const textMessage = {
      client_content: {
        turns: [{
          role: "user",
          parts: [{ text: message }]
        }],
        turn_complete: true
      }
    };

    websocketRef.current.send(JSON.stringify(textMessage));
    console.log('📝 Message texte envoyé:', message);
  }, [connectionStatus]);

  // Interface utilisateur optimisée
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* En-tête avec statut et métriques */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-lg">Synapse Voice Enhanced</CardTitle>
                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                  <Activity className="h-3 w-3 mr-1" />
                  IA Enterprise
                </Badge>
              </div>
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
                {connectionStatus === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                {connectionStatus === 'connecting' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                {connectionStatus === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                {connectionStatus === 'disconnected' && <AlertCircle className="h-3 w-3 mr-1" />}
                {connectionStatus === 'connected' ? 'Connecté' : 
                 connectionStatus === 'connecting' ? 'Connexion...' :
                 connectionStatus === 'error' ? 'Erreur' : 'Déconnecté'}
              </Badge>
            </div>
            
            {/* Métriques de performance */}
            {connectionStatus === 'connected' && (
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span>{performanceMetrics.latency.toFixed(1)}ms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-blue-600" />
                  <span>{(performanceMetrics.speechDetectionAccuracy * 100).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contrôles principaux */}
          <div className="flex gap-2">
            {connectionStatus !== 'connected' ? (
              <Button 
                onClick={connectToGeminiLive}
                disabled={connectionStatus === 'connecting'}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {connectionStatus === 'connecting' ? 'Connexion optimisée...' : 'Activer Synapse Enhanced'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={isListening ? stopListening : startListening}
                  variant={isListening ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Arrêter écoute
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Parler avec Synapse
                    </>
                  )}
                </Button>
                
                <Button onClick={disconnect} variant="outline">
                  Déconnecter
                </Button>
              </>
            )}
          </div>

          {/* Tests rapides enterprise */}
          {connectionStatus === 'connected' && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendTextMessage("Donne-moi le dashboard des projets avec les métriques actuelles")}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Dashboard projets
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendTextMessage("Analyse la performance de l'équipe ce mois-ci")}
              >
                <Users className="h-3 w-3 mr-1" />
                Performance équipe
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendTextMessage("Crée une tâche urgente avec assignation automatique")}
              >
                <Settings className="h-3 w-3 mr-1" />
                Créer tâche IA
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendTextMessage("Donne-moi des insights business avec prédictions")}
              >
                <Brain className="h-3 w-3 mr-1" />
                Insights IA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualiseur audio avancé */}
      {connectionStatus === 'connected' && (
        <SynapseAudioVisualizer
          analyser={analyser}
          isListening={isListening}
          isSpeaking={isSpeaking}
          volume={volume}
        />
      )}

      {/* Transcriptions et outils */}
      {connectionStatus === 'connected' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Transcriptions */}
          {(inputTranscription || outputTranscription) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Transcriptions Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inputTranscription && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-800 font-medium text-sm">Vous</span>
                    </div>
                    <p className="text-blue-700 text-sm">{inputTranscription}</p>
                  </div>
                )}

                {outputTranscription && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-3 w-3 text-purple-600" />
                      <span className="text-purple-800 font-medium text-sm">Synapse</span>
                    </div>
                    <p className="text-purple-700 text-sm">{outputTranscription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Outils Enterprise actifs */}
          {toolCalls.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Actions Enterprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {toolCalls.slice(-5).map((toolCall, index) => (
                  <div key={toolCall.id || index} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                    {toolCall.status === 'executing' && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                    {toolCall.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500" />}
                    {toolCall.status === 'failed' && <AlertCircle className="h-3 w-3 text-red-500" />}
                    <span className="font-medium">{toolCall.name}</span>
                    <Badge variant="outline" className="text-xs">{toolCall.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}; 