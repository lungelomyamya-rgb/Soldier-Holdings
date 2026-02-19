/**
 * API and Service Types
 * 
 * Types for API responses, service interfaces, and data operations
 */

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// API configuration
export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

// API endpoints
export interface APIEndpoints {
  transactions: string;
  compliance: string;
  analytics: string;
  reports: string;
  users: string;
}

// HTTP types
export interface HTTPHeaders {
  [key: string]: string;
}

export interface HTTPRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: HTTPHeaders;
  data?: unknown;
  timeout?: number;
}

// Service interfaces
export interface DataServiceConfig {
  mockDataEnabled: boolean;
  realTimeUpdates: boolean;
  updateInterval: number;
  enableLogging: boolean;
  simulateErrors: boolean;
  errorRate: number;
}

// Cache types
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // time to live in milliseconds
  maxSize: number; // maximum number of entries
  strategy: 'lru' | 'fifo' | 'lfu';
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
}

// WebSocket types
export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  data: T;
  timestamp: string;
  id?: string;
}
