import { createClient } from '@/lib/supabase/server-fetch';
import type { TagFilters, TagsResponse, TagByIdResponse, TagMutationPayload, Tag } from './types';

export async function getTags(filters: TagFilters): Promise<TagsResponse> {
  const supabase = await createClient();

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('tags')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return {
      success: false,
      time: new Date().toISOString(),
      message: error.message,
      total: 0,
      offset,
      limit,
      tags: []
    };
  }

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Tags fetched successfully',
    total: count ?? 0,
    offset,
    limit,
    tags: (data as Tag[]) ?? []
  };
}

export async function getTagById(id: string): Promise<TagByIdResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('tags').select('*').eq('id', id).single();

  if (error) {
    return {
      success: false,
      time: new Date().toISOString(),
      message: error.message,
      tag: null as unknown as Tag
    };
  }

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Tag fetched successfully',
    tag: data as Tag
  };
}

export async function createTag(
  data: TagMutationPayload
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('tags').insert([data]);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Tag created successfully' };
}

export async function updateTag(
  id: string,
  data: Partial<TagMutationPayload>
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('tags').update(data).eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Tag updated successfully' };
}

export async function deleteTag(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('tags').delete().eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Tag deleted successfully' };
}

export async function checkTagSlugUnique(
  slug: string,
  excludeId?: string
): Promise<{ unique: boolean }> {
  const supabase = await createClient();

  let query = supabase.from('tags').select('id', { count: 'exact', head: true }).eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { count } = await query;

  return { unique: (count ?? 0) === 0 };
}
