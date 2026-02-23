/**
 * App Component
 *
 * Demonstrates the improved architecture with focused stores
 * Eliminates prop drilling and manual state synchronization
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DesktopNavbar from '../components/DesktopNavbar';
import UserMessages from '../components/UserMessages';
import useUIStore from '../store/uiStore';
import useDataStore from '../store/dataStore';

// Lazy load page components for code splitting
const OverviewPage = React.lazy(() => import('./OverviewPage'));
const FiatPage = React.lazy(() => import('./FiatPage'));
const CryptoPage = React.lazy(() => import('./CryptoPage'));
const CompliancePage = React.lazy(() => import('./CompliancePage'));
const AnalyticsPage = React.lazy(() => import('./AnalyticsPage'));
const SettingsPage = React.lazy(() => import('./SettingsPage'));

const Dashboard = () => {
  // UI State - focused and clean
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  // Data State - automatically managed by middleware
  const { transactions, fiatTotal, cryptoTotal, loading, error, refetch } = useDataStore();

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('[data-sidebar-open="true"]') as HTMLElement | null;
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
  const renderMainContent = () => (
    <Routes>
      <Route path="/" element={<OverviewPage />} />
      <Route path="fiat" element={<FiatPage transactions={transactions} fiatTotal={fiatTotal} />} />
      <Route path="crypto" element={<CryptoPage transactions={transactions} cryptoTotal={cryptoTotal} />} />
      <Route path="compliance" element={<CompliancePage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div className='app-container'>
      {/* Desktop Navbar - Only visible on desktop */}
      <DesktopNavbar />

      {/* Mobile Menu Toggle - Only visible on mobile */}
      <button
        className='mobile-menu-toggle'
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label='Toggle navigation menu'
      >
        <i className='fas fa-bars' />
      </button>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className='mobile-backdrop'
          onClick={() => setMobileMenuOpen(false)}
          aria-label='Close navigation menu'
        />
      )}

      <Sidebar
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

export default Dashboard;
