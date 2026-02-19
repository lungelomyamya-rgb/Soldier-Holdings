/**
 * Test Data Service
 * 
 * Mock implementation for testing purposes
 * Provides predictable data and behavior for unit tests
 */

import { IDataService } from '../interfaces/IDataService';
import { Transaction } from '../types';

export class TestDataService implements IDataService {
  private mockTransactions: Transaction[] = [
    {
      id: 1,
      type: 'ZAR',
      amount: 100000,
      currency: 'ZAR',
      from: 'Test User 1 (ID: 1234567890123)',
      status: 'verified',
      statusText: 'Compliant',
      timestamp: new Date('2024-01-01'),
      riskScore: 25
    },
    {
      id: 2,
      type: 'BTC',
      amount: 0.5,
      currency: 'BTC',
      from: 'Wallet: abc123...def456',
      status: 'pending',
      statusText: 'Awaiting KYC',
      timestamp: new Date('2024-01-02'),
      riskScore: 50
    }
  ];

  async getTransactions(): Promise<Transaction[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 10));
    return [...this.mockTransactions];
  }

  async updateTransactionStatus(transactionId: number, newStatus: 'pending' | 'scanning' | 'verified' | 'rejected'): Promise<Transaction | undefined> {
    await new Promise(resolve => setTimeout(resolve, 5));
    
    const transaction = this.mockTransactions.find(tx => tx.id === transactionId);
    if (transaction) {
      transaction.status = newStatus;
      transaction.statusText = this.getStatusText(newStatus);
      return { ...transaction };
    }
    return undefined;
  }

  async getTransactionById(transactionId: number): Promise<Transaction | undefined> {
    await new Promise(resolve => setTimeout(resolve, 5));
    const transaction = this.mockTransactions.find(tx => tx.id === transactionId);
    return transaction ? { ...transaction } : undefined;
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 5));
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.max(...this.mockTransactions.map(tx => tx.id)) + 1
    };
    
    this.mockTransactions.push(newTransaction);
    return { ...newTransaction };
  }

  async deleteTransaction(transactionId: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 5));
    
    const index = this.mockTransactions.findIndex(tx => tx.id === transactionId);
    if (index > -1) {
      this.mockTransactions.splice(index, 1);
      return true;
    }
    return false;
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Awaiting KYC',
      'scanning': 'Scanning Forensics...',
      'verified': 'Compliant',
      'rejected': 'Violation Detected'
    };
    return statusMap[status] || 'Unknown';
  }

  // Test-specific methods
  setMockTransactions(transactions: Transaction[]): void {
    this.mockTransactions = [...transactions];
  }

  clearTransactions(): void {
    this.mockTransactions = [];
  }
}
