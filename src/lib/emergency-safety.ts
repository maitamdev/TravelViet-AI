// Emergency contact and safety information for travelers
export interface EmergencyContact { service: string; number: string; description: string; available: string; }
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { service: 'Công an', number: '113', description: 'Gọi khi gặp sự cố an ninh, trộm cắp', available: '24/7' },
  { service: 'Cấp cứu y tế', number: '115', description: 'Cấp cứu y tế, tai nạn', available: '24/7' },
  { service: 'Cứu hỏa', number: '114', description: 'Chữa cháy, cứu nạn', available: '24/7' },
  { service: 'Tổng đài du lịch', number: '1900 6868', description: 'Hỗ trợ du khách, khiếu nại dịch vụ du lịch', available: '8:00-22:00' },
  { service: 'Đường dây nóng CSGT', number: '0694041368', description: 'Phản ánh vi phạm giao thông', available: '24/7' },
  { service: 'Tổng đài taxi', number: '1900 1900', description: 'Đặt taxi, phản ánh chất lượng', available: '24/7' },
];
export interface SafetyTip { category: string; tip: string; priority: 'high' | 'medium' | 'low'; }
export const SAFETY_TIPS: SafetyTip[] = [
  { category: 'Giao thông', tip: 'Luôn đội mũ bảo hiểm khi đi xe máy', priority: 'high' },
  { category: 'Giao thông', tip: 'Sử dụng ứng dụng Grab/Gojek để di chuyển an toàn hơn', priority: 'medium' },
  { category: 'Tài sản', tip: 'Không để đồ quý trên xe máy, giữ túi xách chắc chắn', priority: 'high' },
  { category: 'Sức khỏe', tip: 'Uống đủ nước, đặc biệt khi du lịch miền Trung/Nam', priority: 'medium' },
  { category: 'Sức khỏe', tip: 'Mang theo thuốc cá nhân và bộ sơ cứu nhỏ', priority: 'medium' },
  { category: 'Ẩm thực', tip: 'Ăn ở quán đông khách, tránh hải sản không tươi', priority: 'high' },
  { category: 'Thời tiết', tip: 'Kiểm tra dự báo thời tiết trước mỗi chuyến đi', priority: 'medium' },
  { category: 'Liên lạc', tip: 'Lưu số đại sứ quán nếu là du khách nước ngoài', priority: 'low' },
  { category: 'Tài chính', tip: 'Chia tiền thành nhiều nơi, không mang quá nhiều tiền mặt', priority: 'medium' },
  { category: 'Giấy tờ', tip: 'Chụp ảnh lưu giữ CCCD/hộ chiếu trên điện thoại', priority: 'high' },
];
export function getEmergencyByService(service: string): EmergencyContact | undefined { return EMERGENCY_CONTACTS.find(c => c.service.toLowerCase().includes(service.toLowerCase())); }
export function getHighPrioritySafetyTips(): SafetyTip[] { return SAFETY_TIPS.filter(t => t.priority === 'high'); }
export function getSafetyTipsByCategory(category: string): SafetyTip[] { return SAFETY_TIPS.filter(t => t.category === category); }