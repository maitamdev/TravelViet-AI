import { describe, it, expect } from 'vitest';
import { AppError, ErrorCodes, getErrorMessage, isNetworkError, logError } from '@/lib/error-handling';

describe('AppError', () => {
  it('should create error with code and context', () => {
    const err = new AppError('Test error', ErrorCodes.AUTH_ERROR, { userId: '123' });
    expect(err.message).toBe('Test error');
    expect(err.code).toBe('AUTH_ERROR');
    expect(err.context).toEqual({ userId: '123' });
    expect(err.isOperational).toBe(true);
    expect(err instanceof Error).toBe(true);
  });
});
describe('getErrorMessage', () => {
  it('should extract message from different error types', () => {
    expect(getErrorMessage(new AppError('app', 'CODE'))).toBe('app');
    expect(getErrorMessage(new Error('std'))).toBe('std');
    expect(getErrorMessage('string error')).toBe('string error');
    expect(getErrorMessage(null)).toBe('Đã xảy ra lỗi không xác định');
    expect(getErrorMessage(42)).toBe('Đã xảy ra lỗi không xác định');
  });
});
describe('isNetworkError', () => {
  it('should detect network errors', () => {
    expect(isNetworkError(new AppError('net', ErrorCodes.NETWORK_ERROR))).toBe(true);
    expect(isNetworkError(new AppError('other', ErrorCodes.AUTH_ERROR))).toBe(false);
  });
});
describe('ErrorCodes', () => {
  it('should have all expected error codes', () => {
    expect(ErrorCodes.NETWORK_ERROR).toBe('NETWORK_ERROR');
    expect(ErrorCodes.AUTH_ERROR).toBe('AUTH_ERROR');
    expect(ErrorCodes.RATE_LIMIT).toBe('RATE_LIMIT');
    expect(ErrorCodes.AI_SERVICE_ERROR).toBe('AI_SERVICE_ERROR');
    expect(ErrorCodes.PERMISSION_DENIED).toBe('PERMISSION_DENIED');
  });
});