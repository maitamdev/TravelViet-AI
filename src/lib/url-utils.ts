// URL and query string utility functions

/**
 * Build a URL with query parameters
 */
export function buildUrl(base: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(base, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

/**
 * Parse query string into an object
 */
export function parseQueryString(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract domain from a URL
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Build Google Maps search URL for a location
 */
export function buildGoogleMapsUrl(location: string, lat?: number, lng?: number): string {
  if (lat !== undefined && lng !== undefined) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ' Vietnam')}`;
}

/**
 * Build a shareable trip URL
 */
export function buildShareUrl(slug: string): string {
  return `${window.location.origin}/share/${slug}`;
}

/**
 * Get current page path without query string
 */
export function getCurrentPath(): string {
  return window.location.pathname;
}
