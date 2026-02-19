/**
 * UI State Store
 * 
 * Manages only UI-related state (navigation, filters, UI interactions)
 * Separated from data state for better performance and maintainability
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Navigation State
  activeNav: string;
  setActiveNav: (nav: string) => void;
  
  // Mobile UI State
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  
  // Filter State
  filter: string;
  setFilter: (filter: string) => void;
  
  // UI Preferences
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const useUIStore = create<UIState>()(
  devtools(
    (set, _get) => ({
      // Navigation
      activeNav: 'overview',
      setActiveNav: (nav) => set({ activeNav: nav }),
      
      // Mobile Menu
      mobileMenuOpen: false,
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      
      // Filters
      filter: 'all',
      setFilter: (filter) => set({ filter }),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-store' }
  )
);

export default useUIStore;
