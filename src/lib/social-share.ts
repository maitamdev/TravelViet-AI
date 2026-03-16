// Social media share helpers
export function shareToFacebook(url: string): void { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400'); }
export function shareToTwitter(text: string, url: string): void { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400'); }
export function shareToLinkedin(url: string, title: string): void { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400'); }
export function shareToZalo(url: string): void { window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}`, '_blank'); }
export function shareViaEmail(subject: string, body: string): void { window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }
export async function shareNative(data: { title: string; text: string; url: string }): Promise<boolean> {
  if (!navigator.share) return false;
  try { await navigator.share(data); return true; } catch { return false; }
}
export function canShareNative(): boolean { return typeof navigator !== 'undefined' && !!navigator.share; }
export function buildShareMessage(tripTitle: string, url: string): string { return `Xem lịch trình du lịch "${tripTitle}" trên TravelViet AI!\n\n${url}`; }
export type SharePlatform = 'facebook' | 'twitter' | 'linkedin' | 'zalo' | 'email' | 'native';
export function shareTo(platform: SharePlatform, data: { url: string; title: string; text: string }): void {
  switch (platform) { case 'facebook': shareToFacebook(data.url); break; case 'twitter': shareToTwitter(data.text, data.url); break; case 'linkedin': shareToLinkedin(data.url, data.title); break; case 'zalo': shareToZalo(data.url); break; case 'email': shareViaEmail(data.title, `${data.text}\n${data.url}`); break; case 'native': shareNative(data); break; }
}