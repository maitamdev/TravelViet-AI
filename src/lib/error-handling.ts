// Error boundary utilities and error reporting helpers
export class AppError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;
  public readonly isOperational: boolean;
  constructor(message: string, code: string, context?: Record<string, unknown>, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  STORAGE_FULL: 'STORAGE_FULL',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Đã xảy ra lỗi không xác định';
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof AppError) return error.code === ErrorCodes.NETWORK_ERROR;
  if (error instanceof TypeError && error.message.includes('fetch')) return true;
  return false;
}

export function createErrorFromResponse(response: Response): AppError {
  const statusMap: Record<number, string> = {
    400: 'Yêu cầu không hợp lệ',
    401: 'Vui lòng đăng nhập lại',
    403: 'Bạn không có quyền thực hiện hành động này',
    404: 'Không tìm thấy tài nguyên',
    429: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
    500: 'Lỗi máy chủ, vui lòng thử lại',
  };
  const message = statusMap[response.status] || `Lỗi HTTP ${response.status}`;
  const code = response.status === 429 ? ErrorCodes.RATE_LIMIT : response.status >= 500 ? ErrorCodes.SERVER_ERROR : ErrorCodes.UNKNOWN;
  return new AppError(message, code, { status: response.status, url: response.url });
}

export function logError(error: unknown, context?: string): void {
  const msg = getErrorMessage(error);
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}]${context ? ` [${context}]` : ''} ${msg}`, error);
}