import { createClient } from '@/lib/supabase/server-fetch';
import type {
  CategoryFilters,
  CategoriesResponse,
  CategoryByIdResponse,
  CategoryMutationPayload,
  Category
} from './types';

export async function getCategories(filters: CategoryFilters): Promise<CategoriesResponse> {
  const supabase = await createClient();

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('categories')
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
      categories: []
    };
  }

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Categories fetched successfully',
    total: count ?? 0,
    offset,
    limit,
    categories: (data as Category[]) ?? []
  };
}

export async function getCategoryById(id: string): Promise<CategoryByIdResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

  if (error) {
    return {
      success: false,
      time: new Date().toISOString(),
      message: error.message,
      category: null as unknown as Category
    };
  }

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Category fetched successfully',
    category: data as Category
  };
}

export async function createCategory(
  data: CategoryMutationPayload
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('categories').insert([data]);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Category created successfully' };
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryMutationPayload>
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('categories').update(data).eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Category updated successfully' };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Category deleted successfully' };
}

export async function checkCategorySlugUnique(
  slug: string,
  excludeId?: string
): Promise<{ unique: boolean }> {
  const supabase = await createClient();

  let query = supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { count } = await query;

  return { unique: (count ?? 0) === 0 };
}
