/**
 * App Store Tests
 *
 * Comprehensive test coverage for application-wide state management
 */

import { renderHook, act } from '@testing-library/react';
import useAppStore from '../../store/appStore';

// Mock Zustand devtools
jest.mock('zustand/middleware', () => ({
  devtools: (fn: (...args: unknown[]) => unknown) => fn,
}));

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${Math.random().toString(36).substring(2, 11)}`,
  },
});

describe('App Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.setState({
      loading: false,
      error: null,
      isOnline: true,
      autoRefresh: true,
      notifications: [],
    });

    // Clear all timers
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    it('should have initial loading state', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.loading).toBe(false);
    });

    it('should update loading state', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
      });
      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should have initial error state', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.error).toBeNull();
    });

    it('should set and clear error messages', () => {
      const { result } = renderHook(() => useAppStore());

      const errorMessage = 'Network error occurred';

      act(() => {
        result.current.setError(errorMessage);
      });
      expect(result.current.error).toBe(errorMessage);

      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });

    it('should handle null error setting', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setError('Test error');
      });
      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.setError(null);
      });
      expect(result.current.error).toBeNull();
    });
  });

  describe('Online Status', () => {
    it('should have initial online status', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.isOnline).toBe(true);
    });

    it('should update online status', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setIsOnline(false);
      });
      expect(result.current.isOnline).toBe(false);

      act(() => {
        result.current.setIsOnline(true);
      });
      expect(result.current.isOnline).toBe(true);
    });
  });

  describe('Auto Refresh Setting', () => {
    it('should have initial auto refresh state', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.autoRefresh).toBe(true);
    });

    it('should toggle auto refresh', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setAutoRefresh(false);
      });
      expect(result.current.autoRefresh).toBe(false);

      act(() => {
        result.current.setAutoRefresh(true);
      });
      expect(result.current.autoRefresh).toBe(true);
    });
  });

  describe('Notifications', () => {
    it('should have empty notifications initially', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.notifications).toEqual([]);
    });

    it('should add notification', () => {
      const { result } = renderHook(() => useAppStore());

      const notification = {
        type: 'success' as const,
        title: 'Success',
        message: 'Operation completed successfully',
      };

      act(() => {
        result.current.addNotification(notification);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject({
        type: 'success',
        title: 'Success',
        message: 'Operation completed successfully',
        autoClose: true,
      });
      expect(result.current.notifications[0].id).toBeDefined();
      expect(result.current.notifications[0].timestamp).toBeInstanceOf(Date);
    });

    it('should add notification without auto-close', () => {
      const { result } = renderHook(() => useAppStore());

      const notification = {
        type: 'error' as const,
        title: 'Error',
        message: 'Critical error occurred',
        autoClose: false,
      };

      act(() => {
        result.current.addNotification(notification);
      });

      expect(result.current.notifications[0].autoClose).toBe(false);
    });

    it('should remove notification by ID', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addNotification({
          type: 'info',
          title: 'Info',
          message: 'Information message',
        });
      });

      const notificationId = result.current.notifications[0].id;

      act(() => {
        result.current.removeNotification(notificationId);
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it('should clear all notifications', () => {
      const { result } = renderHook(() => useAppStore());

      // Add multiple notifications
      act(() => {
        result.current.addNotification({
          type: 'info',
          title: 'Info 1',
          message: 'Message 1',
        });
        result.current.addNotification({
          type: 'warning',
          title: 'Warning',
          message: 'Warning message',
        });
      });

      expect(result.current.notifications).toHaveLength(2);

      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it('should auto-close notification after timeout', () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addNotification({
          type: 'info',
          title: 'Auto-close Test',
          message: 'This should auto-close',
        });
      });

      expect(result.current.notifications).toHaveLength(1);

      // Fast-forward 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it('should not auto-close notification when autoClose is false', () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addNotification({
          type: 'error',
          title: 'No Auto-close',
          message: 'This should not auto-close',
          autoClose: false,
        });
      });

      expect(result.current.notifications).toHaveLength(1);

      // Fast-forward 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.notifications).toHaveLength(1);
    });

    it('should handle different notification types', () => {
      const { result } = renderHook(() => useAppStore());

      const types: Array<'success' | 'error' | 'warning' | 'info'> = [
        'success',
        'error',
        'warning',
        'info',
      ];

      types.forEach(type => {
        act(() => {
          result.current.addNotification({
            type,
            title: `${type.charAt(0).toUpperCase()}${type.slice(1)} Title`,
            message: `${type} message`,
          });
        });
      });

      expect(result.current.notifications).toHaveLength(4);

      result.current.notifications.forEach((notification, index) => {
        expect(notification.type).toBe(types[index]);
      });
    });
  });

  describe('State Interactions', () => {
    it('should handle multiple state changes', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
        result.current.setError('Test error');
        result.current.setIsOnline(false);
        result.current.setAutoRefresh(false);
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe('Test error');
      expect(result.current.isOnline).toBe(false);
      expect(result.current.autoRefresh).toBe(false);
    });

    it('should maintain independent state updates', () => {
      const { result } = renderHook(() => useAppStore());

      // Set initial state
      act(() => {
        result.current.setLoading(true);
        result.current.addNotification({
          type: 'info',
          title: 'Test',
          message: 'Test notification',
        });
      });

      // Update only loading
      act(() => {
        result.current.setLoading(false);
      });

      // Other states should remain unchanged
      expect(result.current.loading).toBe(false);
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle removing non-existent notification', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.removeNotification('non-existent-id');
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it('should handle clearing empty notifications', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications).toHaveLength(0);
    });
  });
});
