// 📊 Performance Monitoring Service
// GRAND LEAP TODO - Performance Metrics Implementation

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
}

interface PerformanceReport {
  cls: number;    // Cumulative Layout Shift
  inp: number;    // Interaction to Next Paint (remplace FID)
  fcp: number;    // First Contentful Paint
  lcp: number;    // Largest Contentful Paint
  ttfb: number;   // Time to First Byte
  timestamp: number;
  url: string;
  userId?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private report: Partial<PerformanceReport> = {};
  private userId?: string;
  private apiEndpoint = '/api/performance';

  constructor(userId?: string) {
    this.userId = userId;
    this.initializeWebVitals();
    this.setupCustomMetrics();
  }

  /**
   * 🔥 Initialisation des Web Vitals
   */
  private initializeWebVitals() {
    // Core Web Vitals (version moderne)
    onCLS(this.handleMetric('CLS'));
    onINP(this.handleMetric('INP'));  // Remplace FID
    onFCP(this.handleMetric('FCP'));
    onLCP(this.handleMetric('LCP'));
    onTTFB(this.handleMetric('TTFB'));

    console.log('📊 Performance monitoring initialized');
  }

  /**
   * 📈 Gestionnaire de métriques
   */
  private handleMetric = (name: string) => (metric: any) => {
    const performanceMetric: PerformanceMetric = {
      name,
      value: metric.value,
      id: metric.id,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId
    };

    this.metrics.push(performanceMetric);
    this.report[name.toLowerCase() as keyof PerformanceReport] = metric.value;

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}:`, metric.value);
    }

    // Envoyer immédiatement si critique
    if (this.isCriticalMetric(name, metric.value)) {
      this.sendMetricImmediate(performanceMetric);
    }

    // Auto-rapport toutes les 30 secondes
    this.scheduleReport();
  };

  /**
   * ⚠️ Détection des métriques critiques
   */
  private isCriticalMetric(name: string, value: number): boolean {
    const thresholds = {
      CLS: 0.25,   // > 0.25 = poor
      FID: 300,    // > 300ms = poor
      LCP: 4000,   // > 4s = poor
      FCP: 3000,   // > 3s = poor
      TTFB: 1800   // > 1.8s = poor
    };

    return value > (thresholds[name as keyof typeof thresholds] || Infinity);
  }

  /**
   * 📤 Envoi immédiat pour métriques critiques
   */
  private async sendMetricImmediate(metric: PerformanceMetric) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'critical',
          metric,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send critical metric:', error);
    }
  }

  /**
   * ⏰ Programmation du rapport
   */
  private scheduleReport() {
    // Débounce - éviter les envois trop fréquents
    clearTimeout((this as any).reportTimeout);
    (this as any).reportTimeout = setTimeout(() => {
      this.sendReport();
    }, 30000);
  }

  /**
   * 📊 Métriques personnalisées
   */
  private setupCustomMetrics() {
    // Temps de chargement des chunks
    this.trackChunkLoading();
    
    // Temps de réponse API
    this.trackAPIPerformance();
    
    // Erreurs JavaScript
    this.trackJavaScriptErrors();
    
    // Utilisation mémoire
    this.trackMemoryUsage();
  }

  /**
   * 📦 Tracking du chargement des chunks
   */
  private trackChunkLoading() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('chunk') || entry.name.includes('.js')) {
          this.recordCustomMetric('ChunkLoad', entry.duration, {
            chunkName: entry.name,
            size: (entry as any).transferSize
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * 🌐 Tracking des performances API
   */
  private trackAPIPerformance() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || 'unknown';
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        if (url.includes('/api/')) {
          this.recordCustomMetric('APIResponse', duration, {
            endpoint: url,
            status: response.status,
            method: args[1]?.method || 'GET'
          });
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.recordCustomMetric('APIError', duration, {
          endpoint: url,
          error: (error as Error).message
        });
        throw error;
      }
    };
  }

  /**
   * 🚨 Tracking des erreurs JavaScript
   */
  private trackJavaScriptErrors() {
    window.addEventListener('error', (event) => {
      this.recordCustomMetric('JSError', 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordCustomMetric('UnhandledPromise', 1, {
        reason: event.reason?.toString()
      });
    });
  }

  /**
   * 🧠 Tracking de l'utilisation mémoire
   */
  private trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordCustomMetric('MemoryUsage', memory.usedJSHeapSize, {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 60000); // Chaque minute
    }
  }

  /**
   * 📝 Enregistrement de métrique personnalisée
   */
  recordCustomMetric(name: string, value: number, metadata?: any) {
    const metric: PerformanceMetric = {
      name,
      value,
      id: `custom-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId,
      ...metadata
    };

    this.metrics.push(metric);
  }

  /**
   * 📨 Envoi du rapport complet
   */
  private async sendReport() {
    if (this.metrics.length === 0) return;

    const report: PerformanceReport = {
      cls: this.report.cls || 0,
      inp: this.report.inp || 0,
      fcp: this.report.fcp || 0,
      lcp: this.report.lcp || 0,
      ttfb: this.report.ttfb || 0,
      timestamp: Date.now(),
      url: window.location.href,
      userId: this.userId
    };

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'report',
          report,
          metrics: this.metrics,
          deviceInfo: this.getDeviceInfo()
        })
      });

      // Nettoyer après envoi
      this.metrics = [];
      
      console.log('📊 Performance report sent');
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }

  /**
   * 📱 Informations sur l'appareil
   */
  private getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: devicePixelRatio
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null
    };
  }

  /**
   * 📊 Métriques en temps réel
   */
  getLiveMetrics() {
    return {
      report: this.report,
      recentMetrics: this.metrics.slice(-10),
      deviceInfo: this.getDeviceInfo()
    };
  }

  /**
   * 🎯 Score de performance global
   */
  getPerformanceScore(): number {
    const { cls = 0, inp = 0, fcp = 0, lcp = 0, ttfb = 0 } = this.report;
    
    // Calcul du score selon les seuils Google (Web Vitals 2024)
    let score = 100;
    
    if (cls > 0.1) score -= 20;
    if (cls > 0.25) score -= 10;
    
    if (inp > 200) score -= 20;
    if (inp > 500) score -= 10;
    
    if (fcp > 1800) score -= 15;
    if (fcp > 3000) score -= 10;
    
    if (lcp > 2500) score -= 20;
    if (lcp > 4000) score -= 15;
    
    if (ttfb > 800) score -= 15;
    if (ttfb > 1800) score -= 10;
    
    return Math.max(0, score);
  }
}

// Export pour utilisation globale
export { PerformanceMonitor };

// Auto-initialisation si dans le navigateur
if (typeof window !== 'undefined') {
  // Attendre que l'app soit prête
  window.addEventListener('load', () => {
    const userId = localStorage.getItem('userId');
    (window as any).performanceMonitor = new PerformanceMonitor(userId || undefined);
  });
}
