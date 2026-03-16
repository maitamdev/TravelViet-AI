// Event tracking and analytics utilities
type EventCategory = 'trip' | 'chat' | 'auth' | 'community' | 'navigation' | 'ui';
interface AnalyticsEvent { category: EventCategory; action: string; label?: string; value?: number; timestamp: number; }
const eventLog: AnalyticsEvent[] = [];
const MAX_LOG_SIZE = 500;
export function trackEvent(category: EventCategory, action: string, label?: string, value?: number): void {
  const event: AnalyticsEvent = { category, action, label, value, timestamp: Date.now() };
  eventLog.push(event);
  if (eventLog.length > MAX_LOG_SIZE) eventLog.splice(0, eventLog.length - MAX_LOG_SIZE);
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.debug(`[Analytics] ${category}/${action}`, label, value);
  }
}
export function trackPageView(path: string): void { trackEvent('navigation', 'page_view', path); }
export function trackTripCreated(tripId: string): void { trackEvent('trip', 'created', tripId); }
export function trackTripShared(tripId: string): void { trackEvent('trip', 'shared', tripId); }
export function trackChatMessage(sessionId: string): void { trackEvent('chat', 'message_sent', sessionId); }
export function trackLogin(method: string): void { trackEvent('auth', 'login', method); }
export function trackSignup(method: string): void { trackEvent('auth', 'signup', method); }
export function trackSearch(query: string): void { trackEvent('ui', 'search', query); }
export function trackButtonClick(buttonId: string): void { trackEvent('ui', 'button_click', buttonId); }
export function getEventLog(): AnalyticsEvent[] { return [...eventLog]; }
export function clearEventLog(): void { eventLog.length = 0; }
export function getEventsByCategory(category: EventCategory): AnalyticsEvent[] { return eventLog.filter(e => e.category === category); }
export function getEventCount(category: EventCategory, action: string): number { return eventLog.filter(e => e.category === category && e.action === action).length; }