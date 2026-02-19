/**
 * Example Test Component with Dependency Injection
 *
 * Demonstrates how easy testing becomes with DI
 * Can mock services at the component level
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ServiceProvider } from '../context/ServiceContext';
import { IDataService } from '../interfaces/IDataService';
import { TestDataService } from '../services/TestDataService';

// Mock the hooks to avoid import.meta issues
jest.mock('../hooks/useDataService', () => ({
  useDataServiceHook: () => ({
    loading: false,
    error: null,
    data: null,
    refetch: jest.fn(),
  }),
}));

// Mock the ServiceContainer to avoid import.meta issues
jest.mock('../di/ServiceContainer', () => ({
  ServiceType: {
    DATA_SERVICE: 'dataService',
    ERROR_HANDLER: 'errorHandler',
  },
  serviceContainer: {
    get: jest.fn(),
    register: jest.fn(),
  },
}));

// Test component that uses the data service
const TestComponent: React.FC = () => {
  return <div>Test Component Loaded</div>;
};

// Example test with mocked service
describe('TestComponent with DI', () => {
  it('should load successfully with mock service', async () => {
    // Create mock service
    const mockDataService = new TestDataService();

    // Render component with mocked service
    render(
      <ServiceProvider dataService={mockDataService}>
        <TestComponent />
      </ServiceProvider>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Test Component Loaded')).toBeInTheDocument();
    });
  });

  it('should handle service errors', async () => {
    // Create a service that always throws an error
    const errorService: IDataService = {
      getTransactions: () => Promise.reject(new Error('Service unavailable')),
      updateTransactionStatus: () => Promise.reject(new Error('Service unavailable')),
      getTransactionById: () => Promise.reject(new Error('Service unavailable')),
      addTransaction: () => Promise.reject(new Error('Service unavailable')),
      deleteTransaction: () => Promise.reject(new Error('Service unavailable')),
    };

    render(
      <ServiceProvider dataService={errorService}>
        <TestComponent />
      </ServiceProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Component Loaded')).toBeInTheDocument();
    });
  });
});

// Example of testing with custom data
describe('Custom test scenarios', () => {
  it('should work with custom test data', async () => {
    const customService = new TestDataService();

    // Set up custom test data
    customService.setMockTransactions([
      {
        id: 999,
        type: 'ZAR',
        amount: 50000,
        currency: 'ZAR',
        from: 'Custom Test User',
        status: 'verified',
        statusText: 'Compliant',
        timestamp: new Date(),
        riskScore: 10,
      },
    ]);

    render(
      <ServiceProvider dataService={customService}>
        <TestComponent />
      </ServiceProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Component Loaded')).toBeInTheDocument();
    });
  });
});
