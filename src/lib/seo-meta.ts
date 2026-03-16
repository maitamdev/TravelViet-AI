// SEO meta tags helper for TravelViet AI

interface MetaTags {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noIndex?: boolean;
}

const DEFAULT_DESCRIPTION = 'TravelViet AI - Trợ lý du lịch thông minh giúp bạn lên kế hoạch du lịch Việt Nam hoàn hảo với AI.';
const SITE_NAME = 'TravelViet AI';
const DEFAULT_IMAGE = '/og-image.png';

/**
 * Update all meta tags for the current page
 */
export function updateMetaTags(meta: MetaTags): void {
  // Title
  document.title = `${meta.title} | ${SITE_NAME}`;

  // Standard meta tags
  setMetaTag('description', meta.description || DEFAULT_DESCRIPTION);
  if (meta.keywords?.length) {
    setMetaTag('keywords', meta.keywords.join(', '));
  }

  // Open Graph tags
  setMetaTag('og:title', meta.title, 'property');
  setMetaTag('og:description', meta.description || DEFAULT_DESCRIPTION, 'property');
  setMetaTag('og:image', meta.ogImage || DEFAULT_IMAGE, 'property');
  setMetaTag('og:type', meta.ogType || 'website', 'property');
  setMetaTag('og:site_name', SITE_NAME, 'property');

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', meta.title);
  setMetaTag('twitter:description', meta.description || DEFAULT_DESCRIPTION);
  setMetaTag('twitter:image', meta.ogImage || DEFAULT_IMAGE);

  // Canonical URL
  if (meta.canonical) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = meta.canonical;
  }

  // Robots
  if (meta.noIndex) {
    setMetaTag('robots', 'noindex, nofollow');
  }
}

/**
 * Helper to set or create a meta tag
 */
function setMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Pre-defined SEO configs for common pages
 */
export const SEO_CONFIGS = {
  home: {
    title: 'Trang chủ',
    description: 'TravelViet AI - Lên kế hoạch du lịch Việt Nam thông minh với trí tuệ nhân tạo. Khám phá điểm đến, lịch trình và chi phí tối ưu.',
    keywords: ['du lịch việt nam', 'travel vietnam', 'AI travel planner', 'lịch trình du lịch'],
  },
  dashboard: {
    title: 'Bảng điều khiển',
    description: 'Quản lý chuyến đi và lịch trình du lịch của bạn.',
    noIndex: true,
  },
  explore: {
    title: 'Khám phá',
    description: 'Khám phá các điểm đến du lịch hấp dẫn trên khắp Việt Nam.',
    keywords: ['điểm đến', 'khám phá việt nam', 'destination vietnam'],
  },
  community: {
    title: 'Cộng đồng',
    description: 'Chia sẻ và khám phá lịch trình du lịch từ cộng đồng TravelViet.',
    keywords: ['cộng đồng du lịch', 'chia sẻ lịch trình'],
  },
} as const;