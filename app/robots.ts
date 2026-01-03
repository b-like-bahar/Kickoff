import type { MetadataRoute } from "next";
import { routes } from "./constants";

/**
 * Generates robots.txt file for search engine crawlers
 * Controls which pages crawlers can access and where to find the sitemap
 */
export default function robots(): MetadataRoute.Robots {
  // Get the base URL from environment variables (production) or fallback to localhost (development) for local development testing
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*", // Applies to all search engine crawlers
      allow: "/", // Allow crawling of the homepage
      disallow: [
        "/api/*", // Block API endpoints
        "/admin/*", // Block admin areas
        "/errors-testing/*", // Block testing pages
        ...Object.values(routes.protectedRoutes),
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Point crawlers to our sitemap
  };
}
