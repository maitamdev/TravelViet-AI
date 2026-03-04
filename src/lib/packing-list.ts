export const PACKING_ESSENTIALS = [
  { item: 'CMND/CCCD hoac ho chieu', category: 'giay_to', priority: 'high' },
  { item: 'Dien thoai + sac', category: 'dien_tu', priority: 'high' },
  { item: 'Tien mat + the ngan hang', category: 'giay_to', priority: 'high' },
  { item: 'Kem chong nang', category: 'ca_nhan', priority: 'high' },
  { item: 'Thuoc ca nhan', category: 'suc_khoe', priority: 'high' },
  { item: 'Quan ao du dung', category: 'quan_ao', priority: 'medium' },
  { item: 'Do tam', category: 'quan_ao', priority: 'medium' },
  { item: 'Dep/giay thoai mai', category: 'quan_ao', priority: 'medium' },
  { item: 'Mu/non', category: 'phu_kien', priority: 'medium' },
  { item: 'Binh nuoc', category: 'phu_kien', priority: 'low' },
  { item: 'Sac du phong', category: 'dien_tu', priority: 'medium' },
  { item: 'O du/ao mua', category: 'phu_kien', priority: 'low' },
];

export function getPackingByPriority(priority: string) {
  return PACKING_ESSENTIALS.filter(p => p.priority === priority);
}

export function getPackingByCategory(category: string) {
  return PACKING_ESSENTIALS.filter(p => p.category === category);
}
