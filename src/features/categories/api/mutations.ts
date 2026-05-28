import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createCategory, updateCategory, deleteCategory } from '../actions';
import { categoryKeys } from './queries';
import type { CategoryMutationPayload } from './types';

export const createCategoryMutation = mutationOptions({
  mutationFn: (data: CategoryMutationPayload) => createCategory(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: categoryKeys.all });
  }
});

export const updateCategoryMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: Partial<CategoryMutationPayload> }) =>
    updateCategory(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: categoryKeys.all });
  }
});

export const deleteCategoryMutation = mutationOptions({
  mutationFn: (id: string) => deleteCategory(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: categoryKeys.all });
  }
});
