import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ServiceProvider } from './context/ServiceContext';
import { LoggingProvider, LoggingErrorBoundary } from './components/LoggingProvider';
import { initializeConfig, config, isProduction } from './config';

// Initialize configuration before starting the app
initializeConfig();

// Import CSS for bundling and optimization
import './styles/styles.css';

// Initialize Sentry for error logging (only if enabled in config)
if (config.errorHandling.sentryEnabled) {
  Sentry.init({
    dsn: import.meta.env.VITE_REACT_APP_SENTRY_DSN || 'https://example@example.ingest.sentry.io/example',
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    environment: config.environment,
    enabled: config.errorHandling.sentryEnabled,
    debug: config.isDevelopment,
  });
}

// Get the root element
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <LoggingProvider
      _enableDebugLogging={config.isDevelopment}
      _remoteEndpoint={import.meta.env.VITE_REACT_APP_LOGGING_ENDPOINT}
    >
      <LoggingErrorBoundary
        onError={(error, errorInfo) => {
          console.error('Application error:', error, errorInfo);
        }}
      >
        <ServiceProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ServiceProvider>
      </LoggingErrorBoundary>
    </LoggingProvider>
  </React.StrictMode>
);
