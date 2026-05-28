import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { tagByIdOptions } from '@/features/tags/api/queries';
import PageContainer from '@/components/layout/page-container';
import TagViewPage from '@/features/tags/components/tag-view-page';

export const metadata = {
  title: 'Dashboard : Tag Edit'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(tagByIdOptions(params.id));

  return (
    <PageContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TagViewPage tagId={params.id} />
      </HydrationBoundary>
    </PageContainer>
  );
}
