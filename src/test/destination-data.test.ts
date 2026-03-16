import { describe, it, expect } from 'vitest';
import { POPULAR_DESTINATIONS, getDestinationsByRegion, getDestinationsByMonth, getDestinationsByBudget } from '@/lib/destination-data';

describe('POPULAR_DESTINATIONS', () => {
  it('should have at least 5 destinations', () => { expect(POPULAR_DESTINATIONS.length).toBeGreaterThanOrEqual(5); });
  it('each destination should have required fields', () => {
    POPULAR_DESTINATIONS.forEach(d => {
      expect(d.name).toBeTruthy();
      expect(d.province).toBeTruthy();
      expect(['north','central','south']).toContain(d.region);
      expect(d.bestMonths.length).toBeGreaterThan(0);
      expect(d.avgDailyBudgetVnd).toBeGreaterThan(0);
      expect(d.highlights.length).toBeGreaterThan(0);
    });
  });
});
describe('getDestinationsByRegion', () => {
  it('should filter by region', () => {
    const north = getDestinationsByRegion('north');
    expect(north.length).toBeGreaterThan(0);
    north.forEach(d => expect(d.region).toBe('north'));
  });
});
describe('getDestinationsByMonth', () => {
  it('should filter by month', () => {
    const jan = getDestinationsByMonth(1);
    expect(jan.length).toBeGreaterThan(0);
    jan.forEach(d => expect(d.bestMonths).toContain(1));
  });
});
describe('getDestinationsByBudget', () => {
  it('should filter by max daily budget', () => {
    const budget = getDestinationsByBudget(800000);
    budget.forEach(d => expect(d.avgDailyBudgetVnd).toBeLessThanOrEqual(800000));
  });
});