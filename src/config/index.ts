/**
 * Configuration Index
 *
 * Environment-based configuration management
 * Automatically selects appropriate configuration based on NODE_ENV
 * Provides type-safe access to configuration values
 */

import { developmentConfig } from './development';
import { productionConfig } from './production';
import { logger } from '../utils/logger';
import { testConfig } from './test';

// Configuration type definition
type DevelopmentConfig = typeof developmentConfig;
type ProductionConfig = typeof productionConfig;
type TestConfig = typeof testConfig;

export type AppConfig = DevelopmentConfig | ProductionConfig | TestConfig;

// Environment detection
const getNodeEnv = (): 'development' | 'production' | 'test' => {
  const env = import.meta.env.MODE;

  if (env === 'production') return 'production';
  if (env === 'test') return 'test';

  // Default to development for safety
  return 'development';
};

// Configuration selector
const selectConfig = (): AppConfig => {
  const env = getNodeEnv();

  switch (env) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

// Export the selected configuration
export const config = selectConfig();

// Export configuration type for type safety
export type Config = AppConfig;

// Export environment detection utilities
export const isDevelopment = config.isDevelopment;
export const isProduction = config.isProduction;
export const isTest = config.isTest;

// Export common configuration shortcuts
export const apiConfig = config.api;
export const dataServiceConfig = config.dataService;
export const errorHandlingConfig = config.errorHandling;
export const featureFlags = config.features;
export const uiConfig = config.ui;
export const securityConfig = config.security;
export const performanceConfig = config.performance;
export const monitoringConfig = config.monitoring;
export const businessConfig = config.business;
export const loggingConfig = config.logging;

// Configuration validation
export const validateConfig = (): boolean => {
  try {
    // Validate required configuration sections
    const requiredSections = [
      'api',
      'dataService',
      'errorHandling',
      'features',
      'ui',
      'security',
      'business',
    ];

    for (const section of requiredSections) {
      if (!config[section as keyof AppConfig]) {
        logger.error(`Missing required configuration section: ${section}`);
        return false;
      }
    }

    // Validate API configuration
    if (!config.api.baseUrl || !config.api.timeout) {
      logger.error('Invalid API configuration');
      return false;
    }

    // Validate business configuration
    if (!config.business.defaultCurrency || !config.business.supportedCurrencies) {
      logger.error('Invalid business configuration');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Configuration validation failed:', error as Error);
    return false;
  }
};

// Configuration initialization
export const initializeConfig = (): void => {
  // Validate configuration on startup
  if (!validateConfig()) {
    throw new Error('Invalid configuration detected');
  }

  // Log configuration (only in development)
  if (config.isDevelopment) {
    console.group('🔧 Configuration Loaded');
    console.log('Environment:', config.environment);
    console.log('API Base URL:', config.api.baseUrl);
    console.log('Features:', config.features);
    console.log('Data Service:', config.dataService);
    console.groupEnd();
  }
};

// Configuration utilities
export const getConfigValue = <T extends keyof Config>(key: T): Config[T] => {
  return config[key];
};

export const getNestedConfigValue = <T extends keyof Config, U extends keyof Config[T]>(
  section: T,
  key: U
): Config[T][U] => {
  return config[section][key];
};

export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.api.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export const getBusinessConfig = () => config.business;

export const getSecurityConfig = () => config.security;

export const getPerformanceConfig = () => config.performance;

// Environment-specific helpers
export const shouldEnableDebugging = (): boolean => {
  return config.isDevelopment && config.features.debugMode;
};

export const shouldEnableMonitoring = (): boolean => {
  return config.monitoring.enablePerformanceMonitoring || config.monitoring.enableErrorTracking;
};

export const shouldEnableCaching = (): boolean => {
  return config.performance.enableCaching && !config.isTest;
};

export const shouldEnableServiceWorker = (): boolean => {
  return config.performance.enableServiceWorker && config.isProduction;
};

// Export default configuration
export default config;
