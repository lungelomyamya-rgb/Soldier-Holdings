import { ErrorBoundary } from '@sentry/react';
import { ReactNode } from 'react';
import { logger } from '../utils/logger';

const ErrorBoundaryComponent = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    fallback={({ error, resetError }) => (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'white', background: '#E74C3C' }}>
        <h1>Application Error</h1>
        <p>Something went wrong. Please try reloading the page.</p>
        <p>Error: {error.message}</p>
        <button onClick={resetError} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
          Reload
        </button>
      </div>
    )}
    onError={(error, errorInfo) => {
      logger.error('Error boundary caught an error', error, { errorInfo });
    }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundaryComponent;
