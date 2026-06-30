'use client';

import { useMemo, useState } from 'react';
import VideoCard from '@/components/VideoCard';
import { PLATFORM_OPTIONS } from '@/lib/platform';
import type { Category, VideoWithDetails } from '@/lib/types';

interface LibraryClientProps {
  videos: VideoWithDetails[];
  categories: Category[];
  currentUserId: string;
  isAdmin: boolean;
}

type SortKey = 'recent' | 'favorites';

export default function LibraryClient({
  videos,
  categories,
  currentUserId,
  isAdmin,
}: LibraryClientProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState<SortKey>('recent');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = videos.filter((v) => {
      if (category !== 'all' && v.category_id !== category) return false;
      if (platform !== 'all' && (v.platform || 'other') !== platform) return false;
      if (favoritesOnly && !v.is_favorited) return false;

      if (!q) return true;
      // Search across title, category, tags, platform, coach name.
      const haystack = [
        v.title,
        v.category?.name,
        v.platform,
        v.coach_name,
        v.notes,
        ...v.video_tags.map((t) => t.tag),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    list = [...list].sort((a, b) => {
      if (sort === 'favorites') {
        if (b.favorite_count !== a.favorite_count) {
          return b.favorite_count - a.favorite_count;
        }
      }
      return +new Date(b.created_at) - +new Date(a.created_at);
    });

    return list;
  }, [videos, query, category, platform, sort, favoritesOnly]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-5">
      {/* Search */}
      <div className="mb-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, tag, coach, platform…"
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-base shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand"
        >
          <option value="all">All platforms</option>
          {PLATFORM_OPTIONS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand"
        >
          <option value="recent">Newest first</option>
          <option value="favorites">Most favorited</option>
        </select>

        <button
          type="button"
          onClick={() => setFavoritesOnly((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition ${
            favoritesOnly
              ? 'border-brand bg-orange-50 text-brand'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {favoritesOnly ? '★ My favorites' : '☆ My favorites'}
        </button>

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} {filtered.length === 1 ? 'video' : 'videos'}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <p className="text-3xl">🏀</p>
          <p className="mt-2 text-sm font-medium text-gray-600">No videos found</p>
          <p className="text-xs text-gray-400">
            Try clearing filters, or add the first clip from the Add page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </main>
  );
}
