# Schema + RLS verification

A self-contained, offline test that runs the **unchanged** `../schema.sql`
against a real PostgreSQL instance and exercises every data-layer flow exactly
as the app's server actions do — as the `authenticated` role with a JWT `sub`
claim, which is what Supabase/PostgREST set on each request.

It verifies:

- the signup → `profiles` auto-creation trigger
- RLS for coach vs admin (insert/own, delete own vs any, admin-only categories)
- "favorite once per coach" (unique constraint) and group favorite counts
- the exact library query shape (category name, tags, favorite count, is_favorited)
- cascade deletes (removing a video clears its tags + favorites)
- deleting a category leaves its videos in place (`category_id` → null)

## What it does NOT cover

The hosted Supabase **Auth (GoTrue)** and **PostgREST** HTTP services aren't run
here — those are managed Supabase components the app reaches through standard
`supabase-js` calls. `bootstrap.sql` provides the minimal `auth` scaffolding
(`auth.users`, `auth.uid()`, the API roles + grants) that a real Supabase
project already has, so `schema.sql` applies and runs identically.

## Run it locally

Requires a local Postgres (any 14–16). With the Supabase CLI you could instead
just `supabase start`; this path needs no Docker.

```bash
# 1. Point at your Postgres and create a fresh db
createdb app

# 2. Lay down the Supabase scaffolding, then the real schema
psql -d app -f bootstrap.sql
psql -d app -f ../schema.sql

# 3. Run the end-to-end checks
npm install pg
node e2e.js     # edit the `conn` object at the top for your host/port/user
```

Expected final line: `RESULT: 23 passed, 0 failed`.
