/**
 * Performance Optimization Hooks
 * 
 * Custom hooks for optimizing expensive computations and preventing unnecessary re-renders
 */

import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';

/**
 * Hook for memoizing expensive computations with dependencies
 * @param factory - Function that performs the expensive computation
 * @param deps - Dependency array
 * @param debugName - Optional name for debugging
 */
export function useMemoizedComputation<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const result = useMemo(factory, deps);
  
  if (debugName && import.meta.env.MODE === 'development') {
    console.debug(`[useMemoizedComputation] ${debugName} computed`);
  }
  
  return result;
}

/**
 * Hook for memoizing event handlers to prevent unnecessary re-renders
 * @param handler - Event handler function
 * @param deps - Dependency array
 * @param debugName - Optional name for debugging
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  handler: T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const callback = useCallback(handler, deps);
  
  if (debugName && import.meta.env.MODE === 'development') {
    console.debug(`[useMemoizedCallback] ${debugName} created`);
  }
  
  return callback as T;
}

/**
 * Hook for debouncing expensive operations
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @param debugName - Optional name for debugging
 */
export function useDebouncedValue<T>(
  value: T,
  delay: number,
  debugName?: string
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      if (debugName && import.meta.env.MODE === 'development') {
        console.debug(`[useDebouncedValue] ${debugName} updated`);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, debugName]);

  return debouncedValue;
}

/**
 * Hook for throttling expensive operations
 * @param value - Value to throttle
 * @param delay - Delay in milliseconds
 * @param debugName - Optional name for debugging
 */
export function useThrottledValue<T>(
  value: T,
  delay: number,
  debugName?: string
): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
      if (debugName && import.meta.env.MODE === 'development') {
        console.debug(`[useThrottledValue] ${debugName} updated immediately`);
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
        if (debugName && import.meta.env.MODE === 'development') {
          console.debug(`[useThrottledValue] ${debugName} updated after delay`);
        }
      }, delay - timeSinceLastExecution);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, debugName]);

  return throttledValue;
}

/**
 * Hook for virtualizing large lists to improve performance
 * @param items - Array of items to virtualize
 * @param itemHeight - Height of each item in pixels
 * @param containerHeight - Height of the container in pixels
 * @param overscan - Number of items to render outside viewport
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, 0 - overscan);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
    
    const visibleItems = items.slice(startIndex, endIndex + 1);
    const totalHeight = items.length * itemHeight;
    const offsetY = startIndex * itemHeight;

    return {
      visibleItems,
      totalHeight,
      offsetY,
      startIndex,
      endIndex
    };
  }, [items, itemHeight, containerHeight, overscan]);
}

/**
 * Hook for caching expensive computations with TTL
 * @param factory - Function that performs the expensive computation
 * @param deps - Dependency array
 * @param ttl - Time to live in milliseconds
 */
export function useCachedComputation<T>(
  factory: () => T,
  deps: React.DependencyList,
  ttl: number = 5000
): T {
  const cacheRef = useRef<{ value: T; timestamp: number } | null>(null);

  return useMemo(() => {
    const now = Date.now();
    const isCacheValid = cacheRef.current && (now - cacheRef.current.timestamp) < ttl;

    if (isCacheValid) {
      return cacheRef.current!.value;
    }

    const value = factory();
    cacheRef.current = { value, timestamp: now };
    return value;
  }, deps);
}

/**
 * Hook for performance monitoring
 * @param name - Name of the component or operation
 */
export function usePerformanceMonitor(name: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (import.meta.env.MODE === 'development') {
      console.debug(`[PerformanceMonitor] ${name} render #${renderCount.current}, time since last: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
    timeSinceLastRender: Date.now() - lastRenderTime.current
  };
}

/**
 * Hook for lazy loading components
 * @param importFunc - Function that imports the component
 * @param fallback - Optional fallback component
 */
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    importFunc()
      .then(module => {
        setComponent(module.default);
        setLoading(false);
      })
      .catch(err => {
        setError(err as Error);
        setLoading(false);
      });
  }, [importFunc]);

  const LazyComponent = useMemo(() => {
    if (loading && fallback) return fallback;
    if (error) return () => <div>Error loading component</div>;
    if (!Component) return () => null;
    return Component;
  }, [Component, loading, error, fallback]);

  return { LazyComponent, loading, error };
}
