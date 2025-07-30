import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Layers3, 
  Zap, 
  Eye,
  Activity,
  Waves,
  CircuitBoard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantumWorkspaceProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'neural' | 'holographic' | 'quantum' | 'dimensional';
  emotionalState?: 'focused' | 'stressed' | 'creative' | 'analytical';
  adaptiveMode?: boolean;
}

export const QuantumWorkspace: React.FC<QuantumWorkspaceProps> = ({
  children,
  className,
  variant = 'quantum',
  emotionalState = 'focused',
  adaptiveMode = true
}) => {
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const [isActive, setIsActive] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Détection d'émotion simulée basée sur l'interaction
  const [detectedEmotion, setDetectedEmotion] = useState(emotionalState);
  const [confidenceLevel, setConfidenceLevel] = useState(0.85);

  // Animation des particules quantiques
  useEffect(() => {
    if (!isActive) return;

    const particleCount = variant === 'quantum' ? 50 : 30;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.3
    }));

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.random() * 2 - 1) % 100,
        y: (particle.y + Math.random() * 2 - 1) % 100,
        opacity: Math.random() * 0.7 + 0.3
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, variant]);

  // Adaptation émotionnelle
  useEffect(() => {
    if (!adaptiveMode) return;

    const emotionInterval = setInterval(() => {
      // Simulation de détection d'émotion avancée
      const emotions = ['focused', 'stressed', 'creative', 'analytical'] as const;
      const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setDetectedEmotion(newEmotion);
      setConfidenceLevel(Math.random() * 0.3 + 0.7);

      // Adaptation de l'interface basée sur l'émotion
      switch (newEmotion) {
        case 'stressed':
          setCurrentVariant('neural');
          break;
        case 'creative':
          setCurrentVariant('holographic');
          break;
        case 'analytical':
          setCurrentVariant('dimensional');
          break;
        default:
          setCurrentVariant('quantum');
      }
    }, 10000);

    return () => clearInterval(emotionInterval);
  }, [adaptiveMode]);

  const getVariantStyles = (variant: string) => {
    const baseStyles = "relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-1000";
    
    switch (variant) {
      case 'neural':
        return cn(baseStyles, 
          "bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20",
          "border-purple-500/30 shadow-lg shadow-purple-500/20"
        );
      case 'holographic':
        return cn(baseStyles,
          "bg-gradient-to-br from-cyan-900/20 via-teal-900/20 to-emerald-900/20",
          "border-cyan-500/30 shadow-lg shadow-cyan-500/20"
        );
      case 'dimensional':
        return cn(baseStyles,
          "bg-gradient-to-br from-orange-900/20 via-red-900/20 to-pink-900/20",
          "border-orange-500/30 shadow-lg shadow-orange-500/20"
        );
      default: // quantum
        return cn(baseStyles,
          "bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-fuchsia-900/20",
          "border-violet-500/30 shadow-lg shadow-violet-500/20"
        );
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'stressed': return <Waves className="h-4 w-4" />;
      case 'creative': return <Sparkles className="h-4 w-4" />;
      case 'analytical': return <CircuitBoard className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'stressed': return 'text-red-400';
      case 'creative': return 'text-yellow-400';
      case 'analytical': return 'text-blue-400';
      default: return 'text-green-400';
    }
  };

  return (
    <motion.div
      ref={workspaceRef}
      className={cn(getVariantStyles(currentVariant), className)}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Particules quantiques */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-current rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Grille quantique de fond */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="quantum-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quantum-grid)" />
        </svg>
      </div>

      {/* Header avec détection d'émotion */}
      {adaptiveMode && (
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-xs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Eye className="h-3 w-3 text-purple-400" />
          <span className="text-gray-300">Émotions:</span>
          <div className={cn("flex items-center gap-1", getEmotionColor(detectedEmotion))}>
            {getEmotionIcon(detectedEmotion)}
            <span className="capitalize">{detectedEmotion}</span>
            <span className="text-gray-400">({Math.round(confidenceLevel * 100)}%)</span>
          </div>
        </motion.div>
      )}

      {/* Indicateur de variante */}
      <motion.div
        className="absolute top-4 left-4 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-xs"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Layers3 className="h-3 w-3 text-blue-400" />
        <span className="text-gray-300">Mode:</span>
        <span className="text-blue-400 capitalize">{currentVariant}</span>
        {isActive && <Activity className="h-3 w-3 text-green-400 " />}
      </motion.div>

      {/* Contenu principal */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Effets de bordure animés */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(45deg, transparent 30%, ${currentVariant === 'neural' ? '#8b5cf6' : currentVariant === 'holographic' ? '#06b6d4' : currentVariant === 'dimensional' ? '#f97316' : '#a855f7'}20 50%, transparent 70%)`
        }}
        animate={{
          background: [
            `linear-gradient(45deg, transparent 30%, ${currentVariant === 'neural' ? '#8b5cf6' : currentVariant === 'holographic' ? '#06b6d4' : currentVariant === 'dimensional' ? '#f97316' : '#a855f7'}20 50%, transparent 70%)`,
            `linear-gradient(225deg, transparent 30%, ${currentVariant === 'neural' ? '#8b5cf6' : currentVariant === 'holographic' ? '#06b6d4' : currentVariant === 'dimensional' ? '#f97316' : '#a855f7'}20 50%, transparent 70%)`,
            `linear-gradient(45deg, transparent 30%, ${currentVariant === 'neural' ? '#8b5cf6' : currentVariant === 'holographic' ? '#06b6d4' : currentVariant === 'dimensional' ? '#f97316' : '#a855f7'}20 50%, transparent 70%)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};