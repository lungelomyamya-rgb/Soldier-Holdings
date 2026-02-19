/**
 * Logging Integration Component
 *
 * Provides logging context and initializes monitoring system
 */

import React, { useEffect, createContext, useContext, ReactNode } from 'react';
import { logger, CorrelationContext } from '../utils/logger';
import { monitoring } from '../utils/monitoring';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import { LoggingContextType, LoggingProviderProps, LoggingErrorBoundaryProps, LoggingErrorBoundaryState } from '../types/index';
import styles from '../styles/LoggingErrorBoundary.module.css';

const LoggingContext = createContext<LoggingContextType | null>(null);

export const LoggingProvider: React.FC<LoggingProviderProps> = ({ children, userId }) => {
  const [correlationContext, setCorrelationContext] = React.useState<CorrelationContext>(() => {
    const context: CorrelationContext = {
      correlationId: logger.generateCorrelationId(),
      sessionId: getSessionId(),
      userId,
      traceId: generateTraceId(),
    };

    // Set correlation context for logger
    logger.setCorrelationContext(context);

    return context;
  });

  // Get or generate session ID
  function getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  // Generate trace ID
  function generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize monitoring system
  useEffect(() => {
    // Update logger configuration
    logger.setCorrelationContext(correlationContext);

    // Initialize monitoring
    monitoring.initialize(correlationContext);

    // Log application startup
    logger.info('Application started', {
      correlationId: correlationContext.correlationId,
      sessionId: correlationContext.sessionId,
      userId: correlationContext.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Set up page unload logging
    const handlePageUnload = () => {
      logger.info('Application unloading', {
        correlationId: correlationContext.correlationId,
        sessionId: correlationContext.sessionId,
      });
    };

    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
      logger.info('Logging provider unmounted', {
        correlationId: correlationContext.correlationId,
      });
    };
  }, [correlationContext]);

  // Update correlation context
  const updateCorrelationContext = React.useCallback(
    (context: Partial<CorrelationContext>) => {
      const newContext = {
        ...correlationContext,
        ...context,
        correlationId: context.correlationId || correlationContext.correlationId,
      };
      setCorrelationContext(newContext);
      logger.setCorrelationContext(newContext);
      monitoring.updateCorrelationContext(newContext);
    },
    [correlationContext]
  );

  // Logging methods
  const logDebug = React.useCallback((message: string, metadata?: Record<string, unknown>) => {
    logger.debug(message, metadata);
  }, []);

  const logInfo = React.useCallback((message: string, metadata?: Record<string, unknown>) => {
    logger.info(message, metadata);
  }, []);

  const logWarn = React.useCallback((message: string, metadata?: Record<string, unknown>) => {
    logger.warn(message, metadata);
  }, []);

  const logError = React.useCallback(
    (message: string, error?: Error, metadata?: Record<string, unknown>) => {
      logger.error(message, error, metadata);
    },
    []
  );

  const logUserAction = React.useCallback((action: string, metadata?: Record<string, unknown>) => {
    monitoring.trackUserAction(action, metadata);
    logger.userAction(action, metadata);
  }, []);

  const contextValue: LoggingContextType = React.useMemo(
    () => ({
      correlationId: correlationContext.correlationId,
      userId: correlationContext.userId,
      sessionId: correlationContext.sessionId,
      logDebug,
      logInfo,
      logWarn,
      logError,
      logUserAction,
      updateCorrelationContext,
    }),
    [
      correlationContext,
      logDebug,
      logInfo,
      logWarn,
      logError,
      logUserAction,
      updateCorrelationContext,
    ]
  );

  return <LoggingContext.Provider value={contextValue}>{children}</LoggingContext.Provider>;
};

/**
 * Hook to access logging functionality
 */
export const useLogging = (): LoggingContextType => {
  const context = useContext(LoggingContext);
  if (!context) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return context;
};

/**
 * Higher-order component for automatic logging
 */
export function withLogging<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => {
    const { logInfo } = useLogging();
    const name = componentName || Component.displayName || Component.name || 'Unknown';

    // Log component lifecycle
    useEffect(() => {
      logInfo(`Component mounted: ${name}`, { component: name });

      return () => {
        logInfo(`Component unmounted: ${name}`, { component: name });
      };
    }, [name, logInfo]);

    return <Component {...(props as P)} ref={ref} />;
  });

  WrappedComponent.displayName = `withLogging(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Error boundary with logging
 */

export class LoggingErrorBoundary extends React.Component<
  LoggingErrorBoundaryProps,
  LoggingErrorBoundaryState
> {
  constructor(props: LoggingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LoggingErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with full context
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      timestamp: new Date().toISOString(),
    });

    // Track error in monitoring
    monitoring.trackError({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      line: 0,
      column: 0,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      componentStack: errorInfo.componentStack || undefined,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <Box className={styles.errorContainer}>
          <Flex className={styles.errorContent} direction="column">
            <Typography variant="h2" className={styles.errorTitle}>
              Something went wrong
            </Typography>

            <Box className={styles.errorDetails}>
              <Typography variant="subtitle2" className={styles.errorSummary}>
                Error details
              </Typography>
              <Typography variant="body2" className={styles.errorStack} component="pre">
                {this.state.error?.stack}
              </Typography>
            </Box>

            <button onClick={this.resetError} className={styles.errorButton}>
              <Typography variant="body2">
                Try again
              </Typography>
            </button>
          </Flex>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default LoggingProvider;
