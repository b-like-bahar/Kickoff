import type { MetadataRoute } from "next";

/**
 * Generates sitemap.xml file for search engines
 * Lists all public pages that should be indexed by crawlers
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Get the base URL from environment variables (production) or fallback to localhost (development) for local development testing
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return [
    {
      url: baseUrl, // Homepage - highest priority for SEO
      lastModified: new Date(),
      changeFrequency: "monthly", // Homepage content may change monthly
      priority: 1, // Maximum priority (1.0)
    },
    {
      url: `${baseUrl}/auth`, // Authentication page - important for user acquisition
      lastModified: new Date(),
      changeFrequency: "monthly", // Auth page content may change monthly
      priority: 0.8, // High priority but below homepage
    },
  ];
}
