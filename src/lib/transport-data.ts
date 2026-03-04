export interface TransportOption {
  type: string;
  icon: string;
  avgCostPerKm: number;
  note: string;
}

export const TRANSPORT_OPTIONS: TransportOption[] = [
  { type: 'may_bay', icon: '✈️', avgCostPerKm: 2000, note: 'Nhanh nhat cho khoang cach xa' },
  { type: 'tau_hoa', icon: '🚂', avgCostPerKm: 300, note: 'Thoai mai, ngam canh' },
  { type: 'xe_khach', icon: '🚌', avgCostPerKm: 150, note: 'Tiet kiem nhat' },
  { type: 'xe_may', icon: '🏍️', avgCostPerKm: 100, note: 'Linh hoat, kham pha' },
  { type: 'taxi', icon: '🚕', avgCostPerKm: 12000, note: 'Tien loi cho noi thanh' },
  { type: 'grab', icon: '📱', avgCostPerKm: 8000, note: 'Dat nhanh qua app' },
];

export function estimateTransportCost(type: string, distanceKm: number): number {
  const option = TRANSPORT_OPTIONS.find(t => t.type === type);
  return option ? Math.round(option.avgCostPerKm * distanceKm) : 0;
}
