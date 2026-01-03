# Server Components Architecture

This document explains how our Next.js application handles server components, data loading, actions, revalidation, loading states, and layouts.

## Overview

Our application follows Next.js 15's App Router architecture with a focus on server components for optimal performance and SEO. The architecture leverages server-side rendering, server actions for mutations, and intelligent caching strategies.

## Layout Hierarchy

### Root Layout (`app/layout.tsx`)

- **Purpose**: Provides the base HTML structure and global providers
- **Server Component**: Yes (default)
- **Key Features**:
  - Sets up fonts (Geist Sans, Geist Mono)
  - Wraps the entire app in `ReactQueryClientProvider`
  - Includes global toast notifications (`<Toaster />`)
  - Renders `LayoutClientSide` for client-side functionality

### Logged-In Layout (`app/(logged-in)/layout.tsx`)

- **Purpose**: Handles authenticated user layout and data fetching
- **Server Component**: Yes (async function)
- **Key Features**:
  - Fetches user data server-side using `getCurrentUserWithProfile()` from data layer
  - Provides user context to all child pages
  - Renders navigation bar
  - Throws errors for unauthenticated users

### Route Groups

- `(logged-in)`: Protected routes requiring authentication
- `(logged-out)`: Public routes for unauthenticated users

## Data Loading Patterns

### Server-Side Data Fetching

#### 1. Layout-Level Data (`app/(logged-in)/layout.tsx`)

```typescript
export default async function LoggedInLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserWithProfile();
  const userId = user.user?.id;
  if (!userId) throw new Error("User not found");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex container mx-auto py-6 px-4 lg:px-0">
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
```

#### 2. Page-Level Data (`app/(logged-in)/timeline/page.tsx`)

```typescript
export default async function TimelinePage() {
  const user = await getCurrentUserWithProfile();
  const tweets = await getTweetsForTimeline();
  const allProfiles = await getAllProfiles();

  return (
    // Renders with server-fetched data
  );
}
```

### Data Fetching Utilities

#### Data Layer (`data/tweets.ts`, `data/user.ts`)

- Server-only functions marked with `"use server"`
- Direct database operations using Supabase
- Error handling and type safety
- Centralized data fetching including user authentication and profile data
- Functions like `getCurrentUserWithProfile()` for combined user and profile data

## Server Actions for Data Mutations

### Action Structure (`app/(logged-in)/timeline/timeline-actions.ts`)

```typescript
"use server";

export async function createTweetAction(
  tweetText: string,
  userId: string
): Promise<ActionResponse> {
  try {
    await createTweet(tweetText, userId);
    revalidatePath("/", "layout");
    return { success: true, error: "" };
  } catch (error) {
    return {
      success: false,
      error: formatActionErrorMessage(error),
    };
  }
}
```

### Key Features:

- **Server-only**: Marked with `"use server"` directive
- **Error Handling**: Consistent error response format
- **Revalidation**: Automatic cache invalidation using `revalidatePath()`
- **Type Safety**: Strongly typed parameters and responses

### Client-Side Integration

```typescript
"use client";

const onSubmit = async (data: TweetFormType) => {
  startTransaction(async () => {
    const { error } = await createTweetAction(data.tweet_text, userId);
    if (error) {
      toast({ type: "error", message: error });
    } else {
      form.reset();
      toast({ type: "success", message: "Tweet created successfully" });
    }
  });
};
```

## Revalidation Strategy

### Path-Based Revalidation

- **Layout Revalidation**: `revalidatePath("/", "layout")` - Invalidates entire layout cache
- **Page Revalidation**: `revalidatePath("/timeline")` - Invalidates specific page cache
- **Segment Revalidation**: `revalidatePath("/timeline", "page")` - Invalidates page segment only

### When to Revalidate

- **Create Operations**: After creating tweets, comments
- **Delete Operations**: After deleting tweets, comments
- **Update Operations**: After updating user profiles, tweets

### Cache Behavior

- **Static Generation**: Pages are statically generated at build time
- **Dynamic Rendering**: Pages with dynamic data are rendered on each request
- **ISR (Incremental Static Regeneration)**: Pages can be revalidated in the background

