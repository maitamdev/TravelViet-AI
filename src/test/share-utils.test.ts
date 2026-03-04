import { describe, it, expect } from 'vitest';
import { generateShareUrl } from '@/lib/share-utils';

describe('generateShareUrl', () => {
  it('should generate correct share URL', () => {
    const url = generateShareUrl('abc123');
    expect(url).toContain('/share/abc123');
  });
});
