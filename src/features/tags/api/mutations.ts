import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createTag, updateTag, deleteTag } from '../actions';
import { tagKeys } from './queries';
import type { TagMutationPayload } from './types';

export const createTagMutation = mutationOptions({
  mutationFn: (data: TagMutationPayload) => createTag(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: tagKeys.all });
  }
});

export const updateTagMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: Partial<TagMutationPayload> }) =>
    updateTag(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: tagKeys.all });
  }
});

export const deleteTagMutation = mutationOptions({
  mutationFn: (id: string) => deleteTag(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: tagKeys.all });
  }
});
