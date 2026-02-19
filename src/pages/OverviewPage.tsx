/**
 * OverviewPage Component
 * 
 * Now directly accesses the stores it needs instead of receiving props
 * Eliminates prop drilling and improves component autonomy
 * Optimized with useMemo for performance
 */

import React, { useMemo } from 'react';
import PulseCard from '../components/PulseCard';
import StatsGrid from '../components/StatsGrid';
import TransactionFeed from '../components/TransactionFeed';
import useDataStore from '../store/dataStore';
import useUIStore from '../store/uiStore';

const OverviewPage: React.FC = React.memo(() => {
  // Direct access to the specific state this component needs
  const { transactions, fiatTotal, cryptoTotal } = useDataStore();
  const { filter, setFilter } = useUIStore();

  // Memoize fiat stats to prevent recreation on every render
  const fiatStats = useMemo(() => [
    { label: 'Monthly Budget', value: 'R 15,000,000' },
    { label: 'Compliance Rate', value: '98.4%' }
  ], []);

  // Memoize crypto stats to prevent recreation on every render
  const cryptoStats = useMemo(() => [
    { label: 'BTC Holdings', value: '0.28' },
    { label: 'Risk Score', value: 'Low' }
  ], []);

  // Memoize filter change handler
  const handleFilterChange = useMemo(() => setFilter, [setFilter]);

  return (
    <>
      <header className="header">
        <h2>Dual-Rail Command Center</h2>
        <p>Real-time political funding monitoring and compliance enforcement</p>
      </header>
      
      <div className="pulse-cards">
        <PulseCard
          type="fiat"
          amount={fiatTotal}
          stats={fiatStats}
          badge="Active"
        />
        <PulseCard
          type="crypto"
          amount={cryptoTotal}
          stats={cryptoStats}
          badge="Monitored"
        />
      </div>
      
      <StatsGrid />
      
      <TransactionFeed
        transactions={transactions}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
    </>
  );
});

OverviewPage.displayName = 'OverviewPage';

export default OverviewPage;
