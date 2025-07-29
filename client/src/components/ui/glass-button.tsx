import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "animate" | "initial" | "transition" | "children"> {
  variant?: "default" | "primary" | "gradient" | "neon"
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 dark:hover:bg-gray-900/20",
      primary: "bg-primary/20 hover:bg-primary/30 text-primary-foreground",
      gradient: "bg-gradient-to-r from-primary/20 to-purple-500/20 hover:from-primary/30 hover:to-purple-500/30",
      neon: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative rounded-lg font-medium",
          "backdrop-blur-xl backdrop-saturate-150",
          "border border-white/20 dark:border-gray-700/20",
          "shadow-lg transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
        {...props}
      >
        {variant === "neon" && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 opacity-0"
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    )
  }
)

GlassButton.displayName = "GlassButton"

export { GlassButton }