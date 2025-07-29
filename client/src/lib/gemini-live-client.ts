/**
 * 🔌 GEMINI LIVE CLIENT STABLE
 * Basé sur https://github.com/VoxlD/gemini-live
 * Gestion stable des connexions WebSocket avec Gemini Live API
 */

export interface GeminiConfig {
  generationConfig?: {
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    responseModalities?: string[]; // Une seule modalité à la fois
    speechConfig?: {
      voiceConfig?: {
        prebuiltVoiceConfig?: {
          voiceName: string;
        };
      };
    };
  };
  systemInstruction?: {
    parts: Array<{ text: string }>; // ✅ Conforme API Live - pas de "role"
  };
  tools?: Array<unknown>;
}

export interface GeminiResponse {
  type: 'text' | 'audio' | 'function' | 'error';
  text?: string;
  audio?: { data: string };
  functionCall?: unknown;
  error?: string;
}

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private config: GeminiConfig;
  private isConnected = false;
  private isHandshakeComplete = false;
  private responseHandlers: Array<(response: GeminiResponse) => void> = [];
  private connectionPromise: Promise<void> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  // Event handlers
  private onOpenHandler: (() => void) | null = null;
  private onHandshakeHandler: (() => void) | null = null;
  private onCloseHandler: ((reason: string) => void) | null = null;
  private onErrorHandler: ((error: string) => void) | null = null;

  constructor(apiKey: string, config: GeminiConfig = {}) {
    this.apiKey = apiKey;
    this.config = {
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        responseModalities: ["TEXT"], // ✅ Une seule modalité pour API Live
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Aoede"
            }
          }
        },
        ...config.generationConfig
      }, // ✅ Virgule ajoutée pour corriger l'erreur de syntaxe
      // 🚫 Suppression systemInstruction par défaut - cause erreur API Live
      // systemInstruction: {
      //   role: "user", // ❌ Invalide pour API Live
      //   parts: [{
      //     text: "Tu es Synapse, un assistant IA français pour Enterprise OS. Réponds de manière concise et professionnelle."
      //   }]
      // },
      // Ajout conditionnel de systemInstruction seulement si valide
      ...(config.systemInstruction && {
        systemInstruction: config.systemInstruction
      })
    };
  }

  // Event handlers
  on_open(handler: () => void): GeminiLiveClient {
    this.onOpenHandler = handler;
    return this;
  }

  on_handshake(handler: () => void): GeminiLiveClient {
    this.onHandshakeHandler = handler;
    return this;
  }

  on_close(handler: (reason: string) => void): GeminiLiveClient {
    this.onCloseHandler = handler;
    return this;
  }

  on_error(handler: (error: string) => void): GeminiLiveClient {
    this.onErrorHandler = handler;
    return this;
  }

  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._connect();
    return this.connectionPromise;
  }

  private async _connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
        
        console.log('🔌 Connexion à Gemini Live...');
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connecté');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.onOpenHandler?.();
          this.sendSetup();
        };

        this.ws.onmessage = (event) => {
          try {
            // 🔧 Gestion des Blobs ET JSON
            if (event.data instanceof Blob) {
              console.log('📦 Réception Blob (données binaires):', event.data.size, 'bytes');
              
              // 🤝 Premier Blob reçu = handshake implicitement complété
              if (!this.isHandshakeComplete) {
                this.isHandshakeComplete = true;
                console.log('🤝 Handshake complété avec succès! (Blob reçu)');
                if (this.onHandshakeHandler) {
                  this.onHandshakeHandler();
                }
              }
              
              // Pour l'instant on ignore les Blobs (audio/vidéo) 
              // TODO: Implémenter la gestion audio si nécessaire
              return;
            }
            
            // Gestion des messages JSON
            if (typeof event.data === 'string') {
              const data = JSON.parse(event.data);
              console.log('📥 Message reçu:', data);
              this.handleMessage(data);
              
              if (!this.isHandshakeComplete && data.setupComplete) {
                this.isHandshakeComplete = true;
                console.log('🤝 Handshake terminé');
                this.onHandshakeHandler?.();
                resolve();
              }
            }
          } catch (error) {
            console.error('❌ Erreur parsing message:', error);
            console.error('📋 Type de données reçues:', typeof event.data);
            console.error('📋 Contenu:', event.data);
          }
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket fermé:', event.code, event.reason);
          this.isConnected = false;
          this.isHandshakeComplete = false;
          this.connectionPromise = null;
          
          this.onCloseHandler?.(event.reason);
          
          // Reconnexion automatique
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
            setTimeout(() => {
              this.connect().catch(console.error);
            }, this.reconnectDelay * this.reconnectAttempts);
          }
          
          if (!this.isHandshakeComplete) {
            reject(new Error(event.reason || 'Connexion fermée avant handshake'));
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Erreur WebSocket:', error);
          this.onErrorHandler?.('Erreur de connexion WebSocket');
          reject(error);
        };

        // Timeout de connexion
        setTimeout(() => {
          if (!this.isHandshakeComplete) {
            this.ws?.close();
            reject(new Error('Timeout de connexion'));
          }
        }, 10000);

      } catch (error) {
        console.error('❌ Erreur lors de la connexion:', error);
        reject(error);
      }
    });
  }

  private sendSetup(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const setupMessage = {
      setup: {
        model: "models/gemini-live-2.5-flash-preview",
        ...this.config
      }
    };

    console.log('📤 Envoi setup:', setupMessage);
    console.log('📋 Config détaillée:', JSON.stringify(setupMessage, null, 2));
    this.ws.send(JSON.stringify(setupMessage));
  }

  private handleMessage(data: unknown): void {
    // 🤝 Détecter handshake complet
    if (data.setupComplete && !this.isHandshakeComplete) {
      this.isHandshakeComplete = true;
      console.log('🤝 Handshake complété avec succès!');
      if (this.onHandshakeHandler) {
        this.onHandshakeHandler();
      }
      return;
    }

    // Handle different message types
    if (data.candidates?.[0]?.content?.parts) {
      const parts = data.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.text) {
          this.notifyHandlers({
            type: 'text',
            text: part.text
          });
        }
        
        if (part.inlineData?.data) {
          this.notifyHandlers({
            type: 'audio',
            audio: { data: part.inlineData.data }
          });
        }
        
        if (part.functionCall) {
          this.notifyHandlers({
            type: 'function',
            functionCall: part.functionCall
          });
        }
      }
    }

    if (data.error) {
      this.notifyHandlers({
        type: 'error',
        error: data.error.message || 'Erreur inconnue'
      });
    }
  }

  private notifyHandlers(response: GeminiResponse): void {
    this.responseHandlers.forEach(handler => {
      try {
        handler(response);
      } catch (error) {
        console.error('❌ Erreur dans handler:', error);
      }
    });
  }

  async send(options: { prompt?: string; audio?: string }): Promise<GeminiResponse> {
    if (!this.isHandshakeComplete) {
      await this.connect();
    }

    return new Promise((resolve) => {
      const handler = (response: GeminiResponse) => {
        this.responseHandlers = this.responseHandlers.filter(h => h !== handler);
        resolve(response);
      };

      this.responseHandlers.push(handler);

      const message: unknown = {
        clientContent: {
          turns: [{
            role: "user",
            parts: []
          }],
          turnComplete: true
        }
      };

      if (options.prompt) {
        message.clientContent.turns[0].parts.push({
          text: options.prompt
        });
      }

      if (options.audio) {
        message.clientContent.turns[0].parts.push({
          inlineData: {
            mimeType: "audio/pcm",
            data: options.audio
          }
        });
      }

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    });
  }

  realtime(handler: (response: GeminiResponse) => void): void {
    this.responseHandlers.push(handler);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.isHandshakeComplete = false;
    this.connectionPromise = null;
    this.responseHandlers = [];
  }

  isReady(): boolean {
    return this.isHandshakeComplete;
  }
} 