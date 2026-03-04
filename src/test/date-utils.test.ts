import { describe, it, expect } from 'vitest';
import { getDaysUntil, isDateInPast, isDateInFuture } from '@/lib/date-utils';

describe('getDaysUntil', () => {
  it('should return positive days for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    expect(getDaysUntil(futureDate.toISOString())).toBeGreaterThanOrEqual(4);
  });
});

describe('isDateInPast', () => {
  it('should return true for past dates', () => { expect(isDateInPast('2020-01-01')).toBe(true); });
  it('should return false for future dates', () => { expect(isDateInPast('2030-12-31')).toBe(false); });
});

describe('isDateInFuture', () => {
  it('should return true for future dates', () => { expect(isDateInFuture('2030-12-31')).toBe(true); });
  it('should return false for past dates', () => { expect(isDateInFuture('2020-01-01')).toBe(false); });
});
