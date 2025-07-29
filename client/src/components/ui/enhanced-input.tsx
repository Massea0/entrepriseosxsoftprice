import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'modern' | 'floating';
  showValidation?: boolean;
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4',
  lg: 'h-13 px-6 text-lg'
};

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(({
  label,
  error,
  success,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  size = 'md',
  variant = 'default',
  showValidation = true,
  className,
  type,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const inputVariants = {
    unfocused: { 
      scale: 1,
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(228 228 231)'
    },
    focused: { 
      scale: 1.01,
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(124 58 237)',
      boxShadow: error 
        ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
        : '0 0 0 3px rgba(124, 58, 237, 0.1)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const labelVariants = {
    unfocused: { 
      y: 0, 
      scale: 1, 
      color: 'rgb(113 113 122)' 
    },
    focused: { 
      y: variant === 'floating' ? -28 : 0, 
      scale: variant === 'floating' ? 0.85 : 1,
      color: error ? 'rgb(239 68 68)' : 'rgb(124 58 237)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <div className="relative">
      {/* Standard Label */}
      {label && variant !== 'floating' && (
        <motion.label
          className={cn(
            "block text-sm font-medium mb-2 transition-colors",
            error ? "text-destructive" : "text-foreground"
          )}
          variants={labelVariants}
          animate={isFocused ? 'focused' : 'unfocused'}
        >
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </motion.label>
      )}

      <div className="relative">
        {/* Input Container */}
        <motion.div
          className="relative"
          variants={inputVariants}
          animate={isFocused ? 'focused' : 'unfocused'}
        >
          {/* Left Icon */}
          {Icon && (
            <motion.div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              variants={iconVariants}
              animate={isFocused ? 'visible' : 'visible'}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={actualType}
            className={cn(
              "w-full border rounded-xl bg-background/50 backdrop-blur-sm transition-all duration-200",
              "focus:outline-none focus:ring-0",
              "placeholder:text-muted-foreground/60",
              sizes[size],
              Icon && "pl-10",
              (isPassword || RightIcon) && "pr-10",
              error && "border-destructive",
              success && showValidation && "border-green-500",
              variant === 'modern' && "border-0 bg-gradient-to-r from-background/80 to-muted/20",
              variant === 'floating' && "pt-6",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* Floating Label */}
          {label && variant === 'floating' && (
            <motion.label
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm transition-colors",
                Icon && "left-10"
              )}
              variants={labelVariants}
              animate={isFocused || hasValue ? 'focused' : 'unfocused'}
            >
              {label}
              {props.required && <span className="text-destructive ml-1">*</span>}
            </motion.label>
          )}

          {/* Right Icon */}
          <AnimatePresence>
            {(isPassword || RightIcon || (showValidation && (error || success))) && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Validation Icons */}
                {showValidation && error && (
                  <motion.div
                    className="text-destructive"
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </motion.div>
                )}

                {showValidation && success && !error && (
                  <motion.div
                    className="text-green-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </motion.div>
                )}

                {/* Custom Right Icon */}
                {RightIcon && (
                  <motion.button
                    type="button"
                    onClick={onRightIconClick}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RightIcon className="h-4 w-4" />
                  </motion.button>
                )}

                {/* Password Toggle */}
                {isPassword && (
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Focus Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-2 text-sm text-destructive flex items-center space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && !error && (
          <motion.p
            className="mt-2 text-sm text-green-500 flex items-center space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircle className="h-3 w-3" />
            <span>Validation réussie</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

EnhancedInput.displayName = 'EnhancedInput';