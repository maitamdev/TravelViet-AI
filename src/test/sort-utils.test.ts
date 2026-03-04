import { describe, it, expect } from 'vitest';
import { sortByField, sortByDate } from '@/lib/sort-utils';

describe('sortByField', () => {
  it('should sort ascending', () => {
    const items = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
    const sorted = sortByField(items, 'name', 'asc');
    expect(sorted[0].name).toBe('a');
  });
  it('should sort descending', () => {
    const items = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
    const sorted = sortByField(items, 'name', 'desc');
    expect(sorted[0].name).toBe('c');
  });
});
