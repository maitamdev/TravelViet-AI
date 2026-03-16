import { describe, it, expect } from 'vitest';
import { tripValidation, commentValidation, profileValidation } from '@/lib/validation';
describe('tripValidation', () => {
  it('title: should require 3+ chars', () => { expect(tripValidation.title('')).toBeTruthy(); expect(tripValidation.title('ab')).toBeTruthy(); expect(tripValidation.title('abc')).toBeNull(); });
  it('destination: should require at least 1', () => { expect(tripValidation.destination([])).toBeTruthy(); expect(tripValidation.destination(['HN'])).toBeNull(); });
  it('travelers: should be 1-50', () => { expect(tripValidation.travelers(0)).toBeTruthy(); expect(tripValidation.travelers(5)).toBeNull(); expect(tripValidation.travelers(51)).toBeTruthy(); });
  it('budget: should be non-negative', () => { expect(tripValidation.budget(-1)).toBeTruthy(); expect(tripValidation.budget(1000000)).toBeNull(); });
});
describe('commentValidation', () => { it('should require non-empty content', () => { expect(commentValidation.content('')).toBeTruthy(); expect(commentValidation.content('ok')).toBeNull(); }); });
describe('profileValidation', () => { it('fullName required', () => { expect(profileValidation.fullName('')).toBeTruthy(); expect(profileValidation.fullName('John')).toBeNull(); }); });