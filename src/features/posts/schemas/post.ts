import * as z from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be 200 characters or less')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  content: z.string().min(1, 'Content is required'),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
  focus_keyword: z.string().optional(),
  featured_image_url: z.string().url().optional().nullable(),
  status: z.enum(['draft', 'published']),
  categoryIds: z.array(z.string().uuid()).optional(),
  tagIds: z.array(z.string().uuid()).optional()
});

export type PostFormValues = {
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  featured_image_url?: string | null;
  status: 'draft' | 'published';
  categoryIds?: string[];
  tagIds?: string[];
};
