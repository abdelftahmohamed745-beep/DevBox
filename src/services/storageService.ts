/**
 * Storage Service
 * Robust offline-first key-value storage engine with safe fallbacks.
 */

export const storageService = {
  /**
   * Safely retrieve item from localStorage with a fallback
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to get key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Safely set item in localStorage
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to set key "${key}":`, error);
      return false;
    }
  },

  /**
   * Safely remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Failed to remove key "${key}":`, error);
    }
  },

  /**
   * Clear entire storage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[StorageService] Failed to clear storage:', error);
    }
  }
};
