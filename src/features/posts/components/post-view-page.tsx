'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Post } from '../api/types';
import { notFound } from 'next/navigation';
import PostForm from './post-form';
import { postByIdOptions } from '../api/queries';

type TPostViewPageProps = {
  postId: string;
};

export default function PostViewPage({ postId }: TPostViewPageProps) {
  console.log('PostViewPage received postId:', postId);
  if (postId === 'new') {
    return <PostForm initialData={null} pageTitle='Create New Post' />;
  }

  return <EditPostView postId={postId} />;
}

function EditPostView({ postId }: { postId: string }) {
  console.log('EditPostView called with postId:', postId);
  const { data } = useSuspenseQuery(postByIdOptions(postId));
  console.log('useSuspenseQuery data:', data);
  console.log('data.success:', data?.success, 'data.post:', data?.post);

  if (!data?.success || !data?.post) {
    console.log('Calling notFound()');
    notFound();
  }

  console.log('Rendering PostForm with:', data?.post);
  return <PostForm initialData={data?.post as Post} pageTitle='Edit Post' />;
}
