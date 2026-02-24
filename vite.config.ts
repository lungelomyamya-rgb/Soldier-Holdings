import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  // Only use /Soldier-Holdings/ base path when building for GitHub Pages deployment
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

  return {
    plugins: [react()],
    base: isGitHubPages ? '/Soldier-Holdings/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      minify: isDev ? false : 'terser',
      sourcemap: isDev,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            utils: ['lodash'],
          },
        },
      },
    },
    server: {
      port: 3000,
      host: true,
      open: true,
    },
    preview: {
      port: 4173,
      host: true,
    },
    define: {
      'process.env': {},
      __DEV__: isDev,
    },
  };
});
