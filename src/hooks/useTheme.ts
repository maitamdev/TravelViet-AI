import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    const resolved = theme === 'system' ? getSystemTheme() : theme;

    if (resolved === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem('travelviet-theme') as Theme | null;
        return stored || 'light';
    });

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('travelviet-theme', newTheme);
        applyTheme(newTheme);
    }, []);

    // Apply theme on mount and when it changes
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Listen for system theme changes when using 'system' mode
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => applyTheme('system');
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    return { theme, setTheme, toggleTheme, resolvedTheme };
}
