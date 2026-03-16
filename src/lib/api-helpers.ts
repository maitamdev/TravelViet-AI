// API response type helpers and data transformers
export type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
export function createSuccessResponse<T>(data: T): ApiResponse<T> { return { data, error: null }; }
export function createErrorResponse<T>(error: string): ApiResponse<T> { return { data: null, error }; }
export function isSuccessResponse<T>(response: ApiResponse<T>): response is { data: T; error: null } { return response.error === null; }
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, delayMs = 1000): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try { return await fn(); } catch (err) { lastError = err instanceof Error ? err : new Error(String(err)); if (attempt < maxRetries - 1) await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt))); }
  }
  throw lastError;
}
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout>;
  let pendingPromise: { resolve: (v: any) => void; reject: (e: any) => void } | null = null;
  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      if (timeoutId) clearTimeout(timeoutId);
      pendingPromise = { resolve, reject };
      timeoutId = setTimeout(async () => { try { const result = await fn(...args); pendingPromise?.resolve(result); } catch (err) { pendingPromise?.reject(err); } }, delay);
    });
  };
}
export function toQueryParams(params: Record<string, string | number | boolean | undefined | null>): string {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return entries.length > 0 ? `?${entries.join('&')}` : '';
}