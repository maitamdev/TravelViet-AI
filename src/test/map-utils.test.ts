import { describe, it, expect } from 'vitest';
import { calculateDistance, formatDistance, getMapBounds } from '@/lib/map-utils';

describe('calculateDistance', () => {
  it('should calculate Hanoi-HCMC approx 1150km', () => {
    const dist = calculateDistance(21.0285, 105.8542, 10.8231, 106.6297);
    expect(dist).toBeGreaterThan(1100);
    expect(dist).toBeLessThan(1200);
  });
});

describe('formatDistance', () => {
  it('should format km', () => { expect(formatDistance(5.5)).toBe('5.5 km'); });
  it('should format meters', () => { expect(formatDistance(0.5)).toBe('500 m'); });
});

describe('getMapBounds', () => {
  it('should return default for empty', () => {
    const r = getMapBounds([]);
    expect(r.center[0]).toBe(16.0);
  });
  it('should center on single location', () => {
    const r = getMapBounds([{ lat: 21.0, lng: 105.8 }]);
    expect(r.center[0]).toBe(21.0);
    expect(r.zoom).toBe(13);
  });
});
