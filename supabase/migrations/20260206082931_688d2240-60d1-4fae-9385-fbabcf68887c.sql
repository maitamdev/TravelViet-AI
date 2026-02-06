-- =============================================
-- TravelViet Database Schema - Complete Migration
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- 1. PROFILES TABLE (linked to auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  home_city TEXT,
  travel_styles TEXT[] DEFAULT '{}',
  budget_min_vnd NUMERIC DEFAULT 0,
  budget_max_vnd NUMERIC DEFAULT 0,
  crowd_tolerance SMALLINT DEFAULT 3 CHECK (crowd_tolerance BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 2. TRIPS TABLE
-- =============================================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination_provinces TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  travelers_count INTEGER DEFAULT 1 CHECK (travelers_count > 0),
  mode TEXT DEFAULT 'solo' CHECK (mode IN ('solo', 'couple', 'family', 'friends')),
  total_budget_vnd NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'ongoing', 'completed')),
  share_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 3. TRIP_DAYS TABLE
-- =============================================
CREATE TABLE public.trip_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL CHECK (day_index >= 1),
  date DATE,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(trip_id, day_index)
);

-- =============================================
-- 4. TRIP_ITEMS TABLE
-- =============================================
CREATE TABLE public.trip_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_day_id UUID NOT NULL REFERENCES public.trip_days(id) ON DELETE CASCADE,
  item_type TEXT DEFAULT 'visit' CHECK (item_type IN ('move', 'eat', 'visit', 'rest', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  location_name TEXT,
  lat NUMERIC,
  lng NUMERIC,
  start_time TIME,
  end_time TIME,
  estimated_cost_vnd NUMERIC DEFAULT 0,
  crowd_level_pred SMALLINT CHECK (crowd_level_pred BETWEEN 1 AND 5),
  is_hidden_gem BOOLEAN DEFAULT false,
  source_confidence TEXT DEFAULT 'estimated' CHECK (source_confidence IN ('verified', 'estimated', 'check')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 5. TRIP_COSTS TABLE
-- =============================================
CREATE TABLE public.trip_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('transport', 'stay', 'food', 'tickets', 'other')),
  amount_vnd NUMERIC NOT NULL DEFAULT 0,
  note TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 6. CHAT_SESSIONS TABLE
-- =============================================
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 7. CHAT_MESSAGES TABLE
-- =============================================
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 8. AI_PLAN_VERSIONS TABLE
-- =============================================
CREATE TABLE public.ai_plan_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  version_no INTEGER NOT NULL CHECK (version_no >= 1),
  reason TEXT DEFAULT 'initial' CHECK (reason IN ('initial', 'replan', 'what_if')),
  plan_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(trip_id, version_no)
);

-- =============================================
-- 9. TRIP_MEMBERS TABLE (Collaboration)
-- =============================================
CREATE TABLE public.trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(trip_id, user_id)
);

-- =============================================
-- 10. TRIP_VOTES TABLE
-- =============================================
CREATE TABLE public.trip_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('item', 'day', 'destination')),
  target_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_value SMALLINT NOT NULL CHECK (vote_value BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(trip_id, target_type, target_id, user_id)
);

-- =============================================
-- 11. TRIP_COMMENTS TABLE
-- =============================================
CREATE TABLE public.trip_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_id UUID REFERENCES public.trip_days(id) ON DELETE SET NULL,
  item_id UUID REFERENCES public.trip_items(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 12. TRIP_TASKS TABLE
-- =============================================
CREATE TABLE public.trip_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 13. PUBLIC_ITINERARIES TABLE
-- =============================================
CREATE TABLE public.public_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL UNIQUE REFERENCES public.trips(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- 14. ITINERARY_REVIEWS TABLE
-- =============================================
CREATE TABLE public.itinerary_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_itinerary_id UUID NOT NULL REFERENCES public.public_itineraries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(public_itinerary_id, user_id)
);

-- =============================================
-- 15. ITINERARY_BOOKMARKS TABLE
-- =============================================
CREATE TABLE public.itinerary_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_itinerary_id UUID NOT NULL REFERENCES public.public_itineraries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(public_itinerary_id, user_id)
);

-- =============================================
-- 16. REPORTS TABLE
-- =============================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'itinerary', 'comment')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  resolved_at TIMESTAMPTZ
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_trips_owner ON public.trips(owner_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_share_slug ON public.trips(share_slug) WHERE share_slug IS NOT NULL;

CREATE INDEX idx_trip_days_trip ON public.trip_days(trip_id);
CREATE INDEX idx_trip_items_day ON public.trip_items(trip_day_id);
CREATE INDEX idx_trip_costs_trip ON public.trip_costs(trip_id);

CREATE INDEX idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_trip ON public.chat_sessions(trip_id) WHERE trip_id IS NOT NULL;
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id);

