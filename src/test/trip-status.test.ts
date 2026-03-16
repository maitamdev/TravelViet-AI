import { describe, it, expect } from 'vitest';
import { getStatusLabel, getStatusColor, canEditTrip, canDeleteTrip, getNextStatus, getStatusProgress } from '@/lib/trip-status';
describe('getStatusLabel', () => { it('should return Vietnamese labels', () => { expect(getStatusLabel('draft')).toBe('Bản nháp'); expect(getStatusLabel('completed')).toBe('Hoàn thành'); }); });
describe('getStatusColor', () => { it('should return color', () => { expect(getStatusColor('ongoing')).toBe('green'); }); });
describe('canEditTrip', () => { it('should allow edit for draft/planned', () => { expect(canEditTrip('draft')).toBe(true); expect(canEditTrip('planned')).toBe(true); expect(canEditTrip('ongoing')).toBe(false); }); });
describe('canDeleteTrip', () => { it('should not allow delete during ongoing', () => { expect(canDeleteTrip('ongoing')).toBe(false); expect(canDeleteTrip('draft')).toBe(true); }); });
describe('getNextStatus', () => { it('should return next status', () => { expect(getNextStatus('draft')).toBe('planned'); expect(getNextStatus('completed')).toBeNull(); }); });
describe('getStatusProgress', () => { it('should return progress percentage', () => { expect(getStatusProgress('draft')).toBe(25); expect(getStatusProgress('completed')).toBe(100); }); });