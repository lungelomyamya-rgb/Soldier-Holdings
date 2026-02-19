/**
 * Component Props Types
 * 
 * Type definitions for all React component props
 */

import { ReactNode } from 'react';
import { Transaction } from './transaction';
import { Stat } from './ui';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Specific component props
export interface PulseCardProps extends BaseComponentProps {
  type: 'fiat' | 'crypto';
  amount: number;
  stats: Stat[];
  badge: string;
}

export interface SidebarProps extends BaseComponentProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  path: string;
}

export interface TransactionItemProps extends BaseComponentProps {
  transaction: Transaction;
}

export interface TransactionFeedProps extends BaseComponentProps {
  transactions: Transaction[];
  filter: string | Transaction['type'];
  onFilterChange: (filter: string) => void;
}

// Page component props
export interface OverviewPageProps extends BaseComponentProps {
  transactions: Transaction[];
  filter: string;
  onFilterChange: (filter: string) => void;
  fiatTotal: number;
  cryptoTotal: number;
}

export interface FiatPageProps extends BaseComponentProps {
  transactions: Transaction[];
  fiatTotal: number;
}

export interface CryptoPageProps extends BaseComponentProps {
  transactions: Transaction[];
  cryptoTotal: number;
}

export interface CompliancePageProps extends BaseComponentProps {
  // Add compliance-specific props as needed
}

export interface AnalyticsPageProps extends BaseComponentProps {
  // Add analytics-specific props as needed
}

export interface LoggingProviderProps extends BaseComponentProps {
  children: ReactNode;
  userId?: string;
  _enableDebugLogging?: boolean;
  _remoteEndpoint?: string;
}

export interface LoggingErrorBoundaryProps extends BaseComponentProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface LoggingErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface UserMessagesProps extends BaseComponentProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
