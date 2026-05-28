'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Tag } from '../api/types';
import { notFound } from 'next/navigation';
import TagForm from './tag-form';
import { tagByIdOptions } from '../api/queries';

type TTagViewPageProps = {
  tagId: string;
};

export default function TagViewPage({ tagId }: TTagViewPageProps) {
  if (tagId === 'new') {
    return <TagForm initialData={null} pageTitle='Create New Tag' />;
  }

  return <EditTagView tagId={tagId} />;
}

function EditTagView({ tagId }: { tagId: string }) {
  const { data } = useSuspenseQuery(tagByIdOptions(tagId));

  if (!data?.success || !data?.tag) {
    notFound();
  }

  return <TagForm initialData={data.tag as Tag} pageTitle='Edit Tag' />;
}
