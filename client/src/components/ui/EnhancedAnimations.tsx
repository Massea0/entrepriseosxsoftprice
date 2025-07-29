import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Floating Particles Animation
export const FloatingParticles: React.FC<{ count?: number; className?: string }> = ({ 
  count = 20, 
  className 
}) => {
  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            opacity: 0
          }}
          animate={{
            y: -20,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Morphing Blob Background
export const MorphingBlob: React.FC<{ className?: string; color?: string }> = ({ 
  className, 
  color = "from-blue-400/20 to-purple-600/20" 
}) => {
  return (
    <motion.div
      className={cn(
        "absolute w-96 h-96 bg-gradient-to-r rounded-full blur-3xl",
        color,
        className
      )}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "70% 30% 40% 60% / 40% 50% 60% 30%",
          "40% 70% 60% 30% / 70% 40% 50% 60%",
          "60% 40% 30% 70% / 60% 30% 70% 40%"
        ],
        x: [0, 20, -20, 10, 0],
        y: [0, -10, 20, -15, 0],
        scale: [1, 1.1, 0.9, 1.05, 1]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Animated Text Effect
export const TypewriterText: React.FC<{ 
  text: string; 
  className?: string; 
  delay?: number;
  speed?: number;
}> = ({ text, className, delay = 0, speed = 0.1 }) => {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ 
        duration: text.length * speed, 
        delay,
        ease: "easeOut"
      }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
        className="border-r-2 border-current"
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

// Glowing Text Effect
export const GlowText: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, className, intensity = 'medium' }) => {
  const glowIntensity = {
    low: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]',
    medium: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]',
    high: 'drop-shadow-[0_0_25px_rgba(59,130,246,1)]'
  };

  return (
    <motion.div
      className={cn(
        "filter transition-all duration-500",
        glowIntensity[intensity],
        className
      )}
      whileHover={{
        scale: 1.05,
        filter: 'drop-shadow(0 0 30px rgba(59,130,246,1))'
      }}
    >
      {children}
    </motion.div>
  );
};

// Liquid Animation Container
export const LiquidContainer: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className }) => {
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Liquid Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"
        animate={{
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "70% 30% 30% 70% / 70% 70% 30% 30%",
            "30% 70% 70% 30% / 30% 30% 70% 70%"
          ],
          x: [0, 10, -10, 0],
          y: [0, -5, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Interactive Hover Zone
export const HoverZone: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  effect?: 'lift' | 'glow' | 'rotate' | 'scale';
}> = ({ children, className, effect = 'lift' }) => {
  const effectVariants = {
    lift: {
      whileHover: { y: -8, transition: { type: "spring", stiffness: 300 } }
    },
    glow: {
      whileHover: { 
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
        transition: { duration: 0.3 }
      }
    },
    rotate: {
      whileHover: { 
        rotate: 5,
        scale: 1.05,
        transition: { type: "spring", stiffness: 300 }
      }
    },
    scale: {
      whileHover: { 
        scale: 1.1,
        transition: { type: "spring", stiffness: 300 }
      }
    }
  };

  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      {...effectVariants[effect]}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// Waveform Visualizer
export const WaveformVisualizer: React.FC<{ 
  bars?: number; 
  className?: string;
  animated?: boolean;
}> = ({ bars = 20, className, animated = true }) => {
  return (
    <div className={cn("flex items-end space-x-1 h-16", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-purple-500 w-1 rounded-full"
          initial={{ height: "20%" }}
          animate={animated ? {
            height: [
              "20%", 
              `${Math.random() * 80 + 20}%`, 
              "20%",
              `${Math.random() * 60 + 40}%`,
              "20%"
            ]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Staggered List Animation
export const StaggeredList: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  staggerDelay?: number;
}> = ({ children, className, staggerDelay = 0.1 }) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className }) => {
  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
};

// Magnetic Button Effect
export const MagneticButton: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  magnetStrength?: number;
}> = ({ children, className, magnetStrength = 0.5 }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1
      }}
    >
      {children}
    </motion.div>
  );
};