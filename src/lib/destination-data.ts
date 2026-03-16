// Vietnamese destination metadata for AI-powered recommendations
export interface DestinationInfo {
  name: string;
  province: string;
  region: 'north' | 'central' | 'south';
  category: string[];
  bestMonths: number[];
  avgDailyBudgetVnd: number;
  highlights: string[];
  lat: number;
  lng: number;
}

export const POPULAR_DESTINATIONS: DestinationInfo[] = [
  { name: 'Vịnh Hạ Long', province: 'Quảng Ninh', region: 'north', category: ['biển', 'thiên nhiên', 'UNESCO'], bestMonths: [3,4,5,9,10,11], avgDailyBudgetVnd: 1500000, highlights: ['Du thuyền', 'Hang Sửng Sốt', 'Đảo Ti Tốp'], lat: 20.9101, lng: 107.1839 },
  { name: 'Phố cổ Hội An', province: 'Quảng Nam', region: 'central', category: ['văn hóa', 'ẩm thực', 'UNESCO'], bestMonths: [2,3,4,5,6,7], avgDailyBudgetVnd: 800000, highlights: ['Chùa Cầu', 'Đèn lồng', 'Cao lầu'], lat: 15.8801, lng: 108.338 },
  { name: 'Sapa', province: 'Lào Cai', region: 'north', category: ['núi', 'trekking', 'văn hóa'], bestMonths: [3,4,5,9,10], avgDailyBudgetVnd: 1000000, highlights: ['Ruộng bậc thang', 'Fansipan', 'Chợ phiên'], lat: 22.3363, lng: 103.844 },
  { name: 'Đảo Phú Quốc', province: 'Kiên Giang', region: 'south', category: ['biển', 'nghỉ dưỡng', 'ẩm thực'], bestMonths: [11,12,1,2,3,4], avgDailyBudgetVnd: 2000000, highlights: ['Bãi Sao', 'VinWonders', 'Nước mắm'], lat: 10.2899, lng: 103.984 },
  { name: 'Đà Lạt', province: 'Lâm Đồng', region: 'central', category: ['núi', 'lãng mạn', 'thiên nhiên'], bestMonths: [11,12,1,2,3], avgDailyBudgetVnd: 900000, highlights: ['Hồ Xuân Hương', 'Đồi chè', 'Thác Datanla'], lat: 11.9404, lng: 108.458 },
  { name: 'Huế', province: 'Thừa Thiên Huế', region: 'central', category: ['lịch sử', 'văn hóa', 'ẩm thực'], bestMonths: [1,2,3,7,8], avgDailyBudgetVnd: 700000, highlights: ['Kinh thành', 'Lăng tẩm', 'Bún bò Huế'], lat: 16.4637, lng: 107.5909 },
  { name: 'Ninh Bình', province: 'Ninh Bình', region: 'north', category: ['thiên nhiên', 'lịch sử', 'UNESCO'], bestMonths: [1,2,3,5,6,9,10], avgDailyBudgetVnd: 600000, highlights: ['Tràng An', 'Hang Múa', 'Tam Cốc'], lat: 20.2506, lng: 105.975 },
  { name: 'Mũi Né', province: 'Bình Thuận', region: 'south', category: ['biển', 'thể thao', 'thiên nhiên'], bestMonths: [11,12,1,2,3], avgDailyBudgetVnd: 1200000, highlights: ['Đồi cát', 'Suối Tiên', 'Lướt ván'], lat: 10.9332, lng: 108.287 },
];

export function getDestinationsByRegion(region: 'north' | 'central' | 'south'): DestinationInfo[] {
  return POPULAR_DESTINATIONS.filter(d => d.region === region);
}

export function getDestinationsByMonth(month: number): DestinationInfo[] {
  return POPULAR_DESTINATIONS.filter(d => d.bestMonths.includes(month));
}

export function getDestinationsByBudget(maxDailyBudget: number): DestinationInfo[] {
  return POPULAR_DESTINATIONS.filter(d => d.avgDailyBudgetVnd <= maxDailyBudget);
}