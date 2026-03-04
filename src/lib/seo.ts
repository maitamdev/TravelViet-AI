export function setPageTitle(title: string) {
  document.title = title + ' | TravelViet AI';
}

export function setMetaDescription(description: string) {
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}

export const PAGE_TITLES = {
  HOME: 'Trang chu',
  DASHBOARD: 'Tong quan',
  TRIPS: 'Chuyen di',
  CHAT: 'AI Planner',
  COMMUNITY: 'Cong dong',
  EXPLORE: 'Kham pha',
  FAVORITES: 'Yeu thich',
  PROFILE: 'Ho so',
  SETTINGS: 'Cai dat',
  ABOUT: 'Gioi thieu',
} as const;
