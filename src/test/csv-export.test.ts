import { describe, it, expect } from 'vitest';
import { arrayToCsv, tripItemsToCsv, budgetToCsv } from '@/lib/csv-export';
describe('arrayToCsv', () => {
  it('should convert array to CSV', () => { const data = [{ name: 'A', age: 25 }, { name: 'B', age: 30 }]; const csv = arrayToCsv(data); expect(csv).toContain('name,age'); expect(csv).toContain('A,25'); });
  it('should handle empty array', () => { expect(arrayToCsv([])).toBe(''); });
  it('should escape commas in values', () => { const data = [{ text: 'hello, world' }]; const csv = arrayToCsv(data); expect(csv).toContain('"hello, world"'); });
  it('should use custom column labels', () => { const data = [{ x: 1 }]; const csv = arrayToCsv(data, [{ key: 'x', label: 'Value' }]); expect(csv).toContain('Value'); });
});
describe('tripItemsToCsv', () => { it('should format trip items', () => { const items = [{ title: 'Visit', item_type: 'visit', estimated_cost_vnd: 100000, location_name: 'Hanoi' }]; const csv = tripItemsToCsv(items); expect(csv).toContain('Hoạt động'); expect(csv).toContain('Visit'); }); });
describe('budgetToCsv', () => { it('should format budget data', () => { const costs = [{ category: 'food', amount_vnd: 500000, note: 'Lunch' }]; const csv = budgetToCsv(costs); expect(csv).toContain('Danh mục'); expect(csv).toContain('food'); }); });