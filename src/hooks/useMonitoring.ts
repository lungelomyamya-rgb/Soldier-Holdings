/**
 * Performance Monitoring Hooks
 * 
 * React hooks for component performance monitoring and logging
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { monitoring } from '../utils/monitoring';
import { logger } from '../utils/logger';

/**
 * Hook for monitoring component render performance
 */
export function useComponentPerformance(componentName: string, metadata?: Record<string, unknown>) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const mountTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const renderTime = now - lastRenderTime.current;
    
    // Track component performance
    monitoring.trackComponentPerformance(componentName, renderTime, {
      renderCount: renderCount.current,
      ...metadata,
    });

    // Log component lifecycle
    logger.componentLifecycle(componentName, 'update', {
      renderCount: renderCount.current,
      renderTime,
      ...metadata,
    });

    lastRenderTime.current = now;
  });

  // Track mount
  useEffect(() => {
    const mountDuration = Date.now() - mountTime.current;
    
    monitoring.trackComponentPerformance(`${componentName}_mount`, mountDuration, {
      ...metadata,
    });

    logger.componentLifecycle(componentName, 'mount', {
      mountDuration,
      ...metadata,
    });

    // Track unmount
    return () => {
      const currentMountTime = mountTime.current;
      monitoring.trackComponentPerformance(`${componentName}_unmount`, Date.now() - currentMountTime, {
        ...metadata,
      });

      logger.componentLifecycle(componentName, 'unmount', {
        totalRenders: renderCount.current,
        lifespan: Date.now() - currentMountTime,
        ...metadata,
      });
    };
  }, [componentName, metadata]);

  return {
    renderCount: renderCount.current,
    averageRenderTime: useMemo(() => {
      // This would be calculated from stored metrics in a real implementation
      return 0;
    }, []),
  };
}

/**
 * Hook for monitoring async operations
 */
export function useAsyncPerformance<T>(
  operation: () => Promise<T>,
  operationName: string,
  dependencies: React.DependencyList = []
) {
  const startTime = useRef<number>();
  const operationCount = useRef(0);

  const executeOperation = useCallback(async (): Promise<T> => {
    operationCount.current += 1;
    startTime.current = Date.now();
    
    const operationId = `${operationName}_${operationCount.current}`;
    
    logger.debug(`Starting async operation: ${operationName}`, {
      operationId,
      operationCount: operationCount.current,
    });

    try {
      const result = await operation();
      const duration = Date.now() - (startTime.current || Date.now());
      
      monitoring.trackPerformance(operationName, duration, {
        operationId,
        success: 'true',
        operationCount: operationCount.current,
      });

      logger.info(`Async operation completed: ${operationName}`, {
        operationId,
        duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - (startTime.current || Date.now());
      
      monitoring.trackPerformance(operationName, duration, {
        operationId,
        success: 'false',
        error: error instanceof Error ? error.message : 'Unknown error',
        operationCount: operationCount.current,
      });

      logger.error(`Async operation failed: ${operationName}`, error instanceof Error ? error : new Error('Unknown error'), {
        operationId,
        duration,
        success: false,
      });

      throw error;
    }
  }, [operation, operationName, ...dependencies]);

  return executeOperation;
}

/**
 * Hook for monitoring user interactions
 */
export function useUserInteraction() {
  const trackInteraction = useCallback((
    action: string,
    metadata?: Record<string, unknown>
  ) => {
    monitoring.trackUserAction(action, {
      timestamp: Date.now(),
      ...metadata,
    });

    logger.userAction(action, metadata);
  }, []);

  const trackClick = useCallback((
    element: string,
    metadata?: Record<string, unknown>
  ) => {
    trackInteraction('click', {
      element,
      ...metadata,
    });
  }, [trackInteraction]);

  const trackFormSubmit = useCallback((
    formName: string,
    metadata?: Record<string, unknown>
  ) => {
    trackInteraction('form_submit', {
      formName,
      ...metadata,
    });
  }, [trackInteraction]);

  const trackNavigation = useCallback((
    from: string,
    to: string,
    metadata?: Record<string, unknown>
  ) => {
    trackInteraction('navigation', {
      from,
      to,
      ...metadata,
    });
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackClick,
    trackFormSubmit,
    trackNavigation,
  };
}

/**
 * Hook for monitoring API calls
 */
export function useApiPerformance() {
  const trackApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    url: string,
    method: string = 'GET',
    metadata?: Record<string, unknown>
  ): Promise<T> => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.debug(`API call started: ${method} ${url}`, {
      requestId,
      method,
      url,
      ...metadata,
    });

    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;
      
      // Assume success if no error thrown (status code would be checked in actual implementation)
      const statusCode = 200;
      
      monitoring.trackApiPerformance(url, method, duration, statusCode);
      
      logger.apiRequest(method, url, statusCode, duration, {
        requestId,
        success: true,
        ...metadata,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const statusCode = error instanceof Response ? error.status : 500;
      
      monitoring.trackApiPerformance(url, method, duration, statusCode);
      
      logger.apiRequest(method, url, statusCode, duration, {
        requestId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        ...metadata,
      });

      throw error;
    }
  }, []);

  return {
    trackApiCall,
  };
}

/**
 * Hook for monitoring memory usage
 */
export function useMemoryMonitoring(intervalMs: number = 30000) {
  const memoryUsage = useRef<number>();
  const memoryLimit = useRef<number>();

  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        if (memory) {
          memoryUsage.current = memory.usedJSHeapSize;
          memoryLimit.current = memory.jsHeapSizeLimit;

          monitoring.trackPerformance('memory_usage', memory.usedJSHeapSize, {
            unit: 'bytes',
            limit: memory.jsHeapSizeLimit,
            percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
          });

          logger.debug('Memory usage updated', {
            usedJSHeapSize: memory.usedJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
          });
        }
      }
    };

    updateMemoryUsage();
    const intervalId = setInterval(updateMemoryUsage, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return {
    memoryUsage: memoryUsage.current,
    memoryLimit: memoryLimit.current,
    memoryPercentage: memoryUsage.current && memoryLimit.current 
      ? (memoryUsage.current / memoryLimit.current) * 100 
      : undefined,
  };
}

