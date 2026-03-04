import { describe, it, expect } from 'vitest';
import { calculateBudgetPerDay, calculateBudgetPerPerson, getBudgetStatus, formatBudgetShort } from '@/lib/budget-utils';

describe('calculateBudgetPerDay', () => {
  it('should divide budget evenly', () => { expect(calculateBudgetPerDay(3000000, 3)).toBe(1000000); });
  it('should return 0 for 0 days', () => { expect(calculateBudgetPerDay(3000000, 0)).toBe(0); });
});

describe('calculateBudgetPerPerson', () => {
  it('should divide budget among travelers', () => { expect(calculateBudgetPerPerson(4000000, 2)).toBe(2000000); });
  it('should return 0 for 0 travelers', () => { expect(calculateBudgetPerPerson(4000000, 0)).toBe(0); });
});

describe('getBudgetStatus', () => {
  it('should return safe under 70%', () => { expect(getBudgetStatus(500000, 1000000)).toBe('safe'); });
  it('should return warning 70-90%', () => { expect(getBudgetStatus(800000, 1000000)).toBe('warning'); });
  it('should return danger over 90%', () => { expect(getBudgetStatus(950000, 1000000)).toBe('danger'); });
});

describe('formatBudgetShort', () => {
  it('should format millions', () => { expect(formatBudgetShort(5000000)).toBe('5.0 tr'); });
  it('should format thousands', () => { expect(formatBudgetShort(500000)).toBe('500k'); });
  it('should format billions', () => { expect(formatBudgetShort(1500000000)).toBe('1.5 ty'); });
});
