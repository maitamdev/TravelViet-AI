// Debug and development utilities
export function createLogger(namespace: string) {
  const prefix = `[${namespace}]`;
  const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
  return {
    log: (...args: unknown[]) => isDev && console.log(prefix, ...args),
    warn: (...args: unknown[]) => console.warn(prefix, ...args),
    error: (...args: unknown[]) => console.error(prefix, ...args),
    debug: (...args: unknown[]) => isDev && console.debug(prefix, ...args),
    time: (label: string) => isDev && console.time(`${prefix} ${label}`),
    timeEnd: (label: string) => isDev && console.timeEnd(`${prefix} ${label}`),
    group: (label: string) => isDev && console.group(`${prefix} ${label}`),
    groupEnd: () => isDev && console.groupEnd(),
    table: (data: unknown) => isDev && console.table(data),
  };
}
export function prettyPrintObject(obj: unknown): string { try { return JSON.stringify(obj, null, 2); } catch { return String(obj); } }
export function getStackTrace(): string { try { throw new Error(); } catch (e) { return (e as Error).stack || ''; } }
export function freezeDeep<T extends Record<string, unknown>>(obj: T): Readonly<T> {
  Object.freeze(obj);
  Object.values(obj).forEach(v => { if (v && typeof v === 'object' && !Object.isFrozen(v)) freezeDeep(v as Record<string, unknown>); });
  return obj;
}
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); });
}
export function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }
export function noop(): void {}
export function identity<T>(value: T): T { return value; }