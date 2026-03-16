export function calculateBudgetPerDay(totalBudget: number, days: number): number {
  if (days <= 0) return 0;
  return Math.round(totalBudget / days);
}

export function calculateBudgetPerPerson(totalBudget: number, travelers: number): number {
  if (travelers <= 0) return 0;
  return Math.round(totalBudget / travelers);
}

export function getBudgetStatus(spent: number, total: number): 'safe' | 'warning' | 'danger' {
  if (total <= 0) return 'safe';
  const ratio = spent / total;
  if (ratio < 0.7) return 'safe';
  if (ratio < 0.9) return 'warning';
  return 'danger';
}

export function formatBudgetShort(amount: number): string {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + ' ty';
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' tr';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'k';
  return amount.toString();
}

export function calculateSavings(budgeted: number, spent: number): number { return Math.max(0, budgeted - spent); }
export function getSpendingRate(spent: number, days: number): number { if (days <= 0) return 0; return Math.round(spent / days); }
export function projectTotalSpending(dailyRate: number, totalDays: number): number { return dailyRate * totalDays; }
export function getBudgetHealthScore(spent: number, total: number, daysElapsed: number, totalDays: number): number {
  if (total <= 0 || totalDays <= 0) return 100;
  const expectedRate = total / totalDays;
  const actualRate = daysElapsed > 0 ? spent / daysElapsed : 0;
  const ratio = expectedRate > 0 ? actualRate / expectedRate : 0;
  if (ratio <= 0.8) return 100;
  if (ratio <= 1.0) return 80;
  if (ratio <= 1.2) return 60;
  if (ratio <= 1.5) return 40;
  return 20;
}
export function formatBudgetRange(min: number, max: number): string {
  const fmt = (n: number) => { if (n >= 1000000) return (n/1000000).toFixed(1) + ' triệu'; if (n >= 1000) return (n/1000).toFixed(0) + 'K'; return n.toString(); };
  return `${fmt(min)} - ${fmt(max)} VNĐ`;
}