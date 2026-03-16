// Form utility helpers for TravelViet AI

/**
 * Prevent form submission on Enter key (useful for search inputs)
 */
export function preventEnterSubmit(e: React.KeyboardEvent): void {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
}

/**
 * Format input as Vietnamese phone number
 */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
}

/**
 * Format input as Vietnamese currency (VND)
 */
export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('vi-VN').format(Number(digits));
}

/**
 * Parse formatted currency back to number
 */
export function parseCurrencyInput(formatted: string): number {
  return Number(formatted.replace(/\D/g, '')) || 0;
}

/**
 * Create a debounced input handler
 */
export function createDebouncedHandler(
  handler: (value: string) => void,
  delay = 300
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => handler(e.target.value), delay);
  };
}

/**
 * Validate Vietnamese phone number format
 */
export function isVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^(\+84|0)(3|5|7|8|9)\d{8}$/.test(cleaned);
}

/**
 * Get word count from text
 */
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Get character count remaining
 */
export function getCharsRemaining(text: string, maxLength: number): number {
  return Math.max(0, maxLength - text.length);
}