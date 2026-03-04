import { useState, useEffect, useRef } from 'react';
interface UseVirtualScrollOptions { itemCount: number; itemHeight: number; overscan?: number; }
export function useVirtualScroll({ itemCount, itemHeight, overscan = 5 }: UseVirtualScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    setContainerHeight(c.clientHeight);
    const h = () => setScrollTop(c.scrollTop);
    c.addEventListener('scroll', h); return () => c.removeEventListener('scroll', h);
  }, []);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(itemCount - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);
  return { containerRef, startIndex, endIndex, totalHeight: itemCount * itemHeight, offsetY: startIndex * itemHeight };
}