## Loading States

### Loading UI (`app/(logged-in)/timeline/loading.tsx`)

```typescript
export default function Loading() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1">
          <Heading2>Timeline</Heading2>
          <FormSkeleton rows={2} />
          <TweetListSkeleton count={3} />
        </div>
        <div className="lg:w-1/3 lg:flex-shrink-0">
          <MainContentWithSidebarSkeleton />
        </div>
      </div>
    </div>
  );
}
```

### Loading Patterns:

1. **Route Loading**: Automatic loading UI for route transitions
2. **Suspense Boundaries**: Granular loading states for components
3. **Skeleton Components**: Reusable loading skeletons in `components/ui/loading-skeletons.tsx`
4. **Pending States**: Client-side pending states using `useTransition()`

### Loading Hierarchy:

- **Layout Loading**: `app/(logged-in)/loading.tsx` (if exists)
- **Page Loading**: `app/(logged-in)/timeline/loading.tsx`
- **Component Loading**: Individual component loading states

## Authentication & Middleware

### Middleware (`middleware.ts`)

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

### Authentication Flow:

1. **Session Management**: Middleware updates user sessions on each request
2. **Route Protection**: Layout-level authentication checks
3. **Error Handling**: Throws errors for unauthenticated users
4. **Client-Side Auth**: React Query for client-side auth state

## Performance Optimizations

### Server Components Benefits:

- **Reduced Bundle Size**: Server components don't ship JavaScript to client
- **Faster Initial Load**: Server-rendered HTML
- **Better SEO**: Fully rendered content for search engines
- **Database Efficiency**: Direct server-to-database connections

### Caching Strategy:

- **Request Deduplication**: Automatic deduplication of identical requests
- **Cache Invalidation**: Strategic revalidation using `revalidatePath()`
- **Static Generation**: Where possible, pages are statically generated

### Client-Side Optimizations:

- **React Query**: Client-side caching and synchronization
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Transition States**: Smooth loading states during mutations

## Error Handling

### Server-Side Errors:

- **Layout Errors**: Thrown in layout components for authentication failures
- **Page Errors**: Thrown in page components for data fetching failures
- **Action Errors**: Returned as structured responses from server actions

### Client-Side Errors:

- **Toast Notifications**: User-friendly error messages
- **Form Validation**: Client-side validation with Zod schemas
- **Fallback UI**: Graceful degradation for failed components

## Best Practices

### Server Components:

- Use server components for data fetching and static content
- Keep client components minimal and focused on interactivity
- Leverage server-side data fetching for SEO and performance

### Actions:

- Always include error handling in server actions
- Use consistent response formats
- Revalidate appropriate paths after mutations

### Loading States:

- Provide immediate feedback for user actions
- Use skeleton components for better perceived performance
- Implement progressive loading for large datasets

### Type Safety:

- Use TypeScript for all server and client code
- Leverage Supabase generated types for database operations
- Implement Zod schemas for form validation

## File Structure Summary

```
app/
├── layout.tsx                    # Root layout with providers
├── layout-client-side.tsx        # Client-side layout logic
├── (logged-in)/
│   ├── layout.tsx               # Authenticated layout
│   ├── loading.tsx              # Loading UI for logged-in routes
│   └── timeline/
│       ├── page.tsx             # Timeline page (server component)
│       ├── loading.tsx          # Timeline-specific loading
│       ├── timeline-actions.ts  # Server actions
│       └── components/          # Client components
├── (logged-out)/
│   └── auth/
│       └── page.tsx             # Public auth page
└── auth/                        # Auth API routes
    ├── confirm/route.ts
    ├── delete-account/route.ts
    └── signout/route.ts

utils/
├── actions-utils.ts             # Action utilities
└── supabase/
    ├── server.ts                # Server Supabase client
    └── supabase-middleware.ts   # Middleware utilities

data/
├── tweets.ts                    # Tweet data operations
└── user.ts                      # User data operations
```

This architecture provides a robust foundation for server-side rendering, efficient data management, and excellent user experience while maintaining type safety and performance.
