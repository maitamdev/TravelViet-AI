// Trip planning calculation utilities

import type { TripItem, CostCategory } from '@/types/database';

/**
 * Calculate total estimated cost from trip items
 */
export function calculateTotalCost(items: TripItem[]): number {
  return items.reduce((sum, item) => sum + (item.estimated_cost_vnd || 0), 0);
}

/**
 * Calculate cost breakdown by category
 */
export function calculateCostBreakdown(items: TripItem[]): Record<string, number> {
  const breakdown: Record<string, number> = {
    move: 0,
    eat: 0,
    visit: 0,
    rest: 0,
    other: 0,
  };
  items.forEach(item => {
    breakdown[item.item_type] = (breakdown[item.item_type] || 0) + (item.estimated_cost_vnd || 0);
  });
  return breakdown;
}

/**
 * Estimate daily spending based on trip mode and destination
 */
export function estimateDailyBudget(mode: string, level: 'budget' | 'mid' | 'luxury'): number {
  const baseRates: Record<string, Record<string, number>> = {
    solo: { budget: 500000, mid: 1200000, luxury: 3000000 },
    couple: { budget: 800000, mid: 2000000, luxury: 5000000 },
    family: { budget: 1500000, mid: 3500000, luxury: 8000000 },
    friends: { budget: 1000000, mid: 2500000, luxury: 6000000 },
  };
  return baseRates[mode]?.[level] || baseRates['solo']['mid'];
}

/**
 * Calculate trip completion percentage
 */
export function calculateTripProgress(
  totalItems: number,
  completedItems: number,
  totalDays: number,
  currentDay: number
): { itemProgress: number; dayProgress: number; overallProgress: number } {
  const itemProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const dayProgress = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0;
  const overallProgress = Math.round((itemProgress + dayProgress) / 2);
  return { itemProgress, dayProgress, overallProgress };
}

/**
 * Suggest budget allocation percentages
 */
export function suggestBudgetAllocation(totalBudget: number): Record<CostCategory, number> {
  return {
    transport: Math.round(totalBudget * 0.25),
    stay: Math.round(totalBudget * 0.30),
    food: Math.round(totalBudget * 0.25),
    tickets: Math.round(totalBudget * 0.10),
    other: Math.round(totalBudget * 0.10),
  };
}

/**
 * Format trip duration in human-readable Vietnamese
 */
export function formatTripDuration(days: number): string {
  if (days <= 0) return 'Chưa xác định';
  if (days === 1) return '1 ngày';
  const nights = days - 1;
  return `${days} ngày ${nights} đêm`;
}
