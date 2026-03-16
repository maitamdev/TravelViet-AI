// Types for API request/response patterns
export interface PaginatedRequest { page: number; limit: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; }
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrev: boolean; }
export function createPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return { data, total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
}
export interface SortOption { field: string; label: string; defaultOrder: 'asc' | 'desc'; }
export const TRIP_SORT_OPTIONS: SortOption[] = [
  { field: 'created_at', label: 'Ngày tạo', defaultOrder: 'desc' },
  { field: 'updated_at', label: 'Cập nhật gần nhất', defaultOrder: 'desc' },
  { field: 'start_date', label: 'Ngày khởi hành', defaultOrder: 'asc' },
  { field: 'title', label: 'Tên chuyến đi', defaultOrder: 'asc' },
  { field: 'total_budget_vnd', label: 'Ngân sách', defaultOrder: 'desc' },
];
export const COMMUNITY_SORT_OPTIONS: SortOption[] = [
  { field: 'published_at', label: 'Mới nhất', defaultOrder: 'desc' },
  { field: 'likes_count', label: 'Yêu thích nhất', defaultOrder: 'desc' },
  { field: 'saves_count', label: 'Lưu nhiều nhất', defaultOrder: 'desc' },
];
export interface FilterOption { key: string; label: string; type: 'select' | 'range' | 'date' | 'checkbox'; options?: { value: string; label: string }[]; }