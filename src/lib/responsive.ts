// Responsive breakpoint and media query utilities
export const BREAKPOINTS = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;
export type BreakpointKey = keyof typeof BREAKPOINTS;
export function getBreakpoint(width: number): BreakpointKey { if (width >= BREAKPOINTS['2xl']) return '2xl'; if (width >= BREAKPOINTS.xl) return 'xl'; if (width >= BREAKPOINTS.lg) return 'lg'; if (width >= BREAKPOINTS.md) return 'md'; if (width >= BREAKPOINTS.sm) return 'sm'; return 'xs'; }
export function isAboveBreakpoint(width: number, bp: BreakpointKey): boolean { return width >= BREAKPOINTS[bp]; }
export function isBelowBreakpoint(width: number, bp: BreakpointKey): boolean { return width < BREAKPOINTS[bp]; }
export function getResponsiveValue<T>(width: number, values: Partial<Record<BreakpointKey, T>>, fallback: T): T { const breakpoints: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']; for (const bp of breakpoints) { if (width >= BREAKPOINTS[bp] && values[bp] !== undefined) return values[bp] as T; } return fallback; }
export const CONTAINER_WIDTHS = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' } as const;
export function getGridColumns(width: number): number { if (width >= BREAKPOINTS.xl) return 4; if (width >= BREAKPOINTS.lg) return 3; if (width >= BREAKPOINTS.md) return 2; return 1; }
export function getSidebarWidth(width: number): number { if (width >= BREAKPOINTS.xl) return 280; if (width >= BREAKPOINTS.lg) return 250; return 0; }