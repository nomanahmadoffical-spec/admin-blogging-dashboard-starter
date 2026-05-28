'use server';

import { createClient } from '@/lib/supabase/server-fetch';
import type {
  PostFilters,
  PostsResponse,
  PostByIdResponse,
  PostMutationPayload,
  Post
} from './api/types';

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

  const posts = (data as Post[]) ?? [];

  // Fetch categories and tags for each post
  const postsWithRelations = await Promise.all(
    posts.map(async (post) => {
      const [categoriesResult, tagsResult] = await Promise.all([
        supabase
          .from('post_categories')
          .select('category_id ( id, name, slug )')
          .eq('post_id', post.id),
        supabase.from('post_tags').select('tag_id ( id, name, slug )').eq('post_id', post.id)
      ]);

      return {
        ...post,
        categories: (
          (categoriesResult.data as unknown as {
            category_id: { id: string; name: string; slug: string };
          }[]) ?? []
        ).map((c) => c.category_id),
        tags: (
          (tagsResult.data as unknown as {
            tag_id: { id: string; name: string; slug: string };
          }[]) ?? []
        ).map((t) => t.tag_id)
      };
    })
  );

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Posts fetched successfully',
    total_posts: count ?? 0,
    offset,
    limit,
    posts: postsWithRelations
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

  const post = data as Post;

  // Fetch related categories and tags
  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from('post_categories').select('category_id ( id, name, slug )').eq('post_id', id),
    supabase.from('post_tags').select('tag_id ( id, name, slug )').eq('post_id', id)
  ]);

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Post fetched successfully',
    post: {
      ...post,
      categories: (
        (categoriesResult.data as unknown as {
          category_id: { id: string; name: string; slug: string };
        }[]) ?? []
      ).map((c) => c.category_id),
      tags: (
        (tagsResult.data as unknown as { tag_id: { id: string; name: string; slug: string } }[]) ??
        []
      ).map((t) => t.tag_id)
    }
  };
}

export async function createPost(
  data: PostMutationPayload
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { categoryIds, tagIds, ...postData } = data;

  const { error } = await supabase.from('posts').insert([postData]);

  if (error) {
    return { success: false, message: error.message };
  }

  // Get the created post id (most recent by this user)
  const { data: createdPost } = await supabase
    .from('posts')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!createdPost) {
    return { success: false, message: 'Post created but failed to get ID' };
  }

  // Insert junction records
  if (categoryIds && categoryIds.length > 0) {
    const categoryRecords = categoryIds.map((categoryId) => ({
      post_id: createdPost.id,
      category_id: categoryId
    }));
    const { error: catError } = await supabase.from('post_categories').insert(categoryRecords);
    if (catError) {
      return { success: false, message: `Post created but categories failed: ${catError.message}` };
    }
  }

  if (tagIds && tagIds.length > 0) {
    const tagRecords = tagIds.map((tagId) => ({
      post_id: createdPost.id,
      tag_id: tagId
    }));
    const { error: tagError } = await supabase.from('post_tags').insert(tagRecords);
    if (tagError) {
      return { success: false, message: `Post created but tags failed: ${tagError.message}` };
    }
  }

  return { success: true, message: 'Post created successfully' };
}

export async function updatePost(
  id: string,
  data: Partial<PostMutationPayload>
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { categoryIds, tagIds, ...postData } = data;

  // Update main post fields
  const { error } = await supabase.from('posts').update(postData).eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  // Replace categories: delete all existing, insert new
  if (categoryIds !== undefined) {
    await supabase.from('post_categories').delete().eq('post_id', id);
    if (categoryIds.length > 0) {
      const categoryRecords = categoryIds.map((categoryId) => ({
        post_id: id,
        category_id: categoryId
      }));
      const { error: catError } = await supabase.from('post_categories').insert(categoryRecords);
      if (catError) {
        return {
          success: false,
          message: `Post updated but categories failed: ${catError.message}`
        };
      }
    }
  }

  // Replace tags: delete all existing, insert new
  if (tagIds !== undefined) {
    await supabase.from('post_tags').delete().eq('post_id', id);
    if (tagIds.length > 0) {
      const tagRecords = tagIds.map((tagId) => ({
        post_id: id,
        tag_id: tagId
      }));
      const { error: tagError } = await supabase.from('post_tags').insert(tagRecords);
      if (tagError) {
        return { success: false, message: `Post updated but tags failed: ${tagError.message}` };
      }
    }
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
