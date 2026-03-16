// Vietnamese cultural tips and travel advice
export interface CulturalTip { category: string; title: string; description: string; icon: string; importance: 'essential' | 'recommended' | 'good-to-know'; }
export const CULTURAL_TIPS: CulturalTip[] = [
  { category: 'Giao tiếp', title: 'Chào hỏi', description: 'Người Việt thường chào bằng cách gật đầu nhẹ. Bắt tay phổ biến trong môi trường công việc.', icon: '🤝', importance: 'essential' },
  { category: 'Ẩm thực', title: 'Quy tắc ăn uống', description: 'Đợi người lớn tuổi nhất ăn trước. Không cắm đũa đứng trong bát cơm.', icon: '🥢', importance: 'essential' },
  { category: 'Trang phục', title: 'Trang phục đi chùa', description: 'Mặc áo kín vai và quần dài khi vào chùa, đền. Cởi giày trước khi vào.', icon: '👘', importance: 'essential' },
  { category: 'Giao thông', title: 'Qua đường', description: 'Đi chậm và đều đặn khi qua đường. Xe máy sẽ tránh bạn nếu bạn đi đều.', icon: '🚶', importance: 'recommended' },
  { category: 'Mua sắm', title: 'Trả giá', description: 'Trả giá là bình thường ở chợ truyền thống. Bắt đầu từ 50-60% giá đưa ra.', icon: '🛍️', importance: 'recommended' },
  { category: 'Tiền bạc', title: 'Tiền tip', description: 'Không bắt buộc nhưng được đánh giá cao. 10-15% ở nhà hàng cao cấp.', icon: '💰', importance: 'good-to-know' },
  { category: 'An toàn', title: 'Giữ đồ đạc', description: 'Cẩn thận với túi xách ở khu đông đúc. Dùng túi chéo và để phía trước.', icon: '🎒', importance: 'essential' },
  { category: 'Sức khỏe', title: 'Nước uống', description: 'Chỉ uống nước đóng chai. Tránh đá ở quán nhỏ không rõ nguồn gốc.', icon: '💧', importance: 'essential' },
  { category: 'Giao tiếp', title: 'Số điện thoại khẩn cấp', description: 'Công an: 113, Cấp cứu: 115, Cứu hỏa: 114, Du lịch: 1900 6868', icon: '📞', importance: 'essential' },
  { category: 'Văn hóa', title: 'Chụp ảnh', description: 'Luôn xin phép trước khi chụp ảnh người dân địa phương, đặc biệt đồng bào dân tộc.', icon: '📸', importance: 'recommended' },
];
export function getTipsByCategory(category: string): CulturalTip[] { return CULTURAL_TIPS.filter(t => t.category === category); }
export function getEssentialTips(): CulturalTip[] { return CULTURAL_TIPS.filter(t => t.importance === 'essential'); }
export function getTipCategories(): string[] { return [...new Set(CULTURAL_TIPS.map(t => t.category))]; }