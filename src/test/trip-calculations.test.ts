import { describe, it, expect } from 'vitest';
import { calculateTotalCost, estimateDailyBudget, calculateTripProgress, suggestBudgetAllocation, formatTripDuration } from '@/lib/trip-calculations';

describe('calculateTotalCost', () => {
  it('should sum up costs', () => {
    const items = [
      { estimated_cost_vnd: 100000 },
      { estimated_cost_vnd: 200000 },
      { estimated_cost_vnd: 50000 },
    ] as any[];
    expect(calculateTotalCost(items)).toBe(350000);
  });

  it('should handle empty array', () => {
    expect(calculateTotalCost([])).toBe(0);
  });
});

describe('estimateDailyBudget', () => {
  it('should return budget for known modes', () => {
    expect(estimateDailyBudget('solo', 'budget')).toBe(500000);
    expect(estimateDailyBudget('couple', 'luxury')).toBe(5000000);
  });

  it('should return default for unknown mode', () => {
    expect(estimateDailyBudget('unknown', 'mid')).toBe(1200000);
  });
});

describe('calculateTripProgress', () => {
  it('should calculate progress correctly', () => {
    const result = calculateTripProgress(10, 5, 4, 2);
    expect(result.itemProgress).toBe(50);
    expect(result.dayProgress).toBe(50);
    expect(result.overallProgress).toBe(50);
  });

  it('should handle zero totals', () => {
    const result = calculateTripProgress(0, 0, 0, 0);
    expect(result.overallProgress).toBe(0);
  });
});

describe('suggestBudgetAllocation', () => {
  it('should allocate budget proportionally', () => {
    const allocation = suggestBudgetAllocation(10000000);
    expect(allocation.transport).toBe(2500000);
    expect(allocation.stay).toBe(3000000);
    expect(allocation.food).toBe(2500000);
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    expect(total).toBe(10000000);
  });
});

describe('formatTripDuration', () => {
  it('should format trip duration', () => {
    expect(formatTripDuration(1)).toBe('1 ngày');
    expect(formatTripDuration(3)).toBe('3 ngày 2 đêm');
    expect(formatTripDuration(0)).toBe('Chưa xác định');
  });
});