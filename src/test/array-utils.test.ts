import { describe, it, expect } from 'vitest';
import { groupBy, uniqueBy, chunk, shuffle, sample, flattenDeep, sortByMultiple } from '@/lib/array-utils';

describe('groupBy', () => {
  it('should group items by key', () => {
    const items = [{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }];
    const result = groupBy(items, i => i.type);
    expect(result['a']).toHaveLength(2);
    expect(result['b']).toHaveLength(1);
  });
});

describe('uniqueBy', () => {
  it('should remove duplicates by key', () => {
    const items = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
    expect(uniqueBy(items, i => i.id)).toHaveLength(2);
  });
});

describe('chunk', () => {
  it('should split array into chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
  });

  it('should handle size 0', () => {
    expect(chunk([1, 2], 0)).toEqual([[1, 2]]);
  });
});

describe('shuffle', () => {
  it('should return array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it('should not mutate original array', () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe('sample', () => {
  it('should return requested number of items', () => {
    expect(sample([1, 2, 3, 4, 5], 3)).toHaveLength(3);
  });

  it('should not exceed array length', () => {
    expect(sample([1, 2], 5)).toHaveLength(2);
  });
});

describe('flattenDeep', () => {
  it('should flatten nested arrays', () => {
    expect(flattenDeep([1, [2, [3]], 4])).toEqual([1, 2, 3, 4]);
  });
});

describe('sortByMultiple', () => {
  it('should sort by multiple criteria', () => {
    const items = [
      { name: 'B', age: 20 },
      { name: 'A', age: 30 },
      { name: 'A', age: 20 },
    ];
    const sorted = sortByMultiple(items, [
      (a, b) => a.name.localeCompare(b.name),
      (a, b) => a.age - b.age,
    ]);
    expect(sorted[0]).toEqual({ name: 'A', age: 20 });
  });
});
