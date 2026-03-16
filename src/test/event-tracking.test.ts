import { describe, it, expect, beforeEach } from 'vitest';
import { trackEvent, trackPageView, getEventLog, clearEventLog, getEventsByCategory, getEventCount } from '@/lib/event-tracking';
beforeEach(() => { clearEventLog(); });
describe('trackEvent', () => {
  it('should add event to log', () => { trackEvent('trip', 'created', 'trip-1'); expect(getEventLog()).toHaveLength(1); expect(getEventLog()[0].category).toBe('trip'); });
  it('should include timestamp', () => { trackEvent('auth', 'login'); expect(getEventLog()[0].timestamp).toBeDefined(); });
});
describe('trackPageView', () => { it('should track navigation event', () => { trackPageView('/dashboard'); expect(getEventLog()[0].action).toBe('page_view'); expect(getEventLog()[0].label).toBe('/dashboard'); }); });
describe('getEventsByCategory', () => { it('should filter by category', () => { trackEvent('trip', 'created'); trackEvent('auth', 'login'); trackEvent('trip', 'shared'); expect(getEventsByCategory('trip')).toHaveLength(2); expect(getEventsByCategory('auth')).toHaveLength(1); }); });
describe('getEventCount', () => { it('should count events', () => { trackEvent('ui', 'search', 'q1'); trackEvent('ui', 'search', 'q2'); trackEvent('ui', 'button_click'); expect(getEventCount('ui', 'search')).toBe(2); }); });
describe('clearEventLog', () => { it('should clear all events', () => { trackEvent('trip', 'created'); clearEventLog(); expect(getEventLog()).toHaveLength(0); }); });