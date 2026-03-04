// Cost category definitions for budget tracking

export const COST_CATEGORIES = [
  { value: 'transport', label: 'Di chuyen', icon: '🚗', color: 'blue' },
  { value: 'stay', label: 'Luu tru', icon: '🏨', color: 'purple' },
  { value: 'food', label: 'An uong', icon: '🍜', color: 'orange' },
  { value: 'tickets', label: 'Ve tham quan', icon: '🎫', color: 'green' },
  { value: 'other', label: 'Khac', icon: '💰', color: 'gray' },
] as const;

export type CostCategoryValue = typeof COST_CATEGORIES[number]['value'];

export function getCategoryInfo(value: string) {
  return COST_CATEGORIES.find(c => c.value === value) || COST_CATEGORIES[4];
}

export function getCategoryIcon(value: string): string {
  return getCategoryInfo(value).icon;
}

export function getCategoryLabel(value: string): string {
  return getCategoryInfo(value).label;
}
