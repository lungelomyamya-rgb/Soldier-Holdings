/**
 * Monitoring System
 * 
 * Performance monitoring, error tracking, and metrics collection
 */

import { logger, CorrelationContext } from './logger';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  tags?: Record<string, string | number>;
}

export interface ErrorMetric {
  message: string;
  stack?: string;
  url: string;
  line: number;
  column: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  componentStack?: string;
}

export interface UserMetric {
  action: string;
  component?: string;
  duration?: number;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface SystemMetric {
  memoryUsage?: number;
  memoryLimit?: number;
  connectionType?: string;
  onlineStatus: boolean;
  pageVisibility: boolean;
  timestamp: number;
}

class MonitoringSystem {
  private performanceMetrics: PerformanceMetric[] = [];
  private errorMetrics: ErrorMetric[] = [];
  private userMetrics: UserMetric[] = [];
  private systemMetrics: SystemMetric[] = [];
  private isInitialized = false;
  private correlationContext: CorrelationContext | null = null;

  /**
   * Initialize the monitoring system
   */
  initialize(correlationContext?: CorrelationContext): void {
    if (this.isInitialized) return;

    this.correlationContext = correlationContext || this.generateDefaultContext();
    
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.setupUserInteractionTracking();
    this.setupSystemMonitoring();
    
    this.isInitialized = true;
    logger.info('Monitoring system initialized', { correlationId: this.correlationContext.correlationId });
  }

  /**
   * Generate default correlation context
   */
  private generateDefaultContext(): CorrelationContext {
    return {
      correlationId: logger.generateCorrelationId(),
      sessionId: this.getSessionId(),
      traceId: this.generateTraceId(),
    };
  }

