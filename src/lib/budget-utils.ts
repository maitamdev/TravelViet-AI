export function calculateBudgetPerDay(totalBudget: number, days: number): number {
  if (days <= 0) return 0;
  return Math.round(totalBudget / days);
}

export function calculateBudgetPerPerson(totalBudget: number, travelers: number): number {
  if (travelers <= 0) return 0;
  return Math.round(totalBudget / travelers);
}
