import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  variant?: 'default' | 'glow' | 'elevated' | 'glass' | 'gradient';
  hover?: 'lift' | 'glow' | 'scale' | 'tilt';
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  gradient?: string;
}

export function InteractiveCard({
  title,
  description,
  variant = 'default',
  hover = 'lift',
  children,
  icon,
  badge,
  gradient,
  className,
  ...props
}: InteractiveCardProps) {
  const variantClasses = {
    default: 'bg-card border-border',
    glow: 'bg-card border-primary/20 shadow-[0_0_30px_rgba(102,126,234,0.15)]',
    elevated: 'bg-card border-0 shadow-elevation-3',
    glass: 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-[var(--glass-effect)] border-white/20 dark:border-gray-700/20',
    gradient: `bg-gradient-to-br ${gradient || 'from-primary/10 to-primary/5'} border-primary/20`
  };

  const hoverClasses = {
    lift: 'hover:-translate-y-1 hover:shadow-elevation-4',
    glow: 'hover:shadow-[0_0_40px_rgba(102,126,234,0.3)] hover:border-primary/40',
    scale: 'hover:scale-[1.02]',
    tilt: 'hover:[transform:perspective(1000px)_rotateX(2deg)]'
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'transform-gpu will-change-transform',
        variantClasses[variant],
        hoverClasses[hover],
        'group',
        className
      )}
      {...props}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[var(--gradient-mesh-subtle)] opacity-30" />
      </div>

      {/* Glow effect on hover */}
      {(variant === 'glow' || hover === 'glow') && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-[-2px] bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-xl" />
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          {badge}
        </div>
      )}

      <div className="relative z-10">
        {(title || description || icon) && (
          <CardHeader className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                {title && (
                  <CardTitle className="flex items-center gap-3">
                    {icon && (
                      <div className="flex-shrink-0 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {icon}
                      </div>
                    )}
                    <span className="transition-colors duration-300 group-hover:text-primary">
                      {title}
                    </span>
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="transition-colors duration-300 group-hover:text-foreground/70">
                    {description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
        )}
        
        <CardContent className="relative">
          {children}
        </CardContent>
      </div>

      {/* Animated corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10 transition-transform duration-500 group-hover:translate-x-8 group-hover:-translate-y-8">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
      </div>
    </Card>
  );
}