  /**
   * Get or generate session ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate trace ID
   */
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup global error handling
   */
  private setupErrorHandling(): void {
    // Unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        userId: this.correlationContext?.userId,
        sessionId: this.correlationContext?.sessionId,
        correlationId: this.correlationContext?.correlationId,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        line: 0,
        column: 0,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        userId: this.correlationContext?.userId,
        sessionId: this.correlationContext?.sessionId,
        correlationId: this.correlationContext?.correlationId,
      });
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor page load performance
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.collectPageLoadMetrics();
        }, 0);
      });
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'longtask') {
              this.trackPerformance('long_task', entry.duration, {
                startTime: entry.startTime,
                name: entry.name,
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        logger.warn('Long task monitoring not supported', { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  /**
   * Collect page load metrics
   */
  private collectPageLoadMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.trackPerformance('page_load', navigation.loadEventEnd - navigation.fetchStart, {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        domProcessing: navigation.domComplete - navigation.domInteractive,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        firstPaint: this.getFirstPaint() || 0,
        firstContentfulPaint: this.getFirstContentfulPaint() || 0,
      });
    }
  }

  /**
   * Get first paint time
   */
  private getFirstPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint?.startTime;
  }

  /**
   * Get first contentful paint time
   */
  private getFirstContentfulPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp?.startTime;
  }

  /**
   * Setup user interaction tracking
   */
  private setupUserInteractionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackUserAction('click', {
        element: target.tagName,
        id: target.id,
        className: target.className,
        text: target.textContent?.slice(0, 50),
      });
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const target = event.target as HTMLFormElement;
      this.trackUserAction('form_submit', {
        formId: target.id,
        formName: target.name,
        action: target.action,
      });
    });
  }

  /**
   * Setup system monitoring
   */
  private setupSystemMonitoring(): void {
    // Monitor system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Monitor page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackUserAction('page_visibility_change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      });
    });

    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.trackUserAction('connection_change', { online: true });
    });

    window.addEventListener('offline', () => {
      this.trackUserAction('connection_change', { online: false });
    });
  }

  /**
   * Collect system metrics
   */
  private collectSystemMetrics(): void {
    const metric: SystemMetric = {
      memoryUsage: this.getMemoryUsage(),
      memoryLimit: this.getMemoryLimit(),
      connectionType: this.getConnectionType(),
      onlineStatus: navigator.onLine,
      pageVisibility: !document.hidden,
      timestamp: Date.now(),
    };

    this.systemMetrics.push(metric);
    logger.debug('System metrics collected', { metric });

    // Keep only last 100 system metrics
    if (this.systemMetrics.length > 100) {
      this.systemMetrics = this.systemMetrics.slice(-100);
    }
  }

  /**
   * Get memory usage
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      return memory?.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Get memory limit
   */
  private getMemoryLimit(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { jsHeapSizeLimit: number } }).memory;
      return memory?.jsHeapSizeLimit;
    }
    return undefined;
  }

  /**
   * Get connection type
   */
  private getConnectionType(): string | undefined {
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string; type?: string } }).connection;
      return connection?.effectiveType || connection?.type;
    }
    return undefined;
  }

  /**
   * Track performance metrics
   */
  trackPerformance(name: string, value: number, tags?: Record<string, string | number>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit: 'ms',
      timestamp: Date.now(),
      tags: tags ? Object.fromEntries(
        Object.entries(tags).map(([k, v]) => [k, String(v)])
      ) : undefined,
    };

    this.performanceMetrics.push(metric);
    logger.performance(name, value, tags);

    // Keep only last 1000 performance metrics
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }
  }

  /**
   * Track errors
   */
  trackError(error: ErrorMetric): void {
    this.errorMetrics.push(error);
    logger.error('Error tracked', new Error(error.message), {
      url: error.url,
      line: error.line,
      column: error.column,
      userAgent: error.userAgent,
    });

    // Keep only last 500 error metrics
    if (this.errorMetrics.length > 500) {
      this.errorMetrics = this.errorMetrics.slice(-500);
    }
  }

  /**
   * Track user actions
   */
  trackUserAction(action: string, metadata?: Record<string, unknown>): void {
    const metric: UserMetric = {
      action,
      timestamp: Date.now(),
      userId: this.correlationContext?.userId,
      sessionId: this.correlationContext?.sessionId,
      metadata,
    };

    this.userMetrics.push(metric);
    logger.userAction(action, metadata);

    // Keep only last 1000 user metrics
    if (this.userMetrics.length > 1000) {
      this.userMetrics = this.userMetrics.slice(-1000);
    }
  }

  /**
   * Track component performance
   */
  trackComponentPerformance(componentName: string, renderTime: number, metadata?: Record<string, unknown>): void {
    this.trackPerformance(`component_render_${componentName}`, renderTime, {
      component: componentName,
      ...metadata,
    });
  }

  /**
   * Track API performance
   */
  trackApiPerformance(url: string, method: string, duration: number, statusCode: number): void {
    this.trackPerformance(`api_${method.toLowerCase()}`, duration, {
      url,
      method,
      statusCode: String(statusCode),
    });

    logger.apiRequest(method, url, statusCode, duration, {
      category: 'performance_tracking',
    });
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(): {
    performance: PerformanceMetric[];
    errors: ErrorMetric[];
    userActions: UserMetric[];
    system: SystemMetric[];
  } {
    return {
      performance: [...this.performanceMetrics],
      errors: [...this.errorMetrics],
      userActions: [...this.userMetrics],
      system: [...this.systemMetrics],
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.performanceMetrics = [];
    this.errorMetrics = [];
    this.userMetrics = [];
    this.systemMetrics = [];
    logger.info('All metrics cleared');
  }

  /**
   * Update correlation context
   */
  updateCorrelationContext(context: Partial<CorrelationContext>): void {
    if (!this.correlationContext) {
      this.correlationContext = this.generateDefaultContext();
    }
    
    this.correlationContext = { ...this.correlationContext, ...context };
    logger.setCorrelationContext(this.correlationContext);
  }

  /**
   * Get current correlation context
   */
  getCorrelationContext(): CorrelationContext | null {
    return this.correlationContext;
  }
}

// Export singleton instance
export const monitoring = new MonitoringSystem();

export default monitoring;
