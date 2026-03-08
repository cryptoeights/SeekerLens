-- SeekerLens Supabase Schema
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (extends wallet identity)
create table users (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique not null,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Bounties
create table bounties (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  media_type text check (media_type in ('photo', 'video', 'both')) default 'photo',
  location_lat double precision,
  location_lng double precision,
  location_radius_km double precision,
  location_name text,
  reward_sol double precision not null,
  max_submissions int default 5,
  deadline timestamptz not null,
  status text default 'open' check (status in ('open', 'fulfilled', 'expired', 'cancelled')),
  escrow_tx text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Content (photos/videos — both bounty submissions and marketplace posts)
create table content (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references users(id) on delete cascade,
  bounty_id uuid references bounties(id) on delete set null,
  title text not null,
  description text,
  media_url text not null,
  thumbnail_url text,
  media_type text check (media_type in ('photo', 'video')) default 'photo',
  location_lat double precision,
  location_lng double precision,
  location_name text,
  nft_mint_address text,
  license_price_personal double precision,
  license_price_commercial double precision,
  license_price_exclusive double precision,
  is_exclusive_sold boolean default false,
  source text check (source in ('bounty', 'marketplace')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'listed')),
  tags text[] default '{}',
  likes_count int default 0,
  created_at timestamptz default now()
);

-- Licenses
create table licenses (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references content(id) on delete cascade,
  buyer_id uuid references users(id) on delete cascade,
  license_type text not null check (license_type in ('personal', 'commercial', 'exclusive')),
  price_sol double precision not null,
  tx_signature text not null,
  purchased_at timestamptz default now()
);

-- Indexes for common queries
create index idx_bounties_status on bounties(status);
create index idx_bounties_creator on bounties(creator_id);
create index idx_bounties_deadline on bounties(deadline);
create index idx_content_creator on content(creator_id);
create index idx_content_bounty on content(bounty_id);
create index idx_content_source on content(source);
create index idx_content_status on content(status);
create index idx_licenses_content on licenses(content_id);
create index idx_licenses_buyer on licenses(buyer_id);

-- Row Level Security (RLS)
alter table users enable row level security;
alter table bounties enable row level security;
alter table content enable row level security;
alter table licenses enable row level security;

-- Public read policies (anyone can read)
create policy "Public read users" on users for select using (true);
create policy "Public read bounties" on bounties for select using (true);
create policy "Public read content" on content for select using (true);
create policy "Public read licenses" on licenses for select using (true);

-- Insert policies (authenticated users can insert)
create policy "Users can insert own profile" on users for insert with check (true);
create policy "Users can create bounties" on bounties for insert with check (true);
create policy "Users can create content" on content for insert with check (true);
create policy "Users can create licenses" on licenses for insert with check (true);

-- Update policies
create policy "Users can update own profile" on users for update using (true);
create policy "Creators can update own bounties" on bounties for update using (true);
create policy "Creators can update own content" on content for update using (true);
