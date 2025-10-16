-- Drop overly permissive RLS policies
DROP POLICY IF EXISTS "Users can read all" ON public.users;
DROP POLICY IF EXISTS "Anyone can read trips" ON public.trips;
DROP POLICY IF EXISTS "Anyone can manage itinerary blocks" ON public.itinerary_blocks;
DROP POLICY IF EXISTS "Anyone can read itinerary blocks" ON public.itinerary_blocks;
DROP POLICY IF EXISTS "Anyone can manage checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can read checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can manage expenses" ON public.expenses;
DROP POLICY IF EXISTS "Anyone can read expenses" ON public.expenses;

-- Create secure RLS policies for users table
CREATE POLICY "Users can only read their own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create secure RLS policies for trips table
CREATE POLICY "Authenticated users can read their own trips"
ON public.trips
FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can update their own trips"
ON public.trips
FOR UPDATE
TO authenticated
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can delete their own trips"
ON public.trips
FOR DELETE
TO authenticated
USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create trips"
ON public.trips
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Create secure RLS policies for itinerary_blocks table
CREATE POLICY "Trip creators can manage itinerary blocks"
ON public.itinerary_blocks
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = itinerary_blocks.trip_id
    AND trips.creator_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = itinerary_blocks.trip_id
    AND trips.creator_id = auth.uid()
  )
);

-- Create secure RLS policies for checklist_items table
CREATE POLICY "Trip creators can manage checklist items"
ON public.checklist_items
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = checklist_items.trip_id
    AND trips.creator_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = checklist_items.trip_id
    AND trips.creator_id = auth.uid()
  )
);

-- Create secure RLS policies for expenses table
CREATE POLICY "Trip creators can manage expenses"
ON public.expenses
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = expenses.trip_id
    AND trips.creator_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = expenses.trip_id
    AND trips.creator_id = auth.uid()
  )
);

-- Add database constraints for input validation
ALTER TABLE trips
  DROP CONSTRAINT IF EXISTS title_length,
  DROP CONSTRAINT IF EXISTS description_length,
  DROP CONSTRAINT IF EXISTS participant_count_range;

ALTER TABLE trips
  ADD CONSTRAINT title_length CHECK (char_length(title) <= 200 AND char_length(title) > 0),
  ADD CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 2000),
  ADD CONSTRAINT participant_count_range CHECK (participant_count >= 2 AND participant_count <= 1000);

-- Add constraints for itinerary blocks
ALTER TABLE itinerary_blocks
  DROP CONSTRAINT IF EXISTS title_length_blocks,
  DROP CONSTRAINT IF EXISTS notes_length;

ALTER TABLE itinerary_blocks
  ADD CONSTRAINT title_length_blocks CHECK (char_length(title) <= 500 AND char_length(title) > 0),
  ADD CONSTRAINT notes_length CHECK (notes IS NULL OR char_length(notes) <= 2000);

-- Add constraints for checklist items
ALTER TABLE checklist_items
  DROP CONSTRAINT IF EXISTS title_length_checklist;

ALTER TABLE checklist_items
  ADD CONSTRAINT title_length_checklist CHECK (char_length(title) <= 500 AND char_length(title) > 0);