/**
 * Error Handler Service
 * 
 * Centralized error handling and user feedback system
 * Integrates with Sentry for error logging and provides consistent user notifications
 */

import * as Sentry from '@sentry/react';
import { IErrorHandlerService, ErrorSeverity, UserErrorOptions, UserMessageOptions, UserMessageAction } from '../interfaces/IErrorHandlerService';
import { config, isDevelopment, isProduction } from '../config';

export class ErrorHandlerService implements IErrorHandlerService {
  private userMessages: UserMessage[] = [];
  private messageListeners: ((messages: UserMessage[]) => void)[] = [];

  constructor() {
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
  }

  /**
   * Log error to monitoring systems
   */
  logError(error: Error, context: string, severity: ErrorSeverity = ErrorSeverity.MEDIUM): void {
    // Log to console for development if enabled
    if (config.errorHandling.logToConsole && isDevelopment) {
      console.group(`🚨 Error [${severity.toUpperCase()}] - ${context}`);
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }

    // Log to Sentry in production if enabled
    if (config.errorHandling.sentryEnabled && isProduction) {
      Sentry.withScope((scope) => {
        scope.setTag('context', context);
        scope.setTag('severity', severity);
        scope.setLevel(severity === ErrorSeverity.CRITICAL ? 'fatal' : 'error');
        
        // Add additional context
        scope.setContext('environment', {
          environment: config.environment,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        });

        Sentry.captureException(error);
      });
    }

    // Log to localStorage if enabled
    if (config.errorHandling.logToLocalStorage) {
      try {
        const errorLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          context,
          severity,
          message: error.message,
          stack: error.stack,
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        const updatedLogs = [...existingLogs, errorLog].slice(-config.errorHandling.maxLogEntries);
        localStorage.setItem('errorLogs', JSON.stringify(updatedLogs));
      } catch (logError) {
        console.warn('Failed to log error to localStorage:', logError);
      }
    }
  }

  /**
   * Show user-friendly error message
   */
  showUserError(message: string, options: UserErrorOptions = {} as UserErrorOptions): void {
    const userMessage: UserMessage = {
      id: this.generateMessageId(),
      type: 'error',
      message,
      title: options.title || 'Error',
      timestamp: new Date(),
      duration: options.duration ?? 5000,
      persistent: options.persistent ?? false,
      actions: options.actions ?? []
    };

    this.addUserMessage(userMessage);
  }

  /**
   * Show user success message
   */
  showUserSuccess(message: string, options: UserMessageOptions = {} as UserMessageOptions): void {
    const userMessage: UserMessage = {
      id: this.generateMessageId(),
      type: 'success',
      message,
      title: 'Success',
      timestamp: new Date(),
      duration: options.duration ?? 3000,
      persistent: options.persistent ?? false,
      actions: options.actions ?? []
    };

    this.addUserMessage(userMessage);
  }

  /**
   * Show user warning message
   */
  showUserWarning(message: string, options: UserMessageOptions = {} as UserMessageOptions): void {
    const userMessage: UserMessage = {
      id: this.generateMessageId(),
      type: 'warning',
      message,
      title: 'Warning',
      timestamp: new Date(),
      duration: options.duration ?? 4000,
      persistent: options.persistent ?? false,
      actions: options.actions ?? []
    };

    this.addUserMessage(userMessage);
  }

  /**
   * Show user info message
   */
  showUserInfo(message: string, options: UserMessageOptions = {} as UserMessageOptions): void {
    const userMessage: UserMessage = {
      id: this.generateMessageId(),
      type: 'info',
      message,
      title: 'Info',
      timestamp: new Date(),
      duration: options.duration ?? 3000,
      persistent: options.persistent ?? false,
      actions: options.actions ?? []
    };

    this.addUserMessage(userMessage);
  }

  /**
   * Clear all user messages
   */
  clearUserMessages(): void {
    this.userMessages = [];
    this.notifyListeners();
  }

  /**
   * Handle async operation with error catching
   */
  async handleAsync<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logError(error as Error, context);
      this.showUserError(
        'An unexpected error occurred. Please try again.',
        { title: 'Operation Failed' }
      );
      return fallback as T;
    }
  }

  /**
   * Handle synchronous operation with error catching
   */
  handleSync<T>(
    operation: () => T,
    context: string,
    fallback?: T
  ): T {
    try {
      return operation();
    } catch (error) {
      this.logError(error as Error, context);
      this.showUserError(
        'An unexpected error occurred. Please try again.',
        { title: 'Operation Failed' }
      );
      return fallback as T;
    }
  }

  /**
   * Subscribe to user message changes
   */
  onUserMessagesChange(listener: (messages: UserMessage[]) => void): () => void {
    this.messageListeners.push(listener);
    return () => {
      const index = this.messageListeners.indexOf(listener);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
    };
  }

  /**
   * Get current user messages
   */
  getUserMessages(): UserMessage[] {
    return [...this.userMessages];
  }

  // Private methods

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        new Error(event.reason),
        'Unhandled Promise Rejection',
        ErrorSeverity.HIGH
      );
      this.showUserError(
        'An unexpected error occurred. The issue has been logged.',
        { title: 'Unexpected Error', persistent: true }
      );
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.logError(
        new Error(event.message),
        'Global Error Handler',
        ErrorSeverity.CRITICAL
      );
      this.showUserError(
        'A critical error occurred. Please refresh the page.',
        { title: 'Critical Error', persistent: true }
      );
    });
  }

  private addUserMessage(message: UserMessage): void {
    this.userMessages.push(message);
    this.notifyListeners();

    // Auto-remove message after duration
    if (!message.persistent && message.duration && message.duration > 0) {
      setTimeout(() => {
        this.removeMessage(message.id);
      }, message.duration);
    }
  }

  private removeMessage(messageId: string): void {
    const index = this.userMessages.findIndex(msg => msg.id === messageId);
    if (index > -1) {
      this.userMessages.splice(index, 1);
      this.notifyListeners();
    }
  }

  private notifyListeners(): void {
    this.messageListeners.forEach(listener => {
      listener(this.getUserMessages());
    });
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSeverityLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'info';
      case ErrorSeverity.MEDIUM:
        return 'warning';
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.CRITICAL:
        return 'fatal';
      default:
        return 'error';
    }
  }

  private logToLocalStorage(error: Error, context: string, severity: ErrorSeverity): void {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        context,
        severity,
        message: error.message,
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);

      // Keep only last 50 errors
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }

      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch (e) {
      // Avoid infinite loop if localStorage fails
      console.warn('Failed to log error to localStorage:', e);
    }
  }
}

// Internal interfaces
interface UserMessage {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  persistent?: boolean;
  actions?: UserMessageAction[];
}
