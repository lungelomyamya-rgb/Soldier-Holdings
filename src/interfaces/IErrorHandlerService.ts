/**
 * Error Handler Interface
 * 
 * Defines the contract for error handling services
 * Ensures consistent error management across the application
 */

export interface IErrorHandlerService {
  /**
   * Log error to monitoring systems
   * @param error - Error object
   * @param context - Context where error occurred
   * @param severity - Error severity level
   */
  logError(error: Error, context: string, severity?: ErrorSeverity): void;

  /**
   * Show user-friendly error message
   * @param message - User-facing error message
   * @param options - Display options
   */
  showUserError(message: string, options?: UserErrorOptions): void;

  /**
   * Show user success message
   * @param message - Success message
   * @param options - Display options
   */
  showUserSuccess(message: string, options?: UserMessageOptions): void;

  /**
   * Show user warning message
   * @param message - Warning message
   * @param options - Display options
   */
  showUserWarning(message: string, options?: UserMessageOptions): void;

  /**
   * Show user info message
   * @param message - Info message
   * @param options - Display options
   */
  showUserInfo(message: string, options?: UserMessageOptions): void;

  /**
   * Clear all user messages
   */
  clearUserMessages(): void;

  /**
   * Handle async operation with error catching
   * @param operation - Async operation to execute
   * @param context - Context for error logging
   * @param fallback - Fallback value on error
   */
  handleAsync<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T>;

  /**
   * Handle synchronous operation with error catching
   * @param operation - Operation to execute
   * @param context - Context for error logging
   * @param fallback - Fallback value on error
   */
  handleSync<T>(
    operation: () => T,
    context: string,
    fallback?: T
  ): T;
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface UserErrorOptions {
  title?: string;
  duration?: number;
  persistent?: boolean;
  actions?: UserMessageAction[];
}

export interface UserMessageOptions {
  title?: string;
  duration?: number;
  persistent?: boolean;
  actions?: UserMessageAction[];
}

export interface UserMessageAction {
  label: string;
  action: () => void;
  primary?: boolean;
}
