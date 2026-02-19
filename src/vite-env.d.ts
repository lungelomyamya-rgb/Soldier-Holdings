/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_SENTRY_DSN: string;
  readonly VITE_REACT_APP_LOGGING_ENDPOINT: string;
  readonly VITE_REACT_APP_VERSION: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
