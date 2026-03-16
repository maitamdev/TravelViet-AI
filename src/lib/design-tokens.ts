// UI theme tokens and design system constants
export const SPACING = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem', '3xl': '4rem' } as const;
export const FONT_SIZES = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } as const;
export const BORDER_RADIUS = { none: '0', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', full: '9999px' } as const;
export const SHADOWS = { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.1)', lg: '0 10px 15px -3px rgba(0,0,0,0.1)', xl: '0 20px 25px -5px rgba(0,0,0,0.1)' } as const;
export const Z_INDEX = { dropdown: 1000, sticky: 1020, fixed: 1030, backdrop: 1040, modal: 1050, popover: 1060, tooltip: 1070, toast: 1080 } as const;
export const TRANSITIONS = { fast: '150ms ease', normal: '200ms ease', slow: '300ms ease', spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)' } as const;
export const MEDIA_QUERIES = { sm: '(min-width: 640px)', md: '(min-width: 768px)', lg: '(min-width: 1024px)', xl: '(min-width: 1280px)', dark: '(prefers-color-scheme: dark)', motion: '(prefers-reduced-motion: no-preference)' } as const;
export const MAX_WIDTHS = { prose: '65ch', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', full: '100%' } as const;