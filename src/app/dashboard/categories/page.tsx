import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import CategoryListingPage from '@/features/categories/components/category-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Categories'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Categories'
      pageDescription='Manage post categories'
      pageHeaderAction={
        <Link
          href='/dashboard/categories/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> New Category
        </Link>
      }
    >
      <CategoryListingPage />
    </PageContainer>
  );
}
