import { queryOptions } from '@tanstack/react-query';
import { getTags, getTagById } from '../actions';
import type { Tag, TagFilters } from './types';

export type { Tag };

export const tagKeys = {
  all: ['tags'] as const,
  list: (filters: TagFilters) => [...tagKeys.all, 'list', filters] as const,
  detail: (id: string) => [...tagKeys.all, 'detail', id] as const
};

export const tagsQueryOptions = (filters: TagFilters) =>
  queryOptions({
    queryKey: tagKeys.list(filters),
    queryFn: () => getTags(filters)
  });

export const tagByIdOptions = (id: string) =>
  queryOptions({
    queryKey: tagKeys.detail(id),
    queryFn: () => getTagById(id)
  });
