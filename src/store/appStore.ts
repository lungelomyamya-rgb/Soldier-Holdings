/**
 * Application Store
 * 
 * Manages application-wide state (loading, errors, global settings)
 * Handles cross-cutting concerns like loading states and error handling
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  // Loading States
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Error Handling
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Application Status
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  
  // Global Settings
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
}

const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Loading State
      loading: false,
      setLoading: (loading) => set({ loading }),
      
      // Error Handling
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Application Status
      isOnline: navigator.onLine,
      setIsOnline: (isOnline) => set({ isOnline }),
      
      // Global Settings
      autoRefresh: true,
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = crypto.randomUUID();
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: new Date(),
          autoClose: notification.autoClose ?? true,
        };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        // Auto-close notification after 5 seconds
        if (newNotification.autoClose) {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: 'app-store' }
  )
);

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setIsOnline(true);
  });
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setIsOnline(false);
  });
}

export default useAppStore;
export type { Notification };
