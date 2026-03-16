// Keyboard shortcut registry and manager
type ShortcutHandler = (e: KeyboardEvent) => void;
interface RegisteredShortcut { key: string; ctrl?: boolean; shift?: boolean; alt?: boolean; description: string; handler: ShortcutHandler; }
const shortcuts: RegisteredShortcut[] = [];
export function registerShortcut(shortcut: RegisteredShortcut): () => void { shortcuts.push(shortcut); return () => { const idx = shortcuts.indexOf(shortcut); if (idx > -1) shortcuts.splice(idx, 1); }; }
export function getRegisteredShortcuts(): RegisteredShortcut[] { return [...shortcuts]; }
export function formatShortcutKey(s: RegisteredShortcut): string { const parts: string[] = []; if (s.ctrl) parts.push('Ctrl'); if (s.shift) parts.push('Shift'); if (s.alt) parts.push('Alt'); parts.push(s.key.toUpperCase()); return parts.join(' + '); }
export function initShortcutListener(): () => void {
  const handler = (e: KeyboardEvent) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
    for (const s of shortcuts) {
      if (e.key.toLowerCase() === s.key.toLowerCase() && !!e.ctrlKey === !!s.ctrl && !!e.shiftKey === !!s.shift && !!e.altKey === !!s.alt) {
        e.preventDefault(); s.handler(e); break;
      }
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
export const DEFAULT_SHORTCUTS = [
  { key: 'k', ctrl: true, description: 'Mở tìm kiếm nhanh' },
  { key: 'n', ctrl: true, description: 'Tạo chuyến đi mới' },
  { key: 'h', ctrl: true, description: 'Về trang chủ' },
  { key: '/', ctrl: false, description: 'Focus thanh tìm kiếm' },
  { key: 'Escape', ctrl: false, description: 'Đóng dialog/modal' },
] as const;