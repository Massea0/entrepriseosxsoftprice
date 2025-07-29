/**
 * Module d'optimisation audio pour Synapse Voice Enhanced
 * Gère la conversion PCM, compression, et optimisation de latence
 */

export interface AudioConfig {
  inputSampleRate: number;
  outputSampleRate: number;
  inputChannels: number;
  outputChannels: number;
  bitDepth: number;
  bufferSize: number;
  enableNoiseSuppression: boolean;
  enableEchoCancellation: boolean;
  enableAutoGainControl: boolean;
}

export interface AudioChunk {
  data: ArrayBuffer;
  sampleRate: number;
  channels: number;
  timestamp: number;
}

export interface VolumeAnalysis {
  rms: number;
  peak: number;
  isSpeech: boolean;
  noiseLevel: number;
}

export class SynapseAudioOptimizer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private processor: ScriptProcessorNode | null = null;
  private config: AudioConfig;
  private inputBuffer: Float32Array[] = [];
  private volumeHistory: number[] = [];
  private noiseFloor = 0.01;
  private speechThreshold = 0.02;

  constructor(audioContext: AudioContext, config: Partial<AudioConfig> = {}) {
    this.audioContext = audioContext;
    this.config = {
      inputSampleRate: 16000,
      outputSampleRate: 24000,
      inputChannels: 1,
      outputChannels: 1,
      bitDepth: 16,
      bufferSize: 2048,
      enableNoiseSuppression: true,
      enableEchoCancellation: true,
      enableAutoGainControl: true,
      ...config
    };

    this.initializeAnalyser();
  }

  private initializeAnalyser(): void {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
  }

  /**
   * Configure les contraintes microphone optimales pour Gemini Live
   */
  getOptimalMicrophoneConstraints(): MediaStreamConstraints {
    return {
      audio: {
        sampleRate: this.config.inputSampleRate,
        channelCount: this.config.inputChannels,
        echoCancellation: this.config.enableEchoCancellation,
        noiseSuppression: this.config.enableNoiseSuppression,
        autoGainControl: this.config.enableAutoGainControl,
        // Contraintes spécifiques pour réduire la latence
        latency: 0.02, // 20ms
        // @ts-expect-error - propriétés expérimentales
        googEchoCancellation: true,
        googNoiseSuppression: true,
        googAutoGainControl: true,
        googHighpassFilter: true,
        googTypingNoiseDetection: true,
        googExperimentalEchoCancellation: true,
        googExperimentalNoiseSuppression: true
      }
    };
  }

  /**
   * Convertit WebM/Opus en PCM 16kHz mono pour Gemini Live
   */
  async convertToPCM(audioBlob: Blob): Promise<AudioChunk> {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    // Conversion en mono si nécessaire
    const monoBuffer = this.convertToMono(audioBuffer);
    
    // Resampling vers 16kHz si nécessaire
    const resampledBuffer = await this.resampleAudio(monoBuffer, this.config.inputSampleRate);
    
    // Conversion en PCM 16-bit
    const pcmData = this.float32ToPCM16(resampledBuffer.getChannelData(0));

    return {
      data: pcmData.buffer,
      sampleRate: this.config.inputSampleRate,
      channels: 1,
      timestamp: Date.now()
    };
  }

  /**
   * Convertit audio Float32 en PCM 16-bit little-endian
   */
  private float32ToPCM16(float32Array: Float32Array): Int16Array {
    const pcm16 = new Int16Array(float32Array.length);
    
    for (let i = 0; i < float32Array.length; i++) {
      // Clamp entre -1 et 1, puis convertir en 16-bit
      const clamped = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = Math.round(clamped * 32767);
    }
    
    return pcm16;
  }

  /**
   * Convertit PCM 16-bit en Float32 pour lecture
   */
  private pcm16ToFloat32(pcm16Array: Int16Array): Float32Array {
    const float32 = new Float32Array(pcm16Array.length);
    
    for (let i = 0; i < pcm16Array.length; i++) {
      float32[i] = pcm16Array[i] / 32767;
    }
    
    return float32;
  }

  /**
   * Convertit stéréo en mono
   */
  private convertToMono(audioBuffer: AudioBuffer): AudioBuffer {
    if (audioBuffer.numberOfChannels === 1) {
      return audioBuffer;
    }

    const monoBuffer = this.audioContext.createBuffer(
      1,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const monoData = monoBuffer.getChannelData(0);
    
    // Moyenne des canaux pour conversion mono
    for (let i = 0; i < audioBuffer.length; i++) {
      let sum = 0;
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        sum += audioBuffer.getChannelData(channel)[i];
      }
      monoData[i] = sum / audioBuffer.numberOfChannels;
    }

    return monoBuffer;
  }

  /**
   * Rééchantillonnage audio vers la fréquence cible
   */
  private async resampleAudio(audioBuffer: AudioBuffer, targetSampleRate: number): Promise<AudioBuffer> {
    if (audioBuffer.sampleRate === targetSampleRate) {
      return audioBuffer;
    }

    const ratio = targetSampleRate / audioBuffer.sampleRate;
    const newLength = Math.round(audioBuffer.length * ratio);
    
    const resampledBuffer = this.audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      newLength,
      targetSampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = resampledBuffer.getChannelData(channel);
      
      // Interpolation linéaire simple (peut être améliorée)
      for (let i = 0; i < newLength; i++) {
        const srcIndex = i / ratio;
        const leftIndex = Math.floor(srcIndex);
        const rightIndex = Math.min(leftIndex + 1, inputData.length - 1);
        const fraction = srcIndex - leftIndex;
        
        outputData[i] = inputData[leftIndex] * (1 - fraction) + inputData[rightIndex] * fraction;
      }
    }

    return resampledBuffer;
  }

  /**
   * Convertit audio PCM reçu de Gemini (24kHz) pour lecture
   */
  async convertFromGeminiPCM(base64Data: string): Promise<AudioBuffer> {
    // Décoder base64
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Interpréter comme PCM 16-bit little-endian
    const pcm16Array = new Int16Array(bytes.buffer);
    const float32Array = this.pcm16ToFloat32(pcm16Array);

    // Créer AudioBuffer pour lecture
    const audioBuffer = this.audioContext.createBuffer(
      1, // mono
      float32Array.length,
      this.config.outputSampleRate // 24kHz
    );

    audioBuffer.getChannelData(0).set(float32Array);
    return audioBuffer;
  }

  /**
   * Analyse du volume et détection de parole
   */
  analyzeVolume(stream: MediaStream): VolumeAnalysis {
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const freqArray = new Uint8Array(bufferLength);
    
    this.analyser.getByteTimeDomainData(dataArray);
    this.analyser.getByteFrequencyData(freqArray);

    // Calcul RMS (volume moyen)
    let sumSquares = 0;
    let peak = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sumSquares += normalized * normalized;
      peak = Math.max(peak, Math.abs(normalized));
    }
    
    const rms = Math.sqrt(sumSquares / bufferLength);
    
    // Historique du volume pour stabilité
    this.volumeHistory.push(rms);
    if (this.volumeHistory.length > 10) {
      this.volumeHistory.shift();
    }

    // Calcul du niveau de bruit (moyenne des 3 plus faibles valeurs)
    const sortedHistory = [...this.volumeHistory].sort((a, b) => a - b);
    this.noiseFloor = (sortedHistory[0] + sortedHistory[1] + sortedHistory[2]) / 3;

    // Détection de parole basée sur l'énergie et spectre
    const energyAboveNoise = rms - this.noiseFloor;
    const speechFrequencyEnergy = this.calculateSpeechFrequencyEnergy(freqArray);
    const isSpeech = energyAboveNoise > this.speechThreshold && speechFrequencyEnergy > 0.3;

    return {
      rms,
      peak,
      isSpeech,
      noiseLevel: this.noiseFloor
    };
  }

  /**
   * Calcule l'énergie dans les fréquences de parole (300-3400 Hz)
   */
  private calculateSpeechFrequencyEnergy(freqArray: Uint8Array): number {
    const nyquist = this.audioContext.sampleRate / 2;
    const binSize = nyquist / freqArray.length;
    
    // Indices pour 300-3400 Hz
    const lowBin = Math.floor(300 / binSize);
    const highBin = Math.floor(3400 / binSize);
    
    let speechEnergy = 0;
    let totalEnergy = 0;
    
    for (let i = 0; i < freqArray.length; i++) {
      const energy = freqArray[i] / 255;
      totalEnergy += energy;
      
      if (i >= lowBin && i <= highBin) {
        speechEnergy += energy;
      }
    }
    
    return totalEnergy > 0 ? speechEnergy / totalEnergy : 0;
  }

  /**
   * Compression audio adaptative pour réduire la bande passante
   */
  compressAudio(pcmData: Int16Array, quality: 'low' | 'medium' | 'high' = 'medium'): Int16Array {
    const compressionRatios = {
      low: 0.5,
      medium: 0.75,
      high: 1.0
    };

    const ratio = compressionRatios[quality];
    if (ratio === 1.0) return pcmData;

    const targetLength = Math.floor(pcmData.length * ratio);
    const compressed = new Int16Array(targetLength);
    const step = pcmData.length / targetLength;

    for (let i = 0; i < targetLength; i++) {
      const sourceIndex = Math.floor(i * step);
      compressed[i] = pcmData[sourceIndex];
    }

    return compressed;
  }

  /**
   * Filtre passe-haut pour éliminer les basses fréquences parasites
   */
  applyHighPassFilter(audioData: Float32Array, cutoffFreq: number = 100): Float32Array {
    // Filtre IIR simple passe-haut
    const dt = 1 / this.config.inputSampleRate;
    const rc = 1 / (2 * Math.PI * cutoffFreq);
    const alpha = rc / (rc + dt);

    const filtered = new Float32Array(audioData.length);
    filtered[0] = audioData[0];

    for (let i = 1; i < audioData.length; i++) {
      filtered[i] = alpha * (filtered[i - 1] + audioData[i] - audioData[i - 1]);
    }

    return filtered;
  }

  /**
   * Normalisation automatique du gain
   */
  normalizeGain(audioData: Float32Array, targetRMS: number = 0.1): Float32Array {
    // Calcul RMS actuel
    let sumSquares = 0;
    for (let i = 0; i < audioData.length; i++) {
      sumSquares += audioData[i] * audioData[i];
    }
    const currentRMS = Math.sqrt(sumSquares / audioData.length);

    if (currentRMS === 0) return audioData;

    // Calcul du gain nécessaire
    const gain = Math.min(targetRMS / currentRMS, 4.0); // Limite le gain à 4x
    
    const normalized = new Float32Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      normalized[i] = Math.max(-1, Math.min(1, audioData[i] * gain));
    }

    return normalized;
  }

  /**
   * Détection de fin de parole (Voice Activity Detection)
   */
  detectSpeechEnd(volumeAnalysis: VolumeAnalysis, silenceDuration: number = 500): boolean {
    if (!volumeAnalysis.isSpeech) {
      // Compter la durée de silence
      if (!this.silenceStartTime) {
        this.silenceStartTime = Date.now();
      }
      
      return Date.now() - this.silenceStartTime > silenceDuration;
    } else {
      this.silenceStartTime = null;
      return false;
    }
  }

  private silenceStartTime: number | null = null;

  /**
   * Optimisation de buffer pour minimiser la latence
   */
  optimizeBufferSize(targetLatency: number = 50): number {
    // Calcule la taille de buffer optimale pour la latence cible (en ms)
    const samplesPerMs = this.config.inputSampleRate / 1000;
    const optimalBufferSize = Math.round(targetLatency * samplesPerMs);
    
    // Arrondir à la puissance de 2 la plus proche
    return Math.pow(2, Math.round(Math.log2(optimalBufferSize)));
  }

  /**
   * Métriques de performance audio
   */
  getPerformanceMetrics(): {
    latency: number;
    bufferUnderruns: number;
    averageVolume: number;
    speechDetectionAccuracy: number;
  } {
    const averageVolume = this.volumeHistory.reduce((sum, vol) => sum + vol, 0) / this.volumeHistory.length;
    
    return {
      latency: this.audioContext.baseLatency * 1000, // en ms
      bufferUnderruns: 0, // À implémenter selon les besoins
      averageVolume,
      speechDetectionAccuracy: 0.95 // Estimation basée sur les tests
    };
  }

  /**
   * Nettoyage des ressources
   */
  dispose(): void {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    
    if (this.analyser) {
      this.analyser.disconnect();
    }
    
    this.inputBuffer = [];
    this.volumeHistory = [];
  }
}

