'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { createPostMutation, updatePostMutation } from '../api/mutations';
import type { Post } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { createClient } from '@/lib/supabase/client';
import { postSchema, type PostFormValues } from '@/features/posts/schemas/post';
import * as z from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categoriesQueryOptions } from '@/features/categories/api/queries';
import { tagsQueryOptions } from '@/features/tags/api/queries';
import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/features/categories/api/types';
import type { Tag } from '@/features/tags/api/types';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface PostFormProps {
  initialData: Post | null;
  pageTitle: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ContentEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const config = useMemo(
    () => ({
      readonly: false,
      height: 500,
      toolbarButtonSize: 'small' as const,
      placeholder: 'Write your post content here...',
      buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'superscript',
        'subscript',
        '|',
        'ul',
        'ol',
        '|',
        'outdent',
        'indent',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'file',
        'video',
        'table',
        'link',
        '|',
        'align',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'copyformat',
        '|',
        'fullsize',
        'selectall',
        'print',
        '|',
        'about'
      ],
      uploader: {
        insertImageAsBase64URI: true
      },
      image: {
        openOnDblClick: false,
        editSrc: true,
        useImageEditor: true,
        defaultWidth: 300
      },
      font: {
        font: {
          Arial: 'Arial, Helvetica, sans-serif',
          Georgia: 'Georgia, serif',
          Tahoma: 'Tahoma, Geneva, sans-serif',
          'Times New Roman': 'Times New Roman, Times, serif'
        },
        fontsize: {
          '8': '8px',
          '10': '10px',
          '12': '12px',
          '14': '14px',
          '18': '18px',
          '24': '24px',
          '36': '36px'
        }
      },
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_as_html' as const,
      removeEmptyBlocks: false
    }),
    []
  );

  return (
    <div className='space-y-1'>
      <label className='text-sm font-medium leading-none'>Content</label>
      <div className='min-h-100 rounded-md border'>
        <JoditEditor value={value} onChange={onChange} config={config} className='min-h-100' />
      </div>
    </div>
  );
}

