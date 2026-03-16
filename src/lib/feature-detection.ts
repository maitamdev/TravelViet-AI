// Permission and feature detection utilities
export function isSecureContext(): boolean { return window.isSecureContext; }
export function supportsGeolocation(): boolean { return 'geolocation' in navigator; }
export function supportsClipboard(): boolean { return !!navigator.clipboard; }
export function supportsNotifications(): boolean { return 'Notification' in window; }
export function supportsServiceWorker(): boolean { return 'serviceWorker' in navigator; }
export function supportsWebShare(): boolean { return !!navigator.share; }
export function supportsTouchEvents(): boolean { return 'ontouchstart' in window || navigator.maxTouchPoints > 0; }
export function supportsIntersectionObserver(): boolean { return 'IntersectionObserver' in window; }
export function supportsWebP(): boolean { const canvas = document.createElement('canvas'); return canvas.toDataURL('image/webp').startsWith('data:image/webp'); }
export async function requestNotificationPermission(): Promise<NotificationPermission> { if (!supportsNotifications()) return 'denied'; return Notification.requestPermission(); }
export async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!supportsGeolocation()) { reject(new Error('Geolocation not supported')); return; }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
  });
}
export function getDeviceInfo(): { isMobile: boolean; isTablet: boolean; isDesktop: boolean; os: string; browser: string } {
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPod/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : /Windows/i.test(ua) ? 'Windows' : /Mac/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'Unknown';
  const browser = /Chrome/i.test(ua) ? 'Chrome' : /Firefox/i.test(ua) ? 'Firefox' : /Safari/i.test(ua) ? 'Safari' : /Edge/i.test(ua) ? 'Edge' : 'Unknown';
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet, os, browser };
}