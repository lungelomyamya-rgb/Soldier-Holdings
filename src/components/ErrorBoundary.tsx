import { ErrorBoundary } from '@sentry/react';
import { ReactNode } from 'react';
import { logger } from '../utils/logger';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import styles from '../styles/ErrorBoundary.module.css';

const ErrorBoundaryComponent = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    fallback={({ error, resetError }) => (
      <Box className={styles.errorContainer}>
        <Flex className={styles.errorContent} direction="column" align="center">
          <Typography variant="h1" className={styles.errorTitle}>
            Application Error
          </Typography>

          <Typography variant="body1" className={styles.errorMessage}>
            Something went wrong. Please try reloading the page.
          </Typography>

          <Typography variant="body2" className={styles.errorDetails}>
            Error: {error.message}
          </Typography>

          <button onClick={resetError} className={styles.errorButton}>
            <Typography variant="body2">
              Reload
            </Typography>
          </button>
        </Flex>
      </Box>
    )}
    onError={(error, errorInfo) => {
      logger.error('Error boundary caught an error', error, { errorInfo });
    }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundaryComponent;
