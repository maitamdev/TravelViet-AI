import { describe, it, expect } from 'vitest';
import { createLogger, prettyPrintObject, freezeDeep, generateUUID, identity, noop } from '@/lib/dev-utils';
describe('createLogger', () => { it('should create logger with all methods', () => { const log = createLogger('Test'); expect(log.log).toBeDefined(); expect(log.warn).toBeDefined(); expect(log.error).toBeDefined(); expect(log.debug).toBeDefined(); expect(log.time).toBeDefined(); }); });
describe('prettyPrintObject', () => { it('should format object', () => { expect(prettyPrintObject({ a: 1 })).toContain('"a": 1'); }); });
describe('freezeDeep', () => { it('should freeze nested objects', () => { const obj = freezeDeep({ a: { b: 1 } } as any); expect(Object.isFrozen(obj)).toBe(true); expect(Object.isFrozen(obj.a)).toBe(true); }); });
describe('generateUUID', () => { it('should generate valid UUID format', () => { const uuid = generateUUID(); expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/); }); it('should generate unique UUIDs', () => { expect(generateUUID()).not.toBe(generateUUID()); }); });
describe('identity', () => { it('should return same value', () => { expect(identity(42)).toBe(42); expect(identity('hello')).toBe('hello'); }); });
describe('noop', () => { it('should return undefined', () => { expect(noop()).toBeUndefined(); }); });