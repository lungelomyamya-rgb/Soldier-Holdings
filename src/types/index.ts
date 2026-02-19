/**
 * Types Index - Central Type Exports
 * 
 * Re-exports all types from their respective modules
 * Provides a single entry point for all type imports
 */

// Core transaction types
export * from './transaction';

// Component and UI types
export * from './components';
export * from './ui';

// API and service types
export * from './api';

// Store and state management
export * from './store';

// Error handling types
export * from './errors';

// Configuration types (selective to avoid conflicts)
export type {
  EnvironmentConfig,
  FeatureFlags,
  UIConfig,
  SecurityConfig,
  PerformanceConfig,
  BusinessConfig,
  LoggingConfig,
  TestingConfig,
  AppConfig,
  ConfigValidationResult,
  ConfigUtilities,
} from './config';

// Utility types
export * from './utilities';

// React and DOM types (selective to avoid conflicts)
export type {
  ComponentType,
  ReactTypes,
  DOMElements,
  EventHandlers,
  Ref,
  ForwardRefComponent,
  ContextType,
  HookResult,
  EffectCallback,
  DependencyList,
  MemoComponentType,
  LazyComponentType,
  SuspenseProps,
  PortalProps,
  ProfilerProps,
  StrictModeProps,
  FragmentProps,
} from './react';

// Re-export commonly used utility types for convenience
export type {
  Optional,
  RequiredFields,
  DeepPartial,
  NonNullable,
  ArrayElement,
  Parameters,
  ReturnType,
  AsyncReturnType,
} from './utilities';
