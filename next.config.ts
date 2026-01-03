import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";
import { enablePostHog } from "@/utils/global-utils";
// Throw error if PostHog keys are missing in non-localhost environments

const baseConfig: NextConfig = {
  /* config options here */

  // Image optimization and handling configuration
  images: {
    // Allow images from external domains (for avatars from Supabase Storage)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co", // Supabase storage domains
      },
    ],
  },
};

let nextConfig = baseConfig;

if (enablePostHog) {
  nextConfig = withPostHogConfig(baseConfig, {
    personalApiKey: process.env.POSTHOG_API_KEY || "", // Personal API Key
    envId: process.env.POSTHOG_ENV_ID || "", // Environment ID
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "", // (optional), defaults to https://us.posthog.com
    sourcemaps: {
      enabled: true, // (optional) Enable sourcemaps generation and upload, default to true on production builds
      deleteAfterUpload: true, // (optional) Delete sourcemaps after upload, defaults to true
    },
  });
}

export default nextConfig;
