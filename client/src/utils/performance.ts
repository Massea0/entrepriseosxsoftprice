// 🚀 PHASE 4 - OPTIMISATIONS PERFORMANCE
// Utilitaires pour le monitoring et l'optimisation des performances

import React, { useEffect, useRef, useCallback, useState } from 'react';

// ===============================
// PERFORMANCE MONITORING
// ===============================

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  domContentLoaded?: number;
  loadComplete?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as unknown;
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: PerformanceEntry) => {
            const fidEntry = entry as PerformanceEventTiming;
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          const entries = entryList.getEntries();
          entries.forEach((entry: PerformanceEntry) => {
            const clsEntry = entry as LayoutShift;
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
            }
          });
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // Navigation Timing
    this.measureNavigationTiming();
  }

  private measureNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navEntries = performance.getEntriesByType('navigation');
          if (navEntries.length > 0) {
            const navTiming = navEntries[0] as PerformanceNavigationTiming;
            this.metrics.fcp = navTiming.loadEventStart - navTiming.fetchStart;
            this.metrics.ttfb = navTiming.responseStart - navTiming.fetchStart;
            this.metrics.domContentLoaded = navTiming.domContentLoadedEventEnd - navTiming.fetchStart;
            this.metrics.loadComplete = navTiming.loadEventEnd - navTiming.fetchStart;
          }
        }, 0);
      });
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  logMetrics() {
    console.group('🚀 Performance Metrics');
    console.log('LCP (Largest Contentful Paint):', this.metrics.lcp?.toFixed(2), 'ms');
    console.log('FID (First Input Delay):', this.metrics.fid?.toFixed(2), 'ms');
    console.log('CLS (Cumulative Layout Shift):', this.metrics.cls?.toFixed(4));
    console.log('FCP (First Contentful Paint):', this.metrics.fcp?.toFixed(2), 'ms');
    console.log('TTFB (Time to First Byte):', this.metrics.ttfb?.toFixed(2), 'ms');
    console.groupEnd();
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

export const performanceMonitor = new PerformanceMonitor();

// ===============================
// REACT HOOKS POUR PERFORMANCE
// ===============================

/**
 * Hook pour débouncer les valeurs
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook pour throttler les fonctions
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        return func(...args);
      } else {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          func(...args);
        }, delay - (now - lastCallRef.current));
      }
    }) as T,
    [func, delay]
  );
}

/**
 * Hook pour l'intersection observer optimisé
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
}

// ===============================
// UTILITAIRES DE CACHE
// ===============================

export class MemoryCache<T> {
  private cache = new Map<string, { value: T; timestamp: number; ttl: number }>();

  set(key: string, value: T, ttlMs: number = 300000): void { // 5 min default
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// ===============================
// LAZY LOADING UTILITIES
// ===============================

export function createLazyComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn);

  return function LazyWrapper(props: unknown) {
    return React.createElement(
      React.Suspense,
      { fallback: fallback ? React.createElement(fallback) : React.createElement('div', null, 'Loading...') },
      React.createElement(LazyComponent, props)
    );
  };
}

// ===============================
// PERFORMANCE DEVTOOLS
// ===============================

export function logRenderTimes(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
              descriptor.value = function (...args: unknown[]) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`${componentName}.${propertyKey} took ${end - start} milliseconds`);
        return result;
      };
    };
  }
  return () => {};
}

// ===============================
// EXPORT GLOBAL MONITOR
// ===============================

// Démarrer le monitoring automatiquement
if (typeof window !== 'undefined') {
  // Log les métriques après le chargement complet
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics();
    }, 3000);
  });
}