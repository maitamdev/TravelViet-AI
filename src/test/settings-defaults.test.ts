import { describe, it, expect } from 'vitest';
import { DEFAULT_SETTINGS } from '@/lib/settings-defaults';

describe('DEFAULT_SETTINGS', () => {
  it('should have theme', () => { expect(DEFAULT_SETTINGS.theme).toBe('system'); });
  it('should have language vi', () => { expect(DEFAULT_SETTINGS.language).toBe('vi'); });
  it('should have notifications enabled', () => { expect(DEFAULT_SETTINGS.notifications.tripReminders).toBe(true); });
  it('should have privacy settings', () => { expect(DEFAULT_SETTINGS.privacy.showProfile).toBe(true); });
  it('should have map defaults', () => { expect(DEFAULT_SETTINGS.map.defaultZoom).toBe(10); });
});
