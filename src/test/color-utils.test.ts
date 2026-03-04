import { describe, it, expect } from 'vitest';
import { stringToColor, getContrastColor } from '@/lib/color-utils';

describe('stringToColor', () => {
  it('should return hsl string', () => {
    expect(stringToColor('test')).toMatch(/^hsl\(/);
  });
  it('should return same color for same string', () => {
    expect(stringToColor('abc')).toBe(stringToColor('abc'));
  });
});
describe('getContrastColor', () => {
  it('should return white for dark colors', () => {
    expect(getContrastColor('#000000')).toBe('#ffffff');
  });
  it('should return black for light colors', () => {
    expect(getContrastColor('#ffffff')).toBe('#000000');
  });
});
