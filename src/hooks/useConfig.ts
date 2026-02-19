/**
 * Configuration Hook
 * 
 * React hook for accessing environment configuration
 * Provides type-safe access to all configuration values
 */

import { useCallback } from 'react';
import config, { isFeatureEnabled, isDevelopment, isProduction, isTest } from '../config/environment';

/**
 * Hook for accessing application configuration
 */
export const useConfig = () => {
  // Feature flag checker
  const isFeatureEnabledCallback = useCallback((feature: keyof typeof config.features) => {
    return isFeatureEnabled(feature);
  }, []);

  // Environment checkers
  const isDev = useCallback(() => isDevelopment(), []);
  const isProd = useCallback(() => isProduction(), []);
  const isTesting = useCallback(() => isTest(), []);

  // Get configuration sections
  const getApp = useCallback(() => config.app, []);
  const getApi = useCallback(() => config.api, []);
  const getAuth = useCallback(() => config.auth, []);
  const getMonitoring = useCallback(() => config.monitoring, []);
  const getFeatures = useCallback(() => config.features, []);
  const getDevelopment = useCallback(() => config.development, []);
  const getBusiness = useCallback(() => config.business, []);
  const getUi = useCallback(() => config.ui, []);
  const getIntegrations = useCallback(() => config.integrations, []);

  // Specific commonly used values
  const apiBaseUrl = config.api.baseUrl;
  const debugMode = config.development.debugMode;
  const mockData = config.development.mockData;
  const logLevel = config.monitoring.logLevel;

  return {
    // Full config
    config,
    
    // Feature flags
    isFeatureEnabled: isFeatureEnabledCallback,
    
    // Environment checkers
    isDevelopment: isDev,
    isProduction: isProd,
    isTest: isTesting,
    
    // Configuration getters
    getApp,
    getApi,
    getAuth,
    getMonitoring,
    getFeatures,
    getDevelopment,
    getBusiness,
    getUi,
    getIntegrations,
    
    // Common values
    apiBaseUrl,
    debugMode,
    mockData,
    logLevel,
  };
};

/**
 * Hook for accessing API configuration
 */
export const useApiConfig = () => {
  const { getApi } = useConfig();
  return getApi();
};

/**
 * Hook for accessing feature flags
 */
export const useFeatures = () => {
  const { getFeatures, isFeatureEnabled } = useConfig();
  const features = getFeatures();
  
  return {
    ...features,
    isFeatureEnabled,
  };
};

/**
 * Hook for accessing business configuration
 */
export const useBusinessConfig = () => {
  const { getBusiness } = useConfig();
  return getBusiness();
};

/**
 * Hook for accessing UI configuration
 */
export const useUiConfig = () => {
  const { getUi } = useConfig();
  return getUi();
};

/**
 * Hook for accessing monitoring configuration
 */
export const useMonitoringConfig = () => {
  const { getMonitoring } = useConfig();
  return getMonitoring();
};

export default useConfig;
