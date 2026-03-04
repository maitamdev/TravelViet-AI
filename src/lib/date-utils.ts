export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isDateInPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function isDateInFuture(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Vua xong';
  if (diffMins < 60) return diffMins + ' phut truoc';
  if (diffHours < 24) return diffHours + ' gio truoc';
  if (diffDays < 7) return diffDays + ' ngay truoc';
  if (diffDays < 30) return Math.floor(diffDays / 7) + ' tuan truoc';
  return Math.floor(diffDays / 30) + ' thang truoc';
}
