/**
 * UI Store Tests
 *
 * Comprehensive test coverage for UI state management
 */

import { renderHook, act } from '@testing-library/react';
import useUIStore from '../../store/uiStore';

// Mock Zustand devtools
jest.mock('zustand/middleware', () => ({
  devtools: (fn: (...args: unknown[]) => unknown) => fn,
}));

describe('UI Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
      activeNav: 'overview',
      mobileMenuOpen: false,
      filter: 'all',
      theme: 'light',
    });
  });

  describe('Navigation State', () => {
    it('should have initial navigation state', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.activeNav).toBe('overview');
    });

    it('should update active navigation', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setActiveNav('fiat');
      });

      expect(result.current.activeNav).toBe('fiat');
    });

    it('should handle navigation changes correctly', () => {
      const { result } = renderHook(() => useUIStore());

      const navItems = ['overview', 'fiat', 'crypto', 'compliance', 'analytics', 'settings'];

      navItems.forEach(nav => {
        act(() => {
          result.current.setActiveNav(nav);
        });
        expect(result.current.activeNav).toBe(nav);
      });
    });
  });

  describe('Mobile Menu State', () => {
    it('should have initial mobile menu state', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.mobileMenuOpen).toBe(false);
    });

    it('should toggle mobile menu', () => {
      const { result } = renderHook(() => useUIStore());

      // Initial state should be false
      expect(result.current.mobileMenuOpen).toBe(false);

      // Toggle to true
      act(() => {
        result.current.toggleMobileMenu();
      });
      expect(result.current.mobileMenuOpen).toBe(true);

      // Toggle back to false
      act(() => {
        result.current.toggleMobileMenu();
      });
      expect(result.current.mobileMenuOpen).toBe(false);
    });

    it('should set mobile menu state directly', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setMobileMenuOpen(true);
      });
      expect(result.current.mobileMenuOpen).toBe(true);

      act(() => {
        result.current.setMobileMenuOpen(false);
      });
      expect(result.current.mobileMenuOpen).toBe(false);
    });
  });

  describe('Filter State', () => {
    it('should have initial filter state', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.filter).toBe('all');
    });

    it('should update filter', () => {
      const { result } = renderHook(() => useUIStore());

      const filters = ['all', 'ZAR', 'BTC', 'ETH'];

      filters.forEach(filter => {
        act(() => {
          result.current.setFilter(filter);
        });
        expect(result.current.filter).toBe(filter);
      });
    });
  });

  describe('Theme State', () => {
    it('should have initial theme state', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.theme).toBe('light');
    });

    it('should switch between themes', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setTheme('dark');
      });
      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.setTheme('light');
      });
      expect(result.current.theme).toBe('light');
    });
  });

  describe('State Interactions', () => {
    it('should handle multiple state changes independently', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setActiveNav('crypto');
        result.current.setMobileMenuOpen(true);
        result.current.setFilter('BTC');
        result.current.setTheme('dark');
      });

      expect(result.current.activeNav).toBe('crypto');
      expect(result.current.mobileMenuOpen).toBe(true);
      expect(result.current.filter).toBe('BTC');
      expect(result.current.theme).toBe('dark');
    });

    it('should maintain state consistency across updates', () => {
      const { result } = renderHook(() => useUIStore());

      // Set initial state
      act(() => {
        result.current.setActiveNav('fiat');
        result.current.setMobileMenuOpen(true);
      });

      // Update only one piece of state
      act(() => {
        result.current.setFilter('ZAR');
      });

      // Other states should remain unchanged
      expect(result.current.activeNav).toBe('fiat');
      expect(result.current.mobileMenuOpen).toBe(true);
      expect(result.current.filter).toBe('ZAR');
      expect(result.current.theme).toBe('light');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useUIStore());

      // Rapidly toggle mobile menu (odd number of toggles = true)
      for (let i = 0; i < 11; i++) {
        act(() => {
          result.current.toggleMobileMenu();
        });
      }

      // Should end with true (odd number of toggles from false initial state)
      expect(result.current.mobileMenuOpen).toBe(true);
    });

    it('should handle same navigation set multiple times', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setActiveNav('overview');
        result.current.setActiveNav('overview');
        result.current.setActiveNav('overview');
      });

      expect(result.current.activeNav).toBe('overview');
    });
  });
});
