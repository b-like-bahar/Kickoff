import { type Instrumentation } from "next";
import { enablePostHog } from "@/utils/global-utils";

export function register() {}

export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  // Only use PostHog in non-localhost environments
  if (process.env.NEXT_RUNTIME === "nodejs" && enablePostHog) {
    const { getPostHogServer } = require("./utils/posthog-server");
    const posthog = await getPostHogServer();

    // Safely get headers with fallbacks - treat headers as a plain object
    const sessionId = request?.headers?.["X-POSTHOG-SESSION-ID"] || null;
    const distinctId = request?.headers?.["X-POSTHOG-DISTINCT-ID"] || null;

    await posthog.captureException(err, distinctId || undefined, { $session_id: sessionId });
  }
};
