/**
 * Pulse Card Component
 *
 * Displays key metrics for fiat and crypto liquidity
 * Uses the new UI primitives for consistent styling and behavior
 */

import React, { useMemo } from 'react';
import { PulseCardProps, Stat } from '../types';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import styles from '../styles/PulseCard.module.css';

const PulseCard: React.FC<PulseCardProps> = React.memo(
  ({ type, amount, stats, badge, className, testId }) => {
    // Memoize type-dependent computations
    const typeConfig = useMemo(() => {
      const isFiat = type === 'fiat';
      return {
        isFiat,
        icon: isFiat ? 'university' : 'bitcoin-sign',
        title: isFiat ? 'Fiat Liquidity' : 'Crypto Velocity',
        amountPrefix: isFiat ? 'R ' : '',
        amountSuffix: isFiat ? '' : ' BTC',
        cardVariant: isFiat ? 'primary' : 'secondary',
      };
    }, [type]);

    // Memoize formatted amount
    const formattedAmount = useMemo(() => {
      const formattedNumber =
        type === 'crypto'
          ? amount.toLocaleString('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 })
          : amount.toLocaleString('en-US');
      return `${typeConfig.amountPrefix}${formattedNumber}${typeConfig.amountSuffix}`;
    }, [amount, typeConfig.amountPrefix, typeConfig.amountSuffix, type]);

    return (
      <div 
        className={`${styles.pulseCard} ${typeConfig.isFiat ? styles.fiat : styles.crypto} ${className || ''}`}
        data-testid={testId}
      >
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.iconContainer}>
              <i className={`fas fa-${typeConfig.icon}`} aria-hidden="true" />
            </div>
            <Typography className={styles.title}>
              {typeConfig.title}
            </Typography>
          </div>
          <div className={styles.badge}>
            {badge}
          </div>
        </div>

        <Typography className={styles.amount}>
          {formattedAmount}
        </Typography>

        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className={styles.statItem}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.stat}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

PulseCard.displayName = 'PulseCard';

export default PulseCard;
