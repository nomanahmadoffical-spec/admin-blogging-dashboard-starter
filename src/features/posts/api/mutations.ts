import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createPost, updatePost, deletePost } from '../actions';
import { postKeys } from './queries';
import type { PostMutationPayload } from './types';

export const createPostMutation = mutationOptions({
  mutationFn: (data: PostMutationPayload) => createPost(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  }
});

export const updatePostMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: Partial<PostMutationPayload> }) =>
    updatePost(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  }
});

export const deletePostMutation = mutationOptions({
  mutationFn: (id: string) => deletePost(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  }
});
