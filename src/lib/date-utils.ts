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

export function getCalendarWeeks(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks: Date[][] = [];
  let current = new Date(firstDay);
  current.setDate(current.getDate() - current.getDay());
  while (current <= lastDay || weeks.length < 6) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) { week.push(new Date(current)); current.setDate(current.getDate() + 1); }
    weeks.push(week);
    if (current > lastDay && weeks.length >= 5) break;
  }
  return weeks;
}

export function getTimezone(): string { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
export function toLocalDateString(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function parseLocalDate(str: string): Date { const [y,m,d] = str.split('-').map(Number); return new Date(y, m-1, d); }
export function getDateDiff(d1: Date, d2: Date): { days: number; hours: number; minutes: number } {
  const ms = Math.abs(d2.getTime() - d1.getTime());
  return { days: Math.floor(ms/86400000), hours: Math.floor((ms%86400000)/3600000), minutes: Math.floor((ms%3600000)/60000) };
}