// Vietnamese provinces for destination selection
export const VIETNAM_PROVINCES = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng',
  'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh',
  'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
  'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng',
  'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
  'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
  'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
  'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
  'Thừa Thiên Huế', 'Tiền Giang', 'TP. Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
] as const;

export const TRIP_MODES = [
  { value: 'solo', label: 'Du lịch một mình', icon: '🧳' },
  { value: 'couple', label: 'Du lịch đôi', icon: '💑' },
  { value: 'family', label: 'Du lịch gia đình', icon: '👨‍👩‍👧‍👦' },
  { value: 'friends', label: 'Du lịch bạn bè', icon: '👥' },
] as const;

export const TRIP_STATUSES = [
  { value: 'draft', label: 'Bản nháp', color: 'muted' },
  { value: 'planned', label: 'Đã lên kế hoạch', color: 'secondary' },
  { value: 'ongoing', label: 'Đang diễn ra', color: 'success' },
  { value: 'completed', label: 'Hoàn thành', color: 'accent' },
] as const;

export const ITEM_TYPES = [
  { value: 'move', label: 'Di chuyển', icon: '🚗', color: 'blue' },
  { value: 'eat', label: 'Ăn uống', icon: '🍜', color: 'orange' },
  { value: 'visit', label: 'Tham quan', icon: '🏛️', color: 'green' },
  { value: 'rest', label: 'Nghỉ ngơi', icon: '🛏️', color: 'purple' },
  { value: 'other', label: 'Khác', icon: '📌', color: 'gray' },
] as const;

export const COST_CATEGORIES = [
  { value: 'transport', label: 'Di chuyển', icon: '🚌' },
  { value: 'stay', label: 'Lưu trú', icon: '🏨' },
  { value: 'food', label: 'Ăn uống', icon: '🍽️' },
  { value: 'tickets', label: 'Vé tham quan', icon: '🎫' },
  { value: 'other', label: 'Chi phí khác', icon: '💰' },
] as const;

export const TRAVEL_STYLES = [
  'Phiêu lưu', 'Văn hóa', 'Ẩm thực', 'Nghỉ dưỡng', 'Sinh thái',
  'Lịch sử', 'Biển đảo', 'Núi non', 'Đô thị', 'Làng quê',
  'Chụp ảnh', 'Mua sắm', 'Tâm linh', 'Thể thao', 'Gia đình'
] as const;

// Format VND currency
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date for Vietnamese
export function formatDateVN(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Format short date
export function formatShortDateVN(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

// Calculate trip duration in days
export function calculateTripDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Generate share slug
export function generateShareSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
