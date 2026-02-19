/**
 * Compliance Vault Page Component
 * 
 * Dedicated page for regulatory compliance monitoring
 * and audit trail management
 */

import React from 'react';

const CompliancePage = () => {
    return (
        <>
            <header className="header">
                <h2>Compliance Vault</h2>
                <p>Regulatory compliance monitoring and audit trails</p>
            </header>
            
            <div className="compliance-dashboard">
                <div className="compliance-card card">
                    <h3>Compliance Status</h3>
                    <div className="compliance-metrics">
                        <div className="compliance-metric">
                            <span className="metric-label">Overall Compliance Rate</span>
                            <span className="metric-value success">98.4%</span>
                        </div>
                        <div className="compliance-metric">
                            <span className="metric-label">Flagged Transactions</span>
                            <span className="metric-value warning">23</span>
                        </div>
                        <div className="compliance-metric">
                            <span className="metric-label">Resolved Issues</span>
                            <span className="metric-value success">156</span>
                        </div>
                        <div className="compliance-metric">
                            <span className="metric-label">Pending Review</span>
                            <span className="metric-value">8</span>
                        </div>
                    </div>
                </div>
                
                <div className="compliance-card card">
                    <h3>Recent Compliance Events</h3>
                    <div className="compliance-events">
                        <div className="event-item">
                            <div className="event-icon success">
                                <i className="fas fa-check" />
                            </div>
                            <div className="event-details">
                                <div className="event-title">Transaction Verified</div>
                                <div className="event-time">2 minutes ago</div>
                            </div>
                        </div>
                        <div className="event-item">
                            <div className="event-icon warning">
                                <i className="fas fa-exclamation-triangle" />
                            </div>
                            <div className="event-details">
                                <div className="event-title">Manual Review Required</div>
                                <div className="event-time">15 minutes ago</div>
                            </div>
                        </div>
                        <div className="event-item">
                            <div className="event-icon success">
                                <i className="fas fa-shield-alt" />
                            </div>
                            <div className="event-details">
                                <div className="event-title">Audit Trail Updated</div>
                                <div className="event-time">1 hour ago</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="compliance-card card">
                    <h3>Compliance Reports</h3>
                    <div className="report-list">
                        <div className="report-item">
                            <div className="report-info">
                                <div className="report-name">Monthly Compliance Report</div>
                                <div className="report-date">January 2026</div>
                            </div>
                            <button className="report-download">
                                <i className="fas fa-download" />
                                Download
                            </button>
                        </div>
                        <div className="report-item">
                            <div className="report-info">
                                <div className="report-name">Audit Trail Summary</div>
                                <div className="report-date">Q4 2025</div>
                            </div>
                            <button className="report-download">
                                <i className="fas fa-download" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Attach to window for global access
window.CompliancePage = CompliancePage;

export default CompliancePage;
