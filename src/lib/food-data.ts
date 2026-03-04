export const REGIONAL_FOODS: Record<string, string[]> = {
  'Ha Noi': ['Pho bo', 'Bun cha', 'Banh mi', 'Cha ca La Vong', 'Bun dau mam tom'],
  'Da Nang': ['Mi Quang', 'Bun mam', 'Banh trang cuon thit heo', 'Banh xeo'],
  'Hue': ['Bun bo Hue', 'Com hen', 'Banh beo', 'Banh khoai', 'Che Hue'],
  'Hoi An': ['Cao lau', 'Mi Quang', 'Banh mi Phuong', 'Com ga Hoi An'],
  'Sai Gon': ['Banh mi', 'Com tam', 'Hu tieu', 'Goi cuon', 'Banh trang tron'],
  'Nha Trang': ['Bun ca', 'Nem nuong', 'Banh can', 'Hai san tuoi'],
  'Phu Quoc': ['Bun quay', 'Goi ca trich', 'Nuoc mam Phu Quoc'],
  'Da Lat': ['Banh trang nuong', 'Lau bo', 'Kem bo', 'Sua dau nanh nong'],
};

export function getFoodsByCity(city: string): string[] {
  const key = Object.keys(REGIONAL_FOODS).find(k => city.includes(k));
  return key ? REGIONAL_FOODS[key] : [];
}
