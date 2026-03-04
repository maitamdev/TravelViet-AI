export interface AccommodationType {
  type: string;
  icon: string;
  priceRange: string;
  avgNightlyVnd: number;
}

export const ACCOMMODATION_TYPES: AccommodationType[] = [
  { type: 'hostel', icon: '🏠', priceRange: '100k-300k', avgNightlyVnd: 200000 },
  { type: 'homestay', icon: '🛖', priceRange: '200k-500k', avgNightlyVnd: 350000 },
  { type: 'hotel_3star', icon: '🏨', priceRange: '400k-800k', avgNightlyVnd: 600000 },
  { type: 'hotel_4star', icon: '⭐', priceRange: '800k-1.5tr', avgNightlyVnd: 1200000 },
  { type: 'hotel_5star', icon: '🌟', priceRange: '1.5tr-5tr', avgNightlyVnd: 3000000 },
  { type: 'resort', icon: '🏝️', priceRange: '2tr-10tr', avgNightlyVnd: 5000000 },
];

export function estimateStayCost(type: string, nights: number): number {
  const accom = ACCOMMODATION_TYPES.find(a => a.type === type);
  return accom ? accom.avgNightlyVnd * nights : 0;
}
