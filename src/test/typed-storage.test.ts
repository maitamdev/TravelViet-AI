import { describe, it, expect, beforeEach } from 'vitest';
import { getStorageItem, setStorageItem, removeStorageItem, clearAllStorage, getStorageSize, STORAGE_KEYS } from '@/lib/typed-storage';

beforeEach(() => {
  localStorage.clear();
});

describe('getStorageItem', () => {
  it('should return default value when key does not exist', () => {
    expect(getStorageItem('nonexistent', 'default')).toBe('default');
  });

  it('should return stored value', () => {
    localStorage.setItem('travelviet_test', JSON.stringify('hello'));
    expect(getStorageItem('test', '')).toBe('hello');
  });

  it('should handle complex objects', () => {
    const obj = { name: 'test', items: [1, 2, 3] };
    localStorage.setItem('travelviet_complex', JSON.stringify(obj));
    expect(getStorageItem('complex', {})).toEqual(obj);
  });
});

describe('setStorageItem', () => {
  it('should store value and return true', () => {
    expect(setStorageItem('key1', { value: 42 })).toBe(true);
    expect(JSON.parse(localStorage.getItem('travelviet_key1')!)).toEqual({ value: 42 });
  });
});

describe('removeStorageItem', () => {
  it('should remove stored item', () => {
    localStorage.setItem('travelviet_remove_me', '"data"');
    removeStorageItem('remove_me');
    expect(localStorage.getItem('travelviet_remove_me')).toBeNull();
  });
});

describe('clearAllStorage', () => {
  it('should clear only travelviet_ prefixed items', () => {
    localStorage.setItem('travelviet_a', '1');
    localStorage.setItem('travelviet_b', '2');
    localStorage.setItem('other_key', '3');
    clearAllStorage();
    expect(localStorage.getItem('travelviet_a')).toBeNull();
    expect(localStorage.getItem('other_key')).toBe('3');
  });
});

describe('STORAGE_KEYS', () => {
  it('should have all expected keys', () => {
    expect(STORAGE_KEYS.THEME).toBe('theme');
    expect(STORAGE_KEYS.SIDEBAR_COLLAPSED).toBe('sidebar_collapsed');
    expect(STORAGE_KEYS.DRAFT_TRIP).toBe('draft_trip');
    expect(STORAGE_KEYS.ONBOARDING_COMPLETED).toBe('onboarding_completed');
  });
});