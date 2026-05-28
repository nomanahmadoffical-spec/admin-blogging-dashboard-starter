import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { postsQueryOptions } from '../api/queries';
import { PostTable } from './post-tables';

export default function PostListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('title');
  const pageLimit = searchParamsCache.get('perPage');
  const status = searchParamsCache.get('status');
  const sort = searchParamsCache.get('sort');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status && { status }),
    ...(sort && { sort })
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(postsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostTable />
    </HydrationBoundary>
  );
}
