import { describe, it, expect } from 'vitest';
import { getUnsplashUrl, getPlaceholderAvatar } from '@/lib/image-utils';

describe('getUnsplashUrl', () => {
  it('should return unsplash URL', () => {
    expect(getUnsplashUrl('hanoi')).toContain('source.unsplash.com');
  });
});
describe('getPlaceholderAvatar', () => {
  it('should return UI avatars URL', () => {
    expect(getPlaceholderAvatar('Test User')).toContain('ui-avatars.com');
  });
});
