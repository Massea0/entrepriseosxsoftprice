import React from 'react';
import { cn } from '@/lib/utils';

// Card simple avec hover subtil
export const SimpleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className, hover = true }) => {
  return (
    <div 
      className={cn(
        "rounded-lg border bg-card",
        hover && "transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

// Texte simple sans animation
export const SimpleText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("text-foreground", className)}>
      {children}
    </div>
  );
};

// Bouton simple avec transition de couleur uniquement
export const SimpleButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  [key: string]: any; // Pour accepter toutes les props
}> = ({ children, className, onClick, variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-md transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Container simple sans effets
export const SimpleContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
};

// Liste simple sans animation
export const SimpleList: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
};

// Export des composants vides pour compatibilité
export const FloatingParticles = () => null;
export const MorphingBlob = () => null;
export const TypewriterText = SimpleText;
export const GlowText = SimpleText;
export const LiquidContainer = SimpleContainer;
export const HoverZone = SimpleContainer;
export const WaveformVisualizer = () => null;
export const StaggeredList = SimpleList;
export const StaggeredItem = SimpleContainer;
export const MagneticButton = SimpleButton;
export const EnhancedCard = SimpleCard;