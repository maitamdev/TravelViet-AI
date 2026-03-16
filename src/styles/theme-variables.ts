// Styles index - CSS custom properties and global variables
export const cssVariables = {
  '--color-primary': '222.2 47.4% 11.2%',
  '--color-primary-foreground': '210 40% 98%',
  '--color-accent': '210 40% 96.1%',
  '--color-accent-foreground': '222.2 47.4% 11.2%',
  '--color-destructive': '0 84.2% 60.2%',
  '--color-border': '214.3 31.8% 91.4%',
  '--color-input': '214.3 31.8% 91.4%',
  '--color-ring': '222.2 84% 4.9%',
  '--radius': '0.5rem',
  '--font-sans': "'Inter', system-ui, -apple-system, sans-serif",
  '--font-mono': "'JetBrains Mono', 'Fira Code', monospace",
  '--animation-duration': '200ms',
  '--animation-timing': 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const darkThemeOverrides = {
  '--color-primary': '210 40% 98%',
  '--color-primary-foreground': '222.2 47.4% 11.2%',
  '--color-accent': '217.2 32.6% 17.5%',
  '--color-accent-foreground': '210 40% 98%',
  '--color-destructive': '0 62.8% 30.6%',
  '--color-border': '217.2 32.6% 17.5%',
  '--color-input': '217.2 32.6% 17.5%',
  '--color-ring': '212.7 26.8% 83.9%',
};

export function applyTheme(variables: Record<string, string>): void {
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}