/**
 * Error Handling and User Message Types
 * 
 * Types for error handling, user notifications, and feedback systems
 */

// User message types
export interface UserMessage {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  title?: string;
  timestamp: Date;
  persistent?: boolean;
  actions?: UserMessageAction[];
}

export interface UserMessageAction {
  label: string;
  action: () => void;
  primary?: boolean;
  destructive?: boolean;
}

// Error handling types
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, unknown>;
}

export interface ErrorSeverity {
  level: 'low' | 'medium' | 'high' | 'critical';
  priority: number;
}

// User notification options
export interface UserErrorOptions {
  title?: string;
  duration?: number;
  persistent?: boolean;
  actions?: UserMessageAction[];
  context?: ErrorContext;
}

export interface UserWarningOptions extends UserErrorOptions {}
export interface UserSuccessOptions extends UserErrorOptions {}
export interface UserInfoOptions extends UserErrorOptions {}

// Form handling types
export interface FormSubmitOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Error handler result types
export interface UseErrorHandlerResult {
  // Error handling
  logError: (error: Error, context: string, severity?: ErrorSeverity['level']) => void;
  showUserError: (message: string, options?: UserErrorOptions) => void;
  showUserWarning: (message: string, options?: UserWarningOptions) => void;
  showUserSuccess: (message: string, options?: UserSuccessOptions) => void;
  showUserInfo: (message: string, options?: UserInfoOptions) => void;
  
  // Async handling
  handleAsync: <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    fallback?: T
  ) => Promise<T | undefined>;
  
  // Form handling
  handleSubmit: <T>(
    formData: T,
    submitFn: (data: T) => Promise<void>,
    options?: FormSubmitOptions
  ) => Promise<void>;
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Toast/notification types
export interface ToastConfig {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  duration: number;
  maxToasts: number;
  showProgress: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
}
