import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FuturisticInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'neon' | 'glass' | 'minimal';
}

export function FuturisticInput({
  label,
  error,
  success,
  icon,
  variant = 'default',
  type,
  className,
  ...props
}: FuturisticInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(props.value || '');

  const isPassword = type === 'password';
  const hasValue = value.toString().length > 0;
  const hasError = !!error;
  const hasSuccess = !!success;

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return {
          container: 'relative group',
          input: cn(
            'w-full px-4 py-3 bg-black/20 border-2 rounded-xl',
            'text-white placeholder-gray-400',
            'transition-all duration-300 ease-out',
            hasError
              ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : hasSuccess
              ? 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
              : isFocused
              ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              : 'border-gray-600 hover:border-gray-500',
            'focus:outline-none focus:ring-0',
            'backdrop-blur-sm'
          ),
          label: cn(
            'absolute left-4 transition-all duration-300 pointer-events-none',
            isFocused || hasValue
              ? 'top-2 text-xs scale-90 text-cyan-400'
              : 'top-3.5 text-base text-gray-400'
          ),
          glow: isFocused && !hasError && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-blue-400/10 blur-xl" />
          )
        };

      case 'glass':
        return {
          container: 'relative group',
          input: cn(
            'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl',
            'text-white placeholder-gray-400',
            'transition-all duration-300 ease-out',
            'backdrop-blur-md',
            hasError
              ? 'border-red-400/50 bg-red-500/10'
              : hasSuccess
              ? 'border-green-400/50 bg-green-500/10'
              : isFocused
              ? 'border-white/30 bg-white/10 shadow-lg'
              : 'hover:border-white/20 hover:bg-white/5',
            'focus:outline-none focus:ring-0'
          ),
          label: cn(
            'absolute left-4 transition-all duration-300 pointer-events-none',
            isFocused || hasValue
              ? 'top-2 text-xs scale-90 text-white/80'
              : 'top-3.5 text-base text-white/60'
          )
        };

      case 'minimal':
        return {
          container: 'relative group',
          input: cn(
            'w-full px-0 py-3 bg-transparent border-0 border-b-2 rounded-none',
            'text-foreground placeholder-muted-foreground',
            'transition-all duration-300 ease-out',
            hasError
              ? 'border-red-500'
              : hasSuccess
              ? 'border-green-500'
              : isFocused
              ? 'border-primary'
              : 'border-muted-foreground/30',
            'focus:outline-none focus:ring-0'
          ),
          label: cn(
            'absolute left-0 transition-all duration-300 pointer-events-none',
            isFocused || hasValue
              ? '-top-4 text-sm scale-90 text-primary'
              : 'top-3 text-base text-muted-foreground'
          )
        };

      default:
        return {
          container: 'relative group',
          input: cn(
            'w-full px-4 py-3 bg-background border border-border rounded-lg',
            'text-foreground placeholder-muted-foreground',
            'transition-all duration-300 ease-out',
            hasError
              ? 'border-red-500 focus:border-red-500'
              : hasSuccess
              ? 'border-green-500 focus:border-green-500'
              : 'focus:border-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary/20'
          ),
          label: cn(
            'absolute left-4 px-1 bg-background transition-all duration-300 pointer-events-none',
            isFocused || hasValue
              ? '-top-2.5 text-sm scale-90 text-primary'
              : 'top-3 text-base text-muted-foreground'
          )
        };
    }
  };

  const styles = getVariantStyles();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-2">
      <div className={styles.container}>
        {styles.glow}
        
        <motion.div
          className="relative"
          initial={{ scale: 1 }}
          animate={{ scale: isFocused ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            {...props}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              styles.input,
              icon && 'pl-12',
              isPassword && 'pr-12',
              className
            )}
          />

          {/* Floating Label */}
          {label && (
            <motion.label
              className={styles.label}
              animate={{
                y: isFocused || hasValue ? 0 : 0,
                scale: isFocused || hasValue ? 0.85 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </motion.div>

        {/* Animated Border (for neon variant) */}
        {variant === 'neon' && isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-transparent"
            style={{
              background: 'linear-gradient(45deg, rgba(6,182,212,0.6), rgba(59,130,246,0.6), rgba(147,51,234,0.6))',
              backgroundSize: '300% 300%'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'text-sm font-medium',
              error ? 'text-red-500' : 'text-green-500'
            )}
          >
            {error || success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}