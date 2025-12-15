-- COMBINED SETUP SCRIPT (Run this if starting fresh)
-- Includes: Base Tables, Phase 2 Hardening, Phase 4 Constraints

-- ==========================================
-- 1. BASE SCHEMA
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS Table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  phone text unique,
  role text check (role in ('user', 'organizer', 'admin')) default 'user',
  interests text[],
  created_at timestamp with time zone default now()
);

-- ORGANIZERS Table
create table if not exists organizers (
  id uuid primary key references users(id) on delete cascade,
  org_name text not null,
  bio text,
  verified boolean default false,
  phone text,
  logo_url text,
  created_at timestamp with time zone default now()
);

-- COMMUNITIES Table
create table if not exists communities (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references organizers(id) on delete cascade not null,
  name text not null,
  description text,
  category text,
  cover_image text,
  location text,
  members_count int default 0,
  created_at timestamp with time zone default now()
);

-- EVENTS Table
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references organizers(id) on delete cascade not null,
  community_id uuid references communities(id) on delete set null,
  title text not null,
  description text,
  category text,
  date date not null,
  time time not null,
  price float default 0,
  location text,
  latitude float,
  longitude float,
  images text[],
  created_at timestamp with time zone default now()
);

-- PAYMENTS Table
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references organizers(id),
  amount float not null,
  type text check (type in ('listing_fee', 'ticket_purchase')),
  status text check (status in ('pending', 'completed', 'failed', 'refunded')),
  method text,
  razorpay_payment_id text,
  created_at timestamp with time zone default now()
);

-- TICKETS Table
create table if not exists tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  status text check (status in ('valid', 'used', 'cancelled')) default 'valid',
  payment_id uuid references payments(id),
  created_at timestamp with time zone default now()
);

-- Enable RLS (Base)
alter table users enable row level security;
alter table organizers enable row level security;
alter table communities enable row level security;
alter table events enable row level security;
alter table tickets enable row level security;
alter table payments enable row level security;

-- ==========================================
-- 2. PHASE 2 HARDENING (Columns & Policies)
-- ==========================================

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
    
    -- Ensure attendees column exists too (referenced in Phase 4 plan but not in base schema?)
    -- Base schema didn't have 'attendees' counter on events table, only 'tickets' table.
    -- App logic mentioned "event.attendees" and RPC "increment_attendees".
    -- We should add this column if missing.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'attendees') THEN
        ALTER TABLE events ADD COLUMN attendees int DEFAULT 0;
    END IF;
    -- Also capacity if missing (Base schema didn't show it explicitly in the `create table` block in Step 103, but logic uses it)
    -- Wait, Step 103 shows `capacity` was NOT in the CREATE TABLE events block.
    -- But the code uses `event.capacity`. I must add it.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'capacity') THEN
        ALTER TABLE events ADD COLUMN capacity int DEFAULT 100;
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_communities_status ON communities(status);

-- Admin Helper
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

-- Drop existing/base policies to replace with strict ones
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Organizers can insert events" ON events;
DROP POLICY IF EXISTS "Organizers can update their own events" ON events;
DROP POLICY IF EXISTS "Public can view communities" ON communities;

-- Events Policies (Strict)
CREATE POLICY "Public view approved events" ON events
FOR SELECT USING (
  status = 'approved' OR 
  auth.uid() = organizer_id OR 
  is_admin()
);

CREATE POLICY "Organizers insert events" ON events
FOR INSERT WITH CHECK (
  auth.uid() = organizer_id
);

CREATE POLICY "Organizers update own events" ON events
FOR UPDATE USING (
  auth.uid() = organizer_id OR is_admin()
);

-- Communities Policies (Strict)
CREATE POLICY "Public view approved communities" ON communities
FOR SELECT USING (
  status = 'approved' OR 
  auth.uid() = organizer_id OR 
  is_admin()
);

-- Payments Policies (Hardening)
DROP POLICY IF EXISTS "Users/Organizers can view their own payments" ON payments;

CREATE POLICY "Users/Organizers view own payments" ON payments
FOR SELECT USING (
  auth.uid() = organizer_id OR
  is_admin()
);

-- ==========================================
-- 3. PHASE 4 CONSTRAINTS & RPCs
-- ==========================================

-- Unique Ticket
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS unique_user_event;
ALTER TABLE tickets ADD CONSTRAINT unique_user_event UNIQUE (user_id, event_id);

-- RPC: Increment Attendees
CREATE OR REPLACE FUNCTION increment_attendees(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET attendees = attendees + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Increment Views
CREATE OR REPLACE FUNCTION increment_views(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET views = COALESCE(views, 0) + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Base Policies for Users/Organizers (from original schema, ensuring they exist)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" on users for select using (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" on users for update using (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view basic user info" ON users;
CREATE POLICY "Public can view basic user info" on users for select using (true);

DROP POLICY IF EXISTS "Organizers can update their own profile" ON organizers;
CREATE POLICY "Organizers can update their own profile" on organizers for update using (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view organizers" ON organizers;
CREATE POLICY "Public can view organizers" on organizers for select using (true);
