'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addVideo, type ActionResult } from '@/app/actions';
import {
  detectPlatform,
  PLATFORMS,
  PLATFORM_OPTIONS,
  localThumbnail,
  type Platform,
} from '@/lib/platform';
import type { Category } from '@/lib/types';

interface AddVideoFormProps {
  categories: Category[];
  coachName: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand py-3 font-semibold text-white shadow transition hover:bg-brand-dark disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Save to library'}
    </button>
  );
}

const initialState: ActionResult = {};

export default function AddVideoForm({ categories, coachName }: AddVideoFormProps) {
  const [state, formAction] = useFormState(addVideo, initialState);

  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>('other');
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [fetching, setFetching] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  // When the URL changes: detect platform instantly, then fetch metadata.
  useEffect(() => {
    if (!url.trim()) {
      setPlatform('other');
      return;
    }
    setPlatform(detectPlatform(url));

    // Instant local YouTube thumbnail.
    const local = localThumbnail(url);
    if (local && !thumbnail) setThumbnail(local);

    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        setFetching(true);
        const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.platform) setPlatform(data.platform);
          if (data.title && !title) setTitle(data.title);
          if (data.thumbnail_url) setThumbnail(data.thumbnail_url);
        }
      } catch {
        /* best-effort only */
      } finally {
        setFetching(false);
      }
    }, 600);

    return () => clearTimeout(debounce.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const platformMeta = PLATFORMS[platform];

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      {/* URL */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Video link *</label>
        <input
          name="url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand focus:ring-2 focus:ring-orange-200"
        />
        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
          <span
            className={`rounded px-1.5 py-0.5 font-semibold ${platformMeta.badge}`}
          >
            {platformMeta.label}
          </span>
          {fetching ? <span>Fetching preview…</span> : <span>Auto-detected</span>}
        </div>
      </div>

      {/* Thumbnail preview */}
      {thumbnail && (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnail} alt="preview" className="aspect-video w-full object-cover" />
        </div>
      )}
      <input type="hidden" name="thumbnail_url" value={thumbnail} />
      {/* platform select lets the coach override auto-detection */}
      <input type="hidden" name="platform" value={platform} />

      {/* Title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 2-ball dribbling series"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Category + platform override */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category_id"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand"
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
        <input
          name="tags"
          type="text"
          placeholder="comma,separated,tags"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand focus:ring-2 focus:ring-orange-200"
        />
        <p className="mt-1 text-xs text-gray-400">Separate with commas, e.g. crossover, U12, drill</p>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Why is this useful? When would you run it?"
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Coach name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Saved by</label>
        <input
          name="coach_name"
          type="text"
          defaultValue={coachName}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
