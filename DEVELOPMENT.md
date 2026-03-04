# TravelViet AI - Development Guide

## Prerequisites

- Node.js 18+
- npm or bun
- Supabase account

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Project Structure

```
src/
├── components/         # React components
│   ├── auth/           # Authentication
│   ├── layout/         # Layout components
│   ├── maps/           # Map components
│   ├── trips/          # Trip-related components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Authentication
│   ├── useTrips.ts     # Trip CRUD
│   ├── useChat.ts      # AI Chat
│   ├── useBudget.ts    # Budget tracking
│   ├── useBookmarks.ts # Bookmarks
│   ├── useCollaboration.ts # Collaboration
│   ├── useLikes.ts     # Likes
│   ├── useVotes.ts     # Votes
│   ├── useReports.ts   # Reports
│   └── usePlanVersions.ts # AI Plan versions
├── lib/                # Utilities
│   ├── constants.ts    # App constants
│   ├── validation.ts   # Form validation
│   ├── date-utils.ts   # Date helpers
│   ├── budget-utils.ts # Budget helpers
│   ├── trip-utils.ts   # Trip helpers
│   ├── map-utils.ts    # Map helpers
│   └── share-utils.ts  # Share helpers
├── pages/              # Page components
│   ├── auth/           # Auth pages
│   └── dashboard/      # Dashboard pages
├── types/              # TypeScript types
└── test/               # Tests
```

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

## Features

1. AI Trip Planning (Groq API)
2. Trip Management (CRUD)
3. Budget Tracking
4. Community Sharing
5. Collaboration (Members, Comments, Tasks, Votes)
6. Destination Explorer
7. Bookmarks & Favorites
8. Profile Management
9. Notifications
10. Maps (Leaflet)
