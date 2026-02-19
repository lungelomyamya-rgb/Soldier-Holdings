/**
 * Dependency Injection Container
 * 
 * Manages service instances and their lifecycles
 * Provides factory methods for service creation
 * Enables easy testing and configuration management
 */

import { IDataService } from '../interfaces/IDataService';
import { IErrorHandlerService } from '../interfaces/IErrorHandlerService';
import MockDataService from '../services/MockDataService';
import { ErrorHandlerService } from '../services/ErrorHandlerService';

export enum ServiceType {
  DataService = 'DataService',
  ErrorHandlerService = 'ErrorHandlerService'
}

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

class ServiceContainer {
  private services = new Map<ServiceType, IDataService | IErrorHandlerService>();
  private environment: Environment;

  constructor(environment: Environment = Environment.Development) {
    this.environment = environment;
  }

  /**
   * Register a service instance
   * @param serviceType - Type of service
   * @param instance - Service instance
   */
  register<T extends IDataService | IErrorHandlerService>(serviceType: ServiceType, instance: T): void {
    this.services.set(serviceType, instance);
  }

  /**
   * Get a service instance
   * @param serviceType - Type of service
   * @returns Service instance
   */
  public get<T extends IDataService | IErrorHandlerService>(serviceType: ServiceType): T {
    const service = this.services.get(serviceType);
    
    if (!service) {
      // Auto-create service if not registered
      const createdService = this.createService(serviceType);
      this.register(serviceType, createdService);
      return createdService as T;
    }
    
    return service as T;
  }

  /**
   * Create service instance based on type and environment
   * @param serviceType - Type of service
   * @returns Service instance
   */
  private createService(serviceType: ServiceType): IDataService | IErrorHandlerService {
    switch (serviceType) {
      case ServiceType.DataService:
        switch (this.environment) {
          case Environment.Test:
            return new MockDataService(); // Could use TestDataService here
          case Environment.Production:
            // In production, this would be:
            // return new ApiDataService();
            return new MockDataService(); // For now
          default:
            return new MockDataService();
        }
      
      case ServiceType.ErrorHandlerService:
        return new ErrorHandlerService();
      
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Get current environment
   */
  getEnvironment(): Environment {
    return this.environment;
  }
}

// Create global container instance
const environment = (import.meta.env.MODE as Environment) || Environment.Development;
export const serviceContainer = new ServiceContainer(environment);

export default ServiceContainer;
