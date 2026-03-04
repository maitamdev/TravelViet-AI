export type SortDirection = 'asc' | 'desc';

export function sortByField<T>(items: T[], field: keyof T, direction: SortDirection = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sortByDate<T>(items: T[], field: keyof T, direction: SortDirection = 'desc'): T[] {
  return [...items].sort((a, b) => {
    const aDate = new Date(a[field] as string).getTime();
    const bDate = new Date(b[field] as string).getTime();
    return direction === 'asc' ? aDate - bDate : bDate - aDate;
  });
}
