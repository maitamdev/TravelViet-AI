export interface SeasonInfo {
  months: string;
  weather: string;
  recommendation: string;
}

export const VIETNAM_SEASONS: Record<string, SeasonInfo> = {
  'north': {
    months: 'T10-T3',
    weather: 'Lanh, kho',
    recommendation: 'Mang ao am, du lich van hoa'
  },
  'north_spring': {
    months: 'T3-T5',
    weather: 'Am ap, hoa no',
    recommendation: 'Thoi diem dep nhat mien Bac'
  },
  'central': {
    months: 'T2-T8',
    weather: 'Nang, nong',
    recommendation: 'Thich hop tam bien va tham quan'
  },
  'south': {
    months: 'T12-T4',
    weather: 'Nang, kho',
    recommendation: 'Mua du lich chinh mien Nam'
  },
};

export function getSeasonRecommendation(region: string): SeasonInfo | undefined {
  return VIETNAM_SEASONS[region];
}
