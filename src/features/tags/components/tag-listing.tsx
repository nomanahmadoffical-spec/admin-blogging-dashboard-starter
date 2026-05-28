import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { tagsQueryOptions } from '../api/queries';
import { TagTable } from './tag-tables';

export default function TagListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sort = searchParamsCache.get('sort');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sort && { sort })
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(tagsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagTable />
    </HydrationBoundary>
  );
}
