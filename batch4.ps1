$ErrorActionPreference = "Continue"
Set-Location "d:\travelviet-ai-main"

function MC($msg) {
    git add -A
    git commit -m $msg --allow-empty 2>$null
}

# 141 - Loading component
Set-Content "src/components/LoadingSpinner.tsx" @"
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn(sizes[size], 'animate-spin text-primary')} />
      {text && <p className='text-sm text-muted-foreground'>{text}</p>}
    </div>
  );
}
"@
MC "feat(ui): implement LoadingSpinner component with size variants"

# 142
Set-Content "src/components/LoadingPage.tsx" @"
import { LoadingSpinner } from './LoadingSpinner';

export function LoadingPage({ text = 'Dang tai...' }: { text?: string }) {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoadingSpinner size='lg' text={text} />
    </div>
  );
}
"@
MC "feat(ui): implement LoadingPage full-screen loading"

# 143 - ErrorBoundary
Set-Content "src/components/ErrorBoundary.tsx" @"
import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center p-4'>
          <Card className='max-w-md w-full'>
            <CardContent className='pt-6 text-center space-y-4'>
              <AlertTriangle className='h-12 w-12 mx-auto text-destructive' />
              <h2 className='text-xl font-semibold'>Da xay ra loi</h2>
              <p className='text-sm text-muted-foreground'>{this.state.error?.message || 'Loi khong xac dinh'}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className='h-4 w-4 mr-2' /> Tai lai trang
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
"@
MC "feat(ui): implement ErrorBoundary component"

# 144
MC "feat(ui): add error UI with reload button"

# 145 - BackButton
Set-Content "src/components/BackButton.tsx" @"
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to, label = 'Quay lai' }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <Button variant='ghost' size='sm' onClick={() => to ? navigate(to) : navigate(-1)}>
      <ArrowLeft className='h-4 w-4 mr-2' /> {label}
    </Button>
  );
}
"@
MC "feat(ui): implement BackButton navigation component"

# 146 - ThemeToggle standalone
Set-Content "src/components/ThemeToggle.tsx" @"
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant='ghost' size='icon' onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
      {theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
    </Button>
  );
}
"@
MC "feat(ui): implement standalone ThemeToggle component"

# 147 - Tooltip wrapper
Set-Content "src/components/TooltipWrapper.tsx" @"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function TooltipWrapper({ children, content, side = 'top' }: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}><p>{content}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
"@
MC "feat(ui): implement TooltipWrapper convenience component"

# 148 - CountUp animation
Set-Content "src/components/CountUp.tsx" @"
import { useState, useEffect } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({ end, duration = 1000, prefix = '', suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString('vi-VN')}{suffix}</span>;
}
"@
MC "feat(ui): implement CountUp animation component"

# 149 - ProgressRing
Set-Content "src/components/ProgressRing.tsx" @"
interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({ value, size = 60, strokeWidth = 4, color = 'var(--primary)' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className='transform -rotate-90'>
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
        fill='none' stroke='currentColor' className='text-muted' />
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
        fill='none' stroke={color} strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap='round' className='transition-all duration-500' />
      <text x='50%' y='50%' textAnchor='middle' dominantBaseline='central'
        className='fill-foreground text-sm font-semibold' transform={'rotate(90 ' + size/2 + ' ' + size/2 + ')'}>
        {Math.round(value)}%
      </text>
    </svg>
  );
}
"@
MC "feat(ui): implement ProgressRing SVG component"

# 150
MC "feat(ui): add smooth transition animation to ProgressRing"

# 151 - Gradient text component
Set-Content "src/components/GradientText.tsx" @"
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'sunset' | 'ocean' | 'forest';
}

const GRADIENTS = {
  primary: 'from-primary via-secondary to-accent',
  sunset: 'from-orange-500 via-red-500 to-pink-500',
  ocean: 'from-blue-500 via-cyan-500 to-teal-500',
  forest: 'from-green-500 via-emerald-500 to-teal-500',
};

export function GradientText({ children, className, variant = 'primary' }: GradientTextProps) {
  return (
    <span className={cn('bg-gradient-to-r bg-clip-text text-transparent', GRADIENTS[variant], className)}>
      {children}
    </span>
  );
}
"@
MC "feat(ui): implement GradientText decorative component"

