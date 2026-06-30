'use client';

import { useState } from 'react';
import { PLATFORMS, type Platform } from '@/lib/platform';
import { toggleFavorite, deleteVideo } from '@/app/actions';
import type { VideoWithDetails } from '@/lib/types';

interface VideoCardProps {
  video: VideoWithDetails;
  currentUserId: string;
  isAdmin: boolean;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function VideoCard({ video, currentUserId, isAdmin }: VideoCardProps) {
  const [imgError, setImgError] = useState(false);
  const platformMeta = PLATFORMS[(video.platform as Platform) || 'other'] ?? PLATFORMS.other;
  const canDelete = isAdmin || video.added_by === currentUserId;
  const title = video.title?.trim() || video.url;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      {/* Thumbnail — clicking opens the original link in a new tab */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video w-full overflow-hidden bg-gray-100"
      >
        {video.thumbnail_url && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail_url}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100 text-4xl">
            🏀
          </div>
        )}
        <span
          className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[11px] font-semibold ${platformMeta.badge}`}
        >
          {platformMeta.label}
        </span>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
          Open ↗
        </span>
      </a>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-brand"
          >
            {title}
          </a>
        </div>

        {video.category?.name && (
          <span className="w-fit rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-brand">
            {video.category.name}
          </span>
        )}

        {video.notes && (
          <p className="line-clamp-2 text-xs text-gray-500">{video.notes}</p>
        )}

        {video.video_tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.video_tags.slice(0, 5).map((t, i) => (
              <span
                key={`${t.tag}-${i}`}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
              >
                #{t.tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-2 text-[11px] text-gray-400">
          <span className="truncate">
            {video.coach_name ? `By ${video.coach_name}` : 'By coach'} · {formatDate(video.created_at)}
          </span>

          <div className="flex items-center gap-1">
            {/* Favorite toggle — once per coach, shows group count */}
            <form action={toggleFavorite}>
              <input type="hidden" name="video_id" value={video.id} />
              <input type="hidden" name="is_favorited" value={String(video.is_favorited)} />
              <button
                type="submit"
                aria-label={video.is_favorited ? 'Remove favorite' : 'Add favorite'}
                title="Staff favorites"
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold transition ${
                  video.is_favorited
                    ? 'bg-orange-100 text-brand'
                    : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-brand'
                }`}
              >
                <span>{video.is_favorited ? '★' : '☆'}</span>
                <span>{video.favorite_count}</span>
              </button>
            </form>

            {canDelete && (
              <form
                action={deleteVideo}
                onSubmit={(e) => {
                  if (!confirm('Remove this video from the library?')) e.preventDefault();
                }}
              >
                <input type="hidden" name="video_id" value={video.id} />
                <button
                  type="submit"
                  aria-label="Delete video"
                  title="Remove video"
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  🗑
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
