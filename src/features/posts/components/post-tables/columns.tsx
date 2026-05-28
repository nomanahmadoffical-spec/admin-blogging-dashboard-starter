import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Post } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Post>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<Post, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium line-clamp-1'>{row.getValue('title')}</span>
        <span className='text-muted-foreground text-xs'>{row.original.slug}</span>
      </div>
    ),
    meta: {
      label: 'Title',
      placeholder: 'Search posts...',
      variant: 'text' as const,
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'categories',
    accessorKey: 'categories',
    header: 'Categories',
    enableSorting: false,
    cell: ({ row }) => {
      const categories = row.original.categories ?? [];
      if (categories.length === 0) return null;
      return (
        <div className='flex flex-wrap gap-1'>
          {categories.slice(0, 2).map((cat) => (
            <Badge key={cat.id} variant='outline' className='text-xs'>
              {cat.name}
            </Badge>
          ))}
          {categories.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{categories.length - 2}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    id: 'tags',
    accessorKey: 'tags',
    header: 'Tags',
    enableSorting: false,
    cell: ({ row }) => {
      const tags = row.original.tags ?? [];
      if (tags.length === 0) return null;
      return (
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag.id} variant='secondary' className='text-xs'>
              {tag.name}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant='secondary' className='text-xs'>
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    enableSorting: false,
    header: ({ column }: { column: Column<Post, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Post['status']>();
      const variant = status === 'published' ? 'default' : 'secondary';
      return (
        <Badge variant={variant} className='capitalize'>
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'status',
      variant: 'multiSelect' as const,
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' }
      ]
    }
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Post, unknown> }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<Post['created_at']>();
      return (
        <span className='text-muted-foreground text-sm'>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
