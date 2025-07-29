import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowRight,
  Zap,
  Target,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  progress?: {
    value: number;
    max?: number;
    color?: 'primary' | 'success' | 'warning' | 'danger';
  };
  status?: {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];
  variant?: 'default' | 'gradient' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  progress,
  status,
  actions,
  variant = 'default',
  size = 'md',
  icon,
  footer,
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary/5 via-purple-50/50 to-blue-50/50 dark:from-primary/10 dark:via-purple-950/50 dark:to-blue-950/50 border-primary/20';
      case 'glass':
        return 'bg-white/70 dark:bg-black/20 backdrop-blur-xl border-white/20 shadow-xl';
      case 'minimal':
        return 'bg-muted/30 border-muted-foreground/10 shadow-sm';
      default:
        return 'bg-card border-border shadow-lg';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.isPositive === undefined) {
      return trend.value > 0 ? <TrendingUp className="h-4 w-4" /> : 
             trend.value < 0 ? <TrendingDown className="h-4 w-4" /> : 
             <Minus className="h-4 w-4" />;
    }
    return trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.isPositive === undefined) {
      return trend.value > 0 ? 'text-green-600 bg-green-50 dark:bg-green-950' : 
             trend.value < 0 ? 'text-red-600 bg-red-50 dark:bg-red-950' : 
             'text-muted-foreground bg-muted';
    }
    return trend.isPositive ? 'text-green-600 bg-green-50 dark:bg-green-950' : 'text-red-600 bg-red-50 dark:bg-red-950';
  };

  const getProgressColor = () => {
    switch (progress?.color) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group',
      getVariantStyles(),
      className
    )}>
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      <CardHeader className={cn('relative', getSizeStyles(), size === 'sm' ? 'pb-2' : 'pb-4')}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn(
                'p-2 rounded-xl bg-primary/10 text-primary',
                size === 'lg' ? 'p-3' : 'p-2'
              )}>
                {icon}
              </div>
            )}
            <div>
              <CardTitle className={cn(
                'font-semibold text-muted-foreground',
                size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
              )}>
                {title}
              </CardTitle>
              {subtitle && (
                <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-1">
              {actions.slice(0, 1).map((action, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={action.onClick}
                >
                  {action.icon || <ArrowRight className="h-4 w-4" />}
                </Button>
              ))}
              {actions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn('relative space-y-4', getSizeStyles(), 'pt-0')}>
        {/* Valeur principale */}
        <div className="flex items-baseline gap-2">
          <span className={cn(
            'font-bold text-foreground',
            size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
          )}>
            {value}
          </span>
          {status && (
            <Badge variant={status.variant} className="text-xs">
              {status.label}
            </Badge>
          )}
        </div>

        {/* Tendance */}
        {trend && (
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
            getTrendColor()
          )}>
            {getTrendIcon()}
            <span>{Math.abs(trend.value)}% {trend.label}</span>
          </div>
        )}

        {/* Barre de progression */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">
                {progress.value}{progress.max ? `/${progress.max}` : '%'}
              </span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn('h-full transition-all duration-700 ease-out rounded-full', getProgressColor())}
                style={{ 
                  width: `${Math.min(100, (progress.value / (progress.max || 100)) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Actions principales */}
        {actions && actions.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex gap-2 flex-wrap">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs flex-1 min-w-0"
                  onClick={action.onClick}
                >
                  {action.icon && <span className="mr-1">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Footer personnalisé */}
        {footer && (
          <div className="pt-3 border-t border-border/30">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composants spécialisés pour différents types de métriques
export const RevenueCard: React.FC<Omit<MetricsCardProps, 'icon'>> = (props) => (
  <MetricsCard
    {...props}
    icon={<Target className="h-5 w-5" />}
    variant="gradient"
  />
);

export const PerformanceCard: React.FC<Omit<MetricsCardProps, 'icon'>> = (props) => (
  <MetricsCard
    {...props}
    icon={<Zap className="h-5 w-5" />}
    variant="glass"
  />
);

export const TimeCard: React.FC<Omit<MetricsCardProps, 'icon'>> = (props) => (
  <MetricsCard
    {...props}
    icon={<Clock className="h-5 w-5" />}
    variant="minimal"
  />
);