import { describe, it, expect } from 'vitest';
import { fuzzySearch, highlightMatch } from '@/lib/search-utils';

describe('fuzzySearch', () => {
  it('should find exact matches', () => {
    const results = fuzzySearch('hanoi', ['Ha Noi', 'Da Nang', 'Sai Gon']);
    expect(results).toContain('Ha Noi');
  });
});
describe('highlightMatch', () => {
  it('should wrap match in mark tags', () => {
    expect(highlightMatch('Hello World', 'World')).toContain('<mark>World</mark>');
  });
  it('should return text unchanged if no query', () => {
    expect(highlightMatch('Hello', '')).toBe('Hello');
  });
});
