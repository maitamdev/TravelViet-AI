// Vietnamese weather forecast utilities for travel planning
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export interface WeatherForecast { month: number; region: string; avgTempC: number; rainfallMm: number; humidity: number; season: Season; recommendation: string; }
export const WEATHER_BY_REGION: WeatherForecast[] = [
  { month: 1, region: 'north', avgTempC: 17, rainfallMm: 20, humidity: 80, season: 'winter', recommendation: 'Mang áo ấm, thời tiết lạnh và ẩm' },
  { month: 4, region: 'north', avgTempC: 24, rainfallMm: 90, humidity: 85, season: 'spring', recommendation: 'Thời tiết đẹp nhất, lý tưởng du lịch' },
  { month: 7, region: 'north', avgTempC: 29, rainfallMm: 320, humidity: 85, season: 'summer', recommendation: 'Nóng và mưa nhiều, mang ô dù' },
  { month: 10, region: 'north', avgTempC: 25, rainfallMm: 150, humidity: 80, season: 'autumn', recommendation: 'Thu đẹp, mát mẻ dễ chịu' },
  { month: 1, region: 'central', avgTempC: 21, rainfallMm: 60, humidity: 85, season: 'winter', recommendation: 'Mát mẻ, ít mưa' },
  { month: 7, region: 'central', avgTempC: 30, rainfallMm: 50, humidity: 75, season: 'summer', recommendation: 'Nắng nóng, lý tưởng đi biển' },
  { month: 10, region: 'central', avgTempC: 25, rainfallMm: 500, humidity: 90, season: 'autumn', recommendation: 'CẢNH BÁO: Mùa mưa bão, hạn chế du lịch miền Trung' },
  { month: 1, region: 'south', avgTempC: 27, rainfallMm: 10, humidity: 75, season: 'winter', recommendation: 'Mùa khô đẹp nhất, lý tưởng du lịch' },
  { month: 7, region: 'south', avgTempC: 28, rainfallMm: 300, humidity: 85, season: 'summer', recommendation: 'Mùa mưa nhưng thường chỉ mưa buổi chiều' },
];
export function getWeatherForMonth(month: number, region: string): WeatherForecast | undefined { return WEATHER_BY_REGION.find(w => w.month === month && w.region === region); }
export function getBestTravelMonths(region: string): number[] { return WEATHER_BY_REGION.filter(w => w.region === region && w.rainfallMm < 100 && w.avgTempC >= 20 && w.avgTempC <= 28).map(w => w.month); }
export function getWeatherWarning(month: number, region: string): string | null { const w = getWeatherForMonth(month, region); if (!w) return null; if (w.rainfallMm > 300) return `Mưa nhiều (${w.rainfallMm}mm), cân nhắc khi du lịch`; if (w.avgTempC > 35) return `Nắng nóng (${w.avgTempC}°C), bảo vệ da`; return null; }
export function packingByWeather(avgTemp: number, rainfallMm: number): string[] { const items: string[] = ['Kem chống nắng', 'Kính râm']; if (avgTemp < 20) items.push('Áo khoác dày', 'Khăn quàng', 'Găng tay'); else if (avgTemp < 25) items.push('Áo khoác nhẹ'); if (rainfallMm > 100) items.push('Áo mưa', 'Ô dù', 'Giày chống nước'); items.push('Quần áo thoáng mát', 'Giày thoải mái'); return items; }