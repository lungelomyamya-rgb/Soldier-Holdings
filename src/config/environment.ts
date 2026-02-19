/**
 * Environment Configuration Management
 *
 * Centralized configuration with validation and type safety
 * Supports multiple environments and feature flags
 */

import { logger } from '../utils/logger';

export interface AppConfig {
  // Application metadata
  app: {
    name: string;
    version: string;
    description: string;
    environment: string;
  };

  // API configuration
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };

  // Authentication settings
  auth: {
    enabled: boolean;
    mfaEnabled: boolean;
    sessionTimeout: number;
  };

  // Monitoring and error tracking
  monitoring: {
    sentryDsn?: string;
    sentryEnvironment: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    enablePerformanceMonitoring: boolean;
  };

  // Feature flags
  features: {
    crypto: boolean;
    analytics: boolean;
    realTimeUpdates: boolean;
    compliance: boolean;
    banking: boolean;
    blockchain: boolean;
  };

  // Development settings
  development: {
    debugMode: boolean;
    mockData: boolean;
    enableHotReload: boolean;
  };

  // Business configuration
  business: {
    compliance: {
      annualLimit: number;
      disclosureThreshold: number;
      updateInterval: number;
    };
    currencies: {
      default: string;
      supported: string[];
    };
  };

  // UI configuration
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    pagination: {
      defaultPageSize: number;
      maxPageSize: number;
    };
  };

  // External integrations
  integrations: {
    banking?: {
      endpoint: string;
      apiKey?: string;
    };
    blockchain?: {
      rpcUrl: string;
      chainalysisApiKey?: string;
    };
  };
}

/**
 * Get environment variable with type validation and default values
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return defaultValue;
  }
  return value;
}

/**
 * Get boolean environment variable
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, defaultValue.toString());
  return value.toLowerCase() === 'true';
}

/**
 * Get number environment variable
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key, defaultValue.toString());
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
}

/**
 * Load and validate configuration from environment variables
 */
function loadConfig(): AppConfig {
  const environment = getEnvVar('MODE', 'development');

  return {
    app: {
      name: getEnvVar('VITE_APP_NAME', 'Soldier Holdings'),
      version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
      description: getEnvVar('VITE_APP_DESCRIPTION', 'Political Funding Compliance Platform'),
      environment,
    },

    api: {
      baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8000/api/v1'),
      timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
      retries: getEnvNumber('VITE_API_RETRIES', 3),
    },

    auth: {
      enabled: getEnvBoolean('VITE_AUTH_ENABLED', false),
      mfaEnabled: getEnvBoolean('VITE_MFA_ENABLED', false),
      sessionTimeout: getEnvNumber('VITE_SESSION_TIMEOUT', 3600000), // 1 hour
    },

    monitoring: {
      sentryDsn: getEnvVar('VITE_SENTRY_DSN', undefined),
      sentryEnvironment: getEnvVar('VITE_SENTRY_ENVIRONMENT', environment),
      logLevel: getEnvVar('VITE_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
      enablePerformanceMonitoring: getEnvBoolean('VITE_ENABLE_PERFORMANCE_MONITORING', true),
    },

    features: {
      crypto: getEnvBoolean('VITE_ENABLE_CRYPTO', true),
      analytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', true),
      realTimeUpdates: getEnvBoolean('VITE_ENABLE_REAL_TIME_UPDATES', true),
      compliance: getEnvBoolean('VITE_ENABLE_COMPLIANCE', true),
      banking: getEnvBoolean('VITE_ENABLE_BANKING', false),
      blockchain: getEnvBoolean('VITE_ENABLE_BLOCKCHAIN', false),
    },

    development: {
      debugMode: getEnvBoolean('VITE_DEBUG_MODE', environment === 'development'),
      mockData: getEnvBoolean('VITE_MOCK_DATA', environment === 'development'),
      enableHotReload: environment === 'development',
    },

    business: {
      compliance: {
        annualLimit: getEnvNumber('VITE_COMPLIANCE_ANNUAL_LIMIT', 15000000),
        disclosureThreshold: getEnvNumber('VITE_COMPLIANCE_DISCLOSURE_THRESHOLD', 100000),
        updateInterval: getEnvNumber('VITE_COMPLIANCE_UPDATE_INTERVAL', 3000),
      },
      currencies: {
        default: getEnvVar('VITE_CURRENCY', 'ZAR'),
        supported: ['ZAR', 'USD', 'EUR', 'BTC', 'ETH'],
      },
    },

    ui: {
      theme: getEnvVar('VITE_THEME', 'light') as 'light' | 'dark' | 'auto',
      language: getEnvVar('VITE_LANGUAGE', 'en'),
      pagination: {
        defaultPageSize: getEnvNumber('VITE_DEFAULT_PAGE_SIZE', 20),
        maxPageSize: getEnvNumber('VITE_MAX_PAGE_SIZE', 100),
      },
    },

    integrations: {
      banking: getEnvVar('VITE_BANK_API_ENDPOINT')
        ? {
            endpoint: getEnvVar('VITE_BANK_API_ENDPOINT'),
            apiKey: getEnvVar('VITE_BANK_API_KEY', undefined),
          }
        : undefined,

      blockchain: getEnvVar('VITE_BLOCKCHAIN_RPC_URL')
        ? {
            rpcUrl: getEnvVar('VITE_BLOCKCHAIN_RPC_URL'),
            chainalysisApiKey: getEnvVar('VITE_CHAINALYSIS_API_KEY', undefined),
          }
        : undefined,
    },
  };
}

/**
 * Validate configuration and log warnings for potential issues
 */
function validateConfig(config: AppConfig): void {
  const warnings: string[] = [];

  // Check for missing production configurations
  if (config.app.environment === 'production') {
    if (!config.monitoring.sentryDsn) {
      warnings.push('Sentry DSN is not configured in production');
    }
    if (config.development.debugMode) {
      warnings.push('Debug mode is enabled in production');
    }
    if (config.development.mockData) {
      warnings.push('Mock data is enabled in production');
    }
  }

  // Check API configuration
  try {
    new URL(config.api.baseUrl);
  } catch {
    warnings.push('API base URL is not a valid URL');
  }

  // Check feature dependencies
  if (config.features.blockchain && !config.integrations.blockchain) {
    warnings.push('Blockchain feature is enabled but blockchain integration is not configured');
  }

  if (config.features.banking && !config.integrations.banking) {
    warnings.push('Banking feature is enabled but banking integration is not configured');
  }

  // Log warnings
  if (warnings.length > 0 && config.development.debugMode) {
    logger.warn('Configuration warnings:', { warnings });
  }
}

// Load and validate configuration
const config = loadConfig();
validateConfig(config);

// Export configuration and utilities
export { config };
export default config;

/**
 * Feature flag checker
 */
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature];
};

/**
 * Environment checker
 */
export const isDevelopment = (): boolean => config.app.environment === 'development';
export const isProduction = (): boolean => config.app.environment === 'production';
export const isTest = (): boolean => config.app.environment === 'test';

/**
 * Configuration getter for specific sections
 */
export const getAppConfig = () => config.app;
export const getApiConfig = () => config.api;
export const getAuthConfig = () => config.auth;
export const getMonitoringConfig = () => config.monitoring;
export const getFeaturesConfig = () => config.features;
export const getDevelopmentConfig = () => config.development;
export const getBusinessConfig = () => config.business;
export const getUiConfig = () => config.ui;
export const getIntegrationsConfig = () => config.integrations;
