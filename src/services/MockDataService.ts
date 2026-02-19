/**
 * Mock Data Service
 *
 * Provides mock data for demonstration purposes
 * In production, this would connect to actual backend APIs
 *
 * Architecture: Service layer pattern for data abstraction
 * Standards: Async/await, error handling, data validation
 */

import { Transaction } from '../types';
import { IDataService } from '../interfaces/IDataService';

class MockDataService implements IDataService {
    private transactions: Transaction[];
    private fiatTotal: number;
    private cryptoTotal: number;
    private transactionCounter: number;

    constructor() {
        this.transactionCounter = 1;
        this.fiatTotal = 1245780;
        this.cryptoTotal = 0.34;
        this.transactions = this.generateInitialTransactions();
    }

    /**
     * Generate initial transaction data for demo
     * @returns Array of transaction objects
     */
    private generateInitialTransactions(): Transaction[] {
        const transactions: Transaction[] = [];
        for (let i = 0; i < 20; i++) {
            transactions.push(this.generateRandomTransaction());
        }
        return transactions;
    }

    /**
     * Fetch all transactions
     * @returns Promise of transactions array
     */
    async getTransactions(): Promise<Transaction[]> {
        return new Promise(resolve => {
            setTimeout(() => resolve(this.transactions), 100);
        });
    }

    /**
     * Update transaction status
     * @param transactionId - Transaction ID
     * @param newStatus - New status value
     * @returns Updated transaction or undefined
     */
    async updateTransactionStatus(transactionId: number, newStatus: 'pending' | 'scanning' | 'verified' | 'rejected'): Promise<Transaction | undefined> {
        const transaction = this.transactions.find(tx => tx.id === transactionId);
        if (transaction) {
            transaction.status = newStatus;
            transaction.statusText = this.getStatusText(newStatus);
            return { ...transaction }; // Return a copy to ensure ID is preserved
        }
        return undefined;
    }

    /**
     * Get status text for display
     * @param status - Status code
     * @returns Human-readable status text
     */
    private getStatusText(status: string): string {
        const statusMap: Record<string, string> = {
            'pending': 'Awaiting KYC',
            'scanning': 'Scanning Forensics...',
            'verified': 'Compliant',
            'rejected': 'Violation Detected'
        };
        return statusMap[status] || 'Unknown';
    }

    /**
     * Get transaction by ID
     * @param transactionId - Transaction ID
     * @returns Transaction or undefined
     */
    async getTransactionById(transactionId: number): Promise<Transaction | undefined> {
        return new Promise(resolve => {
            setTimeout(() => {
                const transaction = this.transactions.find(tx => tx.id === transactionId);
                resolve(transaction ? { ...transaction } : undefined);
            }, 50);
        });
    }

    /**
     * Add new transaction
     * @param transaction - Transaction to add
     * @returns Added transaction
     */
    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        return new Promise(resolve => {
            setTimeout(() => {
                const newTransaction: Transaction = {
                    ...transaction,
                    id: this.transactionCounter++
                };
                this.transactions.push(newTransaction);
                resolve({ ...newTransaction });
            }, 100);
        });
    }

    /**
     * Delete transaction
     * @param transactionId - Transaction ID
     * @returns Success status
     */
    async deleteTransaction(transactionId: number): Promise<boolean> {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = this.transactions.findIndex(tx => tx.id === transactionId);
                if (index > -1) {
                    this.transactions.splice(index, 1);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 50);
        });
    }
    private generateRandomTransaction(): Transaction {
        const types: ('ZAR' | 'BTC' | 'ETH')[] = ['ZAR', 'BTC', 'ETH'];
        const type: 'ZAR' | 'BTC' | 'ETH' = types[Math.floor(Math.random() * types.length)];

        return {
            id: this.transactionCounter++,
            type,
            amount: type === 'ZAR'
                ? Math.floor(Math.random() * 200000) + 10000
                : Math.random() * 0.5 + 0.01,
            currency: type,
            from: type === 'ZAR'
                ? `User ${Math.floor(Math.random() * 1000)} (ID: ${Math.random().toString().substr(2, 13)})`
                : `Wallet: ${Math.random().toString(36).substr(2, 12)}...${Math.random().toString(36).substr(2, 8)}`,
            status: 'pending',
            statusText: 'Processing...',
            timestamp: new Date(),
            riskScore: Math.floor(Math.random() * 100)
        };
    }
}

export default MockDataService;
