/**
 * Viewport utilities for handling mobile viewport issues
 */

/**
 * Sets CSS custom property --vh to 1% of the viewport height
 * This provides a more reliable alternative to 100vh on mobile devices
 * where the browser UI can change the viewport height dynamically
 */
export const setVH = (): void => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

/**
 * Initializes viewport handling for mobile devices
 * Sets up event listeners for resize and orientation change
 */
export const initViewportHandling = (): void => {
  // Set initial value
  setVH();

  // Update on resize (handles keyboard, address bar changes)
  window.addEventListener('resize', setVH);

  // Update on orientation change
  window.addEventListener('orientationchange', () => {
    // Small delay to allow viewport to settle after orientation change
    setTimeout(setVH, 100);
  });
};
