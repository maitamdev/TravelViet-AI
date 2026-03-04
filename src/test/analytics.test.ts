import { describe, it, expect, vi } from 'vitest';
import { trackEvent, trackPageView, trackTripCreated } from '@/lib/analytics';

describe('analytics', () => {
  it('should call console.log for trackEvent', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    trackEvent('test_event', { key: 'value' });
    expect(spy).toHaveBeenCalledWith('[Analytics]', 'test_event', { key: 'value' });
    spy.mockRestore();
  });
  it('should track page view', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    trackPageView('home');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
