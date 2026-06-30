-- ============================================================================
-- Impact Coach Video Library — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- It is safe to re-run: objects are created with "if not exists" / "or replace"
-- where possible.
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles : one row per authenticated user, mirrors auth.users
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'coach' check (role in ('coach', 'admin')),
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- categories : admin-managed list of coaching topics
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- videos : a saved link + its metadata (we never store the video itself)
-- ----------------------------------------------------------------------------
create table if not exists public.videos (
  id             uuid primary key default gen_random_uuid(),
  url            text not null,
  title          text,
  platform       text,                         -- youtube, tiktok, instagram, ...
  thumbnail_url  text,
  notes          text,
  category_id    uuid references public.categories (id) on delete set null,
  added_by       uuid references public.profiles (id) on delete set null,
  coach_name     text,                          -- denormalised display name
  created_at     timestamptz not null default now()
);

create index if not exists videos_category_idx on public.videos (category_id);
create index if not exists videos_platform_idx on public.videos (platform);
create index if not exists videos_created_at_idx on public.videos (created_at desc);

-- ----------------------------------------------------------------------------
-- video_tags : free-form tags, many per video
-- ----------------------------------------------------------------------------
create table if not exists public.video_tags (
  id         uuid primary key default gen_random_uuid(),
  video_id   uuid not null references public.videos (id) on delete cascade,
  tag        text not null
);

create index if not exists video_tags_video_idx on public.video_tags (video_id);
create index if not exists video_tags_tag_idx on public.video_tags (lower(tag));

-- ----------------------------------------------------------------------------
-- favorites : each coach may favorite a given video at most once
-- ----------------------------------------------------------------------------
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  video_id   uuid not null references public.videos (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (video_id, user_id)        -- enforces "favorite once" per coach
);

create index if not exists favorites_video_idx on public.favorites (video_id);
create index if not exists favorites_user_idx on public.favorites (user_id);

-- ============================================================================
-- Helper: is the current user an admin?  (used by RLS policies)
-- SECURITY DEFINER so it can read profiles without tripping RLS recursion.
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- Auto-create a profile row whenever a new auth user signs up
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.videos     enable row level security;
alter table public.video_tags enable row level security;
alter table public.favorites  enable row level security;

-- profiles -------------------------------------------------------------------
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  to authenticated using (true);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- categories : everyone reads, only admins write -----------------------------
drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all"
  on public.categories for select
  to authenticated using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- videos : any coach reads/adds; owner or admin edits; admin deletes ---------
drop policy if exists "videos_select_all" on public.videos;
create policy "videos_select_all"
  on public.videos for select
  to authenticated using (true);

drop policy if exists "videos_insert_own" on public.videos;
create policy "videos_insert_own"
  on public.videos for insert
  to authenticated with check (added_by = auth.uid());

drop policy if exists "videos_update_owner_or_admin" on public.videos;
create policy "videos_update_owner_or_admin"
  on public.videos for update
  to authenticated
  using (added_by = auth.uid() or public.is_admin())
  with check (added_by = auth.uid() or public.is_admin());

drop policy if exists "videos_delete_owner_or_admin" on public.videos;
create policy "videos_delete_owner_or_admin"
  on public.videos for delete
  to authenticated
  using (added_by = auth.uid() or public.is_admin());

-- video_tags : readable by all; writable by the video owner or an admin ------
drop policy if exists "video_tags_select_all" on public.video_tags;
create policy "video_tags_select_all"
  on public.video_tags for select
  to authenticated using (true);

drop policy if exists "video_tags_write_owner_or_admin" on public.video_tags;
create policy "video_tags_write_owner_or_admin"
  on public.video_tags for all
  to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.videos v
      where v.id = video_tags.video_id and v.added_by = auth.uid()
    )
  )
  with check (
    public.is_admin() or exists (
      select 1 from public.videos v
      where v.id = video_tags.video_id and v.added_by = auth.uid()
    )
  );

-- favorites : a coach manages only their own favorites; all can read counts --
drop policy if exists "favorites_select_all" on public.favorites;
create policy "favorites_select_all"
  on public.favorites for select
  to authenticated using (true);

drop policy if exists "favorites_insert_self" on public.favorites;
create policy "favorites_insert_self"
  on public.favorites for insert
  to authenticated with check (user_id = auth.uid());

drop policy if exists "favorites_delete_self" on public.favorites;
create policy "favorites_delete_self"
  on public.favorites for delete
  to authenticated using (user_id = auth.uid());

-- ============================================================================
-- Seed the suggested categories (no-op if they already exist)
-- ============================================================================
insert into public.categories (name) values
  ('Ball Handling'),
  ('Shooting'),
  ('Finishing'),
  ('Passing'),
  ('Defense'),
  ('Rebounding'),
  ('Footwork'),
  ('Basketball IQ'),
  ('Team Offense'),
  ('Team Defense'),
  ('Press Break'),
  ('Transition'),
  ('Practice Drills'),
  ('Motivation'),
  ('Coaching Ideas'),
  ('Parent Education')
on conflict (name) do nothing;

-- ============================================================================
-- Make yourself an admin AFTER signing up once through the app:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================================
