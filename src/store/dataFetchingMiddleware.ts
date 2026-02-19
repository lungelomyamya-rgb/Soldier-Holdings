/**
 * Data Fetching Middleware for Zustand
 * 
 * Replaces complex hook-based state synchronization
 * Provides automatic data fetching, caching, and error handling
 * Integrates with the dependency injection system
 * Enhanced with comprehensive logging and monitoring
 */

import { StateCreator } from 'zustand';
import { IDataService } from '../interfaces/IDataService';
import { IErrorHandlerService } from '../interfaces/IErrorHandlerService';
import { config, isTest } from '../config';
import { Transaction } from '../types/index';
import { logger } from '../utils/logger';
import { monitoring } from '../utils/monitoring';

export interface DataFetchingState {
  // Data state
  transactions: Transaction[];
  fiatTotal: number;
  cryptoTotal: number;
  
  // Loading state
  loading: boolean;
  error: string | null;
  
  // Fetching actions
  fetchTransactions: () => Promise<void>;
  refetch: () => Promise<void>;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;
  clearError: () => void;
}

export interface DataFetchingOptions {
  autoRefresh?: boolean;
  interval?: number;
  enabled?: boolean;
  dataService: IDataService;
  errorHandler: IErrorHandlerService;
}

/**
 * Creates data fetching middleware for Zustand stores
 * Eliminates manual state synchronization between hooks and stores
 */
export const createDataFetchingMiddleware = (options: DataFetchingOptions) => {
  const {
    autoRefresh = config.dataService.realTimeUpdates,
    interval = config.dataService.updateInterval,
    enabled = !isTest,
    dataService,
    errorHandler
  } = options;

  let intervalId: NodeJS.Timeout | null = null;

  return <T extends DataFetchingState>(
    config: StateCreator<T>
  ): StateCreator<T> => {
    return (set, get, api) => {
      const store = config(set, get, api);

      // Enhanced fetchTransactions with error handling and logging
      const fetchTransactions = async () => {
        const startTime = Date.now();
        logger.info('Starting transaction fetch', { operation: 'fetchTransactions' });
        
        try {
          set({ loading: true, error: null } as Partial<T>);
          
          const transactions = await dataService.getTransactions();
          const fetchDuration = Date.now() - startTime;
          
          logger.info('Transactions fetched successfully', {
            count: transactions.length,
            duration: fetchDuration,
            operation: 'fetchTransactions',
          });
          
          monitoring.trackPerformance('data_fetch_transactions', fetchDuration, {
            transactionCount: String(transactions.length),
            operation: 'fetchTransactions',
          });
          
          // Calculate totals
          const fiatTotal = transactions
            .filter(tx => tx.type === 'ZAR')
            .reduce((sum, tx) => sum + tx.amount, 0);
          
          const cryptoTotal = transactions
            .filter(tx => tx.type !== 'ZAR')
            .reduce((sum, tx) => sum + tx.amount, 0);
          
          logger.debug('Transaction totals calculated', {
            fiatTotal,
            cryptoTotal,
            fiatCount: transactions.filter(tx => tx.type === 'ZAR').length,
            cryptoCount: transactions.filter(tx => tx.type !== 'ZAR').length,
          });
          
          set({ 
            transactions, 
            fiatTotal, 
            cryptoTotal, 
            loading: false 
          } as Partial<T>);
          
          monitoring.trackUserAction('data_fetch_success', {
            transactionCount: transactions.length,
            duration: fetchDuration,
          });
          
          errorHandler.showUserSuccess(
            `Loaded ${transactions.length} transactions`,
            { title: 'Data Updated' }
          );
        } catch (error) {
          const fetchDuration = Date.now() - startTime;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          logger.error('Transaction fetch failed', error instanceof Error ? error : new Error(errorMessage), {
            duration: fetchDuration,
            operation: 'fetchTransactions',
          });
          
          monitoring.trackPerformance('data_fetch_transactions_error', fetchDuration, {
            error: errorMessage,
            operation: 'fetchTransactions',
          });
          
          monitoring.trackUserAction('data_fetch_error', {
            error: errorMessage,
            duration: fetchDuration,
          });
          
          set({ loading: false, error: errorMessage } as Partial<T>);
          
          errorHandler.logError(error as Error, 'Data Fetch');
          errorHandler.showUserError(
            'Failed to fetch data. Please try again.',
            { title: 'Data Error' }
          );
        }
      };

      // Enhanced refetch function
      const refetch = async () => {
        await fetchTransactions();
      };

      // Enhanced updateTransaction with real-time simulation
      const updateTransaction = (id: number, updates: Partial<Transaction>) => {
        const currentState = get() as T;
        const transactions = currentState.transactions.map(tx =>
          tx.id === id ? { ...tx, ...updates } : tx
        );
        
        set({ transactions } as Partial<T>);
        
        // Show notification for updates
        if (updates.status) {
          errorHandler.showUserInfo(
            `Transaction ${id} updated to ${updates.status}`,
            { title: 'Transaction Updated' }
          );
        }
      };

      const clearError = () => {
        set({ error: null } as Partial<T>);
      };

      // Set up auto-refresh
      const setupAutoRefresh = () => {
        if (autoRefresh && enabled && !intervalId) {
          intervalId = setInterval(() => {
            // Simulate real-time updates
            const currentState = get() as T;
            const scanningTransactions = currentState.transactions.filter(
              tx => tx.status === 'scanning'
            );
            
            if (scanningTransactions.length > 0 && Math.random() > 0.7) {
              const randomTx = scanningTransactions[Math.floor(Math.random() * scanningTransactions.length)];
              updateTransaction(randomTx.id, {
                status: 'verified',
                statusText: 'Compliant'
              });
            }
          }, interval);
        }
      };

      const cleanupAutoRefresh = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      // Initialize auto-refresh
      if (enabled) {
        setupAutoRefresh();
      }

      // Initial fetch
      if (enabled) {
        fetchTransactions();
      }

      // Return enhanced store
      return {
        ...store,
        fetchTransactions,
        refetch,
        updateTransaction,
        clearError,
        // Auto-refresh controls
        _setupAutoRefresh: setupAutoRefresh,
        _cleanupAutoRefresh: cleanupAutoRefresh,
      } as T;
    };
  };
};

/**
 * Hook for using data fetching with Zustand middleware
 * Provides a clean interface for components
 */
export const useDataFetching = <T extends DataFetchingState>(store: () => T) => {
  const {
    transactions,
    fiatTotal,
    cryptoTotal,
    loading,
    error,
    fetchTransactions,
    refetch,
    updateTransaction,
    clearError
  } = store();

  return {
    // Data
    transactions,
    fiatTotal,
    cryptoTotal,
    
    // State
    loading,
    error,
    
    // Actions
    fetchTransactions,
    refetch,
    updateTransaction,
    clearError,
    
    // Computed values
    transactionCount: transactions.length,
    hasData: transactions.length > 0,
    hasError: !!error,
    isLoading: loading,
  };
};
