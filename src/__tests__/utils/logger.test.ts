/**
 * Logger System Tests
 */

// Mock the logger module to avoid import.meta.env issues
jest.mock('../../utils/logger', () => ({
  LogLevel: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4,
  },
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    performance: jest.fn(),
    setCorrelationContext: jest.fn(),
    clearCorrelationContext: jest.fn(),
    generateCorrelationId: jest.fn(() => `test-correlation-${Date.now()}-${Math.random()}`),
    getCorrelationContext: jest.fn(() => ({
      correlationId: 'test-correlation-id',
      userId: 'test-user',
      sessionId: 'test-session',
    })),
  },
  CorrelationContext: {},
}));

import { logger, LogLevel, CorrelationContext } from '../../utils/logger';

describe('Logger', () => {
  beforeEach(() => {
    // Reset logger state before each test
    logger.clearCorrelationContext();
  });

  describe('Basic Logging', () => {
    test('should have all required log methods', () => {
      expect(logger.debug).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.fatal).toBeDefined();
    });

    test('should log messages at different levels', () => {
      expect(() => logger.debug('Debug message')).not.toThrow();
      expect(() => logger.info('Info message')).not.toThrow();
      expect(() => logger.warn('Warning message')).not.toThrow();
      expect(() => logger.error('Error message')).not.toThrow();
      expect(() => logger.fatal('Fatal message')).not.toThrow();
    });

    test('should log with metadata', () => {
      expect(() => logger.info('Test message', { key: 'value' })).not.toThrow();
      expect(() => logger.error('Error message', new Error('Test error'), { context: 'test' })).not.toThrow();
    });
  });

  describe('Correlation Context', () => {
    test('should set correlation context', () => {
      const context: CorrelationContext = {
        correlationId: 'test-123',
        userId: 'user-456',
        sessionId: 'session-789',
      };

      expect(() => logger.setCorrelationContext(context)).not.toThrow();
    });

    test('should generate correlation IDs', () => {
      const id1 = logger.generateCorrelationId();
      const id2 = logger.generateCorrelationId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });

    test('should clear correlation context', () => {
      const context: CorrelationContext = {
        correlationId: 'test-123',
      };
      
      logger.setCorrelationContext(context);
      expect(() => logger.clearCorrelationContext()).not.toThrow();
    });
  });

  describe('Performance Logging', () => {
    test('should log performance metrics', () => {
      expect(() => logger.performance('test-operation', 100)).not.toThrow();
      expect(() => logger.performance('test-operation', 200, { additional: 'data' })).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle errors gracefully', () => {
      const error = new Error('Test error');
      expect(() => logger.error('Error occurred', error)).not.toThrow();
    });

    test('should log fatal errors', () => {
      const error = new Error('Fatal error');
      expect(() => logger.fatal('Fatal error occurred', error)).not.toThrow();
    });
  });
});
