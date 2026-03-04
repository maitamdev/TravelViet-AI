import { describe, it, expect } from 'vitest';
import { getTipForProvince, TRAVEL_TIPS } from '@/lib/travel-tips';

describe('TRAVEL_TIPS', () => {
  it('should have 10 tips', () => { expect(TRAVEL_TIPS.length).toBe(10); });
});

describe('getTipForProvince', () => {
  it('should return tip for Ha Giang', () => {
    const tip = getTipForProvince('Ha Giang');
    expect(tip).toBeDefined();
    expect(tip).toContain('tam giac mach');
  });
  it('should return undefined for unknown province', () => {
    expect(getTipForProvince('Unknown')).toBeUndefined();
  });
});
