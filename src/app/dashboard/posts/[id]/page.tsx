import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { postByIdOptions } from '@/features/posts/api/queries';
import PageContainer from '@/components/layout/page-container';
import PostViewPage from '@/features/posts/components/post-view-page';

export const metadata = {
  title: 'Dashboard : Post Edit'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  if (params.id !== 'new') {
    void queryClient.prefetchQuery(postByIdOptions(params.id));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostViewPage postId={params.id} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
