/**
 * Store and State Management Types
 * 
 * Types for Zustand stores, state management, and data flow
 */

import { Transaction } from './transaction';
import { UserMessage } from './errors';

// Store state types
export interface StoreState {
  // Data State
  transactions: Transaction[];
  fiatTotal: number;
  cryptoTotal: number;
  loading: boolean;
  error: string | null;
  
  // UI State
  activeNav: string;
  mobileMenuOpen: boolean;
  filter: string;
  
  // App State
  notifications: UserMessage[];
  isOnline: boolean;
}

// Data fetching state
export interface DataFetchingState {
  // Data state
  transactions: Transaction[];
  fiatTotal: number;
  cryptoTotal: number;
  
  // Loading state
  loading: boolean;
  error: string | null;
  
  // Fetching actions
  fetchTransactions: () => Promise<void>;
  refetch: () => Promise<void>;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;
  clearError: () => void;
}

// Store options and configuration
export interface StoreOptions {
  name: string;
  devtools?: boolean;
  persist?: boolean;
  version?: number;
}

// Store middleware types
export interface MiddlewareConfig {
  type: 'logger' | 'persist' | 'devtools' | 'immer';
  options?: Record<string, unknown>;
}

// State selectors
export interface StateSelectors<T> {
  [key: string]: (state: T) => any;
}

// State actions
export interface StateActions<T> {
  [key: string]: (state: T, ...args: any[]) => void | T;
}

// Computed state
export interface ComputedState<T> {
  [key: string]: (state: T) => any;
}

// Store subscription types
export type StoreSubscription<T> = (state: T, prevState: T) => void;
export type StoreUnsubscribe = () => void;

// Store creator types
export interface StoreCreator<T> {
  (set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void, get: () => T): T;
}
