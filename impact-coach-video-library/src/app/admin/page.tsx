import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/server';
import { getProfile, displayName } from '@/lib/auth';
import type { Category } from '@/lib/types';
import CategoryManager from './CategoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const profile = await getProfile();
  if (profile.role !== 'admin') redirect('/library');

  const supabase = createClient();

  // Category list + per-category video counts for context.
  const [{ data: categories }, { data: videoCounts }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('videos').select('category_id'),
  ]);

  const counts: Record<string, number> = {};
  (videoCounts ?? []).forEach((v) => {
    if (v.category_id) counts[v.category_id] = (counts[v.category_id] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen">
      <Navbar active="admin" isAdmin coachName={displayName(profile)} />
      <main className="mx-auto max-w-xl px-4 py-6">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Manage categories</h1>
        <p className="mb-5 text-sm text-gray-500">
          Create, rename, or remove categories. Removing a category leaves its videos
          in place — they simply become uncategorized.
        </p>
        <CategoryManager
          categories={(categories ?? []) as Category[]}
          counts={counts}
        />
      </main>
    </div>
  );
}
