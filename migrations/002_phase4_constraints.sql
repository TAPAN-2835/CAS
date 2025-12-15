-- Phase 4: Final Safety & Constraints

-- 1. Unique Ticket Constraint (Prevent double booking)
ALTER TABLE tickets 
ADD CONSTRAINT unique_user_event UNIQUE (user_id, event_id);


-- 2. NOT NULL Constraints (Safety)
ALTER TABLE events ALTER COLUMN title SET NOT NULL;
ALTER TABLE events ALTER COLUMN date SET NOT NULL;
ALTER TABLE communities ALTER COLUMN name SET NOT NULL;


-- 3. RPC for Atomic Increments (Concurrency Safety)
CREATE OR REPLACE FUNCTION increment_attendees(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET attendees = attendees + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. RPC for View Increment (if not done in phase 2)
CREATE OR REPLACE FUNCTION increment_views(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET views = COALESCE(views, 0) + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
