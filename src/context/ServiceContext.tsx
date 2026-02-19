/**
 * Service Context Provider
 * 
 * Provides dependency injection through React Context
 * Enables services to be accessed throughout the component tree
 * Supports easy testing with mock providers
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { IDataService } from '../interfaces/IDataService';
import { IErrorHandlerService } from '../interfaces/IErrorHandlerService';
import { ServiceType, serviceContainer } from '../di/ServiceContainer';

interface ServiceContextType {
  dataService: IDataService;
  errorHandler: IErrorHandlerService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

interface ServiceProviderProps {
  children: ReactNode;
  dataService?: IDataService;
  errorHandler?: IErrorHandlerService;
}

/**
 * Service Provider Component
 * 
 * Provides services to the component tree through React Context
 * Can accept custom services for testing or overrides
 */
export const ServiceProvider: React.FC<ServiceProviderProps> = ({ 
  children, 
  dataService,
  errorHandler
}) => {
  // Use provided services or get from container
  const dataServiceInstance = dataService || serviceContainer.get<IDataService>(ServiceType.DataService);
  const errorHandlerInstance = errorHandler || serviceContainer.get<IErrorHandlerService>(ServiceType.ErrorHandlerService);

  const contextValue: ServiceContextType = {
    dataService: dataServiceInstance,
    errorHandler: errorHandlerInstance,
  };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Hook to access services from context
 * @returns Service context value
 */
export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  
  return context;
};

/**
 * Hook to access data service specifically
 * @returns Data service instance
 */
export const useDataService = (): IDataService => {
  const { dataService } = useServices();
  return dataService;
};

export default ServiceContext;
