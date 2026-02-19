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

export interface SettingsPageProps extends BaseComponentProps {
  // Add settings-specific props as needed
}
