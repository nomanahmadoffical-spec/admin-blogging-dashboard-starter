'use client';

import { useState, useCallback } from 'react';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createTagMutation, updateTagMutation } from '../api/mutations';
import type { Tag } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { tagSchema, type TagFormValues } from '@/features/tags/schemas/tag';
import * as z from 'zod';

interface TagFormProps {
  initialData: Tag | null;
  pageTitle: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function TagForm({ initialData, pageTitle }: TagFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const createMutation = useMutation({
    ...createTagMutation,
    onSuccess: () => {
      toast.success('Tag created successfully');
      router.push('/dashboard/tags');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create tag');
    }
  });

  const updateMutation = useMutation({
    ...updateTagMutation,
    onSuccess: () => {
      toast.success('Tag updated successfully');
      router.push('/dashboard/tags');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update tag');
    }
  });

  const formApi = useAppForm({
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? ''
    } as TagFormValues,
    validators: {
      onSubmit: tagSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        slug: value.slug
      };

      if (isEdit && initialData) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField } = useFormFields<TagFormValues>();

  const handleNameBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!slugManuallyEdited && e.target.value) {
        formApi.setFieldValue('slug', generateSlug(e.target.value));
      }
    },
    [formApi, slugManuallyEdited]
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <formApi.AppForm>
          <formApi.Form className='space-y-8'>
            <FormTextField
              name='name'
              label='Name'
              required
              placeholder='Enter tag name'
              validators={{
                onBlur: z.string().min(1, 'Name is required')
              }}
              onBlurCapture={handleNameBlur}
            />

            <FormTextField
              name='slug'
              label='Slug'
              required
              placeholder='tag-slug'
              validators={{
                onBlur: z
                  .string()
                  .min(1, 'Slug is required')
                  .regex(
                    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    'Slug must be lowercase letters, numbers, and hyphens only'
                  )
              }}
              onChangeCapture={() => setSlugManuallyEdited(true)}
            />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
              <formApi.SubmitButton disabled={isPending}>
                {isPending ? 'Saving...' : isEdit ? 'Update Tag' : 'Create Tag'}
              </formApi.SubmitButton>
            </div>
          </formApi.Form>
        </formApi.AppForm>
      </CardContent>
    </Card>
  );
}
