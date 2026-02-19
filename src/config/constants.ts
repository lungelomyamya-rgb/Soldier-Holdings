/**
 * Application Constants
 *
 * Central constants that now use the environment configuration system
 * Maintains backward compatibility while leveraging environment-based config
 */

import config, { isDevelopment, isProduction, isTest, isFeatureEnabled } from './environment';

// Update intervals (from business config)
export const UPDATE_INTERVAL = config.business.compliance.updateInterval;
export const ANIMATION_DURATION = config.development.debugMode ? 300 : 0;
export const MAX_TRANSACTIONS = 1000;

// Compliance thresholds (from business config)
export const COMPLIANCE_THRESHOLDS = {
  ANNUAL_LIMIT: config.business.compliance.annualLimit,
  DISCLOSURE_THRESHOLD: config.business.compliance.disclosureThreshold,
  WALLET_RISK_THRESHOLD: 75, // Default risk threshold
};

// API endpoints (from api config)
export const API_ENDPOINTS = {
  BASE_URL: config.api.baseUrl,
  TRANSACTIONS: `${config.api.baseUrl}/transactions`,
  COMPLIANCE: `${config.api.baseUrl}/compliance`,
  REPORTS: `${config.api.baseUrl}/reports`,
  ANALYTICS: `${config.api.baseUrl}/analytics`,
  USERS: `${config.api.baseUrl}/users`,
};

// App information (from app config)
export const APP = {
  NAME: config.app.name,
  VERSION: config.app.version,
  DESCRIPTION: config.app.description,
  ENVIRONMENT: config.app.environment,
};

// Navigation items
export const NAVIGATION_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'fas fa-tachometer-alt' },
  { id: 'fiat', label: 'Fiat Operations', icon: 'fas fa-money-bill-wave' },
  { id: 'crypto', label: 'Crypto Operations', icon: 'fas fa-coins' },
  { id: 'compliance', label: 'Compliance Vault', icon: 'fas fa-shield-alt' },
  { id: 'analytics', label: 'Risk Intelligence', icon: 'fas fa-chart-line' },
  { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
];

// Transaction types
export const TRANSACTION_TYPES = {
  ZAR: 'ZAR',
  BTC: 'BTC',
  ETH: 'ETH',
} as const;

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SCANNING: 'scanning',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  API_ERROR: 'Failed to connect to the server. Please try again later.',
  VALIDATION_ERROR: 'Invalid data provided. Please check your input.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully.',
  TRANSACTION_UPDATED: 'Transaction updated successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  USER_CREATED: 'User created successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
};

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
};

// Pagination (from UI config)
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: config.ui.pagination.defaultPageSize,
  MAX_PAGE_SIZE: config.ui.pagination.maxPageSize,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'YYYY-MM-DD HH:mm:ss',
  SHORT: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

// Currency formatting (from business config)
export const CURRENCY_FORMATS = {
  ZAR: { symbol: 'R', decimalPlaces: 2 },
  BTC: { symbol: 'BTC', decimalPlaces: 8 },
  ETH: { symbol: 'ETH', decimalPlaces: 6 },
};

// Feature flags (from features config)
export const FEATURES = {
  CRYPTO: isFeatureEnabled('crypto'),
  ANALYTICS: isFeatureEnabled('analytics'),
  REAL_TIME_UPDATES: isFeatureEnabled('realTimeUpdates'),
  COMPLIANCE: isFeatureEnabled('compliance'),
  BANKING: isFeatureEnabled('banking'),
  BLOCKCHAIN: isFeatureEnabled('blockchain'),
};

// Export the configuration for direct access
export { config };

// Export configuration utilities
export { isDevelopment, isProduction, isTest, isFeatureEnabled };
