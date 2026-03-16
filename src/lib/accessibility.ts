// Accessibility (a11y) constants and helpers

/**
 * ARIA live region announcement helper
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', priority);
  el.setAttribute('aria-atomic', 'true');
  el.className = 'sr-only';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => document.body.removeChild(el), 1000);
}

/**
 * Common keyboard key constants
 */
export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
} as const;

/**
 * Focus trap utility for modals
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  return Array.from(container.querySelectorAll<HTMLElement>(selectors));
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Generate unique ID for form elements
 */
let idCounter = 0;
export function generateId(prefix = 'tv'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/**
 * Vietnamese ARIA labels for common UI elements
 */
export const ARIA_LABELS = {
  navigation: 'Điều hướng chính',
  sidebar: 'Thanh bên',
  mainContent: 'Nội dung chính',
  search: 'Tìm kiếm',
  closeModal: 'Đóng hộp thoại',
  openMenu: 'Mở menu',
  closeMenu: 'Đóng menu',
  loading: 'Đang tải...',
  previousPage: 'Trang trước',
  nextPage: 'Trang tiếp',
  sortAscending: 'Sắp xếp tăng dần',
  sortDescending: 'Sắp xếp giảm dần',
  expandSection: 'Mở rộng phần',
  collapseSection: 'Thu gọn phần',
} as const;