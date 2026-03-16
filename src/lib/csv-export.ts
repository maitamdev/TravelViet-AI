// CSV Export utility for trip data
export function arrayToCsv<T extends Record<string, unknown>>(data: T[], columns?: { key: keyof T; label: string }[]): string {
  if (data.length === 0) return '';
  const cols = columns || Object.keys(data[0]).map(k => ({ key: k as keyof T, label: String(k) }));
  const header = cols.map(c => escCsv(c.label)).join(',');
  const rows = data.map(row => cols.map(c => escCsv(String(row[c.key] ?? ''))).join(','));
  return [header, ...rows].join('\n');
}
function escCsv(val: string): string { if (val.includes(',') || val.includes('"') || val.includes('\n')) return `"${val.replace(/"/g, '""')}"`; return val; }
export function downloadCsv(csvContent: string, filename: string): void {
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link); link.click();
  document.body.removeChild(link); URL.revokeObjectURL(url);
}
export function tripItemsToCsv(items: { title: string; item_type: string; start_time?: string; end_time?: string; estimated_cost_vnd?: number; location_name?: string }[]): string {
  return arrayToCsv(items, [
    { key: 'title', label: 'Hoạt động' },
    { key: 'item_type', label: 'Loại' },
    { key: 'start_time', label: 'Bắt đầu' },
    { key: 'end_time', label: 'Kết thúc' },
    { key: 'estimated_cost_vnd', label: 'Chi phí (VNĐ)' },
    { key: 'location_name', label: 'Địa điểm' },
  ]);
}
export function budgetToCsv(costs: { category: string; amount_vnd: number; note?: string }[]): string {
  return arrayToCsv(costs, [
    { key: 'category', label: 'Danh mục' },
    { key: 'amount_vnd', label: 'Số tiền (VNĐ)' },
    { key: 'note', label: 'Ghi chú' },
  ]);
}