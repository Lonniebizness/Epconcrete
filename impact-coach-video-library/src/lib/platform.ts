// Platform detection + lightweight metadata helpers.
// No external services required for the core (platform + YouTube thumbnail);
// richer title/thumbnail lookups are attempted server-side via oEmbed.

export type Platform =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'linkedin'
  | 'vimeo'
  | 'other';

interface PlatformMeta {
  id: Platform;
  label: string;
  // Tailwind classes for the platform badge.
  badge: string;
}

export const PLATFORMS: Record<Platform, PlatformMeta> = {
  youtube: { id: 'youtube', label: 'YouTube', badge: 'bg-red-100 text-red-700' },
  tiktok: { id: 'tiktok', label: 'TikTok', badge: 'bg-gray-900 text-white' },
  instagram: { id: 'instagram', label: 'Instagram', badge: 'bg-pink-100 text-pink-700' },
  facebook: { id: 'facebook', label: 'Facebook', badge: 'bg-blue-100 text-blue-700' },
  x: { id: 'x', label: 'X', badge: 'bg-gray-200 text-gray-900' },
  linkedin: { id: 'linkedin', label: 'LinkedIn', badge: 'bg-sky-100 text-sky-800' },
  vimeo: { id: 'vimeo', label: 'Vimeo', badge: 'bg-cyan-100 text-cyan-800' },
  other: { id: 'other', label: 'Other', badge: 'bg-orange-100 text-orange-700' },
};

export const PLATFORM_OPTIONS = Object.values(PLATFORMS);

/** Detect the platform from a URL. Returns 'other' when nothing matches. */
export function detectPlatform(rawUrl: string): Platform {
  let host = '';
  try {
    host = new URL(normalizeUrl(rawUrl)).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return 'other';
  }

  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
  if (host.includes('tiktok.com')) return 'tiktok';
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com'))
    return 'facebook';
  if (host === 'x.com' || host.includes('twitter.com') || host.endsWith('.x.com')) return 'x';
  if (host.includes('linkedin.com') || host.includes('lnkd.in')) return 'linkedin';
  if (host.includes('vimeo.com')) return 'vimeo';
  return 'other';
}

/** Add https:// if the user pasted a bare URL. */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Extract a YouTube video id from any of its URL shapes. */
export function youTubeId(rawUrl: string): string | null {
  try {
    const u = new URL(normalizeUrl(rawUrl));
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return u.pathname.slice(1) || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/').filter(Boolean);
    // /shorts/<id>, /embed/<id>, /live/<id>
    const idx = parts.findIndex((p) => ['shorts', 'embed', 'live', 'v'].includes(p));
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

/** A thumbnail we can derive locally without any network call (YouTube only). */
export function localThumbnail(rawUrl: string): string | null {
  const id = youTubeId(rawUrl);
  if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return null;
}
