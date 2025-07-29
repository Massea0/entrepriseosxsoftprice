import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({ 
  actions, 
  className,
  position = 'bottom-right' 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const actionDirection = {
    'bottom-right': { x: 0, y: -16 },
    'bottom-left': { x: 0, y: -16 },
    'top-right': { x: 0, y: 16 },
    'top-left': { x: 0, y: 16 }
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Action buttons */}
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0, ...actionDirection[position] }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: actionDirection[position].y * (index + 1) * 4,
                  x: actionDirection[position].x * (index + 1) * 4
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0,
                  y: 0,
                  x: 0
                }}
                transition={{ 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                className="absolute bottom-0 right-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Label */}
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap shadow-lg"
                  >
                    {action.label}
                  </motion.span>

                  {/* Action button */}
                  <button
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
                      action.color || "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    )}
                  >
                    {action.icon}
                  </button>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300",
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
          "flex items-center justify-center relative overflow-hidden group"
        )}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full animate-ping bg-purple-600 opacity-20" />
      </motion.button>
    </div>
  );
}