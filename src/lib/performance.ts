export function measureRender(name: string) {
  const start = performance.now();
  return () => { const d = performance.now() - start; if (d > 16) console.warn('[Perf] ' + name + ': ' + d.toFixed(2) + 'ms'); };
}
export function preloadRoute(path: string) {
  const link = document.createElement('link'); link.rel = 'prefetch'; link.href = path; document.head.appendChild(link);
}
export const CACHE_TIMES = { SHORT: 60000, MEDIUM: 300000, LONG: 1800000 } as const;