function CategoryMultiSelect({
  value,
  onChange
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const { data } = useQuery(categoriesQueryOptions({ limit: 100 }));
  const [open, setOpen] = useState(false);
  const categories = data?.categories ?? [];

  const selectedCategories = categories.filter((c: Category) => value.includes(c.id));

  const toggleCategory = (categoryId: string) => {
    if (value.includes(categoryId)) {
      onChange(value.filter((id) => id !== categoryId));
    } else {
      onChange([...value, categoryId]);
    }
  };

  return (
    <div className='space-y-1'>
      <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
        Categories
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            role='combobox'
            className='w-full justify-start font-normal'
          >
            {selectedCategories.length > 0 ? (
              <div className='flex flex-wrap gap-1'>
                {selectedCategories.slice(0, 3).map((c: Category) => (
                  <Badge key={c.id} variant='secondary' className='text-xs'>
                    {c.name}
                  </Badge>
                ))}
                {selectedCategories.length > 3 && (
                  <Badge variant='secondary' className='text-xs'>
                    +{selectedCategories.length - 3}
                  </Badge>
                )}
              </div>
            ) : (
              <span className='text-muted-foreground'>Select categories...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-0' align='start'>
          <ScrollArea className='max-h-64'>
            {categories.length === 0 ? (
              <p className='p-3 text-sm text-muted-foreground'>No categories found</p>
            ) : (
              categories.map((category: Category) => (
                <div
                  key={category.id}
                  className='flex cursor-pointer items-center gap-2 p-2 hover:bg-muted'
                  onClick={() => toggleCategory(category.id)}
                >
                  <Checkbox
                    checked={value.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <span className='text-sm'>{category.name}</span>
                </div>
              ))
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TagMultiSelect({
  value,
  onChange
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const { data } = useQuery(tagsQueryOptions({ limit: 100 }));
  const [open, setOpen] = useState(false);
  const tags = data?.tags ?? [];

  const selectedTags = tags.filter((t: Tag) => value.includes(t.id));

  const toggleTag = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  return (
    <div className='space-y-1'>
      <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
        Tags
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            role='combobox'
            className='w-full justify-start font-normal'
          >
            {selectedTags.length > 0 ? (
              <div className='flex flex-wrap gap-1'>
                {selectedTags.slice(0, 3).map((t: Tag) => (
                  <Badge key={t.id} variant='outline' className='text-xs'>
                    {t.name}
                  </Badge>
                ))}
                {selectedTags.length > 3 && (
                  <Badge variant='outline' className='text-xs'>
                    +{selectedTags.length - 3}
                  </Badge>
                )}
              </div>
            ) : (
              <span className='text-muted-foreground'>Select tags...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-0' align='start'>
          <ScrollArea className='max-h-64'>
            {tags.length === 0 ? (
              <p className='p-3 text-sm text-muted-foreground'>No tags found</p>
            ) : (
              tags.map((tag: Tag) => (
                <div
                  key={tag.id}
                  className='flex cursor-pointer items-center gap-2 p-2 hover:bg-muted'
                  onClick={() => toggleTag(tag.id)}
                >
                  <Checkbox
                    checked={value.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  />
                  <span className='text-sm'>{tag.name}</span>
                </div>
              ))
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function PostForm({ initialData, pageTitle }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.featured_image_url ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categories?.map((c) => c.id) ?? []
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map((t) => t.id) ?? []
  );

  const createMutation = useMutation({
    ...createPostMutation,
    onSuccess: () => {
      toast.success('Post created successfully');
      router.push('/dashboard/posts');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create post');
    }
  });

  const updateMutation = useMutation({
    ...updatePostMutation,
    onSuccess: () => {
      toast.success('Post updated successfully');
      router.push('/dashboard/posts');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update post');
    }
  });

  const formApi = useAppForm({
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      content: initialData?.content ?? '',
      meta_title: initialData?.meta_title ?? '',
      meta_description: initialData?.meta_description ?? '',
      focus_keyword: initialData?.focus_keyword ?? '',
      featured_image_url: initialData?.featured_image_url ?? null,
      status: initialData?.status ?? 'draft'
    } as PostFormValues,
    validators: {
      onSubmit: postSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        title: value.title,
        slug: value.slug,
        content: value.content,
        meta_title: value.meta_title || null,
        meta_description: value.meta_description || null,
        focus_keyword: value.focus_keyword || null,
        featured_image_url: imageUrl,
        status: value.status,
        categoryIds: selectedCategoryIds,
        tagIds: selectedTagIds
      };

      if (isEdit && initialData) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  // Sync initialData.content to form field after data loads
  useEffect(() => {
    if (initialData?.content !== undefined) {
      formApi.setFieldValue('content', initialData.content);
    }
  }, [initialData?.content, formApi]);

  const { FormTextField, FormTextareaField } = useFormFields<PostFormValues>();

  const handleTitleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!slugManuallyEdited && e.target.value) {
        formApi.setFieldValue('slug', generateSlug(e.target.value));
      }
    },
    [formApi, slugManuallyEdited]
  );

  const handleImageUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('blog-image')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from('blog-image').getPublicUrl(filePath);
      setImageUrl(urlData.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageUrl(null);
  }, []);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const [currentStatus, setCurrentStatus] = useState(initialData?.status ?? 'draft');

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <formApi.AppForm>
          <formApi.Form className='space-y-8'>
            <div className='grid grid-cols-1 gap-6'>
              <FormTextField
                name='title'
                label='Title'
                required
                placeholder='Enter post title'
                validators={{
                  onBlur: z.string().min(1, 'Title is required')
                }}
                onBlurCapture={handleTitleBlur}
              />

              <FormTextField
                name='slug'
                label='Slug'
                required
                placeholder='post-url-slug'
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
            </div>

            <div className='space-y-1'>
              <label className='text-sm font-medium leading-none'>Content</label>
              <ContentEditor
                value={formApi.getFieldValue('content') ?? ''}
                onChange={(val) => formApi.setFieldValue('content', val)}
              />
              {!formApi.getFieldValue('content') && (
                <p className='text-sm text-destructive'>Content is required</p>
              )}
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <CategoryMultiSelect value={selectedCategoryIds} onChange={setSelectedCategoryIds} />
              <TagMultiSelect value={selectedTagIds} onChange={setSelectedTagIds} />
            </div>

            <div className='space-y-4'>
              <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Featured Image
              </label>
              {imageUrl ? (
                <div className='relative inline-block'>
                  <div className='relative h-48 w-full overflow-hidden rounded-lg border'>
                    <img src={imageUrl} alt='Featured' className='h-full w-full object-cover' />
                  </div>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute -right-2 -top-2 h-8 w-8 rounded-full'
                    onClick={handleRemoveImage}
                  >
                    <Icons.close className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    'border-muted-foreground/25 hover:bg-muted/25 flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition',
                    isUploading && 'pointer-events-none opacity-50'
                  )}
                >
                  <label className='flex cursor-pointer flex-col items-center gap-2'>
                    <Icons.upload className='text-muted-foreground h-8 w-8' />
                    <span className='text-muted-foreground text-sm'>
                      {isUploading ? 'Uploading...' : 'Click to upload image'}
                    </span>
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormTextField
                name='meta_title'
                label='Meta Title'
                placeholder='SEO title (max 60 chars)'
                validators={{
                  onBlur: z.string().max(60, 'Meta title must be 60 characters or less')
                }}
              />

              <FormTextField
                name='focus_keyword'
                label='Focus Keyword'
                placeholder='Primary keyword for SEO'
              />
            </div>

            <FormTextareaField
              name='meta_description'
              label='Meta Description'
              placeholder='SEO description (max 160 chars)'
              rows={3}
              validators={{
                onBlur: z.string().max(160, 'Meta description must be 160 characters or less')
              }}
            />

            <div className='flex items-center gap-3'>
              <Switch
                id='status'
                checked={currentStatus === 'published'}
                onCheckedChange={(checked) => {
                  const newStatus = checked ? 'published' : 'draft';
                  setCurrentStatus(newStatus);
                  formApi.setFieldValue('status', newStatus);
                }}
              />
              <label
                htmlFor='status'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                {currentStatus === 'published' ? 'Published' : 'Draft'}
              </label>
            </div>

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
              <formApi.SubmitButton disabled={isPending}>
                {isPending ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
              </formApi.SubmitButton>
            </div>
          </formApi.Form>
        </formApi.AppForm>
      </CardContent>
    </Card>
  );
}
