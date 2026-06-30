import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/server';
import { getProfile, displayName } from '@/lib/auth';
import type { Category } from '@/lib/types';
import AddVideoForm from './AddVideoForm';

export const dynamic = 'force-dynamic';

export default async function AddPage() {
  const profile = await getProfile();
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="min-h-screen">
      <Navbar
        active="add"
        isAdmin={profile.role === 'admin'}
        coachName={displayName(profile)}
      />
      <main className="mx-auto max-w-xl px-4 py-6">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Save a video</h1>
        <p className="mb-5 text-sm text-gray-500">
          Paste a link from YouTube, TikTok, Instagram, X, and more. We&apos;ll detect
          the platform and grab a preview when we can.
        </p>
        <AddVideoForm
          categories={(categories ?? []) as Category[]}
          coachName={displayName(profile)}
        />
      </main>
    </div>
  );
}
