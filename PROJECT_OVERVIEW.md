# Project Overview

## What This Project Is

**Next.js 16 + Shadcn UI Admin Dashboard** — a production-ready starter template for building SaaS admin panels, internal tools, and dashboards.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| UI | Shadcn/ui + Tailwind CSS v4 |
| Auth | **Supabase Auth** (migrated from Clerk) |
| State | TanStack React Query + Zustand |
| Forms | TanStack Form + Zod |
| DB | Supabase (your own project) |
| Error Tracking | Sentry |

## What Changed (Clerk → Supabase Migration)

### Authentication Flow

**Before (Clerk):**
- ClerkProvider wrapped app
- `auth()` and `currentUser()` server-side helpers
- `<SignInButton>`, `<SignOutButton>` components
- Middleware via `clerkMiddleware()`

**After (Supabase):**
- Session handled via `@supabase/ssr` cookies
- `createClient()` from `src/lib/supabase/client.ts` (browser)
- `createClient()` from `src/lib/supabase/server.ts` (server)
- `src/middleware.ts` protects routes
- Custom sign-in/sign-up forms

### Files Created

```
src/lib/supabase/
├── client.ts      # Browser client (createBrowserClient)
├── server.ts     # Server client (createServerClient)
└── middleware.ts # Session validation

src/middleware.ts # Route protection

src/components/
└── user-avatar.tsx # User avatar with Supabase User type

docs/
└── supabase_setup.md # Setup guide
```

### Files Modified

| File | Change |
|------|--------|
| `src/components/layout/providers.tsx` | Removed ClerkProvider |
| `src/components/layout/user-nav.tsx` | Supabase sign-out |
| `src/components/layout/app-sidebar.tsx` | Supabase user context |
| `src/components/org-switcher.tsx` | Simplified user display |
| `src/features/auth/components/sign-in-view.tsx` | Email/password form |
| `src/features/auth/components/sign-up-view.tsx` | Email/password form |
| `src/features/profile/components/profile-view-page.tsx` | Supabase profile |
| `src/app/page.tsx` | Redirect based on Supabase session |
| `src/app/dashboard/page.tsx` | Supabase auth check |
| `src/app/dashboard/billing/page.tsx` | Simplified (billing removed) |
| `src/app/dashboard/exclusive/page.tsx` | Simplified (plans removed) |
| `src/app/dashboard/workspaces/page.tsx` | Simplified (orgs removed) |
| `src/app/dashboard/workspaces/team/**` | Simplified |
| `src/hooks/use-nav.ts` | Removed Clerk hooks |
| `src/config/infoconfig.ts` | Updated docs |
| `src/app/about/page.tsx` | Updated auth text |
| `src/app/privacy-policy/page.tsx` | Updated auth text |
| `src/components/github-stars-button.tsx` | Added 'use client' |
| `env.example.txt` | Supabase env vars |
| `README.md`, `AGENTS.md` | Updated docs |
| `next.config.ts` | Removed Clerk image domains |

### Files Deleted

- `docs/clerk_setup.md` (replaced with `supabase_setup.md`)
- `src/proxy.ts` (Clerk middleware removed)

## Auth Flow

```
User → / → Middleware checks session → Has session? → /dashboard/overview
                                              ↓
                                         No session
                                              ↓
                                    /auth/sign-in

Login → supabase.auth.signInWithPassword() → Sets cookie → /dashboard/overview
Logout → supabase.auth.signOut() → Clears cookie → /auth/sign-in
```

## Features Removed (Require Custom Implementation)

| Feature | Why Removed |
|---------|-------------|
| Organizations/Workspaces | Supabase has no built-in org system. Need custom tables. |
| Team Management | Requires custom tables + memberships |
| Billing/Subscriptions | Requires Stripe integration |
| Plan-gated pages | Requires custom plan column in users table |
| RBAC (org-level) | Requires custom permissions table |

## Features Kept

- Dashboard overview with charts
- Product listing/CRUD with React Query
- Users table with filtering/pagination
- Kanban board (dnd-kit + Zustand)
- Chat UI (Zustand)
- Notifications center
- Multi-theme system (10 themes)
- Forms with TanStack Form + Zod
- Data tables with TanStack Table
- Command+K search bar
- Infobar component

## To Run This Project

```bash
# 1. Install dependencies
npm install

# 2. Create Supabase project
# https://supabase.com

# 3. Copy env vars to .env.local
cp env.example.txt .env.local
# Edit .env.local with your Supabase URL and anon key

# 4. Start dev server
npm run dev
# OR if postinstall fails:
npx next dev

# 5. Open browser
http://localhost:3000
```

## Supabase Setup

1. Create project at https://supabase.com
2. Go to **Settings → API**
3. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Disable email confirmations for testing:
   - Authentication → Providers → Email → **Confirm email = OFF**

## Project Structure

```
src/
├── app/
│   ├── auth/              # Sign in / Sign up pages
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── overview/      # Analytics dashboard
│   │   ├── product/      # Product CRUD
│   │   ├── users/        # Users table
│   │   ├── kanban/        # Task board
│   │   ├── chat/          # Messaging
│   │   ├── notifications/ # Notifications
│   │   ├── workspaces/    # Org management (simplified)
│   │   ├── billing/       # Billing (simplified)
│   │   ├── exclusive/     # Pro content (simplified)
│   │   └── profile/      # User profile
│   └── api/              # API routes
├── components/
│   ├── ui/               # Shadcn components
│   ├── layout/           # Sidebar, header, etc.
│   └── ...               # Other components
├── features/             # Feature-based modules
├── lib/
│   └── supabase/         # Supabase clients
├── hooks/                # Custom hooks
└── config/               # Navigation, infobar configs
```

## API Pattern (Feature Modules)

Each feature follows a 3-file pattern:

```
src/features/<feature>/
├── api/
│   ├── types.ts    # TypeScript types
│   ├── service.ts  # Data access (swap for real backend)
│   └── queries.ts  # React Query options
└── components/     # UI components
```

## Common Issues

**"Async Client Component" error:**
- Make sure components using Supabase client have `'use client'`

**Middleware not redirecting:**
- Check `.env.local` has correct Supabase vars
- Clear cookies and try again

**Build fails:**
- Run `npx tsc --noEmit` to find type errors
- Delete `.next` folder and rebuild

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (Sentry)
NEXT_PUBLIC_SENTRY_DSN=...
```
