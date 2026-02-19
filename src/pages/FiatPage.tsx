/**
 * Fiat Operations Page Component
 * 
 * Dedicated page for traditional currency transactions
 * and fiat rail compliance monitoring
 */

import PulseCard from '../components/PulseCard';
import TransactionFeed from '../components/TransactionFeed';
import React from 'react';
import { FiatPageProps, Transaction } from '../types/index';


const FiatPage = ({ transactions, fiatTotal }: FiatPageProps) => {
    const fiatTransactions = transactions.filter((tx: Transaction) => tx.type === 'ZAR');

    return (
        <>
            <header className="header">
                <h2>Rail Alpha - Fiat Operations</h2>
                <p>Traditional currency transaction monitoring and compliance</p>
            </header>
            
            <div className="pulse-cards">
                <PulseCard
                    type="fiat"
                    amount={fiatTotal}
                    stats={[
                        { label: 'Monthly Budget', value: 'R 15,000,000' },
                        { label: 'Compliance Rate', value: '98.4%' }
                    ]}
                    badge="Active"
                />
            </div>
            
            <div className="fiat-metrics">
                <div className="metric-card card">
                    <h3>Fiat Transaction Volume</h3>
                    <div className="metric-value">R 1,245,780</div>
                    <div className="metric-change positive">
                        <i className="fas fa-arrow-up" />
                        {' '}+12.5% vs last month
                    </div>
                </div>
                <div className="metric-card card">
                    <h3>Active Fiat Accounts</h3>
                    <div className="metric-value">892</div>
                    <div className="metric-change positive">
                        <i className="fas fa-arrow-up" />
                        {' '}+5.2% vs last month
                    </div>
                </div>
                <div className="metric-card card">
                    <h3>Average Transaction</h3>
                    <div className="metric-value">R 9,450</div>
                    <div className="metric-change positive">
                        <i className="fas fa-arrow-up" />
                        {' '}+3.1% vs last month
                    </div>
                </div>
            </div>
            
            <TransactionFeed
                transactions={fiatTransactions}
                filter="ZAR"
                onFilterChange={() => {}}
            />
        </>
    );
};

// Attach to window for global access
window.FiatPage = FiatPage;

export default FiatPage;
