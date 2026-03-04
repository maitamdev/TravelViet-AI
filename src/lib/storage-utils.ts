export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem('travelviet_' + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem('travelviet_' + key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage:', key);
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem('travelviet_' + key);
  } catch {
    console.warn('Failed to remove from localStorage:', key);
  }
}
