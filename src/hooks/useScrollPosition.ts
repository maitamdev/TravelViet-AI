import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'idle';
  isAtTop: boolean;
  isAtBottom: boolean;
  percentage: number;
}

/**
 * Track scroll position with direction detection
 */
export function useScrollPosition(threshold = 10): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: 'idle',
    isAtTop: true,
    isAtBottom: false,
    percentage: 0,
  });

  const handleScroll = useCallback(() => {
    const x = window.scrollX;
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.round((y / maxScroll) * 100) : 0;

    setPosition(prev => ({
      x,
      y,
      direction: y > prev.y + threshold ? 'down' : y < prev.y - threshold ? 'up' : prev.direction,
      isAtTop: y <= 0,
      isAtBottom: y >= maxScroll - 5,
      percentage: pct,
    }));
  }, [threshold]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  return position;
}