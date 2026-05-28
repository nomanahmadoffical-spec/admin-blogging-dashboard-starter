import { queryOptions } from '@tanstack/react-query';
import { getPosts, getPostById } from '../actions';
import type { Post, PostFilters } from './types';

export type { Post };

export const postKeys = {
  all: ['posts'] as const,
  list: (filters: PostFilters) => [...postKeys.all, 'list', filters] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const
};

export const postsQueryOptions = (filters: PostFilters) =>
  queryOptions({
    queryKey: postKeys.list(filters),
    queryFn: () => getPosts(filters)
  });

export const postByIdOptions = (id: string) =>
  queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id)
  });
