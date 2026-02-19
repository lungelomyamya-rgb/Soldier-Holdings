/**
 * Production Configuration
 * 
 * Settings for production environment
 * Optimized for security, performance, and reliability
 */

export const productionConfig = {
  // Environment identification
  environment: 'production' as const,
  isDevelopment: false,
  isProduction: true,
  isTest: false,

  // API Configuration
  api: {
    baseUrl: 'https://api.soldierholdings.com/api',
    timeout: 15000,
    retries: 2,
    retryDelay: 2000,
  },

  // Data Service Configuration
  dataService: {
    mockDataEnabled: false,
    realTimeUpdates: true,
    updateInterval: 5000,
    enableLogging: false,
    simulateErrors: false,
    errorRate: 0,
  },

  // Error Handling Configuration
  errorHandling: {
    sentryEnabled: true,
    logToConsole: false,
    logToLocalStorage: false,
    showDetailedErrors: false,
    enableUserNotifications: true,
    maxLogEntries: 50,
  },

  // Feature Flags
  features: {
    analytics: true,
    compliance: true,
    riskAssessment: true,
    realTimeMonitoring: true,
    debugMode: false,
    experimentalFeatures: false,
  },

  // UI Configuration
  ui: {
    theme: 'light' as const,
    animations: true,
    reducedMotion: false,
    highContrast: false,
    showDebugInfo: false,
    enableHotReload: false,
  },

  // Security Configuration
  security: {
    enableCSP: true,
    requireHTTPS: true,
    sessionTimeout: 1800000, // 30 minutes in ms
    maxLoginAttempts: 5,
    enableAuditLogging: true,
  },

  // Performance Configuration
  performance: {
    enableServiceWorker: true,
    enableCaching: true,
    cacheTimeout: 600000, // 10 minutes
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableTreeShaking: true,
  },

  // Monitoring Configuration
  monitoring: {
    enablePerformanceMonitoring: true,
    enableUserTracking: true,
    enableErrorTracking: true,
    enableAnalytics: true,
    samplingRate: 0.1, // 10% sampling for production
  },

  // Development Tools (disabled in production)
  development: {
    enableReduxDevTools: false,
    enableReactDevTools: false,
    enableSourceMaps: false,
    enableHotModuleReplacement: false,
    showComponentNames: false,
    enableDebugPanel: false,
  },

  // Business Logic Configuration
  business: {
    defaultCurrency: 'ZAR',
    supportedCurrencies: ['ZAR', 'BTC', 'ETH'],
    transactionLimits: {
      maxFiatTransaction: 5000000, // 5M ZAR (lower than dev)
      maxCryptoTransaction: 5, // 5 BTC (lower than dev)
      dailyTransactionLimit: 25000000, // 25M ZAR (lower than dev)
    },
    complianceThresholds: {
      highRiskThreshold: 70, // Stricter than dev
      mediumRiskThreshold: 40,
      lowRiskThreshold: 15,
    },
    notificationSettings: {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableInAppNotifications: true,
      notificationDuration: 3000, // Shorter in production
    },
  },

  // Logging Configuration
  logging: {
    level: 'error' as const, // Only errors in production
    enableConsoleLogging: false,
    enableFileLogging: false,
    enableRemoteLogging: true,
    logFormat: 'json',
    maxFileSize: 5242880, // 5MB
    maxFiles: 3,
  },
};
