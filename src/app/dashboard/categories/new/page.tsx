import PageContainer from '@/components/layout/page-container';
import CategoryViewPage from '@/features/categories/components/category-view-page';

export const metadata = {
  title: 'Dashboard: New Category'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page() {
  return (
    <PageContainer>
      <CategoryViewPage categoryId='new' />
    </PageContainer>
  );
}
