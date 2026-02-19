/**
 * Development Configuration
 *
 * Settings for development environment
 * Includes debugging tools, loose security, and local services
 */

export const developmentConfig = {
  // Environment identification
  environment: 'development' as const,
  isDevelopment: true,
  isProduction: false,
  isTest: false,

  // API Configuration
  api: {
    baseUrl: 'http://localhost:3001/api',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
  },

  // Data Service Configuration
  dataService: {
    mockDataEnabled: true,
    realTimeUpdates: true,
    updateInterval: 3000,
    enableLogging: true,
    simulateErrors: false,
    errorRate: 0.1, // 10% chance of simulated errors
  },

  // Error Handling Configuration
  errorHandling: {
    sentryEnabled: false,
    logToConsole: true,
    logToLocalStorage: true,
    showDetailedErrors: true,
    enableUserNotifications: true,
    maxLogEntries: 100,
  },

  // Feature Flags
  features: {
    analytics: true,
    compliance: true,
    riskAssessment: true,
    realTimeMonitoring: true,
    debugMode: true,
    experimentalFeatures: true,
  },

  // UI Configuration
  ui: {
    theme: 'light' as const,
    animations: true,
    reducedMotion: false,
    highContrast: false,
    showDebugInfo: true,
    enableHotReload: true,
  },

  // Security Configuration
  security: {
    enableCSP: false,
    requireHTTPS: false,
    sessionTimeout: 3600000, // 1 hour in ms
    maxLoginAttempts: 10,
    enableAuditLogging: true,
  },

  // Performance Configuration
  performance: {
    enableServiceWorker: false,
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableTreeShaking: true,
  },

  // Monitoring Configuration
  monitoring: {
    enablePerformanceMonitoring: true,
    enableUserTracking: false,
    enableErrorTracking: false,
    enableAnalytics: false,
    samplingRate: 1.0,
  },

  // Development Tools
  development: {
    enableReduxDevTools: true,
    enableReactDevTools: true,
    enableSourceMaps: true,
    enableHotModuleReplacement: true,
    showComponentNames: true,
    enableDebugPanel: true,
  },

  // Business Logic Configuration
  business: {
    defaultCurrency: 'ZAR',
    supportedCurrencies: ['ZAR', 'BTC', 'ETH'],
    transactionLimits: {
      maxFiatTransaction: 10000000, // 10M ZAR
      maxCryptoTransaction: 10, // 10 BTC
      dailyTransactionLimit: 50000000, // 50M ZAR
    },
    complianceThresholds: {
      highRiskThreshold: 80,
      mediumRiskThreshold: 50,
      lowRiskThreshold: 20,
    },
    notificationSettings: {
      enableEmailNotifications: false,
      enablePushNotifications: false,
      enableInAppNotifications: true,
      notificationDuration: 5000,
    },
  },

  // Logging Configuration
  logging: {
    level: 'debug' as const,
    enableConsoleLogging: true,
    enableFileLogging: false,
    enableRemoteLogging: false,
    logFormat: 'detailed',
    maxFileSize: 10485760, // 10MB
    maxFiles: 5,
  },
};