CREATE INDEX idx_ai_plan_versions_trip ON public.ai_plan_versions(trip_id);
CREATE INDEX idx_trip_members_trip ON public.trip_members(trip_id);
CREATE INDEX idx_trip_members_user ON public.trip_members(user_id);

CREATE INDEX idx_trip_votes_trip ON public.trip_votes(trip_id);
CREATE INDEX idx_trip_comments_trip ON public.trip_comments(trip_id);
CREATE INDEX idx_trip_tasks_trip ON public.trip_tasks(trip_id);

CREATE INDEX idx_public_itineraries_owner ON public.public_itineraries(owner_id);
CREATE INDEX idx_public_itineraries_tags ON public.public_itineraries USING GIN(tags);
CREATE INDEX idx_itinerary_reviews_itinerary ON public.itinerary_reviews(public_itinerary_id);
CREATE INDEX idx_itinerary_bookmarks_user ON public.itinerary_bookmarks(user_id);

CREATE INDEX idx_reports_status ON public.reports(status);

-- =============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- =============================================

-- Check if user is member or owner of a trip
CREATE OR REPLACE FUNCTION public.is_trip_member(p_trip_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM trips WHERE id = p_trip_id AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM trip_members WHERE trip_id = p_trip_id AND user_id = auth.uid()
  )
$$;

-- Check if user is leader or owner of a trip
CREATE OR REPLACE FUNCTION public.is_trip_leader_or_owner(p_trip_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM trips WHERE id = p_trip_id AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM trip_members WHERE trip_id = p_trip_id AND user_id = auth.uid() AND role = 'leader'
  )
$$;

-- Check if user is owner of a trip
CREATE OR REPLACE FUNCTION public.is_trip_owner(p_trip_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM trips WHERE id = p_trip_id AND owner_id = auth.uid()
  )
$$;

-- =============================================
-- TRIGGER: AUTO-UPDATE updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER: AUTO-CREATE PROFILE ON USER SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES: PROFILES
-- =============================================
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- =============================================
-- RLS POLICIES: TRIPS
-- =============================================
CREATE POLICY "Users can view own trips or member trips"
  ON public.trips FOR SELECT
  TO authenticated
  USING (public.is_trip_member(id));

CREATE POLICY "Users can create trips"
  ON public.trips FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Trip owners can update trips"
  ON public.trips FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Trip owners can delete trips"
  ON public.trips FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- =============================================
-- RLS POLICIES: TRIP_DAYS
-- =============================================
CREATE POLICY "Members can view trip days"
  ON public.trip_days FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id));

CREATE POLICY "Leaders/owners can insert trip days"
  ON public.trip_days FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_leader_or_owner(trip_id));

CREATE POLICY "Leaders/owners can update trip days"
  ON public.trip_days FOR UPDATE
  TO authenticated
  USING (public.is_trip_leader_or_owner(trip_id));

CREATE POLICY "Leaders/owners can delete trip days"
  ON public.trip_days FOR DELETE
  TO authenticated
  USING (public.is_trip_leader_or_owner(trip_id));

-- =============================================
-- RLS POLICIES: TRIP_ITEMS
-- =============================================
CREATE POLICY "Members can view trip items"
  ON public.trip_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM trip_days td WHERE td.id = trip_day_id AND public.is_trip_member(td.trip_id)
  ));

CREATE POLICY "Leaders/owners can insert trip items"
  ON public.trip_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM trip_days td WHERE td.id = trip_day_id AND public.is_trip_leader_or_owner(td.trip_id)
  ));

CREATE POLICY "Leaders/owners can update trip items"
  ON public.trip_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM trip_days td WHERE td.id = trip_day_id AND public.is_trip_leader_or_owner(td.trip_id)
  ));

CREATE POLICY "Leaders/owners can delete trip items"
  ON public.trip_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM trip_days td WHERE td.id = trip_day_id AND public.is_trip_leader_or_owner(td.trip_id)
  ));

-- =============================================
-- RLS POLICIES: TRIP_COSTS
-- =============================================
CREATE POLICY "Members can view trip costs"
  ON public.trip_costs FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id));

CREATE POLICY "Members can insert trip costs"
  ON public.trip_costs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_member(trip_id) AND created_by = auth.uid());

