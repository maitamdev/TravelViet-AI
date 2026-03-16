import { describe, it, expect } from 'vitest';
import { SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, Z_INDEX, TRANSITIONS, MEDIA_QUERIES } from '@/lib/design-tokens';
describe('SPACING', () => { it('should have spacing values', () => { expect(SPACING.xs).toBe('0.25rem'); expect(SPACING.xl).toBe('2rem'); }); });
describe('FONT_SIZES', () => { it('should have font sizes', () => { expect(FONT_SIZES.base).toBe('1rem'); }); });
describe('Z_INDEX', () => { it('should have ordered z-index values', () => { expect(Z_INDEX.modal).toBeGreaterThan(Z_INDEX.dropdown); expect(Z_INDEX.tooltip).toBeGreaterThan(Z_INDEX.modal); expect(Z_INDEX.toast).toBeGreaterThan(Z_INDEX.tooltip); }); });
describe('SHADOWS', () => { it('should have shadow values', () => { expect(SHADOWS.sm).toContain('rgba'); expect(SHADOWS.lg).toContain('rgba'); }); });
describe('TRANSITIONS', () => { it('should have transition values', () => { expect(TRANSITIONS.fast).toContain('150ms'); expect(TRANSITIONS.spring).toContain('cubic-bezier'); }); });
describe('MEDIA_QUERIES', () => { it('should have media queries', () => { expect(MEDIA_QUERIES.md).toContain('768px'); expect(MEDIA_QUERIES.dark).toContain('prefers-color-scheme'); }); });