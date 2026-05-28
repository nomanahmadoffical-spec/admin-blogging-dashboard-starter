import PageContainer from '@/components/layout/page-container';
import TagViewPage from '@/features/tags/components/tag-view-page';

export const metadata = {
  title: 'Dashboard: New Tag'
};

export default async function Page() {
  return (
    <PageContainer>
      <TagViewPage tagId='new' />
    </PageContainer>
  );
}
