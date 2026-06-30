'use client';

import { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions';
import type { Category } from '@/lib/types';

interface CategoryManagerProps {
  categories: Category[];
  counts: Record<string, number>;
}

export default function CategoryManager({ categories, counts }: CategoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Add new */}
      <form
        action={createCategory}
        className="flex gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100"
      >
        <input
          name="name"
          required
          placeholder="New category name"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-brand focus:ring-2 focus:ring-orange-200"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white shadow transition hover:bg-brand-dark"
        >
          Add
        </button>
      </form>

      {/* List */}
      <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {categories.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-gray-400">
            No categories yet.
          </li>
        )}
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-2 px-4 py-3">
            {editingId === c.id ? (
              <form
                action={updateCategory}
                className="flex flex-1 items-center gap-2"
                onSubmit={() => setEditingId(null)}
              >
                <input type="hidden" name="id" value={c.id} />
                <input
                  name="name"
                  defaultValue={c.name}
                  autoFocus
                  required
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-lg px-2 py-1.5 text-sm text-gray-500"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium text-gray-800">{c.name}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {counts[c.id] ?? 0} videos
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(c.id)}
                  className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
                >
                  Edit
                </button>
                <form
                  action={deleteCategory}
                  onSubmit={(e) => {
                    if (!confirm(`Delete "${c.name}"? Videos stay but become uncategorized.`))
                      e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    Delete
                  </button>
                </form>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
