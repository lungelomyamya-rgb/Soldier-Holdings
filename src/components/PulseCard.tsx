/**
 * Pulse Card Component
 *
 * Displays key metrics for fiat and crypto liquidity
 * Supports dynamic data binding and accessibility
 * Optimized with React.memo and useMemo for performance
 */

import React, { useMemo } from 'react';
import { PulseCardProps, Stat } from '../types';

const PulseCard: React.FC<PulseCardProps> = React.memo(
  ({ type, amount, stats, badge, className, testId }) => {
    // Memoize type-dependent computations
    const typeConfig = useMemo(() => {
      const isFiat = type === 'fiat';
      return {
        isFiat,
        cardClass: `pulse-card ${type} ${className || ''}`,
        icon: isFiat ? 'university' : 'bitcoin-sign',
        title: isFiat ? 'Fiat Liquidity' : 'Crypto Velocity',
        amountPrefix: isFiat ? 'R ' : '',
        amountSuffix: isFiat ? '' : ' BTC',
        badgeStyle: {
          background: isFiat ? undefined : 'rgba(52, 152, 219, 0.2)',
          color: isFiat ? undefined : 'var(--crypto-blue)',
        },
        badgeClass: `pulse-badge ${!isFiat ? 'crypto-badge' : ''}`,
      };
    }, [type, className]);

    // Memoize formatted amount
    const formattedAmount = useMemo(() => {
      const formattedNumber =
        type === 'crypto'
          ? amount.toLocaleString('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 })
          : amount.toLocaleString('en-US');
      return `${typeConfig.amountPrefix}${formattedNumber}${typeConfig.amountSuffix}`;
    }, [amount, typeConfig.amountPrefix, typeConfig.amountSuffix, type]);

    // Memoize stats rendering
    const statsElements = useMemo(() => {
      return stats.map((stat: Stat, index: number) => (
        <div key={`${stat.label}-${index}`} className='pulse-stat'>
          <div className='pulse-stat-label'>{stat.label}</div>
          <div className='pulse-stat-value'>{stat.value}</div>
        </div>
      ));
    }, [stats]);

    return (
      <div className={typeConfig.cardClass} data-testid={testId}>
        <div className='pulse-header'>
          <div className='pulse-title'>
            <div className='pulse-icon'>
              <i className={`fas fa-${typeConfig.icon}`} aria-hidden='true' />
            </div>
            <h3>{typeConfig.title}</h3>
          </div>
          <div className={typeConfig.badgeClass} style={typeConfig.badgeStyle}>
            {badge}
          </div>
        </div>
        <div className='pulse-amount'>{formattedAmount}</div>
        <div className='pulse-meta'>{statsElements}</div>
      </div>
    );
  }
);

PulseCard.displayName = 'PulseCard';

export default PulseCard;