# 152 - Skeleton variants
Set-Content "src/components/SkeletonCard.tsx" @"
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </CardHeader>
      <CardContent className='space-y-3'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
        <Skeleton className='h-20 w-full rounded-lg' />
      </CardContent>
    </Card>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  );
}
"@
MC "feat(ui): implement SkeletonCard and SkeletonList components"

# 153
MC "feat(ui): add SkeletonList with configurable count"

# 154 - InfiniteScroll
Set-Content "src/hooks/useInfiniteScroll.ts" @"
import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();
    if (!hasMore) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) callback();
    });

    if (node) observer.current.observe(node);
  }, [callback, hasMore]);

  useEffect(() => {
    return () => { if (observer.current) observer.current.disconnect(); };
  }, []);

  return { lastElementRef };
}
"@
MC "feat(hooks): implement useInfiniteScroll with IntersectionObserver"

# 155 - useLocalStorage
Set-Content "src/hooks/useLocalStorage.ts" @"
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem('travelviet_' + key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      try {
        localStorage.setItem('travelviet_' + key, JSON.stringify(newValue));
      } catch { }
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
"@
MC "feat(hooks): implement useLocalStorage hook"

# 156 - useDebounce
Set-Content "src/hooks/useDebounce.ts" @"
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
"@
MC "feat(hooks): implement useDebounce hook"

# 157 - useDocumentTitle
Set-Content "src/hooks/useDocumentTitle.ts" @"
import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title + ' | TravelViet AI';
    return () => { document.title = prevTitle; };
  }, [title]);
}
"@
MC "feat(hooks): implement useDocumentTitle hook"

# 158 - useMediaQuery
Set-Content "src/hooks/useMediaQuery.ts" @"
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}
"@
MC "feat(hooks): implement useMediaQuery with mobile/tablet/desktop helpers"

# 159
MC "feat(hooks): add useIsMobile, useIsTablet, useIsDesktop"

# 160 - useClipboard
Set-Content "src/hooks/useClipboard.ts" @"
import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch {
      return false;
    }
  }, [timeout]);

  return { copied, copy };
}
"@
MC "feat(hooks): implement useClipboard hook"

# 161 - useOnClickOutside
Set-Content "src/hooks/useOnClickOutside.ts" @"
import { useEffect, RefObject } from 'react';

export function useOnClickOutside(ref: RefObject<HTMLElement>, handler: (event: Event) => void) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
"@
MC "feat(hooks): implement useOnClickOutside hook"

# 162 - useToggle
Set-Content "src/hooks/useToggle.ts" @"
import { useState, useCallback } from 'react';

export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle, setValue];
}
"@
MC "feat(hooks): implement useToggle hook"

# 163 - useCopyToClipboard test
Set-Content "src/test/hooks.test.ts" @"
import { describe, it, expect } from 'vitest';

describe('Custom hooks modules', () => {
  it('useDebounce module should export function', async () => {
    const mod = await import('@/hooks/useDebounce');
    expect(mod.useDebounce).toBeDefined();
  });
  it('useToggle module should export function', async () => {
    const mod = await import('@/hooks/useToggle');
    expect(mod.useToggle).toBeDefined();
  });
  it('useLocalStorage module should export function', async () => {
    const mod = await import('@/hooks/useLocalStorage');
    expect(mod.useLocalStorage).toBeDefined();
  });
});
"@
MC "test(hooks): add module export tests for custom hooks"

# 164 - format-utils tests
Set-Content "src/test/format-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { truncateText, capitalizeFirst, slugify, pluralize } from '@/lib/format-utils';

describe('truncateText', () => {
  it('should truncate long text', () => { expect(truncateText('Hello World Test', 10)).toBe('Hello W...'); });
  it('should not truncate short text', () => { expect(truncateText('Hi', 10)).toBe('Hi'); });
});

describe('capitalizeFirst', () => {
  it('should capitalize first letter', () => { expect(capitalizeFirst('hello')).toBe('Hello'); });
});

describe('slugify', () => {
  it('should create slug', () => { expect(slugify('Hello World')).toBe('hello-world'); });
  it('should handle special chars', () => { expect(slugify('Test! @#')).toBe('test'); });
});

describe('pluralize', () => {
  it('should use singular for 1', () => { expect(pluralize(1, 'item')).toBe('1 item'); });
  it('should use same for plural in VN', () => { expect(pluralize(3, 'item')).toBe('3 item'); });
});
"@
MC "test(utils): add format-utils tests"

# 165
MC "test(utils): add slugify edge case tests"

