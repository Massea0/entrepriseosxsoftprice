import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown } from 'lucide-react';

interface AnimatedMetricWidgetProps {
  title: string;
  value: number | string;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percentage';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  gradient?: string;
  className?: string;
  delay?: number;
}

export function AnimatedMetricWidget({
  title,
  value,
  previousValue,
  format = 'number',
  trend,
  trendValue,
  icon,
  gradient = 'from-blue-500 to-purple-500',
  className,
  delay = 0
}: AnimatedMetricWidgetProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate number counting
  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    
    if (isNaN(numericValue)) {
      setDisplayValue(0);
      return;
    }

    setIsAnimating(true);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(numericValue, increment * step);
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(numericValue);
        setIsAnimating(false);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  // Calculate trend automatically if not provided
  const calculatedTrend = trend || (previousValue !== undefined && typeof value === 'number' 
    ? value > previousValue ? 'up' : value < previousValue ? 'down' : 'neutral'
    : undefined);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', { 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('fr-FR').format(Math.round(val));
    }
  };

  const TrendIcon = calculatedTrend === 'up' ? ArrowUp : calculatedTrend === 'down' ? ArrowDown : Minus;
  const trendColor = calculatedTrend === 'up' ? 'text-green-500' : calculatedTrend === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl p-6',
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800',
        'transition-all duration-500 hover:scale-[1.02]',
        'hover:shadow-elevation-3 dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]',
        'transform-gpu will-change-transform',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient background */}
      <div className={cn(
        'absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500',
        `bg-gradient-to-br ${gradient}`
      )} />

      {/* Animated mesh gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: 'var(--gradient-mesh-subtle)' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn(
                'p-3 rounded-xl',
                `bg-gradient-to-br ${gradient}`,
                'transform transition-all duration-500',
                'group-hover:scale-110 group-hover:rotate-3'
              )}>
                <div className="text-white">
                  {icon}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>
          </div>
          
          {calculatedTrend && (
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full',
              'bg-gray-100 dark:bg-gray-800',
              'transform transition-all duration-300',
              'group-hover:scale-110'
            )}>
              <TrendIcon className={cn('h-4 w-4', trendColor)} />
              {trendValue && (
                <span className={cn('text-xs font-medium', trendColor)}>
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative overflow-hidden">
            <h3 className={cn(
              'text-3xl font-bold tracking-tight',
              'bg-gradient-to-r bg-clip-text',
              isAnimating ? 'text-transparent' : 'text-foreground',
              isAnimating && `${gradient}`
            )}>
              {typeof value === 'string' ? value : formatValue(displayValue)}
            </h3>
            
            {/* Animated underline */}
            <div className={cn(
              'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r',
              gradient,
              'transform origin-left transition-all duration-1000',
              isAnimating ? 'scale-x-100' : 'scale-x-0'
            )} />
          </div>

          {previousValue !== undefined && (
            <p className="text-xs text-muted-foreground">
              vs {formatValue(previousValue)} précédent
            </p>
          )}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute -top-10 -right-10 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <div className={cn(
          'w-full h-full rounded-full blur-2xl',
          `bg-gradient-to-br ${gradient}`
        )} />
      </div>
    </div>
  );
}