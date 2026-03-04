import { describe, it, expect } from 'vitest';
import { getTripStatusColor, getTripModeEmoji, getTripProgress } from '@/lib/trip-utils';

describe('getTripStatusColor', () => {
  it('should return green for ongoing', () => { expect(getTripStatusColor('ongoing')).toContain('green'); });
  it('should return blue for planned', () => { expect(getTripStatusColor('planned')).toContain('blue'); });
});

describe('getTripModeEmoji', () => {
  it('should return correct emoji for solo', () => { expect(getTripModeEmoji('solo')).toBe('🧳'); });
  it('should return correct emoji for friends', () => { expect(getTripModeEmoji('friends')).toBe('👥'); });
});

describe('getTripProgress', () => {
  it('should return 25 for draft', () => { expect(getTripProgress('draft')).toBe(25); });
  it('should return 100 for completed', () => { expect(getTripProgress('completed')).toBe(100); });
});
