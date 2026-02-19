/**
 * Core Transaction Types
 * 
 * Fundamental types for transaction data and operations
 */

export type TransactionType = 'ZAR' | 'BTC' | 'ETH';
export type TransactionStatus = 'pending' | 'scanning' | 'verified' | 'rejected';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Enhanced Transaction Interface
export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  currency: string;
  from: string;
  status: TransactionStatus;
  statusText: string;
  timestamp: Date;
  riskScore: number;
}

// Transaction-related interfaces
export interface TransactionUpdate {
  id: number;
  updates: Partial<Transaction>;
}

export interface TransactionFilter {
  type?: TransactionType | 'all';
  status?: TransactionStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface TransactionStats {
  total: number;
  byType: Record<TransactionType, number>;
  byStatus: Record<TransactionStatus, number>;
  totalAmount: Record<TransactionType, number>;
  averageAmount: Record<TransactionType, number>;
}
