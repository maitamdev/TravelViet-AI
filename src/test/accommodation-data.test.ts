import { describe, it, expect } from 'vitest';
import { estimateStayCost, ACCOMMODATION_TYPES } from '@/lib/accommodation-data';

describe('ACCOMMODATION_TYPES', () => {
  it('should have 6 types', () => { expect(ACCOMMODATION_TYPES.length).toBe(6); });
  it('should include hostel', () => { expect(ACCOMMODATION_TYPES.find(a => a.type === 'hostel')).toBeDefined(); });
});

describe('estimateStayCost', () => {
  it('should calculate hostel cost 3 nights', () => {
    expect(estimateStayCost('hostel', 3)).toBe(600000);
  });
  it('should return 0 for unknown type', () => {
    expect(estimateStayCost('unknown', 2)).toBe(0);
  });
});
