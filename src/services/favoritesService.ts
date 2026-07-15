import { storageService } from './storageService';

const FAVORITES_KEY = 'devbox_favorites';

export const favoritesService = {
  /**
   * Get all starred favorites
   */
  getFavorites(): string[] {
    return storageService.getItem<string[]>(FAVORITES_KEY, []);
  },

  /**
   * Toggle a favorite status for a given tool ID
   */
  toggleFavorite(toolId: string): string[] {
    const favorites = this.getFavorites();
    let updated: string[];
    if (favorites.includes(toolId)) {
      updated = favorites.filter(id => id !== toolId);
    } else {
      updated = [...favorites, toolId];
    }
    storageService.setItem(FAVORITES_KEY, updated);
    return updated;
  },

  /**
   * Check if a tool ID is currently favorited
   */
  isFavorite(toolId: string): boolean {
    return this.getFavorites().includes(toolId);
  }
};
