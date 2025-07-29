import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Eye, 
  Activity,
  Waves,
  Atom,
  Stars
} from 'lucide-react';

interface QuantumCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'holographic' | 'neural' | 'dimensional' | 'particle';
  className?: string;
  data?: {
    type: string;
    values: number[];
    emotion?: 'focused' | 'stressed' | 'creative' | 'analytical';
  };
  interactive?: boolean;
  glowIntensity?: number;
}

export const QuantumCard: React.FC<QuantumCardProps> = ({
  children,
  variant = 'default',
  className,
  data,
  interactive = true,
  glowIntensity = 1
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    velocity: { x: number; y: number };
    life: number;
  }>>([]);
  const [quantumState, setQuantumState] = useState(0);

  // Animation des particules quantiques
  useEffect(() => {
    if (!isHovered || variant !== 'particle') return;

    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      life: 1
    }));

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.velocity.x) % 100,
        y: (particle.y + particle.velocity.y) % 100,
        life: Math.max(0, particle.life - 0.02)
      })).filter(p => p.life > 0));
    }, 50);

    return () => clearInterval(interval);
  }, [isHovered, variant]);

  // État quantique oscillant
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(prev => (prev + 0.1) % (Math.PI * 2));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getVariantStyles = () => {
    const baseStyles = "relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-700";
    
    switch (variant) {
      case 'holographic':
        return cn(baseStyles,
          "bg-gradient-to-br from-cyan-900/30 via-teal-800/30 to-emerald-900/30",
          "border-cyan-400/50 shadow-2xl shadow-cyan-500/30",
          isHovered && "shadow-cyan-500/60 border-cyan-300/70 scale-[1.02]"
        );
      
      case 'neural':
        return cn(baseStyles,
          "bg-gradient-to-br from-purple-900/30 via-indigo-800/30 to-blue-900/30",
          "border-purple-400/50 shadow-2xl shadow-purple-500/30",
          isHovered && "shadow-purple-500/60 border-purple-300/70 scale-[1.02]"
        );
      
      case 'dimensional':
        return cn(baseStyles,
          "bg-gradient-to-br from-orange-900/30 via-red-800/30 to-pink-900/30",
          "border-orange-400/50 shadow-2xl shadow-orange-500/30",
          isHovered && "shadow-orange-500/60 border-orange-300/70 scale-[1.02]"
        );
      
      case 'particle':
        return cn(baseStyles,
          "bg-gradient-to-br from-violet-900/30 via-purple-800/30 to-fuchsia-900/30",
          "border-violet-400/50 shadow-2xl shadow-violet-500/30",
          isHovered && "shadow-violet-500/60 border-violet-300/70 scale-[1.02]"
        );
      
      default:
        return cn(baseStyles,
          "bg-gradient-to-br from-gray-900/30 via-slate-800/30 to-zinc-900/30",
          "border-slate-400/50 shadow-2xl shadow-slate-500/30",
          isHovered && "shadow-slate-500/60 border-slate-300/70 scale-[1.02]"
        );
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'holographic': return Waves;
      case 'neural': return Brain;
      case 'dimensional': return Atom;
      case 'particle': return Stars;
      default: return Sparkles;
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'holographic': return 'text-cyan-400';
      case 'neural': return 'text-purple-400';
      case 'dimensional': return 'text-orange-400';
      case 'particle': return 'text-violet-400';
      default: return 'text-slate-400';
    }
  };

  const IconComponent = getVariantIcon();

  return (
    <motion.div
      className={cn(getVariantStyles(), className)}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={interactive ? { 
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
    >
      {/* Grille quantique de fond */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id={`quantum-grid-${variant}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path 
                d="M 30 0 L 0 0 0 30" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className={getVariantColor()}
              />
            </pattern>
            <linearGradient id={`quantum-glow-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#quantum-grid-${variant})`} />
        </svg>
      </div>

      {/* Particules quantiques */}
      {variant === 'particle' && (
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={cn("absolute w-1 h-1 rounded-full", getVariantColor())}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  opacity: particle.life
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Effet de vague quantique */}
      {variant === 'neural' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(147, 51, 234, ${0.1 + Math.sin(quantumState) * 0.1}) 0%, transparent 70%)`
          }}
        />
      )}

      {/* Indicateur de variante */}
      <motion.div
        className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <IconComponent className={cn("h-3 w-3", getVariantColor())} />
        <span className="text-xs text-gray-300 capitalize">{variant}</span>
      </motion.div>

      {/* État quantique */}
      {isHovered && (
        <motion.div
          className="absolute top-3 left-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Activity className="h-3 w-3 text-green-400" />
          <span className="text-xs text-green-400">Quantum</span>
        </motion.div>
      )}

      {/* Analyse des données */}
      {data && isHovered && (
        <motion.div
          className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Eye className="h-3 w-3 text-blue-400" />
            <span className="text-blue-400">Analyse: {data.type}</span>
          </div>
          <div className="text-gray-300">
            Valeurs: [{data.values.map(v => v.toFixed(1)).join(', ')}]
          </div>
          {data.emotion && (
            <div className="text-gray-400 capitalize">
              État: {data.emotion}
            </div>
          )}
        </motion.div>
      )}

      {/* Contenu principal */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Effet de lueur au survol */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-2xl opacity-30",
              variant === 'holographic' && "bg-gradient-to-r from-cyan-400/20 to-teal-400/20",
              variant === 'neural' && "bg-gradient-to-r from-purple-400/20 to-indigo-400/20",
              variant === 'dimensional' && "bg-gradient-to-r from-orange-400/20 to-red-400/20",
              variant === 'particle' && "bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20",
              variant === 'default' && "bg-gradient-to-r from-slate-400/20 to-gray-400/20"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Bordure animée */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from ${quantumState}rad, transparent 0deg, ${
            variant === 'holographic' ? '#22d3ee' :
            variant === 'neural' ? '#a855f7' :
            variant === 'dimensional' ? '#f97316' :
            variant === 'particle' ? '#8b5cf6' : '#64748b'
          }20 180deg, transparent 360deg)`
        }}
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};