/**
 * Hook for monitoring page performance
 */
export function usePagePerformance() {
  const pageMetrics = useRef<{
    loadTime?: number;
    domContentLoaded?: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
  }>({});

  useEffect(() => {
    const collectPageMetrics = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          pageMetrics.current = {
            loadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          };

          // Get paint metrics
          const paintEntries = performance.getEntriesByType('paint');
          const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
          const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');

          if (firstPaint) {
            pageMetrics.current.firstPaint = firstPaint.startTime;
          }

          if (firstContentfulPaint) {
            pageMetrics.current.firstContentfulPaint = firstContentfulPaint.startTime;
          }

          // Track page load performance
          monitoring.trackPerformance('page_load', pageMetrics.current.loadTime || 0, {
            domContentLoaded: String(pageMetrics.current.domContentLoaded || 0),
            firstPaint: String(pageMetrics.current.firstPaint || 0),
            firstContentfulPaint: String(pageMetrics.current.firstContentfulPaint || 0),
          });

          logger.info('Page performance metrics collected', pageMetrics.current);
        }
      }
    };

    if (document.readyState === 'complete') {
      collectPageMetrics();
    } else {
      window.addEventListener('load', collectPageMetrics);
      return () => window.removeEventListener('load', collectPageMetrics);
    }
  }, []);

  return pageMetrics.current;
}

/**
 * Hook for custom performance tracking
 */
export function usePerformanceTracker() {
  const startTiming = useCallback((operationName: string) => {
    const startTime = Date.now();
    const operationId = `${operationName}_${startTime}_${Math.random().toString(36).substr(2, 9)}`;

    logger.debug(`Performance tracking started: ${operationName}`, {
      operationId,
      startTime,
    });

    return {
      operationId,
      endTiming: (metadata?: Record<string, unknown>) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        monitoring.trackPerformance(operationName, duration, {
          operationId,
          ...metadata,
        });

        logger.performance(operationName, duration, {
          operationId,
          ...metadata,
        });

        return {
          duration,
          startTime,
          endTime,
          operationId,
        };
      },
    };
  }, []);

  const trackTiming = useCallback((
    operationName: string,
    operation: () => void,
    metadata?: Record<string, unknown>
  ) => {
    const { endTiming } = startTiming(operationName);
    
    try {
      operation();
      return endTiming({ success: true, ...metadata });
    } catch (error) {
      return endTiming({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        ...metadata 
      });
    }
  }, [startTiming]);

  return {
    startTiming,
    trackTiming,
  };
}
