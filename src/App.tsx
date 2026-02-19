/**
 * App Component
 *
 * Demonstrates the improved architecture with focused stores
 * Eliminates prop drilling and manual state synchronization
 */

import React from 'react';
import Sidebar from './components/Sidebar';
import UserMessages from './components/UserMessages';
import useUIStore from './store/uiStore';
import useDataStore from './store/dataStore';

// Lazy load page components for code splitting
const OverviewPage = React.lazy(() => import('./pages/OverviewPage'));
const FiatPage = React.lazy(() => import('./pages/FiatPage'));
const CryptoPage = React.lazy(() => import('./pages/CryptoPage'));
const CompliancePage = React.lazy(() => import('./pages/CompliancePage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const App = () => {
  // UI State - focused and clean
  const { activeNav, mobileMenuOpen, setMobileMenuOpen, setActiveNav } = useUIStore();

  // Data State - automatically managed by middleware
  const { transactions, fiatTotal, cryptoTotal, loading, error, refetch } = useDataStore();

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar') as HTMLElement | null;
      const toggle = document.querySelector('.mobile-menu-toggle') as HTMLElement | null;

      if (
        mobileMenuOpen &&
        sidebar &&
        toggle &&
        event.target &&
        !sidebar.contains(event.target as Node) &&
        !toggle.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  // Loading state with better UX
  if (loading) {
    return (
      <div className='app-container'>
        <button
          className='mobile-menu-toggle'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Toggle navigation menu'
        >
          <i className='fas fa-bars' />
        </button>
        <main className='main-content'>
          <div className='loading-container animate-fade-in-up'>
            <div className='loading-spinner'></div>
            <div className='loading-text'>Loading Data</div>
            <div className='loading-subtext'>
              Initializing political funding compliance system...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state with retry functionality
  if (error) {
    return (
      <div className='app-container'>
        <button
          className='mobile-menu-toggle'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Toggle navigation menu'
        >
          <i className='fas fa-bars' />
        </button>
        <main className='main-content'>
          <div className='error-container animate-fade-in-up'>
            <div className='error-icon'>
              <i className='fas fa-exclamation-triangle'></i>
            </div>
            <div className='error-title'>Error Loading Data</div>
            <div className='error-message'>{error}</div>
            <button className='error-button' onClick={refetch}>
              <i className='fas fa-redo' style={{ marginRight: 'var(--space-2)' }}></i>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Render content based on active navigation
  const renderMainContent = () => {
    switch (activeNav) {
      case 'overview':
        return <OverviewPage />;

      case 'fiat':
        return <FiatPage transactions={transactions} fiatTotal={fiatTotal} />;

      case 'crypto':
        return <CryptoPage transactions={transactions} cryptoTotal={cryptoTotal} />;

      case 'compliance':
        return <CompliancePage />;

      case 'analytics':
        return <AnalyticsPage />;

      case 'settings':
        return <SettingsPage />;

      default:
        return (
          <div className='not-found'>
            <h2>Page Not Found</h2>
            <p>The requested page could not be found.</p>
          </div>
        );
    }
  };

  return (
    <div className='app-container'>
      <button
        className='mobile-menu-toggle'
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label='Toggle navigation menu'
      >
        <i className='fas fa-bars' />
      </button>

      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className='main-content animate-fade-in-up'>
        <React.Suspense
          fallback={
            <div className='loading-container'>
              <div className='loading-spinner'></div>
              <div className='loading-text'>Loading Page</div>
            </div>
          }
        >
          {renderMainContent()}
        </React.Suspense>
      </main>

      <UserMessages position='top-right' />
    </div>
  );
};

export default App;
