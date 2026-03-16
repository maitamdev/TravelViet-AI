import { describe, it, expect } from 'vitest';
import { PROVINCE_COORDINATES, getProvinceByName, getProvincesByRegion, getProvinceCoords, getNearestProvince } from '@/lib/province-coordinates';
describe('PROVINCE_COORDINATES', () => { it('should have provinces', () => { expect(PROVINCE_COORDINATES.length).toBeGreaterThanOrEqual(10); }); });
describe('getProvinceByName', () => { it('should find province', () => { const hn = getProvinceByName('Hà Nội'); expect(hn?.lat).toBeCloseTo(21.03, 1); }); it('should return undefined for unknown', () => { expect(getProvinceByName('Unknown')).toBeUndefined(); }); });
describe('getProvincesByRegion', () => { it('should filter by region', () => { const central = getProvincesByRegion('central'); expect(central.length).toBeGreaterThan(0); central.forEach(p => expect(p.region).toBe('central')); }); });
describe('getProvinceCoords', () => { it('should return coords', () => { const c = getProvinceCoords('Đà Nẵng'); expect(c?.lat).toBeCloseTo(16.05, 1); }); });
describe('getNearestProvince', () => { it('should find nearest', () => { const p = getNearestProvince(21, 106); expect(p.name).toBeTruthy(); }); });