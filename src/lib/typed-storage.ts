// Type-safe localStorage utilities with error handling

const PREFIX = 'travelviet_';

/**
 * Get a typed value from localStorage
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(PREFIX + key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Set a typed value in localStorage
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    console.warn(`Failed to save to localStorage: ${key}`);
    return false;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Silently fail
  }
}

/**
 * Clear all TravelViet items from localStorage
 */
export function clearAllStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Silently fail
  }
}

/**
 * Get the total size of TravelViet localStorage usage in bytes
 */
export function getStorageSize(): number {
  let total = 0;
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    });
  } catch {
    // Silently fail
  }
  return total * 2; // UTF-16 encoding = 2 bytes per char
}

/**
 * Storage keys used across the app
 */
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  RECENT_SEARCHES: 'recent_searches',
  DRAFT_TRIP: 'draft_trip',
  CHAT_DRAFT: 'chat_draft',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  MAP_PREFERENCES: 'map_preferences',
  NOTIFICATION_SETTINGS: 'notification_settings',
  LAST_VISITED_TRIP: 'last_visited_trip',
} as const;
