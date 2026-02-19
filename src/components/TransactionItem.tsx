/**
 * Transaction Item Component
 *
 * Displays individual transaction details with proper accessibility
 * Supports different transaction types and statuses
 * Optimized with React.memo and useMemo for performance
 * Uses UI primitives and CSS modules for consistent styling
 */
import React, { useMemo } from 'react';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import { TransactionItemProps } from '../types/index';
import styles from '../styles/TransactionItem.module.css';

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
      <i className="fas fa-spinner fa-spin pulse" aria-hidden="true" />
    ) : null;
  }, [transaction.status]);

  return (
    <Box className={styles.transactionItem} role="article" aria-label={ariaLabel}>
      <Flex className={styles.iconContainer}>
        <i className={`fab fa-${iconClass} ${styles.icon}`} aria-hidden="true" />
      </Flex>
      
      <Box className={styles.details}>
        <Typography variant="h4" className={styles.amount}>
          {formattedAmount}
        </Typography>
        
        <Flex className={styles.addresses}>
          <Typography variant="body2" className={styles.fromAddress}>
            {transaction.from}
          </Typography>
        </Flex>
      </Box>
      
      <Flex className={styles.statusContainer}>
        {spinnerIcon}
        <Typography variant="body2" className={statusClass}>
          {transaction.statusText}
        </Typography>
      </Flex>
    </Box>
  );
});

TransactionItem.displayName = 'TransactionItem';

// Attach to window for global access
window.TransactionItem = TransactionItem;

export default TransactionItem;
