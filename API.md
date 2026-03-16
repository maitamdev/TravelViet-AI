# API Documentation

## Supabase Edge Functions

### AI Planner (`/functions/v1/ai-planner`)

**Method:** POST

**Headers:**
- `Authorization: Bearer <SUPABASE_ANON_KEY>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Lên lịch trình 3 ngày ở Đà Nẵng" }
  ],
  "tripContext": {
    "tripId": "uuid",
    "destination": ["Đà Nẵng"],
    "startDate": "2026-04-01",
    "endDate": "2026-04-03",
    "mode": "couple",
    "budget": 5000000
  },
  "stream": true
}
```

**Response:** Server-Sent Events (SSE) stream with AI-generated itinerary

**Error Responses:**
| Status | Description |
|--------|-------------|
| 429 | Rate limit exceeded |
| 500 | Server error or GROQ_API_KEY not configured |

## Database Tables

### Core Tables
- `profiles` - User profiles (id, full_name, avatar_url, travel_styles)
- `trips` - Trip data (owner_id, title, destination_provinces, dates, budget)
- `trip_days` - Day-by-day itinerary (trip_id, day_index, summary)
- `trip_items` - Activities per day (trip_day_id, item_type, title, costs)

### Collaboration Tables
- `trip_members` - Team members (trip_id, user_id, role)
- `trip_votes` - Voting system (trip_id, target_type, vote_value)
- `trip_comments` - Comments (trip_id, user_id, content)
- `trip_tasks` - Task management (trip_id, assignee_id, status)

### Community Tables
- `public_itineraries` - Shared trips (trip_id, title, tags, likes_count)
- `itinerary_reviews` - Reviews & ratings (rating, comment)
- `itinerary_bookmarks` - Saved itineraries (user_id, public_itinerary_id)

### AI Tables
- `chat_sessions` - AI chat sessions (user_id, trip_id, title)
- `chat_messages` - Chat messages (session_id, role, content)
- `ai_plan_versions` - AI plan history (trip_id, version_no, plan_json)
