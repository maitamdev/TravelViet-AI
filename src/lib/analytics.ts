export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    console.log('[Analytics]', eventName, properties);
  }
}

export function trackPageView(pageName: string) {
  trackEvent('page_view', { page: pageName });
}

export function trackTripCreated(tripId: string) {
  trackEvent('trip_created', { trip_id: tripId });
}

export function trackAIChatSent() {
  trackEvent('ai_chat_sent');
}

export function trackItineraryShared(itineraryId: string) {
  trackEvent('itinerary_shared', { itinerary_id: itineraryId });
}
