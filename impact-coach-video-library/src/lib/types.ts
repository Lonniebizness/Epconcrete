export type Role = 'coach' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface VideoTag {
  id: string;
  video_id: string;
  tag: string;
}

export interface Video {
  id: string;
  url: string;
  title: string | null;
  platform: string | null;
  thumbnail_url: string | null;
  notes: string | null;
  category_id: string | null;
  added_by: string | null;
  coach_name: string | null;
  created_at: string;
}

// Shape returned by the library query (video joined with related data + stats).
export interface VideoWithDetails extends Video {
  category: { name: string } | null;
  video_tags: { tag: string }[];
  favorites: { count: number }[];
  // Derived client-side:
  favorite_count: number;
  is_favorited: boolean;
}
