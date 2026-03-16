// String utility functions for TravelViet AI

/**
 * Remove Vietnamese diacritical marks for search matching
 */
export function removeVietnameseDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Generate initials from a full name
 */
export function getInitials(name: string, maxChars = 2): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, maxChars)
    .join('')
    .toUpperCase();
}

/**
 * Mask email address for privacy display
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  const visible = localPart.slice(0, 2);
  const masked = '*'.repeat(Math.max(localPart.length - 2, 2));
  return `${visible}${masked}@${domain}`;
}

/**
 * Convert bytes to human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${size} ${units[i]}`;
}

/**
 * Escape HTML characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Generate a random color from a string (for avatars, tags, etc.)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}
