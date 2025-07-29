import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Mic, Volume2, Activity, Signal } from 'lucide-react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isListening: boolean;
  isSpeaking: boolean;
  volume: number;
  className?: string;
}

interface AudioMetrics {
  rms: number;
  peak: number;
  frequency: number;
  isSpeech: boolean;
  noiseLevel: number;
}

export const SynapseAudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyser,
  isListening,
  isSpeaking,
  volume,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [metrics, setMetrics] = useState<AudioMetrics>({
    rms: 0,
    peak: 0,
    frequency: 0,
    isSpeech: false,
    noiseLevel: 0
  });

  // Configuration de visualisation
  const config = {
    width: 400,
    height: 120,
    barWidth: 3,
    barSpacing: 1,
    smoothing: 0.8,
    minDecibels: -90,
    maxDecibels: -10,
    speechThreshold: 0.02,
    noiseThreshold: 0.01
  };

  // Animation de visualisation
  const draw = useCallback(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration du canvas
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Données audio
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeArray = new Uint8Array(bufferLength);
    
    analyser.getByteFrequencyData(dataArray);
    analyser.getByteTimeDomainData(timeArray);

    // Calcul des métriques
    const newMetrics = calculateAudioMetrics(dataArray, timeArray, analyser.context.sampleRate);
    setMetrics(newMetrics);

    // Visualisation spectrogramme
    drawSpectogram(ctx, dataArray, width, height);
    
    // Visualisation waveform
    drawWaveform(ctx, timeArray, width, height);
    
    // Indicateurs de statut
    drawStatusIndicators(ctx, newMetrics, width, height);

    if (isListening || isSpeaking) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [analyser, isListening, isSpeaking]);

  // Calcul des métriques audio
  const calculateAudioMetrics = (
    freqData: Uint8Array, 
    timeData: Uint8Array, 
    sampleRate: number
  ): AudioMetrics => {
    // RMS (volume moyen)
    let sumSquares = 0;
    let peak = 0;
    
    for (let i = 0; i < timeData.length; i++) {
      const normalized = (timeData[i] - 128) / 128;
      sumSquares += normalized * normalized;
      peak = Math.max(peak, Math.abs(normalized));
    }
    
    const rms = Math.sqrt(sumSquares / timeData.length);

    // Fréquence dominante
    let maxMagnitude = 0;
    let dominantFreqIndex = 0;
    
    for (let i = 1; i < freqData.length / 2; i++) {
      if (freqData[i] > maxMagnitude) {
        maxMagnitude = freqData[i];
        dominantFreqIndex = i;
      }
    }
    
    const frequency = (dominantFreqIndex * sampleRate) / (freqData.length * 2);

    // Détection de parole (basée sur énergie dans les fréquences vocales)
    const speechEnergyRatio = calculateSpeechEnergyRatio(freqData, sampleRate);
    const isSpeech = rms > config.speechThreshold && speechEnergyRatio > 0.3;

    // Niveau de bruit (percentile bas)
    const sortedFreq = Array.from(freqData).sort((a, b) => a - b);
    const noiseLevel = sortedFreq[Math.floor(sortedFreq.length * 0.1)] / 255;

    return {
      rms,
      peak,
      frequency,
      isSpeech,
      noiseLevel
    };
  };

  // Calcul du ratio d'énergie dans les fréquences de parole
  const calculateSpeechEnergyRatio = (freqData: Uint8Array, sampleRate: number): number => {
    const nyquist = sampleRate / 2;
    const binSize = nyquist / freqData.length;
    
    // Fréquences de parole : 300-3400 Hz
    const speechStartBin = Math.floor(300 / binSize);
    const speechEndBin = Math.floor(3400 / binSize);
    
    let speechEnergy = 0;
    let totalEnergy = 0;
    
    for (let i = 0; i < freqData.length; i++) {
      const energy = freqData[i];
      totalEnergy += energy;
      
      if (i >= speechStartBin && i <= speechEndBin) {
        speechEnergy += energy;
      }
    }
    
    return totalEnergy > 0 ? speechEnergy / totalEnergy : 0;
  };

  // Dessin du spectrogramme
  const drawSpectogram = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const barCount = Math.floor(width / (config.barWidth + config.barSpacing));
    const barWidth = config.barWidth;
    const barSpacing = config.barSpacing;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * dataArray.length);
      const barHeight = (dataArray[dataIndex] / 255) * (height * 0.6);
      
      // Couleur basée sur la fréquence et l'intensité
      const hue = (i / barCount) * 240; // Bleu à rouge
      const saturation = 70;
      const lightness = 30 + (dataArray[dataIndex] / 255) * 40;
      
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(
        i * (barWidth + barSpacing),
        height * 0.7 - barHeight,
        barWidth,
        barHeight
      );
    }
  };

  // Dessin de la waveform
  const drawWaveform = (ctx: CanvasRenderingContext2D, timeArray: Uint8Array, width: number, height: number) => {
    ctx.strokeStyle = isSpeaking ? '#8b5cf6' : isListening ? '#10b981' : '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = width / timeArray.length;
    let x = 0;

    for (let i = 0; i < timeArray.length; i++) {
      const v = (timeArray[i] / 128) - 1; // Normaliser entre -1 et 1
      const y = (height * 0.2) + (v * height * 0.1);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  };

  // Dessin des indicateurs de statut
  const drawStatusIndicators = (ctx: CanvasRenderingContext2D, metrics: AudioMetrics, width: number, height: number) => {
    // Indicateur de niveau de volume
    const volumeBarWidth = 200;
    const volumeBarHeight = 8;
    const volumeX = width - volumeBarWidth - 10;
    const volumeY = 10;

    // Fond de la barre de volume
    ctx.fillStyle = '#374151';
    ctx.fillRect(volumeX, volumeY, volumeBarWidth, volumeBarHeight);

    // Barre de volume
    const volumeWidth = metrics.rms * volumeBarWidth * 10; // Amplifier pour visibilité
    ctx.fillStyle = metrics.isSpeech ? '#10b981' : '#6b7280';
    ctx.fillRect(volumeX, volumeY, Math.min(volumeWidth, volumeBarWidth), volumeBarHeight);

    // Indicateur de pic
    const peakX = volumeX + Math.min(metrics.peak * volumeBarWidth * 10, volumeBarWidth - 2);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(peakX, volumeY - 2, 2, volumeBarHeight + 4);

    // Texte des métriques
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`RMS: ${(metrics.rms * 100).toFixed(1)}%`, 10, height - 30);
    ctx.fillText(`Freq: ${metrics.frequency.toFixed(0)}Hz`, 10, height - 15);
    
    if (metrics.isSpeech) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('🎤 PAROLE DÉTECTÉE', width - 150, height - 15);
    }
  };

  // Effet pour démarrer/arrêter l'animation
  useEffect(() => {
    if ((isListening || isSpeaking) && analyser) {
      animationRef.current = requestAnimationFrame(draw);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isSpeaking, analyser, draw]);

  return (
    <Card className={`${className} bg-gradient-to-br from-gray-900 to-gray-800 text-white`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Waves className="h-4 w-4" />
            Analyse Audio Temps Réel
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={isListening ? 'default' : 'secondary'} className="text-xs">
              {isListening ? <Mic className="h-3 w-3 mr-1" /> : <Mic className="h-3 w-3 mr-1 opacity-50" />}
              {isListening ? 'Écoute' : 'Silencieux'}
            </Badge>
            <Badge variant={isSpeaking ? 'default' : 'secondary'} className="text-xs">
              {isSpeaking ? <Volume2 className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1 opacity-50" />}
              {isSpeaking ? 'Lecture' : 'Muet'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Canvas de visualisation */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={config.width}
            height={config.height}
            className="w-full h-auto border border-gray-600 rounded bg-black"
          />
          
          {/* Overlay des informations */}
          <div className="absolute top-2 left-2 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <Signal className="h-3 w-3" />
              <span>Volume: {(volume * 100).toFixed(0)}%</span>
            </div>
            {metrics.isSpeech && (
              <div className="flex items-center gap-2 text-green-400">
                <Activity className="h-3 w-3" />
                <span>Activité vocale détectée</span>
              </div>
            )}
          </div>
        </div>

        {/* Métriques détaillées */}
        <div className="grid grid-cols-4 gap-4 mt-3 text-xs">
          <div className="text-center">
            <div className="text-gray-400">RMS</div>
            <div className="font-mono">{(metrics.rms * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Pic</div>
            <div className="font-mono">{(metrics.peak * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Fréq. dom.</div>
            <div className="font-mono">{metrics.frequency.toFixed(0)}Hz</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Bruit</div>
            <div className="font-mono">{(metrics.noiseLevel * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Barre de progression du volume */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Niveau audio</span>
            <span>{(volume * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-100 ${
                metrics.isSpeech ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(volume * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Indicateurs d'état */}
        <div className="flex justify-between mt-3 text-xs">
          <div className={`flex items-center gap-1 ${isListening ? 'text-green-400' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span>Microphone</span>
          </div>
          
          <div className={`flex items-center gap-1 ${isSpeaking ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'}`} />
            <span>Sortie audio</span>
          </div>
          
          <div className={`flex items-center gap-1 ${metrics.isSpeech ? 'text-green-400' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${metrics.isSpeech ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span>Parole détectée</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 