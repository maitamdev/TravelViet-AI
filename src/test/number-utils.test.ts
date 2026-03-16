import { describe, it, expect } from 'vitest';
import { clamp, roundTo, percentage, formatNumberVN, randomInt, inRange, average, sum, compactNumber } from '@/lib/number-utils';

describe('clamp', () => {
  it('should clamp value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('roundTo', () => {
  it('should round to specified decimals', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.145, 2)).toBe(3.15);
    expect(roundTo(100, 0)).toBe(100);
  });
});

describe('percentage', () => {
  it('should calculate percentage', () => {
    expect(percentage(25, 100)).toBe(25);
    expect(percentage(1, 3)).toBe(33.3);
  });
  it('should return 0 for zero total', () => {
    expect(percentage(5, 0)).toBe(0);
  });
});

describe('formatNumberVN', () => {
  it('should format with Vietnamese locale', () => {
    const result = formatNumberVN(1234567);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });
});

describe('randomInt', () => {
  it('should return integer within range', () => {
    for (let i = 0; i < 20; i++) {
      const val = randomInt(1, 10);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(10);
      expect(Number.isInteger(val)).toBe(true);
    }
  });
});

describe('inRange', () => {
  it('should check range inclusively', () => {
    expect(inRange(5, 1, 10)).toBe(true);
    expect(inRange(1, 1, 10)).toBe(true);
    expect(inRange(0, 1, 10)).toBe(false);
  });
});

describe('average', () => {
  it('should calculate average', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
    expect(average([])).toBe(0);
  });
});

describe('sum', () => {
  it('should calculate sum', () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([])).toBe(0);
  });
});

describe('compactNumber', () => {
  it('should format compact numbers', () => {
    expect(compactNumber(999)).toBe('999');
    expect(compactNumber(1500)).toBe('1.5K');
    expect(compactNumber(2500000)).toBe('2.5M');
    expect(compactNumber(1000000000)).toBe('1.0B');
  });
});
