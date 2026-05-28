import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { categoryByIdOptions } from '@/features/categories/api/queries';
import PageContainer from '@/components/layout/page-container';
import CategoryViewPage from '@/features/categories/components/category-view-page';

export const metadata = {
  title: 'Dashboard : Category Edit'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(categoryByIdOptions(params.id));

  return (
    <PageContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryViewPage categoryId={params.id} />
      </HydrationBoundary>
    </PageContainer>
  );
}
