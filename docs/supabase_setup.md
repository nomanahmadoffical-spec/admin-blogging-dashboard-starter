# Supabase Setup Guide

This guide covers the setup and configuration of Supabase Auth used in this starter template.

## Supabase Project Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings** > **API**
3. Copy your **URL** and **anon/public** key

### Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Auth Features

### Email/Password Authentication

The starter uses email/password authentication via Supabase:

- **Sign Up**: `supabase.auth.signUp()` - creates new user account
- **Sign In**: `supabase.auth.signInWithPassword()` - authenticates existing user
- **Sign Out**: `supabase.auth.signOut()` - clears session

### Session Management

Sessions are handled via cookies using `@supabase/ssr`:

- **Server Components**: Use `createClient()` from `src/lib/supabase/server.ts`
- **Client Components**: Use `createClient()` from `src/lib/supabase/client.ts`
- **Middleware**: `src/middleware.ts` validates sessions on each request

### User Metadata

Access user data:

```typescript
const { data: { user } } = await supabase.auth.getUser();

// user.user_metadata contains custom fields like:
// - full_name
// - avatar_url
// - etc.
```

## Organization/Workspace Features

Supabase doesn't have built-in organizations like Clerk. To add workspace support:

### Option 1: Custom Tables

Create your own workspaces table:

```sql
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table workspace_members (
  workspace_id uuid references workspaces(id),
  user_id uuid references auth.users(id),
  role text default 'member',
  primary key (workspace_id, user_id)
);
```

### Option 2: Row Level Security (RLS)

Use Supabase RLS policies to control access:

```sql
alter table workspaces enable row level security;

create policy "Users can view their workspaces"
  on workspaces for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_id = workspaces.id
      and user_id = auth.uid()
    )
  );
```

## Billing Features

Supabase Auth doesn't include billing. For production apps:

1. Integrate with **Stripe** directly
2. Create a `subscriptions` table in your database
3. Use Stripe webhooks to update subscription status
4. Check subscription status in your API routes

## Migration from Clerk

If migrating from Clerk:

1. Remove `@clerk/nextjs` package
2. Install `@supabase/ssr` and `@supabase/supabase-js`
3. Replace Clerk components with Supabase equivalents
4. Set up environment variables
5. Update middleware for Supabase session validation

### Key Differences

| Clerk Feature | Supabase Equivalent |
|--------------|---------------------|
| `auth()` | `supabase.auth.getUser()` |
| `useUser()` | `supabase.auth.getUser()` |
| `ClerkProvider` | Not needed (middleware handles sessions) |
| `OrganizationList` | Custom table + UI |
| `PricingTable` | Stripe integration |
| `<Protect>` | Custom conditional rendering |
