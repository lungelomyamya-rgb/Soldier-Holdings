/**
 * Transaction Item Component
 *
 * Displays individual transaction details with proper accessibility
 * Supports different transaction types and statuses
 * Optimized with React.memo and useMemo for performance
 */

import React, { useMemo } from 'react';
import { TransactionItemProps } from '../types/index';

// Memoize icon mapping to prevent recreation on every render
const ICON_MAP: Record<'ZAR' | 'BTC' | 'ETH', string> = {
  ZAR: 'dollar-sign',
  BTC: 'bitcoin',
  ETH: 'ethereum',
} as const;

const TransactionItem: React.FC<TransactionItemProps> = React.memo(({ transaction }) => {
  // Memoize icon class computation
  const iconClass = useMemo(() => {
    return ICON_MAP[transaction.type] || 'question';
  }, [transaction.type]);

  // Memoize transaction type class
  const transactionTypeClass = useMemo(() => {
    return `tx-icon ${transaction.type.toLowerCase()}`;
  }, [transaction.type]);

  // Memoize formatted amount
  const formattedAmount = useMemo(() => {
    const prefix = transaction.type === 'ZAR' ? 'R ' : '';
    const suffix = transaction.type !== 'ZAR' ? ' incoming...' : '';
    return `${prefix}${transaction.amount.toLocaleString()} ${transaction.currency}${suffix}`;
  }, [transaction.amount, transaction.currency, transaction.type]);

  // Memoize status class
  const statusClass = useMemo(() => {
    return `tx-status ${transaction.status}`;
  }, [transaction.status]);

  // Memoize accessibility label
  const ariaLabel = useMemo(() => {
    return `Transaction: ${transaction.amount} ${transaction.currency}`;
  }, [transaction.amount, transaction.currency]);

  // Memoize spinner icon for scanning status
  const spinnerIcon = useMemo(() => {
    return transaction.status === 'scanning' ? (
      <i className='fas fa-spinner fa-spin pulse' aria-hidden='true' />
    ) : null;
  }, [transaction.status]);

  return (
    <div className='transaction-item' role='article' aria-label={ariaLabel}>
      <div className={transactionTypeClass}>
        <i className={`fab fa-${iconClass}`} aria-hidden='true' />
      </div>
      <div className='tx-details'>
        <div className='tx-amount'>{formattedAmount}</div>
        <div className='tx-from'>{transaction.from}</div>
      </div>
      <div className={statusClass}>
        {spinnerIcon}
        <span>{transaction.statusText}</span>
      </div>
    </div>
  );
});

TransactionItem.displayName = 'TransactionItem';

// Attach to window for global access
window.TransactionItem = TransactionItem;

export default TransactionItem;
