// Coordinates for Vietnamese provinces (approximate center points)
export const VIETNAM_PROVINCE_COORDINATES: Record<string, [number, number]> = {
  'An Giang': [10.5215, 105.1259],
  'Bà Rịa - Vũng Tàu': [10.4113, 107.1362],
  'Bắc Giang': [21.2731, 106.1946],
  'Bắc Kạn': [22.1473, 105.8348],
  'Bạc Liêu': [9.2941, 105.7278],
  'Bắc Ninh': [21.1861, 106.0763],
  'Bến Tre': [10.2434, 106.3756],
  'Bình Định': [13.7820, 109.2197],
  'Bình Dương': [11.1665, 106.6318],
  'Bình Phước': [11.7512, 106.7235],
  'Bình Thuận': [11.0904, 108.0721],
  'Cà Mau': [9.1527, 105.1961],
  'Cần Thơ': [10.0452, 105.7469],
  'Cao Bằng': [22.6666, 106.2640],
  'Đà Nẵng': [16.0544, 108.2022],
  'Đắk Lắk': [12.7100, 108.2378],
  'Đắk Nông': [12.0000, 107.6878],
  'Điện Biên': [21.3860, 103.0163],
  'Đồng Nai': [10.9453, 106.8243],
  'Đồng Tháp': [10.5355, 105.6881],
  'Gia Lai': [13.8079, 108.1094],
  'Hà Giang': [22.8025, 104.9784],
  'Hà Nam': [20.5835, 105.9230],
  'Hà Nội': [21.0285, 105.8542],
  'Hà Tĩnh': [18.3559, 105.8877],
  'Hải Dương': [20.9373, 106.3146],
  'Hải Phòng': [20.8449, 106.6881],
  'Hậu Giang': [9.7879, 105.4712],
  'Hòa Bình': [20.8171, 105.3384],
  'Hưng Yên': [20.6525, 106.0512],
  'Khánh Hòa': [12.2585, 109.0526],
  'Kiên Giang': [9.8250, 105.1259],
  'Kon Tum': [14.3497, 108.0005],
  'Lai Châu': [22.3964, 103.4706],
  'Lâm Đồng': [11.9467, 108.4419],
  'Lạng Sơn': [21.8537, 106.7615],
  'Lào Cai': [22.4809, 103.9755],
  'Long An': [10.6956, 106.2431],
  'Nam Định': [20.4174, 106.1683],
  'Nghệ An': [19.2342, 104.9200],
  'Ninh Bình': [20.2506, 105.9745],
  'Ninh Thuận': [11.5752, 108.9880],
  'Phú Thọ': [21.3224, 105.4019],
  'Phú Yên': [13.0882, 109.0929],
  'Quảng Bình': [17.4690, 106.6223],
  'Quảng Nam': [15.5394, 108.0191],
  'Quảng Ngãi': [15.1214, 108.8044],
  'Quảng Ninh': [21.0064, 107.2925],
  'Quảng Trị': [16.7943, 106.9634],
  'Sóc Trăng': [9.6037, 105.9800],
  'Sơn La': [21.3270, 103.9144],
  'Tây Ninh': [11.3102, 106.0984],
  'Thái Bình': [20.4463, 106.3366],
  'Thái Nguyên': [21.5942, 105.8482],
  'Thanh Hóa': [19.8067, 105.7852],
  'Thừa Thiên Huế': [16.4637, 107.5909],
  'Tiền Giang': [10.4494, 106.3421],
  'TP. Hồ Chí Minh': [10.8231, 106.6297],
  'Trà Vinh': [9.8127, 106.2994],
  'Tuyên Quang': [21.8232, 105.2140],
  'Vĩnh Long': [10.2397, 105.9572],
  'Vĩnh Phúc': [21.3609, 105.5474],
  'Yên Bái': [21.7168, 104.8986],
};

// Default center of Vietnam
export const VIETNAM_CENTER: [number, number] = [16.0, 106.0];
export const VIETNAM_ZOOM = 6;

// Get coordinates for a province
export function getProvinceCoordinates(province: string): [number, number] | null {
  return VIETNAM_PROVINCE_COORDINATES[province] || null;
}

// Get bounds for multiple provinces
export function getProvinceBounds(provinces: string[]): [[number, number], [number, number]] | null {
  const coords = provinces
    .map(p => VIETNAM_PROVINCE_COORDINATES[p])
    .filter(Boolean) as [number, number][];
  
  if (coords.length === 0) return null;
  
  const lats = coords.map(c => c[0]);
  const lngs = coords.map(c => c[1]);
  
  return [
    [Math.min(...lats) - 0.5, Math.min(...lngs) - 0.5],
    [Math.max(...lats) + 0.5, Math.max(...lngs) + 0.5],
  ];
}
