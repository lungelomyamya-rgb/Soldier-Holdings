/**
 * Stats Grid Component
 * 
 * Displays key performance metrics and compliance indicators
 * Uses the new UI primitives and CSS modules for styling
 * Optimized with React.memo and useMemo for performance
 */

import React, { useMemo } from 'react';
import { Stat } from '../types';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import styles from '../styles/StatsGrid.module.css';

interface StatsGridProps {
  stats?: Stat[];
  loading?: boolean;
  className?: string;
}

const StatCard: React.FC<{ stat: Stat }> = React.memo(({ stat }) => {
  const changeType = stat.change?.type || 'neutral';
  const arrowIcon = changeType === 'increase' ? 'arrow-up' : 'arrow-down';

  return (
    <Box className={styles.statCard}>
      <Typography variant="body2" className={styles.statLabel}>
        {stat.label}
      </Typography>
      <Typography variant="h4" className={styles.statValue}>
        {stat.value}
      </Typography>
      {stat.change && (
        <Flex alignItems="center" gap={1} className={`${styles.statChange} ${styles[changeType]}`}>
          <i className={`fas fa-${arrowIcon}`} aria-hidden="true" />
          <span>{stat.change.text}</span>
        </Flex>
      )}
    </Box>
  );
});

StatCard.displayName = 'StatCard';

const SkeletonLoader: React.FC = React.memo(() => (
  <Box className={styles.loading}>
    {Array.from({ length: 4 }).map((_, index) => (
      <Box key={index} className={styles.skeletonCard}>
        <Box className={styles.skeletonLine} />
        <Box className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
      </Box>
    ))}
  </Box>
));

SkeletonLoader.displayName = 'SkeletonLoader';

const StatsGrid: React.FC<StatsGridProps> = React.memo(({ stats, loading = false, className = '' }) => {
  const displayStats = useMemo(() => {
    if (stats) return stats;

    // Default stats - memoized to prevent recreation on every render
    return [
      {
        label: 'Total Transactions',
        value: '1,247',
        change: { type: 'increase' as const, text: '12.5% vs last month' },
      },
      {
        label: 'Flagged Items',
        value: '23',
        change: { type: 'decrease' as const, text: '-8% vs last month' },
      },
      {
        label: 'Unique Donors',
        value: '892',
        change: { type: 'increase' as const, text: '5.2% vs last month' },
      },
      {
        label: 'Avg. Donation',
        value: 'R 9,450',
        change: { type: 'increase' as const, text: '3.1% vs last month' },
      },
    ];
  }, [stats]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Box className={`${styles.statsGrid} ${className}`.trim()}>
      {displayStats.map((stat, index) => (
        <StatCard key={`${stat.label}-${index}`} stat={stat} />
      ))}
    </Box>
  );
});

StatsGrid.displayName = 'StatsGrid';

export default StatsGrid;

// Attach to window for global access
window.StatsGrid = StatsGrid;
