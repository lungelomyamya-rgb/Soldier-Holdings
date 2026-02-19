/**
 * Store Index
 * 
 * Exports all focused stores for easy importing
 * Provides a clean separation of concerns:
 * - UI Store: Navigation, filters, UI state
 * - Data Store: Transactions, business logic, computed values
 * - App Store: Loading, errors, notifications, global settings
 */

// Focused Stores
export { default as useUIStore } from './uiStore';
export { default as useDataStore } from './dataStore';
export { default as useAppStore } from './appStore';

// For backward compatibility, provide a combined hook
// (Deprecated: Use individual stores for new code)
import useUIStore from './uiStore';
import useDataStore from './dataStore';
import useAppStore from './appStore';

export const useStore = () => {
  const uiStore = useUIStore();
  const dataStore = useDataStore();
  const appStore = useAppStore();

  return {
    // UI State
    activeNav: uiStore.activeNav,
    setActiveNav: uiStore.setActiveNav,
    mobileMenuOpen: uiStore.mobileMenuOpen,
    setMobileMenuOpen: uiStore.setMobileMenuOpen,
    filter: uiStore.filter,
    setFilter: uiStore.setFilter,

    // Data State
    fiatTotal: dataStore.fiatTotal,
    cryptoTotal: dataStore.cryptoTotal,
    transactions: dataStore.transactions,
    updateTransaction: dataStore.updateTransaction,

    // Loading and Error States
    loading: appStore.loading,
    setLoading: appStore.setLoading,
    error: appStore.error,
    setError: appStore.setError,
  };
};

export default useStore;
