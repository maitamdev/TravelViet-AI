import { describe, it, expect } from 'vitest';
import { canShareNative, buildShareMessage, shareTo } from '@/lib/social-share';
describe('canShareNative', () => { it('should return boolean', () => { expect(typeof canShareNative()).toBe('boolean'); }); });
describe('buildShareMessage', () => { it('should build share message', () => { const msg = buildShareMessage('Da Nang Trip', 'https://example.com/share/abc'); expect(msg).toContain('Da Nang Trip'); expect(msg).toContain('https://example.com'); expect(msg).toContain('TravelViet'); }); it('should include URL', () => { expect(buildShareMessage('Test', 'https://x.com')).toContain('https://x.com'); }); });
describe('shareTo', () => { it('should not throw for any platform', () => {
  const data = { url: 'https://example.com', title: 'Test', text: 'Hello' };
  expect(() => shareTo('native', data)).not.toThrow();
}); });