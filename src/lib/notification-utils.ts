export type NotificationType = 'trip_reminder' | 'member_added' | 'comment' | 'task_assigned' | 'plan_updated';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  tripId?: string;
  isRead: boolean;
  createdAt: string;
}

export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'trip_reminder': return '🗓️';
    case 'member_added': return '👤';
    case 'comment': return '💬';
    case 'task_assigned': return '✅';
    case 'plan_updated': return '🤖';
    default: return '🔔';
  }
}

export function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case 'trip_reminder': return 'text-blue-500';
    case 'member_added': return 'text-green-500';
    case 'comment': return 'text-purple-500';
    case 'task_assigned': return 'text-orange-500';
    case 'plan_updated': return 'text-cyan-500';
    default: return 'text-muted-foreground';
  }
}
