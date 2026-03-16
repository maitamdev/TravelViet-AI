// Vietnamese cuisine data for food recommendations
export interface Cuisine { name: string; region: string; description: string; priceRange: string; avgPriceVnd: number; icon: string; mustTry: boolean; }
export const VIETNAM_CUISINES: Cuisine[] = [
  { name: 'Phở Hà Nội', region: 'Bắc', description: 'Phở bò truyền thống với nước dùng trong, ngọt xương', priceRange: '35K-60K', avgPriceVnd: 45000, icon: '🍜', mustTry: true },
  { name: 'Bún chả', region: 'Bắc', description: 'Bún với chả nướng than hoa, nước chấm đặc trưng', priceRange: '30K-50K', avgPriceVnd: 40000, icon: '🥩', mustTry: true },
  { name: 'Bún bò Huế', region: 'Trung', description: 'Bún với nước dùng cay đặc trưng xứ Huế', priceRange: '30K-55K', avgPriceVnd: 40000, icon: '🌶️', mustTry: true },
  { name: 'Mì Quảng', region: 'Trung', description: 'Mì vàng ít nước với đậu phộng và bánh tráng', priceRange: '25K-45K', avgPriceVnd: 35000, icon: '🍝', mustTry: true },
  { name: 'Cao lầu Hội An', region: 'Trung', description: 'Mì đặc sản chỉ có ở Hội An với thịt xá xíu', priceRange: '30K-50K', avgPriceVnd: 40000, icon: '🥡', mustTry: true },
  { name: 'Bánh mì', region: 'Cả nước', description: 'Ổ bánh mì giòn với nhân đa dạng', priceRange: '15K-35K', avgPriceVnd: 25000, icon: '🥖', mustTry: true },
  { name: 'Cơm tấm', region: 'Nam', description: 'Cơm gạo tấm với sườn nướng, bì, chả', priceRange: '30K-55K', avgPriceVnd: 40000, icon: '🍚', mustTry: true },
  { name: 'Hủ tiếu Nam Vang', region: 'Nam', description: 'Hủ tiếu với nước dùng thơm ngọt và đa dạng topping', priceRange: '30K-50K', avgPriceVnd: 40000, icon: '🍲', mustTry: false },
  { name: 'Bánh xèo', region: 'Nam', description: 'Bánh giòn nhân tôm thịt cuốn rau sống', priceRange: '20K-40K', avgPriceVnd: 30000, icon: '🥞', mustTry: true },
  { name: 'Cà phê trứng', region: 'Bắc', description: 'Cà phê với kem trứng béo ngậy đặc trưng Hà Nội', priceRange: '25K-45K', avgPriceVnd: 35000, icon: '☕', mustTry: true },
];
export function getCuisinesByRegion(region: string): Cuisine[] { return VIETNAM_CUISINES.filter(c => c.region === region || c.region === 'Cả nước'); }
export function getMustTryCuisines(): Cuisine[] { return VIETNAM_CUISINES.filter(c => c.mustTry); }
export function getCuisinesByBudget(maxPrice: number): Cuisine[] { return VIETNAM_CUISINES.filter(c => c.avgPriceVnd <= maxPrice); }
export function estimateFoodBudget(days: number, mealsPerDay = 3, avgMealVnd = 50000): number { return days * mealsPerDay * avgMealVnd; }