/**
 * Settings Page Component
 * 
 * Dedicated page for system configuration
 * and user access management
 */

import React from 'react';

const SettingsPage = () => {
    return (
        <>
            <header className="header">
                <h2>Settings & User Access Control</h2>
                <p>System configuration and user management</p>
            </header>
            
            <div className="settings-dashboard">
                <div className="settings-card card">
                    <h3>System Configuration</h3>
                    <div className="settings-section">
                        <div className="setting-item">
                            <label>Real-time Monitoring</label>
                            <div className="toggle-switch">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="toggle-slider" />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label>Auto-compliance Checks</label>
                            <div className="toggle-switch">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="toggle-slider" />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label>Email Notifications</label>
                            <div className="toggle-switch">
                                <input type="checkbox" defaultChecked={false} />
                                <span className="toggle-slider" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="settings-card card">
                    <h3>User Management</h3>
                    <div className="user-list">
                        <div className="user-item">
                            <div className="user-avatar">
                                <i className="fas fa-user-shield" />
                            </div>
                            <div className="user-info">
                                <div className="user-name">Admin User</div>
                                <div className="user-role">System Administrator</div>
                            </div>
                            <div className="user-status active">Active</div>
                        </div>
                        <div className="user-item">
                            <div className="user-avatar">
                                <i className="fas fa-user" />
                            </div>
                            <div className="user-info">
                                <div className="user-name">Compliance Officer</div>
                                <div className="user-role">Compliance Manager</div>
                            </div>
                            <div className="user-status active">Active</div>
                        </div>
                        <div className="user-item">
                            <div className="user-avatar">
                                <i className="fas fa-user" />
                            </div>
                            <div className="user-info">
                                <div className="user-name">Analyst User</div>
                                <div className="user-role">Risk Analyst</div>
                            </div>
                            <div className="user-status inactive">Inactive</div>
                        </div>
                    </div>
                </div>
                
                <div className="settings-card card">
                    <h3>Security Settings</h3>
                    <div className="settings-section">
                        <div className="setting-item">
                            <label>Two-Factor Authentication</label>
                            <div className="toggle-switch">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="toggle-slider" />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label>Session Timeout (minutes)</label>
                            <input 
                                type="number" 
                                defaultValue="30"
                                className="number-input"
                            />
                        </div>
                        <div className="setting-item">
                            <label>Audit Logging</label>
                            <div className="toggle-switch">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="toggle-slider" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Attach to window for global access
window.SettingsPage = SettingsPage;

export default SettingsPage;
