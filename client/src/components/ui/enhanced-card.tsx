import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { animations, transitions } from '@/lib/animations';

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

  const hoverClasses = {
    lift: 'hover:-translate-y-2',
    scale: 'hover:scale-105',
    glow: '',
    shimmer: '',
    pulse: ''
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm",
        animations.scaleIn,
        transitions.smooth,
        interactive && "cursor-pointer",
        interactive && hoverClasses[hoverEffect],
        floating && "shadow-2xl",
        gradient && `bg-gradient-to-br ${gradient}`,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      {hoverEffect === 'glow' && (
        <div
          className={cn(
            "absolute -inset-0.5 rounded-xl",
            transitions.default,
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(circle at center, ${glowColors[glowColor]}, transparent 70%)`,
            filter: 'blur(8px)'
          }}
        />
      )}

      {/* Shimmer Effect */}
      {hoverEffect === 'shimmer' && isHovered && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_0.6s_ease-in-out]"
          style={{
            animation: 'shimmer 0.6s ease-in-out',
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(200%)' }
            }
          } as React.CSSProperties}
        />
      )}

      {/* Pulse Effect Background */}
      {hoverEffect === 'pulse' && isHovered && (
        <div
          className={cn(
            "absolute inset-0 rounded-xl bg-primary/5",
            animations.pulse
          )}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </div>
  );
}