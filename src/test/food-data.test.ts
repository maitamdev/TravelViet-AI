import { describe, it, expect } from 'vitest';
import { getFoodsByCity, REGIONAL_FOODS } from '@/lib/food-data';

describe('REGIONAL_FOODS', () => {
  it('should have Ha Noi foods', () => { expect(REGIONAL_FOODS['Ha Noi'].length).toBeGreaterThan(0); });
  it('should have Sai Gon foods', () => { expect(REGIONAL_FOODS['Sai Gon'].length).toBeGreaterThan(0); });
});

describe('getFoodsByCity', () => {
  it('should return foods for Ha Noi', () => {
    const foods = getFoodsByCity('Ha Noi');
    expect(foods).toContain('Pho bo');
  });
  it('should return empty for unknown city', () => {
    expect(getFoodsByCity('Unknown')).toEqual([]);
  });
});
