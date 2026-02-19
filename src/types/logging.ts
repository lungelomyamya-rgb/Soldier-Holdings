/**
 * Logging Types
 *
 * Type definitions for logging functionality and context
 */

export interface CorrelationContext {
  correlationId: string;
  sessionId?: string;
  userId?: string;
  traceId?: string;
}

export interface LoggingContextType {
  correlationId: string;
  userId?: string;
  sessionId?: string;
  logDebug: (message: string, metadata?: Record<string, unknown>) => void;
  logInfo: (message: string, metadata?: Record<string, unknown>) => void;
  logWarn: (message: string, metadata?: Record<string, unknown>) => void;
  logError: (message: string, error?: Error, metadata?: Record<string, unknown>) => void;
  logUserAction: (action: string, metadata?: Record<string, unknown>) => void;
  updateCorrelationContext: (context: Partial<CorrelationContext>) => void;
}
