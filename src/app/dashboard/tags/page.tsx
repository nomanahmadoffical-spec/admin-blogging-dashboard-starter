import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import TagListingPage from '@/features/tags/components/tag-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Tags'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Tags'
      pageDescription='Manage post tags'
      pageHeaderAction={
        <Link href='/dashboard/tags/new' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' /> New Tag
        </Link>
      }
    >
      <TagListingPage />
    </PageContainer>
  );
}
