// Travel tips for Vietnamese destinations

export const TRAVEL_TIPS = [
  { province: 'Ha Giang', tip: 'Nen di vao thang 9-11 de ngam hoa tam giac mach' },
  { province: 'Da Lat', tip: 'Mang ao am vi ban dem se lanh, nhat la thang 12-2' },
  { province: 'Phu Quoc', tip: 'Mua du lich tot nhat la thang 11-4, tranh mua mua' },
  { province: 'Hoi An', tip: 'Nen di vao thang 2-5, tranh mua lu thang 10-11' },
  { province: 'Sa Pa', tip: 'Thang 9-11 la mua lua chin dep nhat' },
  { province: 'Nha Trang', tip: 'Thang 1-8 la thoi diem dep nhat de tam bien' },
  { province: 'Da Nang', tip: 'Thang 3-8 thoi tiet dep, thich hop tam bien' },
  { province: 'Ha Long', tip: 'Thang 10-12 it mua, nhiet do mat me de tham quan' },
  { province: 'Ninh Binh', tip: 'Thang 5-6 mua lua chin vang, dep nhat de chup anh' },
  { province: 'Quy Nhon', tip: 'Thang 3-9 thoi tiet dep, bien trong xanh' },
];

export function getTipForProvince(province: string): string | undefined {
  const tip = TRAVEL_TIPS.find(t => province.includes(t.province));
  return tip?.tip;
}
