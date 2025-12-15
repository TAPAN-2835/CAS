-- Phase 2: Backend Hardening Migration

-- 1. Add Status Enums and Columns
-- We use text check constraints instead of native enums for easier mutability, but native is fine too.
-- Using text with check constraints as per existing schema style.

-- Events: Add status and views
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
        ALTER TABLE events ADD COLUMN status text CHECK (status IN ('draft', 'pending', 'approved', 'rejected')) DEFAULT 'draft';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'views') THEN
        ALTER TABLE events ADD COLUMN views int DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'rejection_reason') THEN
        ALTER TABLE events ADD COLUMN rejection_reason text;
    END IF;
END $$;

-- Communities: Add status
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'status') THEN
        ALTER TABLE communities ADD COLUMN status text CHECK (status IN ('draft', 'pending', 'approved', 'rejected')) DEFAULT 'pending';
    END IF;

     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'rejection_reason') THEN
        ALTER TABLE communities ADD COLUMN rejection_reason text;
    END IF;
END $$;

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_communities_status ON communities(status);


-- 3. RLS Hardening

-- Helper function to check for admin
-- Note: You must ensure your users table has the correct roles set.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies to be safe (re-creating them stricter)
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Organizers can insert events" ON events;
DROP POLICY IF EXISTS "Organizers can update their own events" ON events;

-- Events Policies
-- READ: Public can only see APPROVED events. Authors/Admins can see everything.
CREATE POLICY "Public view approved events" ON events
FOR SELECT USING (
  status = 'approved' OR 
  auth.uid() = organizer_id OR -- Owner
  is_admin() -- Admin
);

-- INSERT: Only verified organizers (optional check) or just logged in organizers
CREATE POLICY "Organizers insert events" ON events
FOR INSERT WITH CHECK (
  auth.uid() = organizer_id
  -- AND EXISTS (SELECT 1 FROM organizers WHERE id = auth.uid() AND verified = true) -- Optional: enforce verification
);

-- UPDATE: Only owner or admin
CREATE POLICY "Organizers update own events" ON events
FOR UPDATE USING (
  auth.uid() = organizer_id OR is_admin()
);

-- DELETE: Only owner or admin
CREATE POLICY "Organizers delete own events" ON events
FOR DELETE USING (
  auth.uid() = organizer_id OR is_admin()
);


-- Communities Policies
DROP POLICY IF EXISTS "Public can view communities" ON communities;

CREATE POLICY "Public view approved communities" ON communities
FOR SELECT USING (
  status = 'approved' OR 
  auth.uid() = organizer_id OR 
  is_admin()
);

-- Payments Policies (Hardening)
-- Users should see their own purchase history
-- Organizers should see income related to them
DROP POLICY IF EXISTS "Users/Organizers can view their own payments" ON payments;

CREATE POLICY "Users view own payments" ON payments
FOR SELECT USING (
  -- In real scenario, payments table might link to user_id directly if it stores buyer info
  -- Current schema: payment link keys off organizer_id? 
  -- Assuming tickets link payments to users. 
  -- For strictness: Link payments to users table or join via tickets.
  -- Simplified: Only Organizers view payments for now as per schema
  auth.uid() = organizer_id OR
  is_admin()
);

-- 4. Search Function (RPC) - Optional but better for complex search
-- Creating a function to "increment view" safely
CREATE OR REPLACE FUNCTION increment_view_count(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET views = views + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
