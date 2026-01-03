/**
 * SEO metadata utilities for Next.js pages
 *
 * Provides centralized metadata management with reusable configurations
 * for titles, robots, OpenGraph, and Twitter cards.
 *
 * @example
 * // Standard page
 * export const metadata = createPageMetadata("auth")
 *
 * // Dynamic authenticated page
 * export const metadata = createAuthenticatedPageMetadata("Profile", "User profile page")
 */
import type { Metadata } from "next";

export const appConstants = {
  appName: "Kickoff",
  appDescription:
    "Production-ready Next.js starter template with authentication, database, UI components, and best practices. Ship your SaaS, web app, or startup faster with this comprehensive boilerplate.",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  twitterHandle: "@kickoff",
  keywords: [
    "kickoff",
    "kickoff-template",
    "nextjs",
    "template",
    "starter",
    "boilerplate",
    "saas",
    "developer tools",
    "web development",
    "react",
    "typescript",
  ],
  author: "Deepflow Labs",
};

// Base OpenGraph and Twitter configurations to reduce duplication
const baseOpenGraph = {
  type: "website",
  url: appConstants.appUrl,
  siteName: appConstants.appName,
};

const baseTwitter = {
  card: "summary_large_image" as const,
  creator: appConstants.twitterHandle,
};

// Page-specific metadata - only store what's unique per page
export const pageMetadata = {
  home: {
    title: "Ship Your Project Faster",
    description:
      "Production-ready Next.js template with authentication, database, and UI components. Build your SaaS, web app, or startup in days, not weeks. TypeScript, Tailwind CSS, and modern best practices included.",
    robots: {
      index: true,
      follow: true,
    },
  },
  auth: {
    title: "Sign In",
    description: "Sign in to your account and start building with our Kickoff app.",
    robots: {
      index: true, // Auth pages should be discoverable
      follow: true,
    },
  },
  // Authenticated pages - minimal SEO as per review suggestion
  timeline: {
    title: "Timeline",
    description: "View and interact with the timeline in our Kickoff app.",
  },
  userProfile: {
    title: "User Profile",
    description: "View user profile and tweets in our Kickoff app.",
  },
  settings: {
    title: "Settings",
    description: "Manage your account settings and preferences.",
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
    robots: {
      index: false, // 404 pages shouldn't be indexed
      follow: true, // But do follow links
    },
  },
  confirmationPage: {
    title: "Email Confirmation",
    description: "Confirm your email address to complete your account setup.",
    robots: {
      index: false, // Confirmation pages shouldn't be indexed
      follow: true, // But can follow links
    },
  },
} as const;

// Simplified metadata creation function
export const createPageMetadata = (
  pageKey: keyof typeof pageMetadata,
  overrides: Partial<Metadata> = {}
): Metadata => {
  const page = pageMetadata[pageKey];
  const title = page.title; // Layout template will append the brand suffix

  const { openGraph: ogOverrides, twitter: twOverrides, ...restOverrides } = overrides;

  return {
    title,
    description: page.description,
    openGraph: {
      ...baseOpenGraph,
      title,
      description: page.description,
      ...(ogOverrides ?? {}),
    },
    twitter: {
      ...baseTwitter,
      title,
      description: page.description,
      ...(twOverrides ?? {}),
    },
    ...("robots" in page && page.robots && { robots: page.robots }),
    ...restOverrides,
  };
};

// Base metadata applied at the root layout.
// Provides a title template and complete OpenGraph/Twitter/robots defaults
// so every page inherits consistent SEO settings. Pages can fully override
// fields via their own metadata returned by the helpers below.
// Layout metadata for the root layout
export const layoutMetadata = {
  title: {
    default: appConstants.appName,
    template: `%s | ${appConstants.appName}`,
  },
  description: appConstants.appDescription,
  keywords: appConstants.keywords,
  authors: [{ name: appConstants.author }],
  creator: appConstants.author,
  openGraph: {
    ...baseOpenGraph,
    locale: "en_US",
    title: appConstants.appName,
    description: appConstants.appDescription,
  },
  twitter: {
    ...baseTwitter,
    title: appConstants.appName,
    description: appConstants.appDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
};

// Helper for dynamic/authenticated pages where title/description are computed
// at runtime. It returns a complete metadata object while relying
// on the root layout's title template for brand suffixing.
// Simplified helper functions
export const createAuthenticatedPageMetadata = (
  title: string,
  description: string,
  overrides: Partial<Metadata> = {}
): Metadata => {
  const { openGraph: ogOverrides, twitter: twOverrides, ...restOverrides } = overrides;
  return {
    title, // Layout template will append the brand suffix
    description,
    openGraph: {
      ...baseOpenGraph,
      title,
      description,
      ...(ogOverrides ?? {}),
    },
    twitter: {
      ...baseTwitter,
      title,
      description,
      ...(twOverrides ?? {}),
    },
    ...restOverrides,
  };
};
