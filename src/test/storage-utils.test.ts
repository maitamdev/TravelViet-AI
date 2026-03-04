import { describe, it, expect, beforeEach } from 'vitest';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/storage-utils';

beforeEach(() => { localStorage.clear(); });

describe('localStorage utils', () => {
  it('should set and get value', () => {
    setLocalStorage('test_key', { foo: 'bar' });
    expect(getLocalStorage('test_key', null)).toEqual({ foo: 'bar' });
  });
  it('should return default when key missing', () => {
    expect(getLocalStorage('missing', 'default')).toBe('default');
  });
  it('should remove value', () => {
    setLocalStorage('rm_key', 'value');
    removeLocalStorage('rm_key');
    expect(getLocalStorage('rm_key', null)).toBeNull();
  });
});
