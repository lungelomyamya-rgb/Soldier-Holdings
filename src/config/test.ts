/**
 * Test Configuration
 * 
 * Settings for testing environment
 * Optimized for unit tests, integration tests, and E2E tests
 */

export const testConfig = {
  // Environment identification
  environment: 'test' as const,
  isDevelopment: false,
  isProduction: false,
  isTest: true,

  // API Configuration
  api: {
    baseUrl: 'http://localhost:3001/api',
    timeout: 5000,
    retries: 0, // No retries in tests
    retryDelay: 0,
  },

  // Data Service Configuration
  dataService: {
    mockDataEnabled: true,
    realTimeUpdates: false, // Disabled for predictable tests
    updateInterval: 0, // No auto-updates in tests
    enableLogging: false,
    simulateErrors: false,
    errorRate: 0,
  },

  // Error Handling Configuration
  errorHandling: {
    sentryEnabled: false,
    logToConsole: false,
    logToLocalStorage: false,
    showDetailedErrors: true, // Show errors in tests
    enableUserNotifications: false, // Disabled for tests
    maxLogEntries: 10,
  },

  // Feature Flags
  features: {
    analytics: false, // Disabled for tests
    compliance: true,
    riskAssessment: true,
    realTimeMonitoring: false, // Disabled for predictable tests
    debugMode: true,
    experimentalFeatures: false,
  },

  // UI Configuration
  ui: {
    theme: 'light' as const,
    animations: false, // Disabled for tests
    reducedMotion: true,
    highContrast: false,
    showDebugInfo: true,
    enableHotReload: false,
  },

  // Security Configuration
  security: {
    enableCSP: false,
    requireHTTPS: false,
    sessionTimeout: 86400000, // 24 hours for tests
    maxLoginAttempts: 100, // High limit for tests
    enableAuditLogging: false,
  },

  // Performance Configuration
  performance: {
    enableServiceWorker: false,
    enableCaching: false, // Disabled for tests
    cacheTimeout: 0,
    enableLazyLoading: false, // Disabled for tests
    enableCodeSplitting: false, // Disabled for tests
    enableTreeShaking: false,
  },

  // Monitoring Configuration
  monitoring: {
    enablePerformanceMonitoring: false,
    enableUserTracking: false,
    enableErrorTracking: false,
    enableAnalytics: false,
    samplingRate: 0,
  },

  // Development Tools
  development: {
    enableReduxDevTools: false,
    enableReactDevTools: false,
    enableSourceMaps: true, // Helpful for test debugging
    enableHotModuleReplacement: false,
    showComponentNames: true,
    enableDebugPanel: false,
  },

  // Business Logic Configuration
  business: {
    defaultCurrency: 'ZAR',
    supportedCurrencies: ['ZAR', 'BTC', 'ETH'],
    transactionLimits: {
      maxFiatTransaction: 1000000, // 1M ZAR for tests
      maxCryptoTransaction: 1, // 1 BTC for tests
      dailyTransactionLimit: 5000000, // 5M ZAR for tests
    },
    complianceThresholds: {
      highRiskThreshold: 80,
      mediumRiskThreshold: 50,
      lowRiskThreshold: 20,
    },
    notificationSettings: {
      enableEmailNotifications: false,
      enablePushNotifications: false,
      enableInAppNotifications: false,
      notificationDuration: 0, // No auto-dismiss in tests
    },
  },

  // Logging Configuration
  logging: {
    level: 'silent' as const, // Minimal logging in tests
    enableConsoleLogging: false,
    enableFileLogging: false,
    enableRemoteLogging: false,
    logFormat: 'simple',
    maxFileSize: 1048576, // 1MB
    maxFiles: 1,
  },

  // Test-specific settings
  testing: {
    enableMockServices: true,
    enableTestUtils: true,
    enableTestData: true,
    enableTestHelpers: true,
    testTimeout: 10000,
    enableTestCleanup: true,
    enableTestIsolation: true,
  },
};
