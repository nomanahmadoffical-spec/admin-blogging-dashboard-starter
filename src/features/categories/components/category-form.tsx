'use client';

import { useState, useCallback } from 'react';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCategoryMutation, updateCategoryMutation } from '../api/mutations';
import type { Category } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { categorySchema, type CategoryFormValues } from '@/features/categories/schemas/category';
import * as z from 'zod';

interface CategoryFormProps {
  initialData: Category | null;
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

export default function CategoryForm({ initialData, pageTitle }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const createMutation = useMutation({
    ...createCategoryMutation,
    onSuccess: () => {
      toast.success('Category created successfully');
      router.push('/dashboard/categories');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create category');
    }
  });

  const updateMutation = useMutation({
    ...updateCategoryMutation,
    onSuccess: () => {
      toast.success('Category updated successfully');
      router.push('/dashboard/categories');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update category');
    }
  });

  const formApi = useAppForm({
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? ''
    } as CategoryFormValues,
    validators: {
      onSubmit: categorySchema
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

  const { FormTextField } = useFormFields<CategoryFormValues>();

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
              placeholder='Enter category name'
              validators={{
                onBlur: z.string().min(1, 'Name is required')
              }}
              onBlurCapture={handleNameBlur}
            />

            <FormTextField
              name='slug'
              label='Slug'
              required
              placeholder='category-slug'
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
                {isPending ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
              </formApi.SubmitButton>
            </div>
          </formApi.Form>
        </formApi.AppForm>
      </CardContent>
    </Card>
  );
}
