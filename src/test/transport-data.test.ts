import { describe, it, expect } from 'vitest';
import { estimateTransportCost, TRANSPORT_OPTIONS } from '@/lib/transport-data';

describe('TRANSPORT_OPTIONS', () => {
  it('should have 6 options', () => { expect(TRANSPORT_OPTIONS.length).toBe(6); });
  it('should include may_bay', () => { expect(TRANSPORT_OPTIONS.find(t => t.type === 'may_bay')).toBeDefined(); });
});

describe('estimateTransportCost', () => {
  it('should calculate flight cost', () => {
    const cost = estimateTransportCost('may_bay', 1000);
    expect(cost).toBe(2000000);
  });
  it('should return 0 for unknown type', () => {
    expect(estimateTransportCost('unknown', 100)).toBe(0);
  });
});