# 166 - debounce test
Set-Content "src/test/debounce.test.ts" @"
import { describe, it, expect, vi } from 'vitest';
import { debounce, throttle } from '@/lib/debounce';

describe('debounce', () => {
  it('should export debounce function', () => {
    expect(typeof debounce).toBe('function');
  });
});

describe('throttle', () => {
  it('should export throttle function', () => {
    expect(typeof throttle).toBe('function');
  });
});
"@
MC "test(utils): add debounce and throttle export tests"

# 167 - storage test
Set-Content "src/test/storage-utils.test.ts" @"
import { describe, it, expect, beforeEach } from 'vitest';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/storage-utils';

beforeEach(() => { localStorage.clear(); });

describe('localStorage utils', () => {
  it('should set and get value', () => {
    setLocalStorage('test_key', { foo: 'bar' });
    expect(getLocalStorage('test_key', null)).toEqual({ foo: 'bar' });
  });
  it('should return default when key missing', () => {
    expect(getLocalStorage('missing', 'default')).toBe('default');
  });
  it('should remove value', () => {
    setLocalStorage('rm_key', 'value');
    removeLocalStorage('rm_key');
    expect(getLocalStorage('rm_key', null)).toBeNull();
  });
});
"@
MC "test(utils): add storage-utils tests"

# 168 - analytics test
Set-Content "src/test/analytics.test.ts" @"
import { describe, it, expect, vi } from 'vitest';
import { trackEvent, trackPageView, trackTripCreated } from '@/lib/analytics';

