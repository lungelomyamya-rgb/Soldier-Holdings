/**
 * Data Store
 * 
 * Focused store for data-related state
 * Uses middleware for automatic data fetching and synchronization
 * Eliminates complex hook-based state management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createDataFetchingMiddleware, DataFetchingState } from './dataFetchingMiddleware';
import { config } from '../config';
import { Transaction } from '../types/index';

// Get services from DI container
import { serviceContainer, ServiceType } from '../di/ServiceContainer';

interface DataStoreState extends DataFetchingState {
  // Computed selectors
  getTransactionsByType: (type: string) => Transaction[];
  getTransactionById: (id: number) => Transaction | undefined;
  getStats: () => { totalTransactions: number; fiatTransactions: number; cryptoTransactions: number };
}

const useDataStore = create<DataStoreState>()(
  devtools(
    createDataFetchingMiddleware({
      autoRefresh: config.dataService.realTimeUpdates,
      interval: config.dataService.updateInterval,
      enabled: !config.isTest,
      dataService: serviceContainer.get(ServiceType.DataService),
      errorHandler: serviceContainer.get(ServiceType.ErrorHandlerService),
    })((set, get) => ({
      // Initial state - use configuration values
      transactions: [],
      fiatTotal: config.business.transactionLimits.maxFiatTransaction * 0.1, // 10% of max as demo
      cryptoTotal: config.business.transactionLimits.maxCryptoTransaction * 0.1, // 10% of max as demo
      loading: false,
      error: null,

      // Required methods from DataFetchingState (implemented by middleware)
      fetchTransactions: async () => {
        // This will be overridden by middleware
      },
      refetch: async () => {
        // This will be overridden by middleware
      },
      updateTransaction: (_id: number, _updates: Partial<Transaction>) => {
        // This will be overridden by middleware
      },
      clearError: () => {
        // This will be overridden by middleware
      },

      // Computed selectors
      getTransactionsByType: (type: string) => {
        const { transactions } = get();
        if (type === 'all') return transactions;
        return transactions.filter(tx => tx.type === type);
      },

      getTransactionById: (id: number) => {
        const { transactions } = get();
        return transactions.find(tx => tx.id === id);
      },

      getStats: () => {
        const { transactions } = get();
        const fiatTransactions = transactions.filter(tx => tx.type === 'ZAR');
        const cryptoTransactions = transactions.filter(tx => tx.type !== 'ZAR');
        
        return {
          totalTransactions: transactions.length,
          fiatTransactions: fiatTransactions.length,
          cryptoTransactions: cryptoTransactions.length,
        };
      },

      // Store-specific actions
      setTransactions: (transactions: Transaction[]) => {
        set({ transactions });
      },

      addTransaction: (transaction: Transaction) => {
        set(state => ({
          transactions: [...state.transactions, transaction]
        }));
      },

      removeTransaction: (id: number) => {
        set(state => ({
          transactions: state.transactions.filter(tx => tx.id !== id)
        }));
      },

      // Batch operations
      updateMultipleTransactions: (updates: Array<{ id: number; updates: Partial<Transaction> }>) => {
        set(state => ({
          transactions: state.transactions.map(tx => {
            const update = updates.find(u => u.id === tx.id);
            return update ? { ...tx, ...update.updates } : tx;
          })
        }));
      },
    })),
    { name: 'data-store' }
  )
);

export default useDataStore;
