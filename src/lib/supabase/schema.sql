-- ============================================================
-- THE COLLECTION - LUXURY AUTOMOTIVE DATABASE SCHEMA
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (User accounts)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  first_name text,
  last_name text,
  phone text,
  country text,
  vip_status text default 'MEMBER',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- 2. BRANDS
create table if not exists public.brands (
  id text primary key,
  name text not null,
  country text not null,
  founded_year integer,
  manifesto text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.brands enable row level security;
create policy "Public read brands" on public.brands for select using (true);

-- 3. CATEGORIES
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.categories enable row level security;
create policy "Public read categories" on public.categories for select using (true);

-- 4. CARS (Automobiles in the collection)
create table if not exists public.cars (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  brand text not null,
  model text not null,
  variant text,
  category text not null,
  year integer not null,
  price numeric not null,
  currency text default 'USD' not null,
  tagline text not null,
  manifesto text not null,
  specs jsonb not null,
  engineering jsonb not null,
  design jsonb not null,
  frame_path text not null,
  frame_count integer default 240 not null,
  hero_image text,
  featured boolean default false,
  inventory_status text default 'AVAILABLE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.cars enable row level security;
create policy "Public read cars" on public.cars for select using (true);

-- 5. FAVORITES / WISHLIST
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  car_slug text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, car_slug)
);
alter table public.favorites enable row level security;
create policy "Users manage own favorites" on public.favorites for all using (auth.uid() = user_id);

-- 6. RECENTLY VIEWED
create table if not exists public.recently_viewed (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  car_slug text not null,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, car_slug)
);
alter table public.recently_viewed enable row level security;
create policy "Users manage own recently viewed" on public.recently_viewed for all using (auth.uid() = user_id);

-- 7. VEHICLE CONFIGURATIONS (Bespoke Atelier saves)
create table if not exists public.vehicle_configurations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  car_slug text not null,
  color jsonb not null,
  interior jsonb not null,
  wheel jsonb not null,
  caliper jsonb not null,
  aero jsonb not null,
  total_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.vehicle_configurations enable row level security;
create policy "Users view own configurations" on public.vehicle_configurations for all using (auth.uid() = user_id or user_id is null);

-- 8. ADDRESSES
create table if not exists public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  address_line1 text not null,
  city text not null,
  state text,
  country text not null,
  postal_code text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.addresses enable row level security;
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- 9. TEST DRIVE REQUESTS
create table if not exists public.test_drive_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  car_slug text not null,
  car_name text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  preferred_time text not null,
  showroom_location text not null,
  notes text,
  status text default 'PENDING' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.test_drive_requests enable row level security;
create policy "Users view own test drives" on public.test_drive_requests for select using (auth.uid() = user_id or user_id is null);
create policy "Users create test drives" on public.test_drive_requests for insert with check (true);

-- 10. PURCHASE REQUESTS & RESERVATIONS
create table if not exists public.purchase_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  car_slug text not null,
  car_name text not null,
  configuration_id uuid references public.vehicle_configurations(id) on delete set null,
  customer_details jsonb not null,
  delivery_details jsonb not null,
  financing_details jsonb not null,
  estimated_total numeric not null,
  status text default 'REQUESTED' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.purchase_requests enable row level security;
create policy "Users view own purchase requests" on public.purchase_requests for select using (auth.uid() = user_id or user_id is null);
create policy "Users create purchase requests" on public.purchase_requests for insert with check (true);
