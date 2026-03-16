import { describe, it, expect } from 'vitest';
import { VIETNAM_CUISINES, getCuisinesByRegion, getMustTryCuisines, getCuisinesByBudget, estimateFoodBudget } from '@/lib/cuisine-data';
describe('VIETNAM_CUISINES', () => { it('should have cuisine entries', () => { expect(VIETNAM_CUISINES.length).toBeGreaterThanOrEqual(8); }); });
describe('getCuisinesByRegion', () => { it('should filter by region', () => { const bac = getCuisinesByRegion('Bắc'); expect(bac.length).toBeGreaterThan(0); }); });
describe('getMustTryCuisines', () => { it('should return must-try dishes', () => { const mt = getMustTryCuisines(); expect(mt.length).toBeGreaterThan(0); mt.forEach(c => expect(c.mustTry).toBe(true)); }); });
describe('getCuisinesByBudget', () => { it('should filter by budget', () => { const cheap = getCuisinesByBudget(30000); cheap.forEach(c => expect(c.avgPriceVnd).toBeLessThanOrEqual(30000)); }); });
describe('estimateFoodBudget', () => { it('should estimate total food budget', () => { expect(estimateFoodBudget(3, 3, 50000)).toBe(450000); expect(estimateFoodBudget(1)).toBe(150000); }); });