import { describe, it, expect } from 'vitest';
import { truncateText, capitalizeFirst, slugify, pluralize } from '@/lib/format-utils';

describe('truncateText', () => {
  it('should truncate long text', () => { expect(truncateText('Hello World Test', 10)).toBe('Hello W...'); });
  it('should not truncate short text', () => { expect(truncateText('Hi', 10)).toBe('Hi'); });
});

describe('capitalizeFirst', () => {
  it('should capitalize first letter', () => { expect(capitalizeFirst('hello')).toBe('Hello'); });
});

describe('slugify', () => {
  it('should create slug', () => { expect(slugify('Hello World')).toBe('hello-world'); });
  it('should handle special chars', () => { expect(slugify('Test! @#')).toBe('test'); });
});

describe('pluralize', () => {
  it('should use singular for 1', () => { expect(pluralize(1, 'item')).toBe('1 item'); });
  it('should use same for plural in VN', () => { expect(pluralize(3, 'item')).toBe('3 item'); });
});
