// Rate limiting and throttle utilities for the client
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => { if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => { inThrottle = false; }, limit); } };
}
export function rateLimit(maxRequests: number, windowMs: number): { canProceed: () => boolean; reset: () => void; remaining: () => number } {
  const timestamps: number[] = [];
  return {
    canProceed: () => { const now = Date.now(); const windowStart = now - windowMs; const recent = timestamps.filter(t => t > windowStart); timestamps.length = 0; timestamps.push(...recent); if (recent.length < maxRequests) { timestamps.push(now); return true; } return false; },
    reset: () => { timestamps.length = 0; },
    remaining: () => { const now = Date.now(); const recent = timestamps.filter(t => t > now - windowMs); return Math.max(0, maxRequests - recent.length); },
  };
}
export function memoize<T extends (...args: any[]) => any>(fn: T, ttlMs = 60000): T {
  const cache = new Map<string, { value: ReturnType<T>; expiry: number }>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) return cached.value;
    const result = fn(...args);
    cache.set(key, { value: result, expiry: Date.now() + ttlMs });
    return result;
  }) as T;
}
export function batchRequests<T>(items: T[], batchSize: number, delayMs: number, processFn: (batch: T[]) => Promise<void>): Promise<void> {
  return items.reduce(async (prev, _, idx) => {
    await prev;
    if (idx % batchSize === 0) {
      const batch = items.slice(idx, idx + batchSize);
      await processFn(batch);
      if (idx + batchSize < items.length) await new Promise(r => setTimeout(r, delayMs));
    }
  }, Promise.resolve());
}