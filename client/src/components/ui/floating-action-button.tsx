import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6'
};

export function FloatingActionButton({ 
  actions, 
  className, 
  position = 'bottom-right' 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const fabVariants = {
    closed: { 
      rotate: 0,
      scale: 1
    },
    open: { 
      rotate: 45,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  const actionVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      y: 20
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    }),
    exit: {
      opacity: 0,
      scale: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={cn(
        "fixed z-50 flex flex-col-reverse items-end space-y-reverse space-y-3",
        positionClasses[position],
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="flex flex-col-reverse space-y-reverse space-y-3 mb-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  className="flex items-center space-x-3"
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                >
                  {/* Label */}
                  <motion.div
                    className="px-3 py-2 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      {action.label}
                    </span>
                  </motion.div>

                  {/* Action Button */}
                  <motion.button
                    className={cn(
                      "w-12 h-12 rounded-full shadow-lg backdrop-blur-sm border border-border/50",
                      "hover:shadow-xl hover:scale-110 transition-all duration-200",
                      "flex items-center justify-center",
                      action.color || "bg-primary text-primary-foreground"
                    )}
                    onClick={action.onClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className={cn(
          "w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl",
          "flex items-center justify-center text-white",
          "hover:shadow-purple-500/25 hover:shadow-2xl",
          "border-2 border-white/20 backdrop-blur-sm",
          "relative overflow-hidden group"
        )}
        variants={fabVariants}
        animate={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Icon */}
        <motion.div className="relative z-10">
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </motion.div>
  );
}