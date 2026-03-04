// API response types

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface StreamChunk {
  id: string;
  choices: Array<{
    delta: { content?: string };
    finish_reason: string | null;
  }>;
}
