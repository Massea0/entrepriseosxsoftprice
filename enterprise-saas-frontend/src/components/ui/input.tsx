import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full rounded-token-md border border-border bg-background px-3 py-2 text-sm ring-offset-background transition-colors duration-token-fast file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10',
        lg: 'h-12 text-base',
      },
      error: {
        true: 'border-error focus-visible:ring-error',
      },
    },
    defaultVariants: {
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string | boolean;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    inputSize,
    error,
    label,
    helper,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    id,
    ...props 
  }, ref) => {
    const inputId = id || React.useId();
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : '';
    
    const inputElement = (
      <div className="relative flex items-center">
        {leftAddon && (
          <div className="flex h-full items-center rounded-l-token-md border border-r-0 border-border bg-muted px-3 text-sm text-muted-foreground">
            {leftAddon}
          </div>
        )}
        
        {leftIcon && !leftAddon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          id={inputId}
          className={cn(
            inputVariants({ inputSize, error: hasError, className }),
            leftIcon && !leftAddon && 'pl-10',
            rightIcon && !rightAddon && 'pr-10',
            leftAddon && 'rounded-l-none',
            rightAddon && 'rounded-r-none'
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={
            hasError && errorMessage ? `${inputId}-error` : 
            helper ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && !rightAddon && (
          <div className="pointer-events-none absolute right-3 flex items-center text-muted-foreground">
            {rightIcon}
          </div>
        )}
        
        {rightAddon && (
          <div className="flex h-full items-center rounded-r-token-md border border-l-0 border-border bg-muted px-3 text-sm text-muted-foreground">
            {rightAddon}
          </div>
        )}
      </div>
    );
    
    if (!label && !errorMessage && !helper) {
      return inputElement;
    }
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="ml-1 text-error">*</span>}
          </label>
        )}
        
        {inputElement}
        
        {errorMessage && (
          <p id={`${inputId}-error`} className="text-sm text-error">
            {errorMessage}
          </p>
        )}
        
        {helper && !hasError && (
          <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };