// Vietnamese province coordinate data for map features
export interface ProvinceCoordinate { name: string; lat: number; lng: number; region: 'north' | 'central' | 'south'; population: number; area: number; }
export const PROVINCE_COORDINATES: ProvinceCoordinate[] = [
  { name: 'Hà Nội', lat: 21.0285, lng: 105.8542, region: 'north', population: 8435700, area: 3359 },
  { name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, region: 'south', population: 9227600, area: 2095 },
  { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, region: 'central', population: 1195700, area: 1285 },
  { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, region: 'north', population: 2072800, area: 1562 },
  { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, region: 'south', population: 1281000, area: 1439 },
  { name: 'Quảng Ninh', lat: 21.0064, lng: 107.2925, region: 'north', population: 1382400, area: 6178 },
  { name: 'Khánh Hòa', lat: 12.2388, lng: 109.1967, region: 'central', population: 1258600, area: 5218 },
  { name: 'Lâm Đồng', lat: 11.5753, lng: 108.1429, region: 'central', population: 1312900, area: 9775 },
  { name: 'Thừa Thiên Huế', lat: 16.4637, lng: 107.5909, region: 'central', population: 1163600, area: 5033 },
  { name: 'Quảng Nam', lat: 15.5735, lng: 108.4741, region: 'central', population: 1509600, area: 10575 },
  { name: 'Lào Cai', lat: 22.3380, lng: 103.8448, region: 'north', population: 761900, area: 6364 },
  { name: 'Ninh Bình', lat: 20.2506, lng: 105.9745, region: 'north', population: 999400, area: 1378 },
  { name: 'Kiên Giang', lat: 10.0125, lng: 105.0809, region: 'south', population: 1815500, area: 6349 },
  { name: 'Bình Thuận', lat: 10.9332, lng: 108.2872, region: 'south', population: 1255300, area: 7813 },
];
export function getProvinceByName(name: string): ProvinceCoordinate | undefined { return PROVINCE_COORDINATES.find(p => p.name.toLowerCase().includes(name.toLowerCase())); }
export function getProvincesByRegion(region: 'north' | 'central' | 'south'): ProvinceCoordinate[] { return PROVINCE_COORDINATES.filter(p => p.region === region); }
export function getProvinceCoords(name: string): { lat: number; lng: number } | null { const p = getProvinceByName(name); return p ? { lat: p.lat, lng: p.lng } : null; }
export function getNearestProvince(lat: number, lng: number): ProvinceCoordinate { return PROVINCE_COORDINATES.reduce((nearest, p) => { const d1 = Math.hypot(p.lat - lat, p.lng - lng); const d2 = Math.hypot(nearest.lat - lat, nearest.lng - lng); return d1 < d2 ? p : nearest; }); }