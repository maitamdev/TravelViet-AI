// Date formatting and Vietnamese calendar utilities
export function getVietnameseDay(date: Date): string { const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']; return days[date.getDay()]; }
export function getVietnameseMonth(month: number): string { const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']; return months[month] || ''; }
export function formatFullDateVN(date: Date | string): string { const d = typeof date === 'string' ? new Date(date) : date; return `${getVietnameseDay(d)}, ${d.getDate()} ${getVietnameseMonth(d.getMonth())} ${d.getFullYear()}`; }
export function isSameDay(d1: Date, d2: Date): boolean { return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(); }
export function isToday(date: Date): boolean { return isSameDay(date, new Date()); }
export function isTomorrow(date: Date): boolean { const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); return isSameDay(date, tomorrow); }
export function isWeekend(date: Date): boolean { const d = date.getDay(); return d === 0 || d === 6; }
export function getWeekNumber(date: Date): number { const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)); return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7); }
export function addDays(date: Date, days: number): Date { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
export function getMonthDays(year: number, month: number): number { return new Date(year, month + 1, 0).getDate(); }
export function formatTimeRange(start: string, end: string): string { return `${start} - ${end}`; }
export function getQuarter(date: Date): number { return Math.floor(date.getMonth() / 3) + 1; }