import { storageService } from './storageService';

const SEARCH_HISTORY_KEY = 'devbox_search_history';
const RECENTS_KEY = 'devbox_recents';
const MAX_HISTORY_ITEMS = 5;
const MAX_RECENT_TOOLS = 8;

export const historyService = {
  /**
   * Get recently used tool IDs
   */
  getRecents(): string[] {
    return storageService.getItem<string[]>(RECENTS_KEY, []);
  },

  /**
   * Record a tool being launched
   */
  addRecent(toolId: string): string[] {
    const recents = this.getRecents();
    const filtered = recents.filter(id => id !== toolId);
    const updated = [toolId, ...filtered].slice(0, MAX_RECENT_TOOLS);
    storageService.setItem(RECENTS_KEY, updated);
    return updated;
  },

  /**
   * Get recent search queries
   */
  getSearchHistory(): string[] {
    return storageService.getItem<string[]>(SEARCH_HISTORY_KEY, []);
  },

  /**
   * Record a search query
   */
  addSearchQuery(query: string): string[] {
    const q = query.trim();
    if (!q) return this.getSearchHistory();
    const history = this.getSearchHistory();
    const filtered = history.filter(item => item.toLowerCase() !== q.toLowerCase());
    const updated = [q, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    storageService.setItem(SEARCH_HISTORY_KEY, updated);
    return updated;
  },

  /**
   * Clear search queries
   */
  clearSearchHistory(): void {
    storageService.removeItem(SEARCH_HISTORY_KEY);
  }
};
