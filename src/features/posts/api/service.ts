import { createClient } from '@/lib/supabase/server';
import type {
  PostFilters,
  PostsResponse,
  PostByIdResponse,
  PostMutationPayload,
  Post
} from './types';

export async function getPosts(filters: PostFilters): Promise<PostsResponse> {
  const supabase = await createClient();

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.sort) {
    const [field, direction] = filters.sort.replace(/"/g, '').split(':');
    query = query.order(field as keyof Post, { ascending: direction === 'asc' });
  }

  const { data, error, count } = await query;

  if (error) {
    return {
      success: false,
      time: new Date().toISOString(),
      message: error.message,
      total_posts: 0,
      offset,
      limit,
      posts: []
    };
  }

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Posts fetched successfully',
    total_posts: count ?? 0,
    offset,
    limit,
    posts: (data as Post[]) ?? []
  };
}

export async function getPostById(id: string): Promise<PostByIdResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

  if (error) {
    return {
      success: false,
      time: new Date().toISOString(),
      message: error.message,
      post: null as unknown as Post
    };
  }

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Post fetched successfully',
    post: data as Post
  };
}

export async function createPost(
  data: PostMutationPayload
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('posts').insert([data]);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Post created successfully' };
}

export async function updatePost(
  id: string,
  data: Partial<PostMutationPayload>
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('posts').update(data).eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Post updated successfully' };
}

export async function deletePost(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Post deleted successfully' };
}

export async function checkSlugUnique(
  slug: string,
  excludeId?: string
): Promise<{ unique: boolean }> {
  const supabase = await createClient();

  let query = supabase.from('posts').select('id', { count: 'exact', head: true }).eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { count } = await query;

  return { unique: (count ?? 0) === 0 };
}
