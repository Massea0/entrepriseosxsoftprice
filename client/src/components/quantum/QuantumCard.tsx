import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// Custom Hooks for Quantum Effects
const useEmotionDetection = () => {
  // In production, this would use real emotion detection
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'stressed' | 'focused'>('neutral');
  
  useEffect(() => {
    // Simulate emotion changes
    const interval = setInterval(() => {
      const emotions = ['neutral', 'happy', 'stressed', 'focused'] as const;
      setEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return emotion;
};

const useContextAwareness = () => {
  const [context, setContext] = useState({
    timeOfDay: 'day',
    userActivity: 'active',
    systemLoad: 'normal',
    ambientOpacity: 1
  });
  
  useEffect(() => {
    const updateContext = () => {
      const hour = new Date().getHours();
      const timeOfDay = hour < 6 || hour > 20 ? 'night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      
      setContext({
        timeOfDay,
        userActivity: 'active',
        systemLoad: 'normal',
        ambientOpacity: timeOfDay === 'night' ? 0.8 : 1
      });
    };
    
    updateContext();
    const interval = setInterval(updateContext, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return context;
};

const usePhysicsEngine = () => {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const transform3D = useTransform(spring, [0, 1], ["translateZ(0px)", "translateZ(50px)"]);
  
  const calculateAnimation = (emotion: string, context: any) => {
    const emotionAnimations = {
      neutral: { scale: 1, rotateY: 0 },
      happy: { scale: 1.05, rotateY: 5 },
      stressed: { scale: 0.98, rotateY: -2 },
      focused: { scale: 1.02, rotateY: 0 }
    };
    
    return emotionAnimations[emotion as keyof typeof emotionAnimations] || emotionAnimations.neutral;
  };
  
  return {
    spring,
    transform3D,
    calculateAnimation,
    adaptiveBlur: 'blur(0px)'
  };
};

// Particle Visualization Component (CSS-based)
const ParticleVisualization = ({ data }: { data: any }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, [data]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10 + particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Quantum Card Props
interface QuantumCardProps {
  children: React.ReactNode;
  data?: any;
  className?: string;
  variant?: 'default' | 'holographic' | 'neural' | 'dimensional';
  interactive?: boolean;
  showVisualization?: boolean;
}

// Main Quantum Card Component
export const QuantumCard = React.forwardRef<HTMLDivElement, QuantumCardProps>(({
  children,
  data,
  className,
  variant = 'default',
  interactive = true,
  showVisualization = true,
  ...props
}, ref) => {
  const emotion = useEmotionDetection();
  const context = useContextAwareness();
  const physics = usePhysicsEngine();
  
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };
  
  const variantClasses = {
    default: 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10',
    holographic: 'bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20',
    neural: 'bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10',
    dimensional: 'bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10'
  };
  
  const emotionEffects = {
    neutral: '',
    happy: 'saturate-110',
    stressed: 'saturate-90',
    focused: 'contrast-105'
  };
  
  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl backdrop-blur-xl',
        'border border-white/10 dark:border-white/5',
        'shadow-2xl dark:shadow-purple-500/10',
        variantClasses[variant],
        emotionEffects[emotion],
        className
      )}
      animate={physics.calculateAnimation(emotion, context)}
      style={{
        transform: physics.transform3D,
        opacity: context.ambientOpacity,
        perspective: '1000px'
      }}
      whileHover={interactive ? {
        scale: 1.02,
        rotateY: mousePosition.x * 10 - 5,
        rotateX: -(mousePosition.y * 10 - 5),
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      {...props}
    >
      {/* Holographic Effect Layer */}
      <AnimatePresence>
        {variant === 'holographic' && isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2, repeat: Infinity },
              backgroundPosition: { duration: 3, repeat: Infinity }
            }}
            style={{ backgroundSize: '200% 200%' }}
          />
        )}
      </AnimatePresence>
      
      {/* Neural Network Pattern */}
      {variant === 'neural' && (
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="neural-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="currentColor" className="text-blue-400" />
                <circle cx="25" cy="25" r="1" fill="currentColor" className="text-purple-400" />
                <circle cx="45" cy="45" r="1" fill="currentColor" className="text-pink-400" />
                <line x1="5" y1="5" x2="25" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-blue-400/50" />
                <line x1="25" y1="25" x2="45" y2="45" stroke="currentColor" strokeWidth="0.5" className="text-purple-400/50" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-pattern)" />
          </svg>
        </div>
      )}
      
      {/* Particle Visualization Layer */}
      {showVisualization && data && (
        <ParticleVisualization data={data} />
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Interactive Glow Effect */}
      <AnimatePresence>
        {interactive && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

QuantumCard.displayName = 'QuantumCard';