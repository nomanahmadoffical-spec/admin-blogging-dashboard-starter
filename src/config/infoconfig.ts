import type { InfobarContent } from '@/components/ui/infobar';

export const workspacesInfoContent: InfobarContent = {
  title: 'Workspaces Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Workspaces page allows you to manage your workspaces and switch between them. This feature requires custom implementation with Supabase.',
      links: [
        {
          title: 'Supabase Documentation',
          url: 'https://supabase.com/docs'
        }
      ]
    },
    {
      title: 'Creating Workspaces',
      description:
        'To add workspace support, create a workspaces table in Supabase and link it to users via memberships.',
      links: []
    },
    {
      title: 'Switching Workspaces',
      description:
        'Workspace switching requires custom implementation to maintain active workspace context.',
      links: []
    },
    {
      title: 'Workspace Features',
      description:
        'Each workspace operates independently with its own team members, roles, and settings.',
      links: []
    },
    {
      title: 'Server-Side Permission Checks',
      description:
        'Implement server-side permission checks using Supabase RLS (Row Level Security) policies.',
      links: []
    }
  ]
};

export const teamInfoContent: InfobarContent = {
  title: 'Team Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Team Management page allows you to manage your workspace team. This requires custom Supabase implementation.',
      links: [
        {
          title: 'Supabase Documentation',
          url: 'https://supabase.com/docs'
        }
      ]
    },
    {
      title: 'Managing Team Members',
      description:
        'Add team management by creating a team_members table linked to users and workspaces.',
      links: []
    },
    {
      title: 'Roles and Permissions',
      description:
        'Configure roles and permissions using Supabase RLS policies for your application.',
      links: []
    },
    {
      title: 'Security Settings',
      description: 'Implement security settings using Supabase authentication and RLS policies.',
      links: []
    },
    {
      title: 'Organization Settings',
      description: 'Configure workspace settings in your Supabase database.',
      links: []
    },
    {
      title: 'Navigation RBAC System',
      description:
        'The application includes navigation filtering via the `useNav` hook. Update `src/config/nav-config.ts` to configure access properties.',
      links: []
    }
  ]
};

export const billingInfoContent: InfobarContent = {
  title: 'Billing & Plans',
  sections: [
    {
      title: 'Overview',
      description:
        'The Billing page allows you to manage subscriptions. For production, integrate with Stripe or another payment provider.',
      links: [
        {
          title: 'Stripe Documentation',
          url: 'https://stripe.com/docs'
        }
      ]
    },
    {
      title: 'Available Plans',
      description: 'Plans and pricing are managed through your payment provider, not Supabase.',
      links: []
    },
    {
      title: 'Plan Features',
      description: 'Implement plan-based feature access using custom fields in your users table.',
      links: []
    },
    {
      title: 'Access Control',
      description: 'Plan and feature access can be checked server-side in your API routes.',
      links: []
    },
    {
      title: 'Setup Requirements',
      description: 'To enable billing, set up a Stripe account and configure webhook endpoints.',
      links: [
        {
          title: 'Stripe Webhooks',
          url: 'https://stripe.com/docs/webhooks'
        }
      ]
    }
  ]
};

export const productInfoContent: InfobarContent = {
  title: 'Product Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Products page allows you to manage your product catalog. You can view all products in a table format with server-side functionality including sorting, filtering, pagination, and search capabilities. Use the "Add New" button to create new products.',
      links: [
        {
          title: 'Product Management Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Adding Products',
      description:
        'To add a new product, click the "Add New" button in the page header. You will be taken to a form where you can enter product details including name, description, price, category, and upload product images.',
      links: [
        {
          title: 'Adding Products Documentation',
          url: '#'
        }
      ]
    },
    {
      title: 'Editing Products',
      description:
        'You can edit existing products by clicking on a product row in the table. This will open the product edit form where you can modify any product information. Changes are saved automatically when you submit the form.',
      links: [
        {
          title: 'Editing Products Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Deleting Products',
      description:
        'Products can be deleted from the product listing table. Click the delete action for the product you want to remove. You will be asked to confirm the deletion before the product is permanently removed from your catalog.',
      links: [
        {
          title: 'Product Deletion Policy',
          url: '#'
        }
      ]
    },
    {
      title: 'Table Features',
      description:
        'The product table includes several powerful features to help you manage large product catalogs efficiently. You can sort columns by clicking on column headers, filter products using the filter controls, navigate through pages using pagination, and quickly find products using the search functionality.',
      links: [
        {
          title: 'Table Features Documentation',
          url: '#'
        },
        {
          title: 'Sorting and Filtering Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Product Fields',
      description:
        'Each product can have the following fields: Name (required), Description (optional text), Price (numeric value), Category (for organizing products), and Image Upload (for product photos). All fields can be edited when creating or updating a product.',
      links: [
        {
          title: 'Product Fields Specification',
          url: '#'
        }
      ]
    }
  ]
};
