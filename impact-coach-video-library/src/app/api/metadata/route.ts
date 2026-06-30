import { NextResponse } from 'next/server';
import { detectPlatform, normalizeUrl, localThumbnail } from '@/lib/platform';

// Best-effort metadata lookup. Always returns 200 with whatever it could find;
// the client treats every field as optional. Never throws to the caller.
export const dynamic = 'force-dynamic';

interface Meta {
  platform: string;
  title: string | null;
  thumbnail_url: string | null;
}

// Public oEmbed endpoints keyed by platform. These return JSON with
// `title` and `thumbnail_url`. Not every platform supports it (TikTok/YouTube
// do without auth; Instagram/Facebook require a token, so we skip them).
const OEMBED: Record<string, (u: string) => string> = {
  youtube: (u) => `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(u)}`,
  vimeo: (u) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(u)}`,
  tiktok: (u) => `https://www.tiktok.com/oembed?url=${encodeURIComponent(u)}`,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('url');

  if (!raw) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  const url = normalizeUrl(raw);
  const platform = detectPlatform(url);

  const meta: Meta = {
    platform,
    title: null,
    thumbnail_url: localThumbnail(url), // instant YouTube thumb, if applicable
  };

  const endpoint = OEMBED[platform]?.(url);
  if (endpoint) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: { 'User-Agent': 'ImpactCoachVideoLibrary/1.0' },
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = (await res.json()) as { title?: string; thumbnail_url?: string };
        if (data.title) meta.title = data.title;
        if (data.thumbnail_url) meta.thumbnail_url = data.thumbnail_url;
      }
    } catch {
      // Network/CORS/timeout — fall back to whatever we already have.
    }
  }

  return NextResponse.json(meta);
}
