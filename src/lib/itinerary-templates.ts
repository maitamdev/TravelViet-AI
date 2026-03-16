// Itinerary template presets for quick trip creation
export interface ItineraryTemplate { id: string; title: string; destination: string; days: number; mode: string; budget: number; description: string; tags: string[]; }
export const ITINERARY_TEMPLATES: ItineraryTemplate[] = [
  { id: 'dn-3d', title: 'Đà Nẵng 3 ngày 2 đêm', destination: 'Đà Nẵng', days: 3, mode: 'couple', budget: 5000000, description: 'Khám phá thành phố biển với Bà Nà Hills, Cầu Vàng, phố cổ Hội An', tags: ['biển', 'cầu vàng', 'hội an'] },
  { id: 'dl-4d', title: 'Đà Lạt 4 ngày 3 đêm', destination: 'Lâm Đồng', days: 4, mode: 'couple', budget: 4000000, description: 'Thành phố ngàn hoa với thác, hồ, và cà phê', tags: ['núi', 'hoa', 'lãng mạn'] },
  { id: 'sp-3d', title: 'Sapa 3 ngày 2 đêm', destination: 'Lào Cai', days: 3, mode: 'friends', budget: 3500000, description: 'Trekking ruộng bậc thang và khám phá văn hóa dân tộc', tags: ['trekking', 'núi', 'bản làng'] },
  { id: 'pq-5d', title: 'Phú Quốc 5 ngày 4 đêm', destination: 'Kiên Giang', days: 5, mode: 'family', budget: 12000000, description: 'Đảo ngọc với bãi biển đẹp, công viên giải trí, và hải sản', tags: ['biển', 'đảo', 'nghỉ dưỡng'] },
  { id: 'hl-2d', title: 'Hạ Long 2 ngày 1 đêm', destination: 'Quảng Ninh', days: 2, mode: 'solo', budget: 3000000, description: 'Du thuyền khám phá vịnh UNESCO với hang động và đảo đá', tags: ['vịnh', 'du thuyền', 'UNESCO'] },
  { id: 'hue-3d', title: 'Huế 3 ngày 2 đêm', destination: 'Thừa Thiên Huế', days: 3, mode: 'solo', budget: 2500000, description: 'Kinh đô cổ với lăng tẩm, chùa chiền và ẩm thực cung đình', tags: ['lịch sử', 'văn hóa', 'ẩm thực'] },
  { id: 'nb-2d', title: 'Ninh Bình 2 ngày 1 đêm', destination: 'Ninh Bình', days: 2, mode: 'friends', budget: 2000000, description: 'Tràng An - Tam Cốc - Hang Múa và cảnh đẹp sông nước', tags: ['thiên nhiên', 'UNESCO', 'chèo thuyền'] },
  { id: 'hg-4d', title: 'Hà Giang 4 ngày 3 đêm', destination: 'Hà Giang', days: 4, mode: 'friends', budget: 3000000, description: 'Cung đường phượt huyền thoại qua 4 huyện vùng cao', tags: ['phượt', 'đèo', 'núi đá'] },
];
export function getTemplatesByMode(mode: string): ItineraryTemplate[] { return ITINERARY_TEMPLATES.filter(t => t.mode === mode); }
export function getTemplatesByBudget(maxBudget: number): ItineraryTemplate[] { return ITINERARY_TEMPLATES.filter(t => t.budget <= maxBudget); }
export function getTemplatesByDays(days: number): ItineraryTemplate[] { return ITINERARY_TEMPLATES.filter(t => t.days === days); }
export function getTemplatesByTag(tag: string): ItineraryTemplate[] { return ITINERARY_TEMPLATES.filter(t => t.tags.includes(tag.toLowerCase())); }