import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial" | "transition" | "children"> {
  variant?: "default" | "glass" | "gradient" | "neon"
  hover?: boolean
  delay?: number
  children?: React.ReactNode
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, variant = "default", hover = true, delay = 0, children, ...props }, ref) => {
    const variants = {
      default: "bg-card text-card-foreground",
      glass: "bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl backdrop-saturate-150",
      gradient: "bg-gradient-to-br from-primary/10 to-primary/5",
      neon: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-transparent"
    }

    const hoverEffects = hover ? {
      whileHover: {
        scale: 1.02,
        y: -5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      },
      whileTap: {
        scale: 0.98
      }
    } : {}

    const neonEffect = variant === "neon" ? {
      animate: {
        borderColor: ["rgba(147, 51, 234, 0.5)", "rgba(236, 72, 153, 0.5)", "rgba(147, 51, 234, 0.5)"],
        boxShadow: [
          "0 0 20px rgba(147, 51, 234, 0.3)",
          "0 0 40px rgba(236, 72, 153, 0.3)",
          "0 0 20px rgba(147, 51, 234, 0.3)"
        ]
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    } : {}

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl shadow-lg transition-all duration-300",
          variants[variant],
          variant === "glass" && "border border-white/20 dark:border-gray-700/20",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          ...neonEffect.animate
        }}
        transition={{ 
          delay,
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
          ...neonEffect.transition
        }}
        {...hoverEffects}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }