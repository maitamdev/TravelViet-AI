// Trip status helper utilities
import type { TripStatus } from '@/types/database';
export function getStatusLabel(status: TripStatus): string { const labels: Record<TripStatus, string> = { draft: 'Bản nháp', planned: 'Đã lên kế hoạch', ongoing: 'Đang diễn ra', completed: 'Hoàn thành' }; return labels[status] || status; }
export function getStatusColor(status: TripStatus): string { const colors: Record<TripStatus, string> = { draft: 'gray', planned: 'blue', ongoing: 'green', completed: 'purple' }; return colors[status] || 'gray'; }
export function getStatusIcon(status: TripStatus): string { const icons: Record<TripStatus, string> = { draft: '📝', planned: '📋', ongoing: '✈️', completed: '✅' }; return icons[status] || '📌'; }
export function canEditTrip(status: TripStatus): boolean { return status === 'draft' || status === 'planned'; }
export function canDeleteTrip(status: TripStatus): boolean { return status !== 'ongoing'; }
export function getNextStatus(status: TripStatus): TripStatus | null { const flow: Record<TripStatus, TripStatus | null> = { draft: 'planned', planned: 'ongoing', ongoing: 'completed', completed: null }; return flow[status]; }
export function getStatusDescription(status: TripStatus): string {
  const desc: Record<TripStatus, string> = {
    draft: 'Chuyến đi đang được lên kế hoạch, chưa hoàn thiện',
    planned: 'Kế hoạch đã sẵn sàng, chờ ngày khởi hành',
    ongoing: 'Đang thực hiện chuyến đi',
    completed: 'Chuyến đi đã kết thúc',
  };
  return desc[status] || '';
}
export function getStatusProgress(status: TripStatus): number { const progress: Record<TripStatus, number> = { draft: 25, planned: 50, ongoing: 75, completed: 100 }; return progress[status] || 0; }