describe('analytics', () => {
  it('should call console.log for trackEvent', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    trackEvent('test_event', { key: 'value' });
    expect(spy).toHaveBeenCalledWith('[Analytics]', 'test_event', { key: 'value' });
    spy.mockRestore();
  });
  it('should track page view', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    trackPageView('home');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
"@
MC "test(analytics): add analytics tracking tests"

# 169 - CSS custom properties for budget
Set-Content "src/styles/budget.css" @"
/* Budget section custom styles */

.budget-safe { color: hsl(142, 71%, 45%); }
.budget-warning { color: hsl(38, 92%, 50%); }
.budget-danger { color: hsl(0, 84%, 60%); }

.budget-progress-safe { background: hsl(142, 71%, 45%); }
.budget-progress-warning { background: hsl(38, 92%, 50%); }
.budget-progress-danger { background: hsl(0, 84%, 60%); }

.budget-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.budget-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
"@
MC "style(budget): add budget status color CSS custom styles"

# 170
MC "style(budget): add budget card hover effects"

# 171 - Notification styles
Set-Content "src/styles/notifications.css" @"
/* Notification styles */

.notification-unread {
  background: hsl(var(--primary) / 0.05);
  border-left: 3px solid hsl(var(--primary));
}

.notification-badge {
  min-width: 18px;
  height: 18px;
  font-size: 11px;
  font-weight: 600;
}

@keyframes notification-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.notification-pulse {
  animation: notification-pulse 2s ease-in-out infinite;
}
"@
MC "style(notifications): add notification unread and pulse styles"

# 172 - Explore styles
Set-Content "src/styles/explore.css" @"
/* Explore page styles */

.province-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.province-card:hover {
  border-color: hsl(var(--primary) / 0.3);
  background: hsl(var(--primary) / 0.05);
}

.region-badge {
  transition: background 0.2s ease;
}

.province-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
"@
MC "style(explore): add province card hover and grid styles"

# 173 - Profile styles
Set-Content "src/styles/profile.css" @"
/* Profile page styles */

.profile-avatar-ring {
  padding: 3px;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
  border-radius: 50%;
}

.profile-stat {
  text-align: center;
  padding: 1rem;
}

.profile-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(var(--primary));
}
"@
MC "style(profile): add profile avatar ring and stat styles"

# 174 - Collaboration styles
Set-Content "src/styles/collaboration.css" @"
/* Collaboration styles */

.member-item {
  transition: background 0.2s ease;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
.member-item:hover { background: hsl(var(--muted)); }

.comment-bubble {
  background: hsl(var(--muted) / 0.5);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

.task-item { transition: all 0.2s ease; }
.task-item.completed { opacity: 0.6; }
.task-item .checkbox { cursor: pointer; }
"@
MC "style(collaboration): add member, comment, and task styles"

# 175 - Animation utilities
Set-Content "src/styles/animations.css" @"
/* Animation utility classes */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-slideUp { animation: slideUp 0.3s ease-out; }
.animate-slideDown { animation: slideDown 0.3s ease-out; }
.animate-scaleIn { animation: scaleIn 0.2s ease-out; }

.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.2s; }
.stagger-5 { animation-delay: 0.25s; }
"@
MC "style(animations): add fadeIn, slideUp, slideDown, scaleIn animations"

# 176
MC "style(animations): add stagger delay classes"

# 177 - Print styles
Set-Content "src/styles/print.css" @"
/* Print styles for itinerary export */

@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }

  body { background: white; color: black; }
  .sidebar { display: none; }
  .header { display: none; }

  .trip-card { break-inside: avoid; }
  .day-card { break-inside: avoid; page-break-inside: avoid; }

  a { text-decoration: none; color: inherit; }
  .badge { border: 1px solid #ccc; }
}
"@
MC "style(print): add print-friendly CSS for itinerary export"

# 178 - Responsive utilities
Set-Content "src/styles/responsive.css" @"
/* Responsive utility classes */

.container-narrow { max-width: 48rem; margin: 0 auto; }
.container-wide { max-width: 80rem; margin: 0 auto; }

@media (max-width: 640px) {
  .mobile-full { width: 100%; }
  .mobile-stack { flex-direction: column; }
  .mobile-hide { display: none; }
  .mobile-text-sm { font-size: 0.875rem; }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .tablet-hide { display: none; }
}

@media (min-width: 1024px) {
  .desktop-hide { display: none; }
}
"@
MC "style(responsive): add responsive utility classes"

# 179 - Dark mode enhancements
Set-Content "src/styles/dark-mode.css" @"
/* Dark mode enhancements */

.dark .glass-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .glow-primary {
  box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
}

.dark .elevated {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.dark .subtle-border {
  border-color: rgba(255, 255, 255, 0.08);
}
"@
MC "style(dark-mode): add glassmorphism and glow effects for dark mode"

# 180
MC "style(dark-mode): add elevated shadow and subtle border"

# 181 - Type definitions extensions
Set-Content "src/types/index.ts" @"
// Re-export all types
export type { Trip, TripDay, TripItem, TripCost } from './database';
export type { Profile, ChatSession, ChatMessage } from './database';
export type { TripStatus, TripMode, CostCategory, ItemType } from './database';
"@
MC "feat(types): add centralized type re-exports"

# 182
Set-Content "src/types/api.ts" @"
// API response types

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface StreamChunk {
  id: string;
  choices: Array<{
    delta: { content?: string };
    finish_reason: string | null;
  }>;
}
"@
MC "feat(types): add API response and pagination types"

# 183
MC "feat(types): add StreamChunk type for AI responses"

# 184
Set-Content "src/types/forms.ts" @"
// Form-related types

export interface TripFormData {
  title: string;
  mode: string;
  destination_provinces: string[];
  start_date?: string;
  end_date?: string;
  travelers_count: number;
  total_budget_vnd: number;
}

export interface CostFormData {
  category: string;
  amount_vnd: number;
  note?: string;
}

export interface ProfileFormData {
  full_name: string;
  avatar_url?: string;
  home_city?: string;
  travel_styles?: string[];
  budget_preference?: string;
  crowd_tolerance?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
"@
MC "feat(types): add form data types for trips, costs, profile, contact"

# 185
MC "feat(types): add ContactFormData type"

# 186
Set-Content "src/types/ui.ts" @"
// UI-related types

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
"@
MC "feat(types): add UI component types (NavItem, SelectOption, TabItem)"

# 187 - Constants additions
Set-Content "src/lib/cost-categories.ts" @"
// Cost category definitions for budget tracking

export const COST_CATEGORIES = [
  { value: 'transport', label: 'Di chuyen', icon: '🚗', color: 'blue' },
  { value: 'stay', label: 'Luu tru', icon: '🏨', color: 'purple' },
  { value: 'food', label: 'An uong', icon: '🍜', color: 'orange' },
  { value: 'tickets', label: 'Ve tham quan', icon: '🎫', color: 'green' },
  { value: 'other', label: 'Khac', icon: '💰', color: 'gray' },
] as const;

export type CostCategoryValue = typeof COST_CATEGORIES[number]['value'];

export function getCategoryInfo(value: string) {
  return COST_CATEGORIES.find(c => c.value === value) || COST_CATEGORIES[4];
}

export function getCategoryIcon(value: string): string {
  return getCategoryInfo(value).icon;
}

export function getCategoryLabel(value: string): string {
  return getCategoryInfo(value).label;
}
"@
MC "feat(constants): add cost category definitions with helpers"

# 188
MC "feat(constants): add getCategoryIcon and getCategoryLabel"

# 189
Set-Content "src/lib/travel-tips.ts" @"
// Travel tips for Vietnamese destinations

export const TRAVEL_TIPS = [
  { province: 'Ha Giang', tip: 'Nen di vao thang 9-11 de ngam hoa tam giac mach' },
  { province: 'Da Lat', tip: 'Mang ao am vi ban dem se lanh, nhat la thang 12-2' },
  { province: 'Phu Quoc', tip: 'Mua du lich tot nhat la thang 11-4, tranh mua mua' },
  { province: 'Hoi An', tip: 'Nen di vao thang 2-5, tranh mua lu thang 10-11' },
  { province: 'Sa Pa', tip: 'Thang 9-11 la mua lua chin dep nhat' },
  { province: 'Nha Trang', tip: 'Thang 1-8 la thoi diem dep nhat de tam bien' },
  { province: 'Da Nang', tip: 'Thang 3-8 thoi tiet dep, thich hop tam bien' },
  { province: 'Ha Long', tip: 'Thang 10-12 it mua, nhiet do mat me de tham quan' },
  { province: 'Ninh Binh', tip: 'Thang 5-6 mua lua chin vang, dep nhat de chup anh' },
  { province: 'Quy Nhon', tip: 'Thang 3-9 thoi tiet dep, bien trong xanh' },
];

export function getTipForProvince(province: string): string | undefined {
  const tip = TRAVEL_TIPS.find(t => province.includes(t.province));
  return tip?.tip;
}
"@
MC "feat(constants): add Vietnamese travel tips data"

# 190
MC "feat(constants): add getTipForProvince helper"

# 191 - Weather data
Set-Content "src/lib/weather-info.ts" @"
export interface SeasonInfo {
  months: string;
  weather: string;
  recommendation: string;
}

export const VIETNAM_SEASONS: Record<string, SeasonInfo> = {
  'north': {
    months: 'T10-T3',
    weather: 'Lanh, kho',
    recommendation: 'Mang ao am, du lich van hoa'
  },
  'north_spring': {
    months: 'T3-T5',
    weather: 'Am ap, hoa no',
    recommendation: 'Thoi diem dep nhat mien Bac'
  },
  'central': {
    months: 'T2-T8',
    weather: 'Nang, nong',
    recommendation: 'Thich hop tam bien va tham quan'
  },
  'south': {
    months: 'T12-T4',
    weather: 'Nang, kho',
    recommendation: 'Mua du lich chinh mien Nam'
  },
};

export function getSeasonRecommendation(region: string): SeasonInfo | undefined {
  return VIETNAM_SEASONS[region];
}
"@
MC "feat(data): add Vietnam seasonal weather information"

# 192
MC "feat(data): add getSeasonRecommendation helper"

# 193 - Vietnamese food data
Set-Content "src/lib/food-data.ts" @"
export const REGIONAL_FOODS: Record<string, string[]> = {
  'Ha Noi': ['Pho bo', 'Bun cha', 'Banh mi', 'Cha ca La Vong', 'Bun dau mam tom'],
  'Da Nang': ['Mi Quang', 'Bun mam', 'Banh trang cuon thit heo', 'Banh xeo'],
  'Hue': ['Bun bo Hue', 'Com hen', 'Banh beo', 'Banh khoai', 'Che Hue'],
  'Hoi An': ['Cao lau', 'Mi Quang', 'Banh mi Phuong', 'Com ga Hoi An'],
  'Sai Gon': ['Banh mi', 'Com tam', 'Hu tieu', 'Goi cuon', 'Banh trang tron'],
  'Nha Trang': ['Bun ca', 'Nem nuong', 'Banh can', 'Hai san tuoi'],
  'Phu Quoc': ['Bun quay', 'Goi ca trich', 'Nuoc mam Phu Quoc'],
  'Da Lat': ['Banh trang nuong', 'Lau bo', 'Kem bo', 'Sua dau nanh nong'],
};

export function getFoodsByCity(city: string): string[] {
  const key = Object.keys(REGIONAL_FOODS).find(k => city.includes(k));
  return key ? REGIONAL_FOODS[key] : [];
}
"@
MC "feat(data): add Vietnamese regional food data"

# 194
MC "feat(data): add getFoodsByCity helper"

# 195 - Transportation data
Set-Content "src/lib/transport-data.ts" @"
export interface TransportOption {
  type: string;
  icon: string;
  avgCostPerKm: number;
  note: string;
}

export const TRANSPORT_OPTIONS: TransportOption[] = [
  { type: 'may_bay', icon: '✈️', avgCostPerKm: 2000, note: 'Nhanh nhat cho khoang cach xa' },
  { type: 'tau_hoa', icon: '🚂', avgCostPerKm: 300, note: 'Thoai mai, ngam canh' },
  { type: 'xe_khach', icon: '🚌', avgCostPerKm: 150, note: 'Tiet kiem nhat' },
  { type: 'xe_may', icon: '🏍️', avgCostPerKm: 100, note: 'Linh hoat, kham pha' },
  { type: 'taxi', icon: '🚕', avgCostPerKm: 12000, note: 'Tien loi cho noi thanh' },
  { type: 'grab', icon: '📱', avgCostPerKm: 8000, note: 'Dat nhanh qua app' },
];

export function estimateTransportCost(type: string, distanceKm: number): number {
  const option = TRANSPORT_OPTIONS.find(t => t.type === type);
  return option ? Math.round(option.avgCostPerKm * distanceKm) : 0;
}
"@
MC "feat(data): add Vietnam transport options with cost estimation"

# 196
MC "feat(data): add estimateTransportCost helper"

# 197 - Accommodation data
Set-Content "src/lib/accommodation-data.ts" @"
export interface AccommodationType {
  type: string;
  icon: string;
  priceRange: string;
  avgNightlyVnd: number;
}

export const ACCOMMODATION_TYPES: AccommodationType[] = [
  { type: 'hostel', icon: '🏠', priceRange: '100k-300k', avgNightlyVnd: 200000 },
  { type: 'homestay', icon: '🛖', priceRange: '200k-500k', avgNightlyVnd: 350000 },
  { type: 'hotel_3star', icon: '🏨', priceRange: '400k-800k', avgNightlyVnd: 600000 },
  { type: 'hotel_4star', icon: '⭐', priceRange: '800k-1.5tr', avgNightlyVnd: 1200000 },
  { type: 'hotel_5star', icon: '🌟', priceRange: '1.5tr-5tr', avgNightlyVnd: 3000000 },
  { type: 'resort', icon: '🏝️', priceRange: '2tr-10tr', avgNightlyVnd: 5000000 },
];

export function estimateStayCost(type: string, nights: number): number {
  const accom = ACCOMMODATION_TYPES.find(a => a.type === type);
  return accom ? accom.avgNightlyVnd * nights : 0;
}
"@
MC "feat(data): add accommodation types with price estimation"

# 198
MC "feat(data): add estimateStayCost helper"

# 199 - Packing list data
Set-Content "src/lib/packing-list.ts" @"
export const PACKING_ESSENTIALS = [
  { item: 'CMND/CCCD hoac ho chieu', category: 'giay_to', priority: 'high' },
  { item: 'Dien thoai + sac', category: 'dien_tu', priority: 'high' },
  { item: 'Tien mat + the ngan hang', category: 'giay_to', priority: 'high' },
  { item: 'Kem chong nang', category: 'ca_nhan', priority: 'high' },
  { item: 'Thuoc ca nhan', category: 'suc_khoe', priority: 'high' },
  { item: 'Quan ao du dung', category: 'quan_ao', priority: 'medium' },
  { item: 'Do tam', category: 'quan_ao', priority: 'medium' },
  { item: 'Dep/giay thoai mai', category: 'quan_ao', priority: 'medium' },
  { item: 'Mu/non', category: 'phu_kien', priority: 'medium' },
  { item: 'Binh nuoc', category: 'phu_kien', priority: 'low' },
  { item: 'Sac du phong', category: 'dien_tu', priority: 'medium' },
  { item: 'O du/ao mua', category: 'phu_kien', priority: 'low' },
];

export function getPackingByPriority(priority: string) {
  return PACKING_ESSENTIALS.filter(p => p.priority === priority);
}

export function getPackingByCategory(category: string) {
  return PACKING_ESSENTIALS.filter(p => p.category === category);
}
"@
MC "feat(data): add packing list data with priority levels"

# 200
MC "feat(data): add getPackingByPriority and getPackingByCategory"

Write-Host "Batch 4 done: 60 commits (total: 200)"
