/**
 * Stats Grid Component
 *
 * Displays key performance metrics and compliance indicators
 * Supports dynamic data and trend analysis
 * Optimized with React.memo and useMemo for performance
 */

import React, { useMemo } from 'react';
import { Stat } from '../types';

interface StatsGridProps {
  // Optional props for future dynamic data
  stats?: Stat[];
  loading?: boolean;
}

// Memoized stat card component to prevent unnecessary re-renders
const StatCard: React.FC<{ stat: Stat; index: number }> = React.memo(({ stat, index }) => {
  const arrowIcon = useMemo(() => {
    return stat.change?.type === 'increase' ? 'up' : 'down';
  }, [stat.change?.type]);

  const changeClass = useMemo(() => {
    return stat.change ? `stat-change ${stat.change.type}` : '';
  }, [stat.change]);

  return (
    <div key={index} className='stat-card card'>
      <div className='stat-label'>{stat.label}</div>
      <div className='stat-value'>{stat.value}</div>
      {stat.change && (
        <div className={changeClass}>
          <i className={`fas fa-arrow-${arrowIcon}`} aria-hidden='true' />
          <span>{stat.change.text}</span>
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';

const StatsGrid: React.FC<StatsGridProps> = React.memo(({ stats, loading = false }) => {
  // Memoize stats data to prevent unnecessary recalculations
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

  // Memoize loading state to prevent unnecessary re-renders
  const loadingContent = useMemo(() => {
    if (!loading) return null;

    return (
      <div className='stats-grid loading'>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className='stat-card card skeleton'>
            <div className='skeleton-line' />
            <div className='skeleton-line' />
          </div>
        ))}
      </div>
    );
  }, [loading]);

  if (loading) {
    return loadingContent;
  }

  return (
    <div className='stats-grid'>
      {displayStats.map((stat, index) => (
        <StatCard key={`${stat.label}-${index}`} stat={stat} index={index} />
      ))}
    </div>
  );
});

StatsGrid.displayName = 'StatsGrid';

// Attach to window for global access
window.StatsGrid = StatsGrid;

export default StatsGrid;
