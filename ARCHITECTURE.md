# TravelViet AI Architecture

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI:** Groq API (Llama 3.3 70B)
- **State:** TanStack Query (React Query)
- **Routing:** React Router DOM v6
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

## Security

- Row Level Security (RLS) on all tables
- Auth via Supabase Auth
- Protected routes with ProtectedRoute component
