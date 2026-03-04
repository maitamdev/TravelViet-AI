import { describe, it, expect, vi } from 'vitest';
import { debounce, throttle } from '@/lib/debounce';

describe('debounce', () => {
  it('should export debounce function', () => {
    expect(typeof debounce).toBe('function');
  });
});

describe('throttle', () => {
  it('should export throttle function', () => {
    expect(typeof throttle).toBe('function');
  });
});
