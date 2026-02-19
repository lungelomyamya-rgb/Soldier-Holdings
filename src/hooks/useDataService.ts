/**
 * Data Service Hook
 * 
 * Integrates data fetching with the new store architecture
 * Uses dependency injection for better testability and flexibility
 * Handles real-time updates, caching, and error management
 */

import { useEffect } from 'react';
import useDataStore from '../store/dataStore';
import useAppStore from '../store/appStore';
import { useDataService as useDataServiceFromContext } from '../context/ServiceContext';
import { useErrorHandler } from './useErrorHandler';

interface UseDataServiceOptions {
  autoRefresh?: boolean;
  interval?: number;
  enabled?: boolean;
}

export const useDataServiceHook = (options: UseDataServiceOptions = {}) => {
  const {
    autoRefresh = true,
    interval = 3000,
    enabled = true
  } = options;

  const {
    updateTransaction,
    getTransactionsByType
  } = useDataStore();

  const {
    loading,
    setLoading,
    error,
    setError,
    clearError,
    isOnline,
    autoRefresh: globalAutoRefresh
  } = useAppStore();

  // Get services through dependency injection
  const dataService = useDataServiceFromContext();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (!enabled || !isOnline) return;

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        setLoading(true);
        clearError();
        
        const transactions = await dataService.getTransactions();
        
        if (mounted) {
          // Data is now handled by middleware, just show success message
          errorHandler.showUserSuccess(
            `Loaded ${transactions.length} transactions`,
            { title: 'Data Updated' }
          );
        }
      } catch (err) {
        if (mounted) {
          errorHandler.logError(err as Error, 'Data Fetch');
          errorHandler.showUserError(
            'Failed to fetch data. Please try again.',
            { title: 'Data Error' }
          );
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const simulateRealTimeUpdates = () => {
      if (!mounted) return;
      
      // Get current transactions and simulate status updates
      const currentTransactions = getTransactionsByType('all');
      const scanningTransactions = currentTransactions.filter(tx => tx.status === 'scanning');
      
      if (scanningTransactions.length > 0 && Math.random() > 0.7) {
        const randomTx = scanningTransactions[Math.floor(Math.random() * scanningTransactions.length)];
        updateTransaction(randomTx.id, {
          status: 'verified',
          statusText: 'Compliant'
        });
        
        errorHandler.showUserInfo(
          `Transaction ${randomTx.id} has been verified`,
          { title: 'Transaction Verified' }
        );
      }
    };

    // Initial fetch
    fetchData();

    // Set up real-time updates
    if (autoRefresh && globalAutoRefresh) {
      intervalId = setInterval(simulateRealTimeUpdates, interval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enabled, isOnline, autoRefresh, globalAutoRefresh, interval, dataService, clearError, errorHandler, getTransactionsByType, updateTransaction, setLoading, setError]);

  return {
    loading,
    error,
    refetch: () => {
      // Manual refetch function
      const fetchData = async () => {
        try {
          setLoading(true);
          clearError();
          await dataService.getTransactions();
          // Data is handled by middleware
        } catch (err) {
          errorHandler.logError(err as Error, 'Manual Refetch');
          errorHandler.showUserError(
            'Failed to refresh data. Please try again.',
            { title: 'Refresh Error' }
          );
          setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };
};
