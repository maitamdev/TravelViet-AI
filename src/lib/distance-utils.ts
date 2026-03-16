// Distance calculation and route optimization utilities
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1); const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function toRad(deg: number): number { return deg * (Math.PI / 180); }
export function estimateTravelTime(distanceKm: number, mode: 'walk' | 'bike' | 'car' | 'bus' | 'train'): number {
  const speeds: Record<string, number> = { walk: 5, bike: 15, car: 60, bus: 40, train: 80 };
  const speed = speeds[mode] || 40;
  return Math.round((distanceKm / speed) * 60);
}
export function formatDistance(km: number): string { if (km < 1) return `${Math.round(km * 1000)} m`; return `${km.toFixed(1)} km`; }
export function formatTravelTime(minutes: number): string { if (minutes < 60) return `${minutes} phút`; const h = Math.floor(minutes / 60); const m = minutes % 60; return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`; }
export function calculateTotalRouteDistance(points: { lat: number; lng: number }[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) { total += haversineDistance(points[i-1].lat, points[i-1].lng, points[i].lat, points[i].lng); }
  return total;
}
export function findNearestPoint(lat: number, lng: number, points: { lat: number; lng: number; name: string }[]): { name: string; distance: number } | null {
  if (points.length === 0) return null;
  let nearest = { name: points[0].name, distance: haversineDistance(lat, lng, points[0].lat, points[0].lng) };
  for (let i = 1; i < points.length; i++) { const d = haversineDistance(lat, lng, points[i].lat, points[i].lng); if (d < nearest.distance) nearest = { name: points[i].name, distance: d }; }
  return nearest;
}
export function estimateTransportCost(distanceKm: number, mode: 'taxi' | 'grab' | 'bus' | 'train'): number {
  const rates: Record<string, number> = { taxi: 15000, grab: 12000, bus: 1000, train: 3000 };
  const base: Record<string, number> = { taxi: 12000, grab: 10000, bus: 7000, train: 50000 };
  return Math.round((base[mode] || 0) + distanceKm * (rates[mode] || 5000));
}