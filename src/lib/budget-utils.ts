export function calculateBudgetPerDay(totalBudget: number, days: number): number {
  if (days <= 0) return 0;
  return Math.round(totalBudget / days);
}