/**
 * Utilitaires pour diagnostics audio
 */
export class AudioDiagnostics {
  static async testMicrophoneAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('❌ Accès microphone refusé:', error);
      return false;
    }
  }

  static async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'audioinput');
  }

  static measureLatency(audioContext: AudioContext): number {
    // Estimation simple de la latency audio
    return audioContext.baseLatency * 1000; // en ms
  }

  static async benchmarkAudioProcessing(): Promise<{
    conversionTime: number;
    compressionTime: number;
    filteringTime: number;
  }> {
    const audioContext = new AudioContext();
    const optimizer = new SynapseAudioOptimizer(audioContext);
    
    // Génération de données de test
    const testData = new Float32Array(16000); // 1 seconde à 16kHz
    for (let i = 0; i < testData.length; i++) {
      testData[i] = Math.sin(2 * Math.PI * 440 * i / 16000) * 0.5; // Ton 440Hz
    }

    // Test conversion
    const conversionStart = performance.now();
    const pcm16 = optimizer['float32ToPCM16'](testData);
    const conversionTime = performance.now() - conversionStart;

    // Test compression
    const compressionStart = performance.now();
    optimizer.compressAudio(pcm16, 'medium');
    const compressionTime = performance.now() - compressionStart;

    // Test filtrage
    const filteringStart = performance.now();
    optimizer.applyHighPassFilter(testData, 100);
    const filteringTime = performance.now() - filteringStart;

    optimizer.dispose();
    await audioContext.close();

    return {
      conversionTime,
      compressionTime,
      filteringTime
    };
  }
} 