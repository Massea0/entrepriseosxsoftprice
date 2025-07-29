import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { 
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface GridItem {
  id: string;
  component: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  span?: {
    cols?: number;
    rows?: number;
  };
}

interface GridLayoutProps {
  items: GridItem[];
  onItemsChange?: (items: GridItem[]) => void;
  columns?: number;
  gap?: number;
  className?: string;
  enableDragAndDrop?: boolean;
  responsive?: boolean;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  span?: {
    cols?: number;
    rows?: number;
  };
}

function SortableItem({ id, children, size = 'md', span }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSizeClasses = () => {
    const cols = span?.cols || (size === 'sm' ? 1 : size === 'lg' ? 2 : size === 'xl' ? 3 : 1);
    const rows = span?.rows || 1;
    
    return {
      gridColumn: `span ${cols}`,
      gridRow: `span ${rows}`,
    };
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{ ...style, ...getSizeClasses() }}
      className={cn(
        'relative',
        isDragging && 'z-50 opacity-50'
      )}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
    >
      {children}
    </motion.div>
  );
}

export function GridLayout({
  items,
  onItemsChange,
  columns = 3,
  gap = 4,
  className,
  enableDragAndDrop = true,
  responsive = true
}: GridLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [gridItems, setGridItems] = useState(items);

  // Update local state when items prop changes
  React.useEffect(() => {
    setGridItems(items);
  }, [items]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setGridItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        onItemsChange?.(newItems);
        return newItems;
      });
    }

    setActiveId(null);
  }, [onItemsChange]);

  const getResponsiveColumns = () => {
    if (!responsive) return columns;
    
    // Responsive breakpoints
    return {
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      },
      '@media (max-width: 1024px) and (min-width: 769px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
    };
  };

  const responsiveColumns = getResponsiveColumns();
  const gridStyle = {
    display: 'grid' as const,
    gap: `${gap * 0.25}rem`,
    gridTemplateColumns: typeof responsiveColumns === 'object' ? responsiveColumns.gridTemplateColumns : `repeat(${columns}, minmax(0, 1fr))`,
  };

  if (!enableDragAndDrop) {
    return (
      <div 
        className={cn('w-full', className)} 
        style={gridStyle}
      >
        <AnimatePresence>
          {gridItems.map((item) => (
            <motion.div
              key={item.id}
              style={{
                gridColumn: item.span?.cols ? `span ${item.span.cols}` : 'span 1',
                gridRow: item.span?.rows ? `span ${item.span.rows}` : 'span 1',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30 
              }}
              layout
            >
              {item.component}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext 
        items={gridItems.map(item => item.id)} 
        strategy={rectSortingStrategy}
      >
        <div 
          className={cn('w-full', className)} 
          style={gridStyle}
        >
          <AnimatePresence>
            {gridItems.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                size={item.size}
                span={item.span}
              >
                {item.component}
              </SortableItem>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div className="opacity-90 transform scale-105 shadow-2xl">
            {gridItems.find(item => item.id === activeId)?.component}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default GridLayout;