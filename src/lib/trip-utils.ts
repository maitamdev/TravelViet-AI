import type { TripStatus } from '@/types/database';

export function getTripStatusColor(status: TripStatus): string {
  switch (status) {
    case 'draft': return 'text-gray-500 bg-gray-100';
    case 'planned': return 'text-blue-500 bg-blue-100';
    case 'ongoing': return 'text-green-500 bg-green-100';
    case 'completed': return 'text-purple-500 bg-purple-100';
    default: return 'text-gray-500 bg-gray-100';
  }
}

export function getTripModeEmoji(mode: string): string {
  switch (mode) {
    case 'solo': return '🧳';
    case 'couple': return '💑';
    case 'family': return '👨‍👩‍👧‍👦';
    case 'friends': return '👥';
    default: return '🧳';
  }
}

export function getTripProgress(status: TripStatus): number {
  switch (status) {
    case 'draft': return 25;
    case 'planned': return 50;
    case 'ongoing': return 75;
    case 'completed': return 100;
    default: return 0;
  }
}
