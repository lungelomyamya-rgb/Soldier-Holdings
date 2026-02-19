/**
 * Error Handler Hook
 * 
 * Provides easy access to error handling functionality throughout the application
 * Integrates with the DI system for consistent error management
 */

import { useContext, useCallback, useState, useEffect } from 'react';
import ServiceContext from '../context/ServiceContext';
import { IErrorHandlerService } from '../interfaces/IErrorHandlerService';
import { 
  UserErrorOptions, 
  UserWarningOptions, 
  UserSuccessOptions, 
  UserInfoOptions,
  UserMessage 
} from '../types/index';

/**
 * Hook for accessing error handling functionality
 */
export const useErrorHandler = (): IErrorHandlerService => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within a ServiceProvider');
  }
  return context.errorHandler;
};

/**
 * Hook for handling async operations with automatic error handling
 */
export const useAsyncHandler = () => {
  const errorHandler = useErrorHandler();

  const handleAsync = useCallback(
    async <T>(
      operation: () => Promise<T>,
      context: string,
      fallback?: T
    ): Promise<T> => {
      return errorHandler.handleAsync(operation, context, fallback);
    },
    [errorHandler]
  );

  const handleAsyncWithCallback = useCallback(
    async <T>(
      operation: () => Promise<T>,
      context: string,
      onSuccess?: (result: T) => void,
      onError?: (error: Error) => void,
      fallback?: T
    ): Promise<T | undefined> => {
      try {
        const result = await operation();
        onSuccess?.(result);
        return result;
      } catch (error) {
        errorHandler.logError(error as Error, context);
        onError?.(error as Error);
        return fallback;
      }
    },
    [errorHandler]
  );

  return { handleAsync, handleAsyncWithCallback };
};

/**
 * Hook for handling form submissions with error handling
 */
export const useFormHandler = () => {
  const errorHandler = useErrorHandler();

  const handleSubmit = useCallback(
    async <T>(
      submitOperation: () => Promise<T>,
      context: string,
      options?: {
        successMessage?: string;
        errorMessage?: string;
        onSuccess?: (result: T) => void;
        onError?: (error: Error) => void;
      }
    ): Promise<T | undefined> => {
      try {
        const result = await submitOperation();
        
        if (options?.successMessage) {
          errorHandler.showUserSuccess(options.successMessage);
        }
        
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        errorHandler.logError(error as Error, context);
        
        const message = options?.errorMessage || 'Submission failed. Please try again.';
        errorHandler.showUserError(message, { title: 'Submission Error' });
        
        options?.onError?.(error as Error);
        return undefined;
      }
    },
    [errorHandler]
  );

  return { handleSubmit };
};

/**
 * Hook for managing user messages
 */
export const useUserMessages = () => {
  const errorHandler = useErrorHandler();
  const [messages, setMessages] = useState<UserMessage[]>([]);

  useEffect(() => {
    // Subscribe to message changes
    const unsubscribe = (errorHandler as { onUserMessagesChange?: (callback: (messages: UserMessage[]) => void) => (() => void) | void }).onUserMessagesChange?.(setMessages);
    return unsubscribe;
  }, [errorHandler]);

  const clearMessages = useCallback(() => {
    errorHandler.clearUserMessages();
  }, [errorHandler]);

  const showError = useCallback((message: string, options?: UserErrorOptions) => {
    errorHandler.showUserError(message, options);
  }, [errorHandler]);

  const showSuccess = useCallback((message: string, options?: UserSuccessOptions) => {
    errorHandler.showUserSuccess(message, options);
  }, [errorHandler]);

  const showWarning = useCallback((message: string, options?: UserWarningOptions) => {
    errorHandler.showUserWarning(message, options);
  }, [errorHandler]);

  const showInfo = useCallback((message: string, options?: UserInfoOptions) => {
    errorHandler.showUserInfo(message, options);
  }, [errorHandler]);

  return {
    messages,
    clearMessages,
    showError,
    showSuccess,
    showWarning,
    showInfo
  };
};
