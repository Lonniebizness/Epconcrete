import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/server';
import { getProfile, displayName } from '@/lib/auth';
import type { Category, VideoWithDetails } from '@/lib/types';
import LibraryClient from './LibraryClient';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const profile = await getProfile();
  const supabase = createClient();

  // Pull videos with their category, tags, and a server-side favorite count.
  const [{ data: videosRaw }, { data: categories }, { data: myFavorites }] =
    await Promise.all([
      supabase
        .from('videos')
        .select(
          `id, url, title, platform, thumbnail_url, notes, category_id,
           added_by, coach_name, created_at,
           category:categories(name),
           video_tags(tag),
           favorites(count)`
        )
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('favorites').select('video_id').eq('user_id', profile.id),
    ]);

  const favoritedIds = new Set((myFavorites ?? []).map((f) => f.video_id));

  const videos: VideoWithDetails[] = (videosRaw ?? []).map((v: any) => ({
    ...v,
    favorite_count: v.favorites?.[0]?.count ?? 0,
    is_favorited: favoritedIds.has(v.id),
  }));

  const isAdmin = profile.role === 'admin';

  return (
    <div className="min-h-screen">
      <Navbar active="library" isAdmin={isAdmin} coachName={displayName(profile)} />
      <LibraryClient
        videos={videos}
        categories={(categories ?? []) as Category[]}
        currentUserId={profile.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
