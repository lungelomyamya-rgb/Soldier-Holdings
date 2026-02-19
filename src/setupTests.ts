import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder for Jest environment
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock import.meta for Vite compatibility in Jest
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        MODE: 'test',
        VITE_REACT_APP_VERSION: '1.0.0-test',
        VITE_REACT_APP_LOGGING_ENDPOINT: 'http://localhost:3000/logs',
      },
    },
  },
});
