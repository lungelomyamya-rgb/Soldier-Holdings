/**
 * Configuration and Environment Types
 * 
 * Types for application configuration, environment settings, and feature flags
 */

// Environment configuration
export interface EnvironmentConfig {
  environment: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// API configuration
export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

// Data service configuration
export interface DataServiceConfig {
  mockDataEnabled: boolean;
  realTimeUpdates: boolean;
  updateInterval: number;
  enableLogging: boolean;
  simulateErrors: boolean;
  errorRate: number;
}

// Error handling configuration
export interface ErrorHandlingConfig {
  sentryEnabled: boolean;
  logToConsole: boolean;
  logToLocalStorage: boolean;
  maxLogEntries: number;
  userNotificationDuration: number;
}

// Feature flags
export interface FeatureFlags {
  analytics: boolean;
  compliance: boolean;
  debugMode: boolean;
  experimentalFeatures: boolean;
  advancedFilters: boolean;
  realTimeUpdates: boolean;
  offlineMode: boolean;
  darkMode: boolean;
}

// UI configuration
export interface UIConfig {
  theme: 'light' | 'dark' | 'auto';
  animations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  sidebarCollapsed: boolean;
  notifications: boolean;
  language: string;
  timezone: string;
}

// Security configuration
export interface SecurityConfig {
  contentSecurityPolicy: boolean;
  httpsRequired: boolean;
  sessionTimeout: number;
  auditLogging: boolean;
  maxLoginAttempts: number;
  passwordMinLength: number;
}

// Performance configuration
export interface PerformanceConfig {
  serviceWorkerEnabled: boolean;
  cachingEnabled: boolean;
  lazyLoading: boolean;
  codeSplitting: boolean;
  imageOptimization: boolean;
  bundleAnalysis: boolean;
}

// Business logic configuration
export interface BusinessConfig {
  supportedCurrencies: string[];
  transactionLimits: {
    maxFiatTransaction: number;
    maxCryptoTransaction: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
  complianceThresholds: {
    annualLimit: number;
    disclosureThreshold: number;
    walletRiskThreshold: number;
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
}

// Logging configuration
export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  maxFileSize: number;
  maxFiles: number;
}

// Testing configuration
export interface TestingConfig {
  mockDataEnabled: boolean;
  realTimeUpdatesDisabled: boolean;
  errorLoggingDisabled: boolean;
  userNotificationsDisabled: boolean;
  predictableBehavior: boolean;
  deterministicData: boolean;
}

// Complete application configuration
export interface AppConfig extends EnvironmentConfig {
  api: APIConfig;
  dataService: DataServiceConfig;
  errorHandling: ErrorHandlingConfig;
  features: FeatureFlags;
  ui: UIConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
  business: BusinessConfig;
  logging: LoggingConfig;
  testing?: TestingConfig;
}

// Configuration validation
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Configuration utilities
export interface ConfigUtilities {
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
  getApiUrl: (endpoint: string) => string;
  getBusinessConfig: () => BusinessConfig;
  validateConfig: () => ConfigValidationResult;
}
