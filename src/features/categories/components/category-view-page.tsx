'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Category } from '../api/types';
import { notFound } from 'next/navigation';
import CategoryForm from './category-form';
import { categoryByIdOptions } from '../api/queries';

type TCategoryViewPageProps = {
  categoryId: string;
};

export default function CategoryViewPage({ categoryId }: TCategoryViewPageProps) {
  if (categoryId === 'new') {
    return <CategoryForm initialData={null} pageTitle='Create New Category' />;
  }

  return <EditCategoryView categoryId={categoryId} />;
}

function EditCategoryView({ categoryId }: { categoryId: string }) {
  const { data } = useSuspenseQuery(categoryByIdOptions(categoryId));

  if (!data?.success || !data?.category) {
    notFound();
  }

  return <CategoryForm initialData={data.category as Category} pageTitle='Edit Category' />;
}
