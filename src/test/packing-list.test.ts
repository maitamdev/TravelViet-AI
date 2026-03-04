import { describe, it, expect } from 'vitest';
import { getPackingByPriority, getPackingByCategory, PACKING_ESSENTIALS } from '@/lib/packing-list';

describe('PACKING_ESSENTIALS', () => {
  it('should have items', () => { expect(PACKING_ESSENTIALS.length).toBeGreaterThan(0); });
});

describe('getPackingByPriority', () => {
  it('should filter high priority items', () => {
    const high = getPackingByPriority('high');
    expect(high.length).toBeGreaterThan(0);
    expect(high.every(p => p.priority === 'high')).toBe(true);
  });
});

describe('getPackingByCategory', () => {
  it('should filter by giay_to', () => {
    const items = getPackingByCategory('giay_to');
    expect(items.length).toBeGreaterThan(0);
  });
});
