import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-token-md text-sm font-medium transition-all duration-token-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-token-sm hover:bg-primary/90 active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-token-sm hover:bg-secondary/80 active:scale-[0.98]',
        destructive:
          'bg-error text-error-foreground shadow-token-sm hover:bg-error/90 active:scale-[0.98]',
        outline:
          'border border-border bg-background shadow-token-sm hover:bg-muted hover:text-foreground active:scale-[0.98]',
        ghost: 
          'hover:bg-muted hover:text-foreground active:bg-muted/80',
        link: 
          'text-primary underline-offset-4 hover:underline',
        success:
          'bg-success text-success-foreground shadow-token-sm hover:bg-success/90 active:scale-[0.98]',
        warning:
          'bg-warning text-warning-foreground shadow-token-sm hover:bg-warning/90 active:scale-[0.98]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
      loading: {
        true: 'relative text-transparent pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const loadingSpinnerVariants = cva(
  'absolute inset-0 flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        secondary: 'text-secondary-foreground',
        destructive: 'text-error-foreground',
        outline: 'text-foreground',
        ghost: 'text-foreground',
        link: 'text-primary',
        success: 'text-success-foreground',
        warning: 'text-warning-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={loadingSpinnerVariants({ variant })}>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        
        {leftIcon && !loading && (
          <span className="mr-2 flex shrink-0 items-center">{leftIcon}</span>
        )}
        
        {children}
        
        {rightIcon && !loading && (
          <span className="ml-2 flex shrink-0 items-center">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };