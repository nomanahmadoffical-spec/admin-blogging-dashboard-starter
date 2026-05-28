import type { Category } from '@/features/categories/api/types';
import type { Tag } from '@/features/tags/api/types';

// Slim types for what Supabase joins return (only id, name, slug)
export type PostCategory = Pick<Category, 'id' | 'name' | 'slug'>;
export type PostTag = Pick<Tag, 'id' | 'name' | 'slug'>;

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  featured_image_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  categories?: PostCategory[];
  tags?: PostTag[];
};

export type PostFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
};

export type PostsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_posts: number;
  offset: number;
  limit: number;
  posts: Post[];
};

export type PostByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  post: Post;
};

export type PostMutationPayload = {
  title: string;
  slug: string;
  content: string;
  meta_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  featured_image_url?: string | null;
  status: 'draft' | 'published';
  categoryIds?: string[];
  tagIds?: string[];
};
