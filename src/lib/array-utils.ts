// Array utility functions for TravelViet AI

/**
 * Group an array of items by a key extractor function
 */
export function groupBy<T, K extends string | number>(
  items: T[],
  keyExtractor: (item: T) => K
): Record<K, T[]> {
  return items.reduce((groups, item) => {
    const key = keyExtractor(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

/**
 * Remove duplicate items based on a key
 */
export function uniqueBy<T>(items: T[], keyExtractor: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  return items.filter(item => {
    const key = keyExtractor(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Chunk an array into smaller arrays of a given size
 */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get a random sample of items from an array
 */
export function sample<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

/**
 * Flatten nested arrays to a specific depth
 */
export function flattenDeep<T>(items: (T | T[])[]): T[] {
  return items.reduce<T[]>((flat, item) => {
    if (Array.isArray(item)) {
      return flat.concat(flattenDeep(item as (T | T[])[]));
    }
    return flat.concat(item);
  }, []);
}

/**
 * Sort items by multiple criteria
 */
export function sortByMultiple<T>(
  items: T[],
  comparators: ((a: T, b: T) => number)[]
): T[] {
  return [...items].sort((a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  });
}
