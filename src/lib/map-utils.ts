export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return Math.round(km * 1000) + ' m';
  return km.toFixed(1) + ' km';
}

export function getMapBounds(locations: Array<{ lat: number; lng: number }>): { center: [number, number]; zoom: number } {
  if (locations.length === 0) return { center: [16.0, 108.0], zoom: 6 };
  if (locations.length === 1) return { center: [locations[0].lat, locations[0].lng], zoom: 13 };
  const lats = locations.map(l => l.lat);
  const lngs = locations.map(l => l.lng);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const maxDiff = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
  const zoom = maxDiff > 5 ? 6 : maxDiff > 2 ? 8 : maxDiff > 0.5 ? 10 : 12;
  return { center: [centerLat, centerLng], zoom };
}
