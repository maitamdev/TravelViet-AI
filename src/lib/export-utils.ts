export function tripToCsv(trip: any, days: any[], items: any[]): string {
  let csv = 'Ngay,Hoat dong,Dia diem,Chi phi,Loai\n';
  days.forEach((day, i) => {
    const dayItems = items.filter(item => item.trip_day_id === day.id);
    dayItems.forEach(item => {
      csv += (i + 1) + ',' + item.title + ',' + (item.location_name || '') + ',' + (item.estimated_cost_vnd || 0) + ',' + item.item_type + '\n';
    });
  });
  return csv;
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
