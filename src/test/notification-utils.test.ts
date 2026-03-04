import { describe, it, expect } from 'vitest';
import { getNotificationIcon, getNotificationColor } from '@/lib/notification-utils';

describe('getNotificationIcon', () => {
  it('should return icon for trip_reminder', () => { expect(getNotificationIcon('trip_reminder')).toBe('🗓️'); });
  it('should return icon for comment', () => { expect(getNotificationIcon('comment')).toBe('💬'); });
});
describe('getNotificationColor', () => {
  it('should return blue for trip_reminder', () => { expect(getNotificationColor('trip_reminder')).toContain('blue'); });
});
