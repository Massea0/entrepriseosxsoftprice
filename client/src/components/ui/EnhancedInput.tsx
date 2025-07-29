import React, { useState, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  info?: string;
  variant?: 'default' | 'floating' | 'inline';
  icon?: React.ComponentType<{ className?: string }>;
  showPasswordToggle?: boolean;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    label, 
    error, 
    success, 
    info, 
    variant = 'floating', 
    icon, 
    showPasswordToggle, 
    className,
    type: initialType = 'text',
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const type = showPasswordToggle && showPassword ? 'text' : initialType;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const getStatusIcon = () => {
      if (error) return <AlertCircle className="w-4 h-4 text-red-500" />;
      if (success) return <CheckCircle className="w-4 h-4 text-green-500" />;
      if (info) return <Info className="w-4 h-4 text-blue-500" />;
      return null;
    };

    const getStatusMessage = () => {
      return error || success || info;
    };

    const getStatusColor = () => {
      if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
      if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
      return 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20';
    };

    if (variant === 'floating') {
      return (
        <div className="relative">
          <div className="relative">
            {/* Input Field */}
            <input
              ref={inputRef}
              type={type}
              className={cn(
                "peer w-full px-4 py-3 pt-6 text-sm bg-white dark:bg-gray-800 border rounded-lg",
                "transition-all duration-200 ease-out",
                "placeholder-transparent focus:outline-none focus:ring-2",
                icon && "pl-11",
                (showPasswordToggle || getStatusIcon()) && "pr-11",
                getStatusColor(),
                className
              )}
              placeholder={label || props.placeholder}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={handleChange}
              {...props}
            />

            {/* Floating Label */}
            {label && (
              <motion.label
                className={cn(
                  "absolute left-4 text-gray-500 dark:text-gray-400 pointer-events-none",
                  "transition-all duration-200 ease-out",
                  "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base",
                  "peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500",
                  (hasValue || focused) && "top-2 text-xs text-blue-500",
                  icon && "peer-placeholder-shown:left-11 peer-focus:left-4",
                  icon && (hasValue || focused) && "left-4"
                )}
                initial={false}
                animate={{
                  scale: (focused || hasValue) ? 0.85 : 1,
                  color: focused ? '#3b82f6' : undefined
                }}
              >
                {label}
              </motion.label>
            )}

            {/* Left Icon */}
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {React.createElement(icon, { className: "h-4 w-4" })}
              </div>
            )}

            {/* Right Icons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
              {getStatusIcon()}
            </div>

            {/* Focus Ring Animation */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={false}
              animate={{
                boxShadow: focused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 0 0 0px transparent'
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {getStatusMessage() && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "mt-1 text-xs flex items-center space-x-1",
                  error && "text-red-500",
                  success && "text-green-500",
                  info && "text-blue-500"
                )}
              >
                {getStatusIcon()}
                <span>{getStatusMessage()}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Default/Inline variants (simplified for now)
    return (
      <div className="space-y-1">
        {label && variant === 'inline' && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={inputRef}
            type={type}
            className={cn(
              "w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-md",
              "focus:outline-none focus:ring-2 transition-all duration-200",
              getStatusColor(),
              className
            )}
            onChange={handleChange}
            {...props}
          />
          {(showPasswordToggle || getStatusIcon()) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
              {getStatusIcon()}
            </div>
          )}
        </div>
        {getStatusMessage() && (
          <div className={cn(
            "text-xs flex items-center space-x-1",
            error && "text-red-500",
            success && "text-green-500",
            info && "text-blue-500"
          )}>
            {getStatusIcon()}
            <span>{getStatusMessage()}</span>
          </div>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';