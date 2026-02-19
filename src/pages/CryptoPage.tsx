/**
 * Crypto Operations Page Component
 * 
 * Dedicated page for cryptocurrency transactions
 * and crypto rail forensic analysis
 */

import PulseCard from '../components/PulseCard';
import TransactionFeed from '../components/TransactionFeed';
import React from 'react';
import { CryptoPageProps, Transaction } from '../types/index';


const CryptoPage = ({ transactions, cryptoTotal }: CryptoPageProps) => {
    const cryptoTransactions = transactions.filter((tx: Transaction) => tx.type !== 'ZAR');

    return (
        <>
            <header className="header">
                <h2>Rail Beta - Crypto Operations</h2>
                <p>Cryptocurrency transaction monitoring and forensic analysis</p>
            </header>
            
            <div className="pulse-cards">
                <PulseCard
                    type="crypto"
                    amount={cryptoTotal}
                    stats={[
                        { label: 'In Escrow', value: '0.18 BTC' },
                        { label: 'Settled', value: '0.16 BTC' }
                    ]}
                    badge="Beta"
                />
            </div>
            
            <div className="crypto-metrics">
                <div className="metric-card card">
                    <h3>Crypto Transaction Volume</h3>
                    <div className="metric-value">0.34 BTC</div>
                    <div className="metric-change positive">
                        <i className="fas fa-arrow-up" />
                        {' '}+28.3% vs last month
                    </div>
                </div>
                <div className="metric-card card">
                    <h3>Wallet Addresses</h3>
                    <div className="metric-value">1,247</div>
                    <div className="metric-change positive">
                        <i className="fas fa-arrow-up" />
                        {' '}+15.7% vs last month
                    </div>
                </div>
                <div className="metric-card card">
                    <h3>Risk Score Average</h3>
                    <div className="metric-value">42.3</div>
                    <div className="metric-change negative">
                        <i className="fas fa-arrow-down" />
                        {' '}-8.2% vs last month
                    </div>
                </div>
            </div>
            
            <TransactionFeed
                transactions={cryptoTransactions}
                filter="crypto"
                onFilterChange={() => {}}
            />
        </>
    );
};

// Attach to window for global access
window.CryptoPage = CryptoPage;

export default CryptoPage;
