import { describe, it, expect, beforeEach } from 'vitest';
import { parseQueryString, isValidUrl, extractDomain, buildGoogleMapsUrl } from '@/lib/url-utils';

describe('parseQueryString', () => {
  it('should parse query string', () => {
    const result = parseQueryString('?name=test&value=123');
    expect(result.name).toBe('test');
    expect(result.value).toBe('123');
  });

  it('should handle empty string', () => {
    expect(parseQueryString('')).toEqual({});
  });
});

describe('isValidUrl', () => {
  it('should validate URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });
});

describe('extractDomain', () => {
  it('should extract domain', () => {
    expect(extractDomain('https://www.example.com/path')).toBe('www.example.com');
    expect(extractDomain('invalid')).toBe('');
  });
});

describe('buildGoogleMapsUrl', () => {
  it('should build maps URL with coordinates', () => {
    const url = buildGoogleMapsUrl('Test', 10.5, 106.7);
    expect(url).toContain('10.5,106.7');
  });

  it('should build maps URL with location name', () => {
    const url = buildGoogleMapsUrl('Da Nang');
    expect(url).toContain(encodeURIComponent('Da Nang Vietnam'));
  });
});
