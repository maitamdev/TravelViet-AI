import { describe, it, expect } from 'vitest';
import { fadeIn, fadeInUp, scaleIn, staggerContainer, staggerItem, pageTransition, modalContent } from '@/lib/animations';

describe('animation variants', () => {
  it('fadeIn should have hidden and visible states', () => {
    expect(fadeIn.hidden).toHaveProperty('opacity', 0);
    expect(fadeIn.visible).toHaveProperty('opacity', 1);
  });
  it('fadeInUp should move from below', () => {
    expect(fadeInUp.hidden).toHaveProperty('y', 20);
    expect(fadeInUp.visible).toHaveProperty('y', 0);
  });
  it('scaleIn should scale from smaller', () => {
    expect(scaleIn.hidden).toHaveProperty('scale', 0.8);
    expect(scaleIn.visible).toHaveProperty('scale', 1);
  });
  it('staggerContainer should define stagger timing', () => {
    expect(staggerContainer.visible.transition).toHaveProperty('staggerChildren');
    expect(staggerContainer.visible.transition).toHaveProperty('delayChildren');
  });
  it('staggerItem should animate from below', () => {
    expect(staggerItem.hidden).toHaveProperty('y', 15);
  });
  it('pageTransition should have all lifecycle states', () => {
    expect(pageTransition).toHaveProperty('initial');
    expect(pageTransition).toHaveProperty('animate');
    expect(pageTransition).toHaveProperty('exit');
  });
  it('modalContent should scale and fade', () => {
    expect(modalContent.hidden).toHaveProperty('scale', 0.95);
    expect(modalContent.visible).toHaveProperty('scale', 1);
  });
});