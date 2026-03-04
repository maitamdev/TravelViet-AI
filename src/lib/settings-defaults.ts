export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  language: 'vi' as const,
  notifications: {
    tripReminders: true,
    memberUpdates: true,
    commentReplies: true,
    weeklyDigest: false,
  },
  privacy: {
    showProfile: true,
    showTrips: false,
    showStats: true,
  },
  map: {
    defaultZoom: 10,
    showTraffic: false,
    mapStyle: 'standard' as const,
  },
} as const;

export type AppSettings = typeof DEFAULT_SETTINGS;
