import posthog from "posthog-js";
import { isLocalhost } from "@/utils/global-utils";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const hasPosthogKeys = posthogKey && posthogHost;

// Throw error if PostHog keys are missing in non-localhost environments
if (!isLocalhost && !hasPosthogKeys) {
  throw new Error(
    "Missing PostHog environment variables: NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST are required in non-localhost environments"
  );
}

// Only initialize PostHog in non-localhost environments
if (!isLocalhost && hasPosthogKeys) {
  posthog.init(posthogKey!, {
    api_host: posthogHost!,
    defaults: "2025-05-24",
  });
}
