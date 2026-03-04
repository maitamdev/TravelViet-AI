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
