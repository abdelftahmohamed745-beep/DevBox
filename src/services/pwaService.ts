/**
 * PWA Service
 * Coordinates service worker updates, client online status listeners, and cache metrics.
 */

export const pwaService = {
  /**
   * Check if current client tab is offline
   */
  isOffline(): boolean {
    return !navigator.onLine;
  },

  /**
   * Monitor online/offline state change and trigger callback
   */
  onOfflineStatusChange(callback: (offline: boolean) => void): () => void {
    const handleOnline = () => callback(false);
    const handleOffline = () => callback(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup hook
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  /**
   * Tries to register service worker if supported
   */
  registerServiceWorker(): void {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('[Pwaservice] SW registered successfully:', registration.scope);
          },
          (err) => {
            console.warn('[Pwaservice] SW registration failed:', err);
          }
        );
      });
    }
  }
};
