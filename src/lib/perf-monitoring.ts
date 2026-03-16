// Performance monitoring utilities
export function measurePerformance(label: string, fn: () => void): number { const start = performance.now(); fn(); const end = performance.now(); const duration = end - start; console.debug(`[Perf] ${label}: ${duration.toFixed(2)}ms`); return duration; }
export async function measureAsync(label: string, fn: () => Promise<void>): Promise<number> { const start = performance.now(); await fn(); const end = performance.now(); const duration = end - start; console.debug(`[Perf] ${label}: ${duration.toFixed(2)}ms`); return duration; }
export function getNavigationTiming(): { domContentLoaded: number; load: number; firstPaint: number } | null {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const fp = paint.find(e => e.name === 'first-paint');
    return { domContentLoaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), firstPaint: fp ? Math.round(fp.startTime) : 0 };
  } catch { return null; }
}
export function trackComponentRender(componentName: string): () => void { const start = performance.now(); return () => { const duration = performance.now() - start; if (duration > 16) console.warn(`[Perf] Slow render: ${componentName} took ${duration.toFixed(1)}ms`); }; }
export function debounceRAF(fn: (...args: any[]) => void): (...args: any[]) => void { let frameId: number; return (...args) => { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(() => fn(...args)); }; }
export function idleCallback(fn: () => void, timeout = 5000): void { if ('requestIdleCallback' in window) { (window as any).requestIdleCallback(fn, { timeout }); } else { setTimeout(fn, 100); } }
export class PerformanceBudget { private budgets: Map<string, number> = new Map(); setBudget(metric: string, maxMs: number): void { this.budgets.set(metric, maxMs); }
  check(metric: string, actualMs: number): boolean { const budget = this.budgets.get(metric); if (!budget) return true; const passed = actualMs <= budget; if (!passed) console.warn(`[Budget] ${metric}: ${actualMs.toFixed(1)}ms exceeds budget of ${budget}ms`); return passed; }
}