# SEO Strategy

Our SEO setup leverages Next.js 15’s native metadata, sitemap, and robots integration, with a server-first architecture for optimal crawlability and performance.

## Overview

- **Server-first rendering**: Server Components deliver complete HTML for better crawlability and Core Web Vitals
- **Centralized metadata**: Reusable helpers ensure consistent titles, OpenGraph, Twitter, and robots
- **Automated crawl control**: Native `sitemap.xml` and `robots.txt` are generated at runtime

## Core Implementation

### Centralized metadata utilities (`utils/seo-utils.ts`)

- **Exports**: `appConstants`, `robotsConfig`, `pageMetadata`, `layoutMetadata`
- **Helpers**: `createPageMetadata(pageKey, overrides?)`, `createAuthenticatedPageMetadata(title, description, overrides?)`

Minimal examples:

```typescript
// app/layout.tsx
import { appConstants, layoutMetadata } from "@/utils/seo-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...layoutMetadata,
  publisher: appConstants.author,
  metadataBase: new URL(appConstants.appUrl),
  formatDetection: { email: false, address: false, telephone: false },
};
```

```typescript
// app/page.tsx (public)
import { createPageMetadata } from "@/utils/seo-utils";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata("default");
```

```typescript
// app/(logged-out)/auth/page.tsx (public)
import { appConstants, createPageMetadata } from "@/utils/seo-utils";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata("auth", {
  openGraph: { url: `${appConstants.appUrl}/auth` },
});
```

```typescript
// app/(logged-in)/settings/page.tsx (protected)
import { createPageMetadata } from "@/utils/seo-utils";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata("settings");
```

```typescript
// app/(logged-in)/user/[id]/page.tsx (dynamic)
import { createPageMetadata, createAuthenticatedPageMetadata } from "@/utils/seo-utils";
import type { Metadata } from "next";
import { getProfileByUserId } from "@/data/user";
import { createClient } from "@/utils/supabase/supabase-server-client";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = await createClient();
  const profile = await getProfileByUserId(id, db);
  if (!profile) return createPageMetadata("userProfile");

  const userName = (profile.email || "User").split("@")[0];
  return createAuthenticatedPageMetadata(
    `${userName}'s Profile`,
    `View ${userName}'s profile and tweets. See their latest posts and activity.`
  );
}
```

Notes:

- Layout uses a title template; helper functions return plain titles (no double suffix)
- Protected routes keep minimal SEO; access control and robots rules prevent crawling

## Crawling & Indexing

This route programmatically generates `robots.txt` at runtime. It allows crawlers to access public pages while disallowing protected/internal paths (API, app routes, framework internals). It also advertises the `sitemap.xml` location for efficient URL discovery.

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/*",
        "/admin/*",
        "/settings/*",
        "/timeline/*",
        "/user/*",
        "/errors-testing/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

This route programmatically generates `sitemap.xml` at runtime. It enumerates public URLs and includes `lastModified`, `changeFrequency`, and `priority` so search engines can efficiently discover and prioritize content. The `baseUrl` uses `NEXT_PUBLIC_APP_URL` (with a localhost fallback) to ensure absolute URLs.

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/auth`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
```

## Next.js Configuration (SEO-related)

```typescript
// next.config.ts
import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";
import { enablePostHog } from "@/utils/global-utils";

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

let nextConfig = baseConfig;
if (enablePostHog) {
  nextConfig = withPostHogConfig(baseConfig, {
    personalApiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || "", // todo: update
    envId: process.env.POSTHOG_ENV_ID || "",
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "",
    sourcemaps: {
      enabled: false, // Disabled for security & performance - prevents exposing source code in production
      deleteAfterUpload: true,
    },
  });
}
export default nextConfig;
```

## File Pointers

```
app/
├── layout.tsx                     # Base metadata using layoutMetadata
├── page.tsx                       # Homepage using createPageMetadata
├── not-found.tsx                  # 404 page using createPageMetadata
├── (logged-in)/...                # Protected pages with minimal SEO
└── (logged-out)/auth/page.tsx     # Public auth page with full SEO

utils/
└── seo-utils.ts                   # Centralized metadata, robots config, SEO utilities

app/sitemap.ts                     # Native sitemap generation
app/robots.ts                      # Native robots.txt generation
```

## Best Practices

- **Metadata**: Unique titles; 150–160 char descriptions; include OG/Twitter
- **Performance**: Server-render content; optimize images; stable fonts
- **Indexing**: Only public pages in sitemap; use robots rules for protected areas
- **Consistency**: Use helpers for all pages; rely on layout title template

Notes:

- `sitemap.xml` and `robots.txt` are generated dynamically by Next.js
