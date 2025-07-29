import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';

// Virtual Scrolling Hook
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const scrollTop = scrollRef.current.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.ceil((scrollTop + containerHeight) / itemHeight);
      
      setVisibleRange({
        start: Math.max(0, start - overscan),
        end: Math.min(items.length, end + overscan)
      });
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [items.length, itemHeight, containerHeight, overscan]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    scrollRef,
    visibleItems,
    totalHeight,
    offsetY,
    visibleRange
  };
};

// Debounce Hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle Hook
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRun.current = now;
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, delay - timeSinceLastRun);
    }
  }, [callback, delay]) as T;
};

// Lazy Load Hook
export const useLazyLoad = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  });

  return { ref, isLoaded: isInView };
};

// Memory Optimization Hook
export const useMemoryOptimization = () => {
  useEffect(() => {
    // Request idle callback for non-critical updates
    if ('requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(() => {
        // Perform memory cleanup
        if ('gc' in window) {
          (window as any).gc();
        }
      });

      return () => {
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(handle);
        }
      };
    }
  }, []);
};

// Prefetch Hook
export const usePrefetch = (urls: string[]) => {
  useEffect(() => {
    const links = urls.map(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach(link => document.head.removeChild(link));
    };
  }, [urls]);
};

// Web Worker Hook
export const useWebWorker = <T, R>(
  workerFunction: (data: T) => R
): [(data: T) => Promise<R>, boolean] => {
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker>();

  useEffect(() => {
    // Create worker from function
    const blob = new Blob([
      `self.onmessage = function(e) {
        const result = (${workerFunction.toString()})(e.data);
        self.postMessage(result);
      }`
    ], { type: 'application/javascript' });
    
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  const process = useCallback((data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsProcessing(true);
      
      workerRef.current.onmessage = (e) => {
        setIsProcessing(false);
        resolve(e.data);
      };

      workerRef.current.onerror = (error) => {
        setIsProcessing(false);
        reject(error);
      };

      workerRef.current.postMessage(data);
    });
  }, []);

  return [process, isProcessing];
};

// Performance Observer Hook
export const usePerformanceObserver = (
  callback: (entries: PerformanceEntry[]) => void,
  options: PerformanceObserverInit
) => {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });

    observer.observe(options);

    return () => observer.disconnect();
  }, [callback, options]);
};