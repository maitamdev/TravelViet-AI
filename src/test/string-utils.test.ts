import { describe, it, expect } from 'vitest';
import {
  removeVietnameseDiacritics,
  getInitials,
  maskEmail,
  formatFileSize,
  escapeHtml,
  stringToColor,
} from '@/lib/string-utils';

describe('removeVietnameseDiacritics', () => {
  it('should remove diacritics from Vietnamese text', () => {
    expect(removeVietnameseDiacritics('Đà Nẵng')).toBe('da nang');
    expect(removeVietnameseDiacritics('Hồ Chí Minh')).toBe('ho chi minh');
  });

  it('should handle empty string', () => {
    expect(removeVietnameseDiacritics('')).toBe('');
  });
});

describe('getInitials', () => {
  it('should return initials from a name', () => {
    expect(getInitials('Nguyen Van A')).toBe('NV');
    expect(getInitials('John')).toBe('J');
  });

  it('should return ? for empty name', () => {
    expect(getInitials('')).toBe('?');
  });

  it('should respect maxChars', () => {
    expect(getInitials('A B C D', 3)).toBe('ABC');
  });
});

describe('maskEmail', () => {
  it('should mask email correctly', () => {
    expect(maskEmail('test@example.com')).toBe('te**@example.com');
    expect(maskEmail('hi@gmail.com')).toBe('hi**@gmail.com');
  });
});

describe('formatFileSize', () => {
  it('should format byte sizes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1048576)).toBe('1.0 MB');
  });
});

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });
});

describe('stringToColor', () => {
  it('should return consistent HSL color for same string', () => {
    const c1 = stringToColor('test');
    const c2 = stringToColor('test');
    expect(c1).toBe(c2);
    expect(c1).toMatch(/^hsl\(\d+, 70%, 60%\)$/);
  });
});
