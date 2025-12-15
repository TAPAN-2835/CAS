-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS Table
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  phone text unique,
  role text check (role in ('user', 'organizer', 'admin')) default 'user',
  interests text[],
  created_at timestamp with time zone default now()
);

-- ORGANIZERS Table
create table organizers (
  id uuid primary key references users(id) on delete cascade,
  org_name text not null,
  bio text,
  verified boolean default false,
  phone text,
  logo_url text,
  created_at timestamp with time zone default now()
);

-- COMMUNITIES Table
create table communities (
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
create table events (
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
create table payments (
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
create table tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  status text check (status in ('valid', 'used', 'cancelled')) default 'valid',
  payment_id uuid references payments(id),
  created_at timestamp with time zone default now()
);

-- RLS POLICIES

-- Enable RLS
alter table users enable row level security;
alter table organizers enable row level security;
alter table communities enable row level security;
alter table events enable row level security;
alter table tickets enable row level security;
alter table payments enable row level security;

-- Users
create policy "Users can view their own profile" on users for select using (auth.uid() = id);
create policy "Users can update their own profile" on users for update using (auth.uid() = id);
create policy "Public can view basic user info" on users for select using (true); -- Adjust based on privacy needs

-- Organizers
create policy "Organizers can update their own profile" on organizers for update using (auth.uid() = id);
create policy "Public can view organizers" on organizers for select using (true);

-- Communities
create policy "Organizers can insert communities" on communities for insert with check (auth.uid() = organizer_id);
create policy "Organizers can update their own communities" on communities for update using (auth.uid() = organizer_id);
create policy "Public can view communities" on communities for select using (true);

-- Events
create policy "Organizers can insert events" on events for insert with check (auth.uid() = organizer_id);
create policy "Organizers can update their own events" on events for update using (auth.uid() = organizer_id);
create policy "Public can view events" on events for select using (true);

-- Tickets
create policy "Users can view their own tickets" on tickets for select using (auth.uid() = user_id);
create policy "Users can insert tickets" on tickets for insert with check (auth.uid() = user_id);

-- Payments
create policy "Users/Organizers can view their own payments" on payments for select using (auth.uid() = organizer_id); -- This might need adjustment for user payments

-- Admin Bypass (This is usually handled by service role, but for RLS checks in client)
-- You can create a function `is_admin()` and use it in policies.
