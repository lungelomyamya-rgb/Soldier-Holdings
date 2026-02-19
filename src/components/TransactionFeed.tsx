import React, { useMemo, useCallback } from 'react';
import TransactionItem from './TransactionItem';
import { TransactionFeedProps } from '../types/index';
import { useComponentPerformance, useUserInteraction } from '../hooks/useMonitoring';
import { useLogging } from './LoggingProvider';

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
          <div className='empty-state'>
            <p>No transactions found for filter: {filter}</p>
          </div>
        );
      }

      logDebug('Rendering transaction list', {
        count: filteredTransactions.length,
        filter,
      });

      return filteredTransactions.map((transaction, index) => (
        <TransactionItem key={`tx-${String(transaction.id || index)}`} transaction={transaction} />
      ));
    }, [filteredTransactions, filter, logInfo, logDebug]);

    return (
      <div className='transaction-feed card'>
        <div className='feed-header'>
          <h3>Identity-Wallet Live Feed</h3>
          <div className='feed-filter' role='group' aria-label='Filter transactions'>
            {filterOptions.map(type => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? 'active' : ''}`}
                onClick={() => handleFilterChange(type)}
                aria-pressed={filter === type}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className='transaction-list'>{transactionList}</div>
      </div>
    );
  }
);

TransactionFeed.displayName = 'TransactionFeed';

export default TransactionFeed;
