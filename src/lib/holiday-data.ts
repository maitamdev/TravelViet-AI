// Vietnamese holiday and festival data for travel recommendations
export interface VietnamHoliday { name: string; date: string; description: string; regions: string[]; travelTip: string; isPublicHoliday: boolean; }
export const VIETNAM_HOLIDAYS: VietnamHoliday[] = [
  { name: 'Tết Nguyên Đán', date: '01-29', description: 'Lễ hội lớn nhất năm của người Việt', regions: ['Cả nước'], travelTip: 'Nên đặt trước 1-2 tháng, giá cao', isPublicHoliday: true },
  { name: 'Giỗ Tổ Hùng Vương', date: '04-10', description: 'Ngày Quốc lễ tưởng nhớ các Vua Hùng', regions: ['Phú Thọ', 'Cả nước'], travelTip: 'Về Đền Hùng - Phú Thọ rất đông', isPublicHoliday: true },
  { name: 'Ngày Giải Phóng', date: '04-30', description: 'Kỷ niệm ngày thống nhất đất nước', regions: ['Cả nước'], travelTip: 'Kỳ nghỉ dài, đông du khách nội địa', isPublicHoliday: true },
  { name: 'Quốc Khánh', date: '09-02', description: 'Ngày Quốc khánh nước CHXHCN Việt Nam', regions: ['Cả nước'], travelTip: 'Nghỉ 1-2 ngày, nên tận dụng du lịch ngắn', isPublicHoliday: true },
  { name: 'Lễ hội Hoa Đà Lạt', date: '12-20', description: 'Festival hoa 2 năm một lần tại Đà Lạt', regions: ['Đà Lạt', 'Lâm Đồng'], travelTip: 'Đặt phòng sớm, thời tiết mát mẻ', isPublicHoliday: false },
  { name: 'Festival Huế', date: '04-15', description: 'Lễ hội văn hóa nghệ thuật quốc tế tại Huế', regions: ['Huế', 'Thừa Thiên Huế'], travelTip: 'Trải nghiệm văn hóa cung đình', isPublicHoliday: false },
  { name: 'Lễ hội Pháo hoa Đà Nẵng', date: '06-01', description: 'DIFF - Cuộc thi trình diễn pháo hoa quốc tế', regions: ['Đà Nẵng'], travelTip: 'Đặt khách sạn ven sông Hàn sớm', isPublicHoliday: false },
  { name: 'Tết Trung Thu', date: '09-15', description: 'Tết thiếu nhi với đèn lồng và bánh trung thu', regions: ['Cả nước', 'Hội An'], travelTip: 'Hội An cực đẹp với đèn lồng', isPublicHoliday: false },
];
export function getHolidaysByMonth(month: number): VietnamHoliday[] { return VIETNAM_HOLIDAYS.filter(h => { const m = parseInt(h.date.split('-')[0]); return m === month; }); }
export function getPublicHolidays(): VietnamHoliday[] { return VIETNAM_HOLIDAYS.filter(h => h.isPublicHoliday); }
export function getHolidaysByRegion(region: string): VietnamHoliday[] { return VIETNAM_HOLIDAYS.filter(h => h.regions.some(r => r.toLowerCase().includes(region.toLowerCase()) || r === 'Cả nước')); }