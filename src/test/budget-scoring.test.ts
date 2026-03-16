import { describe, it, expect } from 'vitest';
import { calculateSavings, getSpendingRate, projectTotalSpending, getBudgetHealthScore, formatBudgetRange } from '@/lib/budget-utils';
describe('calculateSavings', () => { it('should calculate savings', () => { expect(calculateSavings(1000000, 800000)).toBe(200000); expect(calculateSavings(500000, 600000)).toBe(0); }); });
describe('getSpendingRate', () => { it('should calculate daily rate', () => { expect(getSpendingRate(300000, 3)).toBe(100000); expect(getSpendingRate(0, 0)).toBe(0); }); });
describe('projectTotalSpending', () => { it('should project total', () => { expect(projectTotalSpending(100000, 5)).toBe(500000); }); });
describe('getBudgetHealthScore', () => { it('under budget = 100', () => { expect(getBudgetHealthScore(400000, 1000000, 5, 10)).toBe(100); }); it('over budget = low score', () => { expect(getBudgetHealthScore(900000, 1000000, 5, 10)).toBeLessThan(50); }); });
describe('formatBudgetRange', () => { it('should format range', () => { const r = formatBudgetRange(500000, 2000000); expect(r).toContain('500K'); expect(r).toContain('2.0 triệu'); expect(r).toContain('VNĐ'); }); });