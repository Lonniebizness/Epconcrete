import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

// Loads the signed-in user's profile for use in Server Components.
// Redirects to /login if there is no session.
export async function getProfile(): Promise<Profile> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fallback in case the trigger hasn't populated the row yet.
  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      full_name: user.email?.split('@')[0] ?? 'Coach',
      role: 'coach',
      created_at: new Date().toISOString(),
    };
  }

  return profile as Profile;
}

export function displayName(profile: Profile): string {
  return profile.full_name || profile.email || 'Coach';
}
