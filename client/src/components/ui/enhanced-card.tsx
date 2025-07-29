import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: 'glow' | 'lift' | 'shimmer' | 'pulse' | 'scale';
  gradient?: string;
  glowColor?: 'purple' | 'blue' | 'green' | 'orange' | 'pink';
  delay?: number;
  floating?: boolean;
  interactive?: boolean;
}

const glowColors = {
  purple: 'rgba(124, 58, 237, 0.3)',
  blue: 'rgba(59, 130, 246, 0.3)',
  green: 'rgba(34, 197, 94, 0.3)',
  orange: 'rgba(249, 115, 22, 0.3)',
  pink: 'rgba(236, 72, 153, 0.3)'
};

export function EnhancedCard({ 
  children, 
  className = '', 
  hoverEffect = 'lift',
  gradient,
  glowColor = 'purple',
  delay = 0,
  floating = false,
  interactive = true
}: EnhancedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        delay,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      y: hoverEffect === 'lift' ? -8 : 0,
      scale: hoverEffect === 'scale' ? 1.05 : 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm",
        interactive && "cursor-pointer",
        floating && "shadow-2xl",
        gradient && `bg-gradient-to-br ${gradient}`,
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={interactive ? "hover" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      {hoverEffect === 'glow' && (
        <motion.div
          className="absolute -inset-0.5 rounded-xl opacity-0"
          style={{
            background: `radial-gradient(circle at center, ${glowColors[glowColor]}, transparent 70%)`,
            filter: 'blur(8px)'
          }}
          variants={glowVariants}
          animate={isHovered ? 'hover' : 'hidden'}
        />
      )}

      {/* Shimmer Effect */}
      {hoverEffect === 'shimmer' && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}

      {/* Pulse Effect Background */}
      {hoverEffect === 'pulse' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/5"
          animate={isHovered ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </motion.div>
  );
}