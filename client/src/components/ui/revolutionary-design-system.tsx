import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// Types pour les props des composants
export interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export interface MorphingBlobProps {
  className?: string;
}

export interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export interface GlowTextProps {
  children: ReactNode;
  className?: string;
}

export interface StaggeredListProps {
  children: ReactNode;
  className?: string;
}

export interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
}

export interface HoverZoneProps {
  children: ReactNode;
  effect?: 'glow' | 'lift' | 'pulse';
  className?: string;
}

export interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  magnetStrength?: number;
}

export interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'shimmer' | 'glow' | 'pulse' | 'lift';
}

export interface AnimatedMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: LucideIcon;
  variant?: 'default' | 'glow' | 'shimmer' | 'pulse' | 'lift';
  className?: string;
}

// Composant FloatingParticles
export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  count = 20, 
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Composant MorphingBlob
export const MorphingBlob: React.FC<MorphingBlobProps> = ({ className = "" }) => {
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-600 ${className}`}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "60% 40% 30% 70% / 60% 30% 70% 40%",
        ],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Composant TypewriterText
export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  className = "", 
  speed = 50 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-current ml-1"
      />
    </span>
  );
};

// Composant GlowText
export const GlowText: React.FC<GlowTextProps> = ({ children, className = "" }) => {
  return (
    <span className={`text-shadow-glow ${className}`}>
      {children}
    </span>
  );
};

// Composant StaggeredList
export const StaggeredList: React.FC<StaggeredListProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Composant StaggeredItem
export const StaggeredItem: React.FC<StaggeredItemProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Composant HoverZone
export const HoverZone: React.FC<HoverZoneProps> = ({ 
  children, 
  effect = 'glow', 
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getEffectClasses = () => {
    switch (effect) {
      case 'glow':
        return isHovered ? 'shadow-2xl shadow-blue-500/25' : '';
      case 'lift':
        return isHovered ? 'transform -translate-y-1' : '';
      case 'pulse':
        return isHovered ? 'animate-pulse' : '';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className={`transition-all duration-300 ${getEffectClasses()} ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// Composant MagneticButton
export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  variant = 'default',
  size = 'md',
  onClick,
  magnetStrength = 0.3
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-300 bg-transparent hover:bg-gray-50';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`rounded-lg font-medium transition-all duration-200 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Composant EnhancedCard
export const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  children, 
  className = "", 
  variant = 'default' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20';
      case 'shimmer':
        return 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200';
      case 'glow':
        return 'bg-white shadow-lg border border-gray-200 shadow-blue-500/10';
      case 'pulse':
        return 'bg-white border border-gray-200 animate-pulse';
      case 'lift':
        return 'bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  return (
    <motion.div
      className={`rounded-xl p-6 ${getVariantClasses()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Composant AnimatedMetricCard
export const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({
  title,
  value,
  description,
  trend = 'neutral',
  trendValue,
  icon: Icon,
  variant = 'default',
  className = ""
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'glow':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
      case 'shimmer':
        return 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200';
      case 'pulse':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
      case 'lift':
        return 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <motion.div
      className={`rounded-xl border p-6 ${getVariantClasses()} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        {trendValue && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trendValue}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
}; 