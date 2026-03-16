// Number utility functions for TravelViet AI

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return roundTo((value / total) * 100, 1);
}

/**
 * Format number with thousand separators (Vietnamese style)
 */
export function formatNumberVN(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

/**
 * Parse Vietnamese formatted number string back to number
 */
export function parseNumberVN(str: string): number {
  return Number(str.replace(/\./g, '').replace(',', '.'));
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if a number is within a range (inclusive)
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Calculate the average of an array of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return roundTo(sum / numbers.length, 2);
}

/**
 * Calculate the sum of an array of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

/**
 * Format a large number with K, M, B suffixes
 */
export function compactNumber(value: number): string {
  if (Math.abs(value) >= 1e9) return (value / 1e9).toFixed(1) + 'B';
  if (Math.abs(value) >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  if (Math.abs(value) >= 1e3) return (value / 1e3).toFixed(1) + 'K';
  return value.toString();
}
