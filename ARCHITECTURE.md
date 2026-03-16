# TravelViet AI Architecture

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI:** Groq API (Llama 3.3 70B) with streaming responses
- **State:** TanStack Query (React Query)
- **Routing:** React Router DOM v6 with lazy loading
- **Maps:** Leaflet + React Leaflet
- **Forms:** React Hook Form + Zod
- **Animation:** Framer Motion

## Database Schema (16 tables)

1. profiles - User profiles
2. trips - Trip data
3. trip_days - Day-by-day itinerary
4. trip_items - Activities per day
5. trip_costs - Budget tracking
6. chat_sessions - AI chat sessions
7. chat_messages - Chat messages
8. ai_plan_versions - AI plan history
9. trip_members - Team collaboration
10. trip_votes - Voting system
11. trip_comments - Comments
12. trip_tasks - Task management
13. public_itineraries - Community sharing
14. itinerary_reviews - Reviews & likes
15. itinerary_bookmarks - Saved itineraries
16. reports - Content reporting

## Project Structure

```
src/
├── components/       # 50+ React components
│   ├── auth/        # Authentication (AuthForm, AuthGuard, ProtectedRoute)
│   ├── layout/      # Dashboard layout
│   ├── maps/        # Map components (TripMap, ItemsMap)
│   ├── trips/       # Trip management (18 components)
│   └── ui/          # shadcn/ui components
├── pages/           # 19 page components
│   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│   └── dashboard/   # Dashboard, Trips, Chat, Community, Settings, etc.
├── hooks/           # 35+ custom React hooks
├── lib/             # 45+ utility modules
│   ├── *-utils.ts   # Utility functions (search, date, format, etc.)
│   ├── *-data.ts    # Data modules (cuisine, destination, holiday, etc.)
│   └── *.ts         # Helpers (validation, animation, SEO, a11y, etc.)
├── types/           # TypeScript type definitions
├── integrations/    # Supabase client configuration
├── styles/          # Global styles
└── test/            # 50+ unit test files
```

## Security

- Row Level Security (RLS) on all tables
- Auth via Supabase Auth
- Protected routes with ProtectedRoute component
- Input validation with Zod schemas
- XSS prevention with HTML escaping utilities

## Performance

- Code splitting with React.lazy() and Suspense
- Debounced search and API calls
- Virtual scrolling for large lists
- Image lazy loading
- Performance monitoring utilities

## Testing

- Unit tests with Vitest
- Test coverage for all utility modules
- Component testing with React Testing Library
