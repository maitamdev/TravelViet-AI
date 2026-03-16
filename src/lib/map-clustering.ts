// Map marker and location clustering utilities
export interface MapMarker { id: string; lat: number; lng: number; title: string; type: string; }
export interface MapCluster { lat: number; lng: number; count: number; markers: MapMarker[]; }
export function clusterMarkers(markers: MapMarker[], zoomLevel: number): MapCluster[] {
  const clusterRadius = 100 / Math.pow(2, zoomLevel);
  const clusters: MapCluster[] = [];
  const used = new Set<string>();
  for (const marker of markers) {
    if (used.has(marker.id)) continue;
    const nearby = markers.filter(m => !used.has(m.id) && Math.abs(m.lat - marker.lat) < clusterRadius && Math.abs(m.lng - marker.lng) < clusterRadius);
    nearby.forEach(m => used.add(m.id));
    const avgLat = nearby.reduce((s, m) => s + m.lat, 0) / nearby.length;
    const avgLng = nearby.reduce((s, m) => s + m.lng, 0) / nearby.length;
    clusters.push({ lat: avgLat, lng: avgLng, count: nearby.length, markers: nearby });
  }
  return clusters;
}
export function getMapBounds(markers: MapMarker[]): { minLat: number; maxLat: number; minLng: number; maxLng: number } | null {
  if (markers.length === 0) return null;
  return { minLat: Math.min(...markers.map(m => m.lat)), maxLat: Math.max(...markers.map(m => m.lat)), minLng: Math.min(...markers.map(m => m.lng)), maxLng: Math.max(...markers.map(m => m.lng)) };
}
export function getMapCenter(markers: MapMarker[]): { lat: number; lng: number } {
  if (markers.length === 0) return { lat: 16.0, lng: 106.0 }; // Center of Vietnam
  return { lat: markers.reduce((s, m) => s + m.lat, 0) / markers.length, lng: markers.reduce((s, m) => s + m.lng, 0) / markers.length };
}
export function getMarkerIcon(type: string): string { const icons: Record<string, string> = { visit: '📍', eat: '🍜', rest: '🏨', move: '🚗', other: '📌' }; return icons[type] || '📌'; }
export function isValidCoordinate(lat: number, lng: number): boolean { return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180; }
export function isInVietnam(lat: number, lng: number): boolean { return lat >= 8.18 && lat <= 23.39 && lng >= 102.14 && lng <= 109.46; }