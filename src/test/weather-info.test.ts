import { describe, it, expect } from 'vitest';
import { getSeasonRecommendation, VIETNAM_SEASONS } from '@/lib/weather-info';

describe('VIETNAM_SEASONS', () => {
  it('should have north season', () => { expect(VIETNAM_SEASONS['north']).toBeDefined(); });
  it('should have south season', () => { expect(VIETNAM_SEASONS['south']).toBeDefined(); });
});

describe('getSeasonRecommendation', () => {
  it('should return recommendation for valid region', () => {
    const result = getSeasonRecommendation('north');
    expect(result).toBeDefined();
    expect(result?.months).toBeDefined();
  });
  it('should return undefined for invalid region', () => {
    expect(getSeasonRecommendation('invalid')).toBeUndefined();
  });
});
