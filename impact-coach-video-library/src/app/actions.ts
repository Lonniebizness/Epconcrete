'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { detectPlatform, normalizeUrl } from '@/lib/platform';

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { supabase, user };
}

async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    throw new Error('Not authorized — admin only.');
  }
  return { supabase, user };
}

export type ActionResult = { error?: string; success?: boolean };

// ---------------------------------------------------------------------------
// Videos
// ---------------------------------------------------------------------------
export async function addVideo(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await requireUser();

  const rawUrl = String(formData.get('url') || '').trim();
  if (!rawUrl) return { error: 'A video URL is required.' };

  const url = normalizeUrl(rawUrl);
  try {
    // Validate it parses as a URL.
    // eslint-disable-next-line no-new
    new URL(url);
  } catch {
    return { error: 'That does not look like a valid URL.' };
  }

  const title = String(formData.get('title') || '').trim() || null;
  const notes = String(formData.get('notes') || '').trim() || null;
  const thumbnail_url = String(formData.get('thumbnail_url') || '').trim() || null;
  const category_id = String(formData.get('category_id') || '') || null;
  const platform =
    String(formData.get('platform') || '').trim() || detectPlatform(url);
  const coach_name = String(formData.get('coach_name') || '').trim() || null;

  const tagsRaw = String(formData.get('tags') || '');
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);

  const { data: video, error } = await supabase
    .from('videos')
    .insert({
      url,
      title,
      notes,
      thumbnail_url,
      category_id: category_id || null,
      platform,
      coach_name,
      added_by: user.id,
    })
    .select('id')
    .single();

  if (error || !video) {
    return { error: error?.message || 'Could not save the video.' };
  }

  if (tags.length > 0) {
    await supabase
      .from('video_tags')
      .insert(tags.map((tag) => ({ video_id: video.id, tag })));
  }

  revalidatePath('/library');
  redirect('/library');
}

export async function deleteVideo(formData: FormData): Promise<void> {
  // Owner or admin (enforced again by RLS).
  const { supabase } = await requireUser();
  const id = String(formData.get('video_id') || '');
  if (!id) return;
  await supabase.from('videos').delete().eq('id', id);
  revalidatePath('/library');
}

// ---------------------------------------------------------------------------
// Favorites — toggle on/off, once per coach (DB unique constraint enforces it)
// ---------------------------------------------------------------------------
export async function toggleFavorite(formData: FormData): Promise<void> {
  const { supabase, user } = await requireUser();
  const videoId = String(formData.get('video_id') || '');
  const isFavorited = String(formData.get('is_favorited') || '') === 'true';
  if (!videoId) return;

  if (isFavorited) {
    await supabase
      .from('favorites')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', user.id);
  } else {
    await supabase
      .from('favorites')
      .insert({ video_id: videoId, user_id: user.id });
  }

  revalidatePath('/library');
}

// ---------------------------------------------------------------------------
// Categories (admin only)
// ---------------------------------------------------------------------------
export async function createCategory(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  if (!name) return;
  await supabase.from('categories').insert({ name });
  revalidatePath('/admin');
  revalidatePath('/library');
}

export async function updateCategory(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '').trim();
  if (!id || !name) return;
  await supabase.from('categories').update({ name }).eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/library');
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) return;
  // Videos keep existing; their category_id is set to null by the FK rule.
  await supabase.from('categories').delete().eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/library');
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
