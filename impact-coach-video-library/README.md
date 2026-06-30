# 🏀 Impact Coach Video Library

A private, mobile-first web app for basketball coaching staff to **save and
organize video links** from TikTok, Instagram, YouTube, Facebook, X, LinkedIn,
Vimeo, and anywhere else — into one growing coaching library.

> We only ever store **links + metadata** (title, thumbnail/preview, notes, tags,
> favorites). The actual videos are never downloaded or re-hosted.

## ✨ Features

- **Coach login** (email + password via Supabase Auth)
- **Save a video link** with auto-detected platform
- Auto-grab **title + thumbnail/preview** when available (oEmbed; YouTube thumbnails work offline)
- Store **title, thumbnail, URL, category, tags, notes, and coach name**
- **Organize by category** + **search** by title, category, tag, platform, or coach
- **Filter** by category and platform, **sort** by newest or most-favorited
- **Favorites**: each coach can favorite a video once; cards show the **group favorite count** so you can see what the staff likes most
- **Admin**: create / edit / delete categories, and remove any video
- Coaches can remove videos they added
- Clean, **mobile-first** responsive UI (Tailwind CSS)

## 🧱 Tech stack

| Layer    | Choice                              |
| -------- | ----------------------------------- |
| Framework| Next.js 14 (App Router) + TypeScript|
| Styling  | Tailwind CSS                        |
| Auth + DB| Supabase (Postgres + Auth + RLS)    |

## 📁 Project structure

```
impact-coach-video-library/
├── supabase/
│   └── schema.sql              # Full DB schema, RLS, triggers, seed categories
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server actions: add/delete video, favorite, categories
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Redirects to /library
│   │   ├── globals.css
│   │   ├── login/             # Auth UI (sign in / sign up)
│   │   ├── library/          # Main library (search, filter, sort)
│   │   ├── add/              # Add-video form (auto platform + preview)
│   │   ├── admin/           # Category management (admin only)
│   │   ├── auth/callback/    # OAuth/email-confirm callback
│   │   └── api/metadata/     # Best-effort oEmbed title/thumbnail lookup
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── VideoCard.tsx
│   └── lib/
│       ├── auth.ts            # getProfile() helper
│       ├── platform.ts        # Platform detection + thumbnails
│       ├── types.ts
│       └── supabase/          # Browser, server, middleware clients
├── middleware.ts             # Session refresh + route protection
└── .env.local.example
```

## 🚀 Setup

### 1. Create a Supabase project

1. Go to <https://supabase.com> → **New project**.
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates all
   tables (`profiles`, `videos`, `categories`, `video_tags`, `favorites`),
   row-level-security policies, the new-user trigger, and seeds the suggested
   categories.
3. In **Project Settings → API**, copy the **Project URL** and **anon public
   key**.

### 2. Configure the app

```bash
cd impact-coach-video-library
cp .env.local.example .env.local
# then edit .env.local:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Install & run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### 4. Create your first coach + make yourself admin

1. Visit the app, click **Create account**, and sign up.
   - If you left **email confirmation** on (Supabase default), confirm via the
     email link, then sign in. To skip confirmation for quick testing:
     **Authentication → Providers → Email → disable "Confirm email"**.
2. Promote yourself to admin from the **SQL Editor**:

   ```sql
   update public.profiles set role = 'admin'
   where email = 'you@example.com';
   ```

3. Reload — the **Admin** tab now appears.

### 5. Auth redirect URLs (for email links / deploys)

In **Authentication → URL Configuration**, add your site URL (e.g.
`http://localhost:3000` and your production domain) to **Redirect URLs** so the
`/auth/callback` flow works.

## 👥 Roles

- **Coach** — sign in, add videos, favorite, search/filter, remove their own videos.
- **Admin** — everything a coach can do, plus manage categories and remove **any** video.

Roles live in `profiles.role` and are enforced by Postgres **RLS policies** (see
`schema.sql`), so the rules hold even outside this UI.

## 🔌 Platform auto-detection & previews

- Platform is detected from the URL host (YouTube, TikTok, Instagram, Facebook,
  X/Twitter, LinkedIn, Vimeo → otherwise "Other").
- **YouTube** thumbnails are derived directly from the video id (no network).
- **YouTube / Vimeo / TikTok** titles + thumbnails are fetched via public oEmbed.
- Instagram/Facebook require an access token for oEmbed, so those previews are
  best-effort; you can always paste a title and the card still works. The coach
  can override the platform and title before saving.

## 📝 Notes

- No videos are stored — only links and metadata, per the project requirement.
- Search/filtering runs client-side over the loaded set for snappy UX (great for
  an MVP-sized library); move to server-side queries if the library grows large.
