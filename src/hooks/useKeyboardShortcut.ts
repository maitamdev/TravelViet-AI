import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
}

export function useKeyboardShortcut(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      shortcuts.forEach(s => {
        const ctrlMatch = s.ctrlKey ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = s.shiftKey ? e.shiftKey : true;
        if (e.key.toLowerCase() === s.key.toLowerCase() && ctrlMatch && shiftMatch) {
          e.preventDefault();
          s.callback();
        }
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
