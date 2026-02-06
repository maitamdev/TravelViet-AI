-- Fix RLS policies: Change from RESTRICTIVE to PERMISSIVE

-- Drop existing RESTRICTIVE policies on trips
DROP POLICY IF EXISTS "Users can create trips" ON public.trips;
DROP POLICY IF EXISTS "Users can view own trips or member trips" ON public.trips;
DROP POLICY IF EXISTS "Trip owners can update trips" ON public.trips;
DROP POLICY IF EXISTS "Trip owners can delete trips" ON public.trips;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Users can create trips" 
  ON public.trips FOR INSERT 
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can view own trips or member trips" 
  ON public.trips FOR SELECT 
  TO authenticated
  USING (is_trip_member(id));

CREATE POLICY "Trip owners can update trips" 
  ON public.trips FOR UPDATE 
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Trip owners can delete trips" 
  ON public.trips FOR DELETE 
  TO authenticated
  USING (owner_id = auth.uid());

-- Also fix other critical tables that might have same issue

-- trip_days
DROP POLICY IF EXISTS "Members can view trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Leaders/owners can insert trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Leaders/owners can update trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Leaders/owners can delete trip days" ON public.trip_days;

CREATE POLICY "Members can view trip days" 
  ON public.trip_days FOR SELECT 
  TO authenticated
  USING (is_trip_member(trip_id));

CREATE POLICY "Leaders/owners can insert trip days" 
  ON public.trip_days FOR INSERT 
  TO authenticated
  WITH CHECK (is_trip_leader_or_owner(trip_id));

CREATE POLICY "Leaders/owners can update trip days" 
  ON public.trip_days FOR UPDATE 
  TO authenticated
  USING (is_trip_leader_or_owner(trip_id));

CREATE POLICY "Leaders/owners can delete trip days" 
  ON public.trip_days FOR DELETE 
  TO authenticated
  USING (is_trip_leader_or_owner(trip_id));

-- trip_items  
DROP POLICY IF EXISTS "Members can view trip items" ON public.trip_items;
DROP POLICY IF EXISTS "Leaders/owners can insert trip items" ON public.trip_items;
DROP POLICY IF EXISTS "Leaders/owners can update trip items" ON public.trip_items;
DROP POLICY IF EXISTS "Leaders/owners can delete trip items" ON public.trip_items;

CREATE POLICY "Members can view trip items" 
  ON public.trip_items FOR SELECT 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM trip_days td WHERE td.id = trip_items.trip_day_id AND is_trip_member(td.trip_id)));

CREATE POLICY "Leaders/owners can insert trip items" 
  ON public.trip_items FOR INSERT 
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM trip_days td WHERE td.id = trip_items.trip_day_id AND is_trip_leader_or_owner(td.trip_id)));

CREATE POLICY "Leaders/owners can update trip items" 
  ON public.trip_items FOR UPDATE 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM trip_days td WHERE td.id = trip_items.trip_day_id AND is_trip_leader_or_owner(td.trip_id)));

CREATE POLICY "Leaders/owners can delete trip items" 
  ON public.trip_items FOR DELETE 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM trip_days td WHERE td.id = trip_items.trip_day_id AND is_trip_leader_or_owner(td.trip_id)));

-- chat_sessions
DROP POLICY IF EXISTS "Users can create own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can view own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can update own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON public.chat_sessions;

CREATE POLICY "Users can create own chat sessions" 
  ON public.chat_sessions FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own chat sessions" 
  ON public.chat_sessions FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions" 
  ON public.chat_sessions FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own chat sessions" 
  ON public.chat_sessions FOR DELETE 
  TO authenticated
  USING (user_id = auth.uid());

-- chat_messages
DROP POLICY IF EXISTS "Users can insert messages in own sessions" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view messages in own sessions" ON public.chat_messages;

CREATE POLICY "Users can insert messages in own sessions" 
  ON public.chat_messages FOR INSERT 
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM chat_sessions cs WHERE cs.id = chat_messages.session_id AND cs.user_id = auth.uid()));

CREATE POLICY "Users can view messages in own sessions" 
  ON public.chat_messages FOR SELECT 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM chat_sessions cs WHERE cs.id = chat_messages.session_id AND cs.user_id = auth.uid()));