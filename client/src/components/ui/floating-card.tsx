import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingCardProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial" | "transition" | "children"> {
  delay?: number
  duration?: number
  floatIntensity?: number
  children?: React.ReactNode
}

const FloatingCard = React.forwardRef<HTMLDivElement, FloatingCardProps>(
  ({ className, delay = 0, duration = 6, floatIntensity = 10, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-xl p-6",
          "bg-gradient-to-br from-white/80 to-white/60",
          "dark:from-gray-800/80 dark:to-gray-800/60",
          "backdrop-blur-xl backdrop-saturate-150",
          "border border-white/20 dark:border-gray-700/20",
          "shadow-2xl shadow-primary/10",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: [0, -floatIntensity, 0]
        }}
        transition={{
          opacity: { delay, duration: 0.5 },
          y: {
            delay: delay + 0.5,
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
          }
        }}
        {...props}
      >
        {/* Gradient Orb Background Effect */}
        <motion.div
          className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            filter: "blur(20px)",
            zIndex: -1
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {children}
      </motion.div>
    )
  }
)

FloatingCard.displayName = "FloatingCard"

export { FloatingCard }