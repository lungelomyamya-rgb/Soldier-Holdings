/**
 * Data Service Interface
 * 
 * Defines the contract for data operations
 * Enables dependency injection and testability
 */

import { Transaction } from '../types/index';

export interface IDataService {
  /**
   * Fetch all transactions
   * @returns Promise of transactions array
   */
  getTransactions(): Promise<Transaction[]>;

  /**
   * Update transaction status
   * @param transactionId - Transaction ID
   * @param newStatus - New status value
   * @returns Updated transaction or undefined
   */
  updateTransactionStatus(transactionId: number, newStatus: 'pending' | 'scanning' | 'verified' | 'rejected'): Promise<Transaction | undefined>;

  /**
   * Get transaction by ID
   * @param transactionId - Transaction ID
   * @returns Transaction or undefined
   */
  getTransactionById(transactionId: number): Promise<Transaction | undefined>;

  /**
   * Add new transaction
   * @param transaction - Transaction to add
   * @returns Added transaction
   */
  addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction>;

  /**
   * Delete transaction
   * @param transactionId - Transaction ID
   * @returns Success status
   */
  deleteTransaction(transactionId: number): Promise<boolean>;
}
