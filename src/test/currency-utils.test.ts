import { describe, it, expect } from 'vitest';
import { vndToUsd, usdToVnd, formatCurrency } from '@/lib/currency-utils';

describe('vndToUsd', () => {
  it('should convert VND to USD', () => { expect(vndToUsd(2400000)).toBe(100); });
});
describe('usdToVnd', () => {
  it('should convert USD to VND', () => { expect(usdToVnd(100)).toBe(2400000); });
});
describe('formatCurrency', () => {
  it('should format VND', () => { expect(formatCurrency(1000000)).toContain('VND'); });
  it('should format USD', () => { expect(formatCurrency(100, 'USD')).toContain('$'); });
});
