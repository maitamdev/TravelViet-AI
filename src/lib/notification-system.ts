// Notification system types and utilities
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'trip_update' | 'chat_message' | 'comment' | 'member_joined';
export interface AppNotification { id: string; type: NotificationType; title: string; message: string; createdAt: string; read: boolean; actionUrl?: string; metadata?: Record<string, unknown>; }
export function createNotification(type: NotificationType, title: string, message: string, actionUrl?: string): AppNotification {
  return { id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2), type, title, message, createdAt: new Date().toISOString(), read: false, actionUrl };
}
export function getNotificationIcon(type: NotificationType): string { const icons: Record<NotificationType, string> = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌', trip_update: '🗺️', chat_message: '💬', comment: '💭', member_joined: '👤' }; return icons[type] || 'ℹ️'; }
export function getNotificationColor(type: NotificationType): string { const colors: Record<NotificationType, string> = { info: 'blue', success: 'green', warning: 'yellow', error: 'red', trip_update: 'purple', chat_message: 'indigo', comment: 'teal', member_joined: 'cyan' }; return colors[type] || 'gray'; }
export function sortNotifications(notifications: AppNotification[]): AppNotification[] {
  return [...notifications].sort((a, b) => { if (a.read !== b.read) return a.read ? 1 : -1; return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
}
export function getUnreadCount(notifications: AppNotification[]): number { return notifications.filter(n => !n.read).length; }
export function markAsRead(notifications: AppNotification[], id: string): AppNotification[] { return notifications.map(n => n.id === id ? { ...n, read: true } : n); }
export function markAllAsRead(notifications: AppNotification[]): AppNotification[] { return notifications.map(n => ({ ...n, read: true })); }
export function filterNotifications(notifications: AppNotification[], type?: NotificationType, unreadOnly = false): AppNotification[] {
  return notifications.filter(n => { if (type && n.type !== type) return false; if (unreadOnly && n.read) return false; return true; });
}