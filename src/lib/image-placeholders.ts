// Image placeholder and fallback utilities
export function getPlaceholderImage(width = 400, height = 300, text = 'TravelViet'): string { return `https://placehold.co/${width}x${height}/2563eb/ffffff?text=${encodeURIComponent(text)}`; }
export function getDestinationPlaceholder(destination: string): string { return `https://placehold.co/800x400/2563eb/ffffff?text=${encodeURIComponent(destination)}`; }
export function getAvatarPlaceholder(name: string, size = 200): string { return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=2563eb&color=ffffff&bold=true`; }
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
export function isValidImageType(file: File): boolean { const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']; return validTypes.includes(file.type); }
export function compressImageUrl(url: string, width = 800, quality = 80): string { if (url.includes('unsplash.com')) return `${url}&w=${width}&q=${quality}&auto=format`; return url; }
export const FALLBACK_IMAGES = {
  destination: '/images/destination-fallback.jpg',
  avatar: '/images/avatar-fallback.png',
  trip: '/images/trip-fallback.jpg',
  food: '/images/food-fallback.jpg',
  hotel: '/images/hotel-fallback.jpg',
} as const;
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, fallback?: string): void {
  const target = event.currentTarget;
  if (fallback) { target.src = fallback; } else { target.style.display = 'none'; }
  target.onerror = null;
}