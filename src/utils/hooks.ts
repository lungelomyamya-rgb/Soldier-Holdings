/**
 * Custom React Hooks
 *
 * Reusable hooks for common functionality
 * Follows React best practices and performance optimization
 */

import { Transaction } from '../types';
import React from 'react';
import { logger } from './logger';

/**
 * Custom hook for real-time data updates
 * @param dataService - Service instance for data operations
 * @param interval - Update interval in milliseconds (default 3000)
 * @param onData - Callback to handle data updates
 * @returns Object with data, loading, error
 */
const useRealTimeData = (
    dataService: { getTransactions(): Promise<Transaction[]>; updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> },
    interval: number = 3000,
    onData?: (data: Transaction[]) => void
) => {
    const [data, setData] = React.useState<Transaction[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await dataService.getTransactions();
                if (mounted) {
                    setData(result);
                    if (onData) onData(result);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError((err as Error).message);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        const updateData = () => {
            if (!mounted) return;
            
            setData((prevData: Transaction[]) => {
                const newData: Transaction[] = prevData.map((tx: Transaction) => {
                    if (tx.status === 'scanning' && Math.random() > 0.7) {
                        dataService.updateTransactionStatus(tx.id, 'verified');
                        return { ...tx, status: 'verified', statusText: 'Compliant' };
                    }
                    return tx;
                });
                return newData;
            });
        };

        fetchData();
        const intervalId = setInterval(updateData, interval);

        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [dataService, interval, onData]);

    React.useEffect(() => {
        if (onData) {
            onData(data);
        }
    }, [data, onData]);

    return { data, loading, error };
};

/**
 * Custom hook for filtering transactions
 * @param transactions - Array of transaction objects
 * @param filterType - Filter type ('all', 'ZAR', 'BTC', 'ETH')
 * @returns Filtered transactions
 */
const useTransactionFilter = (transactions: Transaction[], filterType: string): Transaction[] => {
    return React.useMemo(() => {
        if (filterType === 'all') {
            return transactions;
        }
        return transactions.filter(tx => tx.type === filterType);
    }, [transactions, filterType]);
};

/**
 * Custom hook for local storage with synchronization
 * @param key - Storage key
 * @param defaultValue - Default value
 * @returns Tuple [value, setValue]
 */
const useLocalStorage = <T>(key: string, defaultValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = React.useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            logger.error(`Error reading localStorage key "${key}"`, error as Error);
            return defaultValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            logger.error(`Error setting localStorage key "${key}"`, error as Error);
        }
    };

    return [storedValue, setValue];
};

export { useRealTimeData, useTransactionFilter, useLocalStorage };
