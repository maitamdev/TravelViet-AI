import { describe, it, expect, beforeEach } from 'vitest';
import { KEYS, prefersReducedMotion, generateId, ARIA_LABELS } from '@/lib/accessibility';

describe('KEYS', () => {
  it('should have all expected keyboard keys', () => {
    expect(KEYS.ENTER).toBe('Enter');
    expect(KEYS.ESCAPE).toBe('Escape');
    expect(KEYS.TAB).toBe('Tab');
    expect(KEYS.ARROW_UP).toBe('ArrowUp');
    expect(KEYS.ARROW_DOWN).toBe('ArrowDown');
    expect(KEYS.SPACE).toBe(' ');
    expect(KEYS.BACKSPACE).toBe('Backspace');
    expect(KEYS.DELETE).toBe('Delete');
    expect(KEYS.HOME).toBe('Home');
    expect(KEYS.END).toBe('End');
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^test-\d+$/);
  });

  it('should use default prefix', () => {
    const id = generateId();
    expect(id).toMatch(/^tv-\d+$/);
  });
});

describe('ARIA_LABELS', () => {
  it('should have Vietnamese labels for all UI elements', () => {
    expect(ARIA_LABELS.navigation).toBe('Điều hướng chính');
    expect(ARIA_LABELS.search).toBe('Tìm kiếm');
    expect(ARIA_LABELS.loading).toBe('Đang tải...');
    expect(ARIA_LABELS.closeModal).toBe('Đóng hộp thoại');
    expect(ARIA_LABELS.openMenu).toBe('Mở menu');
    expect(ARIA_LABELS.previousPage).toBe('Trang trước');
    expect(ARIA_LABELS.nextPage).toBe('Trang tiếp');
  });

  it('should have all expected keys', () => {
    const expectedKeys = ['navigation', 'sidebar', 'mainContent', 'search', 'closeModal', 'openMenu', 'closeMenu', 'loading'];
    expectedKeys.forEach(key => {
      expect(ARIA_LABELS).toHaveProperty(key);
    });
  });
});