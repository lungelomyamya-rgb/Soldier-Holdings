/**
 * Structured Logging System
 * 
 * Comprehensive logging with levels, correlation IDs, and production observability
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration?: number;
    memoryUsage?: number;
    renderTime?: number;
  };
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  enableFile: boolean;
  remoteEndpoint?: string;
  maxRetries: number;
  batchSize: number;
  flushInterval: number;
  includeStackTrace: boolean;
  sanitizeData: boolean;
}

export interface CorrelationContext {
  correlationId: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  traceId?: string;
}

class Logger {
  private config: LoggerConfig;
  private correlationContext: CorrelationContext | null = null;
  private logBuffer: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: LoggerConfig) {
    this.config = config;
    this.setupFlushTimer();
  }

  /**
   * Set correlation context for all subsequent logs
   */
  setCorrelationContext(context: CorrelationContext): void {
    this.correlationContext = context;
  }

  /**
   * Clear correlation context
   */
  clearCorrelationContext(): void {
    this.correlationContext = null;
  }

  /**
   * Generate a new correlation ID
   */
  generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a log entry with correlation context
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata: this.config.sanitizeData ? this.sanitizeMetadata(metadata) : metadata,
    };

    // Add correlation context
    if (this.correlationContext) {
      entry.correlationId = this.correlationContext.correlationId;
      entry.userId = this.correlationContext.userId;
      entry.sessionId = this.correlationContext.sessionId;
    }

    // Add error information
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.config.includeStackTrace ? error.stack : undefined,
      };
    }

    return entry;
  }

  /**
   * Sanitize metadata to remove sensitive information
   */
  private sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!metadata) return undefined;

    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'creditCard', 'ssn'];
    const sanitized = { ...metadata };

    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Log a message at the specified level
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>, error?: Error): void {
    if (level < this.config.level) return;

    const entry = this.createLogEntry(level, message, metadata, error);

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Buffer for remote/file logging
    if (this.config.enableRemote || this.config.enableFile) {
      this.logBuffer.push(entry);
      
      if (this.logBuffer.length >= this.config.batchSize) {
        this.flushLogs();
      }
    }
  }

  /**
   * Log to console with appropriate formatting
   */
  private logToConsole(entry: LogEntry): void {
    // eslint-disable-next-line no-console
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    const levelColors = ['#6B7280', '#3B82F6', '#F59E0B', '#EF4444', '#DC2626'];
    
    const color = levelColors[entry.level];
    const levelName = levelNames[entry.level];
    const correlationId = entry.correlationId ? ` [${entry.correlationId}]` : '';
    
    const style = `color: ${color}; font-weight: bold;`;
    const message = `%c[${levelName}]${correlationId} ${entry.timestamp} - ${entry.message}`;
    
    // Use appropriate console method based on level
    switch (entry.level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(message, style);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(message, style);
        break;
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(message, style);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        // eslint-disable-next-line no-console
        console.error(message, style);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(message, style);
    }
    
    if (entry.metadata) {
      // eslint-disable-next-line no-console
      console.log('Metadata:', entry.metadata);
    }
    
    if (entry.error) {
      // eslint-disable-next-line no-console
      console.error('Error details:', entry.error);
    }
    
    if (entry.performance) {
      // eslint-disable-next-line no-console
      console.info('Performance:', entry.performance);
    }
  }

  /**
   * Setup automatic flush timer
   */
  private setupFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flushLogs();
      }
    }, this.config.flushInterval);
  }

  /**
   * Flush buffered logs to remote/file storage
   */
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    try {
      if (this.config.enableRemote && this.config.remoteEndpoint) {
        await this.sendLogsToRemote(logsToFlush);
      }

      if (this.config.enableFile) {
        await this.writeLogsToFile(logsToFlush);
      }
    } catch (error) {
      // Use logger.warn instead of console.error to avoid recursion
      if (this.config.enableConsole) {
        // eslint-disable-next-line no-console
        console.warn('Failed to flush logs:', error);
      }
      // Re-add failed logs to buffer for retry
      this.logBuffer.unshift(...logsToFlush);
    }
  }

  /**
   * Send logs to remote endpoint
   */
  private async sendLogsToRemote(logs: LogEntry[]): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    const payload = {
      logs,
      source: 'soldier-holdings-app',
      version: import.meta.env.VITE_REACT_APP_VERSION || '1.0.0',
      environment: import.meta.env.MODE || 'development',
    };

    const response = await fetch(this.config.remoteEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Remote logging failed: ${response.status}`);
    }
  }

  /**
   * Write logs to file (in development)
   */
  private async writeLogsToFile(logs: LogEntry[]): Promise<void> {
    // In a real implementation, this would write to a file
    // For browser environment, we'll use localStorage as fallback
    try {
      const existingLogs = localStorage.getItem('app_logs') || '[]';
      const allLogs = JSON.parse(existingLogs);
      allLogs.push(...logs);
      
      // Keep only last 1000 logs to prevent storage overflow
      const trimmedLogs = allLogs.slice(-1000);
      localStorage.setItem('app_logs', JSON.stringify(trimmedLogs));
    } catch (error) {
      // Use console.warn to avoid recursion with logger
      // eslint-disable-next-line no-console
      console.warn('Failed to write logs to localStorage:', error);
    }
  }

  /**
   * Public logging methods
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, metadata, error);
  }

  fatal(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, metadata, error);
  }

  /**
   * Performance logging
   */
  performance(
    operation: string,
    duration: number,
    metadata?: Record<string, unknown>
  ): void {
    const performanceData = {
      operation,
      duration,
      memoryUsage: this.getMemoryUsage(),
      timestamp: Date.now(),
    };

    this.log(LogLevel.INFO, `Performance: ${operation}`, {
      ...metadata,
      performance: performanceData,
    });
  }

  /**
   * Get current memory usage (if available)
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      return memory?.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * User action logging
   */
  userAction(action: string, metadata?: Record<string, unknown>): void {
    this.info(`User Action: ${action}`, {
      ...metadata,
      category: 'user_action',
    });
  }

  /**
   * Component lifecycle logging
   */
  componentLifecycle(
    component: string,
    lifecycle: 'mount' | 'unmount' | 'update',
    metadata?: Record<string, unknown>
  ): void {
    this.debug(`Component ${lifecycle}: ${component}`, {
      ...metadata,
      category: 'component_lifecycle',
      component,
      lifecycle,
    });
  }

  /**
   * API request logging
   */
  apiRequest(
    method: string,
    url: string,
    statusCode?: number,
    duration?: number,
    metadata?: Record<string, unknown>
  ): void {
    const level = statusCode && statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    
    this.log(level, `API ${method} ${url}`, {
      ...metadata,
      category: 'api_request',
      method,
      url,
      statusCode,
      duration,
    });
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Flush any remaining logs
    this.flushLogs();
  }
}

// Default logger instance
export const logger = new Logger({
  level: import.meta.env.MODE === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: import.meta.env.MODE === 'production',
  enableFile: import.meta.env.MODE === 'development',
  remoteEndpoint: import.meta.env.VITE_REACT_APP_LOGGING_ENDPOINT,
  maxRetries: 3,
  batchSize: 10,
  flushInterval: 5000,
  includeStackTrace: import.meta.env.MODE === 'development',
  sanitizeData: true,
});

export default logger;
