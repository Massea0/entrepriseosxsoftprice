// Système d'animations unifié pour remplacer Framer Motion
export const animations = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Slide animations
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  
  // Bounce
  bounce: 'animate-bounce',
  
  // Pulse
  pulse: 'animate-pulse',
  
  // Float
  float: 'animate-float',
  
  // Glow
  glow: 'animate-glow',
  
  // Quantum effects
  quantumPulse: 'animate-quantum-pulse',
  holographic: 'animate-holographic'
};

// Transition utilities
export const transitions = {
  fast: 'transition-all duration-200',
  default: 'transition-all duration-300',
  slow: 'transition-all duration-500',
  smooth: 'transition-all duration-300 ease-in-out'
};

// Stagger animations for lists
export const staggerChildren = (delay = 50) => ({
  parent: '',
  child: (index: number) => ({
    style: { animationDelay: `${index * delay}ms` }
  })
});

// Replace motion.div with animated div
export const AnimatedDiv = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  animation?: keyof typeof animations;
  delay?: number;
  className?: string;
  [key: string]: any;
}) => {
  const animationClass = animations[animation] || animation;
  const style = delay > 0 ? { animationDelay: `${delay}ms` } : {};
  
  return (
    <div 
      className={`${animationClass} ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};