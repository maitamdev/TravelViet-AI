-- Drop and recreate SELECT policy to also allow owner to see their own trips directly
DROP POLICY IF EXISTS "Users can view own trips or member trips" ON public.trips;

CREATE POLICY "Users can view own trips or member trips"
ON public.trips FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM trip_members 
    WHERE trip_members.trip_id = trips.id 
    AND trip_members.user_id = auth.uid()
  )
);