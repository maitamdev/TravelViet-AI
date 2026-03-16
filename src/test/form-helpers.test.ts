import { describe, it, expect } from 'vitest';
import { formatPhoneInput, formatCurrencyInput, parseCurrencyInput, isVietnamesePhone, getWordCount, getCharsRemaining } from '@/lib/form-helpers';

describe('formatPhoneInput', () => {
  it('should format phone numbers', () => {
    expect(formatPhoneInput('0901234567')).toBe('0901 234 567');
    expect(formatPhoneInput('0901')).toBe('0901');
    expect(formatPhoneInput('090123')).toBe('0901 23');
  });
});

describe('formatCurrencyInput', () => {
  it('should format currency with separators', () => {
    const result = formatCurrencyInput('1500000');
    expect(result).toMatch(/1.*500.*000/);
  });

  it('should return empty for empty input', () => {
    expect(formatCurrencyInput('')).toBe('');
  });
});

describe('parseCurrencyInput', () => {
  it('should parse formatted currency', () => {
    expect(parseCurrencyInput('1.500.000')).toBe(1500000);
    expect(parseCurrencyInput('')).toBe(0);
  });
});

describe('isVietnamesePhone', () => {
  it('should validate Vietnamese phone numbers', () => {
    expect(isVietnamesePhone('0901234567')).toBe(true);
    expect(isVietnamesePhone('+84901234567')).toBe(true);
    expect(isVietnamesePhone('123456')).toBe(false);
    expect(isVietnamesePhone('0101234567')).toBe(false);
  });
});

describe('getWordCount', () => {
  it('should count words', () => {
    expect(getWordCount('hello world')).toBe(2);
    expect(getWordCount('')).toBe(0);
    expect(getWordCount('  spaced  out  ')).toBe(2);
  });
});

describe('getCharsRemaining', () => {
  it('should return remaining chars', () => {
    expect(getCharsRemaining('hello', 10)).toBe(5);
    expect(getCharsRemaining('hello world', 5)).toBe(0);
  });
});