CREATE POLICY "Creators can update own trip costs"
  ON public.trip_costs FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Owners can delete trip costs"
  ON public.trip_costs FOR DELETE
  TO authenticated
  USING (public.is_trip_owner(trip_id));

-- =============================================
-- RLS POLICIES: CHAT_SESSIONS
-- =============================================
CREATE POLICY "Users can view own chat sessions"
  ON public.chat_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own chat sessions"
  ON public.chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions"
  ON public.chat_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own chat sessions"
  ON public.chat_sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- RLS POLICIES: CHAT_MESSAGES
-- =============================================
CREATE POLICY "Users can view messages in own sessions"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chat_sessions cs WHERE cs.id = session_id AND cs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages in own sessions"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM chat_sessions cs WHERE cs.id = session_id AND cs.user_id = auth.uid()
  ));

-- =============================================
-- RLS POLICIES: AI_PLAN_VERSIONS
-- =============================================
CREATE POLICY "Members can view plan versions"
  ON public.ai_plan_versions FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id));

CREATE POLICY "Leaders/owners can insert plan versions"
  ON public.ai_plan_versions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_leader_or_owner(trip_id));

-- =============================================
-- RLS POLICIES: TRIP_MEMBERS
-- =============================================
CREATE POLICY "Members can view trip members"
  ON public.trip_members FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id));

CREATE POLICY "Owners can add trip members"
  ON public.trip_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_owner(trip_id) AND user_id != auth.uid());

CREATE POLICY "Owners can update trip members"
  ON public.trip_members FOR UPDATE
  TO authenticated
  USING (public.is_trip_owner(trip_id));

CREATE POLICY "Owners can remove members or self-leave"
  ON public.trip_members FOR DELETE
  TO authenticated
  USING (public.is_trip_owner(trip_id) OR user_id = auth.uid());

-- =============================================
-- RLS POLICIES: TRIP_VOTES
-- =============================================
CREATE POLICY "Members can view trip votes"
  ON public.trip_votes FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id));

CREATE POLICY "Members can create votes"
  ON public.trip_votes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_member(trip_id) AND user_id = auth.uid());

CREATE POLICY "Users can update own votes"
  ON public.trip_votes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own votes"
  ON public.trip_votes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- RLS POLICIES: TRIP_COMMENTS
-- =============================================
CREATE POLICY "Members can view trip comments"
  ON public.trip_comments FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id));

CREATE POLICY "Members can create comments"
  ON public.trip_comments FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_member(trip_id) AND user_id = auth.uid());

CREATE POLICY "Users can update own comments"
  ON public.trip_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments or owners can delete"
  ON public.trip_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_trip_owner(trip_id));

-- =============================================
-- RLS POLICIES: TRIP_TASKS
-- =============================================
CREATE POLICY "Members can view trip tasks"
  ON public.trip_tasks FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id));

CREATE POLICY "Leaders/owners can create tasks"
  ON public.trip_tasks FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_leader_or_owner(trip_id));

CREATE POLICY "Assignees or leaders can update tasks"
  ON public.trip_tasks FOR UPDATE
  TO authenticated
  USING (assignee_id = auth.uid() OR public.is_trip_leader_or_owner(trip_id));

CREATE POLICY "Leaders/owners can delete tasks"
  ON public.trip_tasks FOR DELETE
  TO authenticated
  USING (public.is_trip_leader_or_owner(trip_id));

-- =============================================
-- RLS POLICIES: PUBLIC_ITINERARIES
-- =============================================
CREATE POLICY "Anyone can view public itineraries"
  ON public.public_itineraries FOR SELECT
  USING (true);

CREATE POLICY "Trip owners can publish itineraries"
  ON public.public_itineraries FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid() AND public.is_trip_owner(trip_id));

CREATE POLICY "Owners can update public itineraries"
  ON public.public_itineraries FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete public itineraries"
  ON public.public_itineraries FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- =============================================
-- RLS POLICIES: ITINERARY_REVIEWS
-- =============================================
CREATE POLICY "Anyone can view reviews"
  ON public.itinerary_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.itinerary_reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON public.itinerary_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON public.itinerary_reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- RLS POLICIES: ITINERARY_BOOKMARKS
-- =============================================
CREATE POLICY "Users can view own bookmarks"
  ON public.itinerary_bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookmarks"
  ON public.itinerary_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bookmarks"
  ON public.itinerary_bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- RLS POLICIES: REPORTS
-- =============================================
CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());