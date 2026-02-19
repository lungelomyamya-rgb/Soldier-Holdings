import React, { useMemo, useCallback } from 'react';
import { TransactionFeedProps } from '../types/index';
import { useComponentPerformance, useUserInteraction } from '../hooks/useMonitoring';
import { useLogging } from './LoggingProvider';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import TransactionItem from './TransactionItem';
import styles from '../styles/TransactionFeed.module.css';

const TransactionFeed: React.FC<TransactionFeedProps> = React.memo(
  ({ transactions, filter, onFilterChange }) => {
    const { logInfo, logDebug, logUserAction } = useLogging();
    const { trackClick } = useUserInteraction();

    // Performance monitoring
    useComponentPerformance('TransactionFeed', {
      transactionCount: transactions?.length || 0,
      filter,
    });

    // Memoize expensive filtering operation
    const filteredTransactions = useMemo(() => {
      const startTime = Date.now();

      if (!transactions) {
        logDebug('No transactions available for filtering');
        return [];
      }

      const filtered = transactions.filter(tx => {
        if (filter === 'all') {
          return true;
        }
        return tx.type === filter;
      });

      const duration = Date.now() - startTime;
      logDebug('Transaction filtering completed', {
        totalCount: transactions.length,
        filteredCount: filtered.length,
        filter,
        duration,
      });

      return filtered;
    }, [transactions, filter, logDebug]);

    // Memoize filter options to prevent recreation
    const filterOptions = useMemo(() => {
      return ['all', 'ZAR', 'BTC', 'ETH'] as const;
    }, []);

    // Memoize event handler to prevent unnecessary re-renders
    const handleFilterChange = useCallback(
      (type: string) => {
        logUserAction('filter_changed', {
          newFilter: type,
          previousFilter: filter,
          resultCount: filteredTransactions.length,
        });

        trackClick('filter_button', { filterType: type });
        onFilterChange(type);
      },
      [onFilterChange, filter, filteredTransactions.length, logUserAction, trackClick]
    );

    // Memoize the transaction list rendering
    const transactionList = useMemo(() => {
      if (filteredTransactions.length === 0) {
        logInfo('No transactions found for current filter', { filter });

        return (
          <Box className={styles.emptyState}>
            <Typography variant="body2">No transactions found for filter: {filter}</Typography>
          </Box>
        );
      }

      logDebug('Rendering transaction list', {
        count: filteredTransactions.length,
        filter,
      });

      return (
        <Box as="ul" className={styles.transactionList}>
          {filteredTransactions.map((transaction, index) => (
            <TransactionItem 
              key={`tx-${String(transaction.id || index)}`} 
              transaction={transaction} 
            />
          ))}
        </Box>
      );
    }, [filteredTransactions, filter, logInfo, logDebug]);

    return (
      <Box className={styles.transactionFeed}>
        <Box className={styles.feedHeader}>
          <Typography variant="h3" className={styles.feedTitle}>
            Identity-Wallet Live Feed
          </Typography>
          <Flex as="div" role="group" aria-label="Filter transactions" className={styles.filterGroup}>
            {filterOptions.map(type => (
              <button
                className={`${styles.filterButton} ${filter === type ? 
                  styles.filterButtonActive : ''}`}
                onClick={() => handleFilterChange(type)}
                aria-pressed={filter === type}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </Flex>
        </Box>
        {transactionList}
      </Box>
    );
  }
);

TransactionFeed.displayName = 'TransactionFeed';

export default TransactionFeed;
