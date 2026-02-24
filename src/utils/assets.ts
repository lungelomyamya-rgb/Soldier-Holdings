/**
 * Asset path utilities
 *
 * Handles path resolution for static assets in different environments
 */

import { isProduction } from '../config/environment';

/**
 * Get the correct logo path for current environment
 * - Development: /images/logo.png
 * - Preview/Production (GitHub Pages): /Soldier-Holdings/images/logo.png
 * - Local preview: /images/logo.png (same as dev)
 */
export const getLogoPath = (): string => {
  // For GitHub Pages deployment, use the repository path
  if (typeof window !== 'undefined' && window.location.hostname === 'lungelomyamya-rgb.github.io') {
    return '/Soldier-Holdings/images/logo.png';
  }

  // For all other environments (dev, local preview, etc.), use root path
  return '/images/logo.png';
};
