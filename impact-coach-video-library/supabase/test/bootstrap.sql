-- Replicates the minimal Supabase platform scaffolding that schema.sql assumes
-- already exists on a real Supabase project: the auth schema/users table,
-- auth.uid(), the API roles, and the default table grants.

create schema if not exists auth;

create table if not exists auth.users (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique,
  raw_user_meta_data  jsonb default '{}'::jsonb,
  created_at          timestamptz default now()
);

-- Supabase's auth.uid(): reads the JWT 'sub' claim that PostgREST sets per request.
create or replace function auth.uid() returns uuid
language sql stable as $$
  select nullif(
    coalesce(
      nullif(current_setting('request.jwt.claim.sub', true), ''),
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    ),
  '')::uuid
$$;

-- API roles that PostgREST switches into.
do $$ begin
  if not exists (select from pg_roles where rolname = 'anon') then create role anon nologin noinherit; end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated nologin noinherit; end if;
  if not exists (select from pg_roles where rolname = 'service_role') then create role service_role nologin noinherit bypassrls; end if;
end $$;

grant usage on schema public to anon, authenticated, service_role;

-- Supabase configures default privileges so the API roles can reach public
-- tables (RLS then narrows what each row-actor may actually do).
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
