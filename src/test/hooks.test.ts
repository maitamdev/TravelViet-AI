import { describe, it, expect } from 'vitest';

describe('Custom hooks modules', () => {
  it('useDebounce module should export function', async () => {
    const mod = await import('@/hooks/useDebounce');
    expect(mod.useDebounce).toBeDefined();
  });
  it('useToggle module should export function', async () => {
    const mod = await import('@/hooks/useToggle');
    expect(mod.useToggle).toBeDefined();
  });
  it('useLocalStorage module should export function', async () => {
    const mod = await import('@/hooks/useLocalStorage');
    expect(mod.useLocalStorage).toBeDefined();
  });
});
