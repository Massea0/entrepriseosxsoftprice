import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedMetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  icon: LucideIcon;
  gradient?: string;
  trend?: 'up' | 'down' | 'neutral' | string;
  trendValue?: string;
  description?: string;
  delay?: number;
  animateValue?: boolean;
  onClick?: () => void;
}

export function AnimatedMetricCard({
  title,
  value,
  previousValue,
  icon: Icon,
  gradient = 'from-blue-500 to-purple-500',
  trend = 'neutral',
  trendValue,
  description,
  delay = 0,
  animateValue = true,
  onClick
}: AnimatedMetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animate numeric values
  useEffect(() => {
    if (!animateValue || typeof value !== 'number') return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
      const start = typeof previousValue === 'number' ? previousValue : 0;
      const end = value;
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (end - start) * easeOutCubic;
        
        setDisplayValue(Math.floor(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, previousValue, animateValue, delay]);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        delay: delay + 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-muted-foreground'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <motion.div
      className={cn(
        "relative group rounded-2xl p-6 border border-border/50 overflow-hidden cursor-pointer",
        "bg-gradient-to-br from-card/80 to-card backdrop-blur-sm",
        "hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5 bg-gradient-to-br",
        gradient
      )} />

      {/* Animated Background Pattern */}
      <motion.div
        className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-10"
        style={{ background: `linear-gradient(45deg, ${gradient?.split(' ')[1] || 'blue'}, transparent)` }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br",
              gradient,
              "shadow-lg"
            )}
            variants={iconVariants}
          >
            {Icon && <Icon className="h-6 w-6 text-white" />}
          </motion.div>

          {trendValue && (
            <motion.div
              className="flex items-center space-x-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.5 }}
            >
              <span className={cn("text-sm font-medium", trendColors[trend])}>
                {trendIcons[trend]} {trendValue}
              </span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {animateValue && typeof value === 'number' ? displayValue.toLocaleString() : value}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
        </motion.div>

        {/* Description */}
        {description && (
          <motion.p
            className="text-xs text-muted-foreground mt-3 border-t border-border/50 pt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.6 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Hover Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${gradient?.split(' ')[1] || 'blue'}15, transparent 70%)`
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Bottom Shine */}
      <motion.div
        className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.7, duration: 0.8 }}
      />
    </motion.div>
  );
}