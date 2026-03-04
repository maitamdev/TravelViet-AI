import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
interface LazyImageProps { src: string; alt: string; className?: string; }
export function LazyImage({ src, alt, className }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn('overflow-hidden bg-muted', className)}>
      {inView && <img src={src} alt={alt} loading='lazy' onLoad={() => setLoaded(true)}
        className={cn('w-full h-full object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')} />}
    </div>
  );
}
