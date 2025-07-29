import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Maximize2, 
  Minimize2, 
  Settings, 
  X, 
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DynamicWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  allowResize?: boolean;
  allowMove?: boolean;
  allowCollapse?: boolean;
  allowFullscreen?: boolean;
  refreshable?: boolean;
  downloadable?: boolean;
  shareable?: boolean;
  onRefresh?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onRemove?: () => void;
  onSettings?: () => void;
}

export function DynamicWidget({
  title,
  children,
  className,
  variant = 'default',
  size = 'md',
  allowResize = false,
  allowMove = false,
  allowCollapse = true,
  allowFullscreen = true,
  refreshable = false,
  downloadable = false,
  shareable = false,
  onRefresh,
  onDownload,
  onShare,
  onRemove,
  onSettings
}: DynamicWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'min-h-48 max-w-sm';
      case 'md':
        return 'min-h-64 max-w-md';
      case 'lg':
        return 'min-h-80 max-w-lg';
      case 'xl':
        return 'min-h-96 max-w-xl';
      default:
        return 'min-h-64 max-w-md';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/5 dark:bg-black/20 backdrop-blur-md border-white/10 dark:border-white/10';
      case 'gradient':
        return 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20';
      case 'minimal':
        return 'bg-transparent border-border/50 shadow-none';
      default:
        return 'bg-card dark:bg-card border-border';
    }
  };

  const handleRefresh = async () => {
    if (refreshable && onRefresh) {
      setIsLoading(true);
      try {
        await onRefresh();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (!allowMove) return;
    setIsDragging(true);
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX - offsetX,
          y: e.clientY - offsetY
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const containerClasses = cn(
    'relative transition-all duration-300 ease-out',
    getSizeClasses(),
    getVariantClasses(),
    {
      'fixed inset-4 z-50 max-w-none max-h-none': isFullscreen,
      'cursor-move': allowMove && isDragging,
      'shadow-2xl': isFullscreen,
    },
    className
  );

  const widgetStyle = allowMove && !isFullscreen ? {
    transform: `translate(${position.x}px, ${position.y}px)`,
    zIndex: isDragging ? 1000 : 'auto'
  } : {};

  return (
    <motion.div
      ref={widgetRef}
      className={containerClasses}
      style={widgetStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        height: isCollapsed ? 'auto' : 'auto'
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
      layout
    >
      <Card className="h-full border-0 shadow-lg">
        <CardHeader 
          className={cn(
            'flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer',
            allowMove && 'cursor-move'
          )}
          onMouseDown={handleDragStart}
        >
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {title}
          </CardTitle>

          <div className="flex items-center gap-1">
            {/* Quick Action Buttons */}
            {refreshable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isLoading && "animate-spin"
                )} />
              </Button>
            )}

            {allowFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
                onClick={handleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {allowCollapse && (
                  <DropdownMenuItem onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? 'Expand' : 'Collapse'}
                  </DropdownMenuItem>
                )}
                
                {downloadable && onDownload && (
                  <DropdownMenuItem onClick={onDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                )}
                
                {shareable && onShare && (
                  <DropdownMenuItem onClick={onShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                )}
                
                {onSettings && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSettings}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </>
                )}
                
                {onRemove && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={onRemove}
                      className="text-red-600 dark:text-red-400"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Widget
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Resize Handle */}
      {allowResize && !isFullscreen && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-muted/50 hover:bg-muted transition-colors" />
      )}

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleFullscreen}
        />
      )}
    </motion.div>
  );
}

export default DynamicWidget;