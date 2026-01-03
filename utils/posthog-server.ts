import { PostHog } from "posthog-node";
import { isLocalhost } from "@/utils/global-utils";
import { cookies } from "next/headers";
import { logger } from "./logger";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const hasPosthogKeys = Boolean(posthogKey && posthogHost);

// Event names constants
export const ANALYTICS_EVENTS = {
  // Authentication Events
  USER_SIGNED_UP: "user_signed_up",
  USER_SIGNED_IN: "user_signed_in",
  USER_SIGNED_OUT: "user_signed_out",
  GOOGLE_AUTH_SUCCESS: "google_auth_success",
  EMAIL_CONFIRMED: "email_confirmed",

  // User Management Events
  PASSWORD_UPDATED: "password_updated",
  ACCOUNT_DELETED: "account_deleted",

  // Content Creation Events
  TWEET_CREATED: "tweet_created",
  TWEET_DELETED: "tweet_deleted",
  COMMENT_CREATED: "comment_created",
  COMMENT_DELETED: "comment_deleted",
  AVATAR_UPDATED: "avatar_updated",
  AVATAR_DELETED: "avatar_deleted",
} as const;

// Extract the event names as a union type
export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// PostHog singleton instance for server-side usage
let posthogInstance: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  if (!hasPosthogKeys) return null;

  // Initialize PostHog if not already initialized
  if (!posthogInstance) {
    posthogInstance = new PostHog(posthogKey!, {
      host: posthogHost!,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogInstance;
}

async function getDistinctId() {
  const cookieStore = await cookies();
  const cookieName = "ph_" + process.env.NEXT_PUBLIC_POSTHOG_KEY + "_posthog";
  const cookieValue = cookieStore.get(cookieName)?.value;
  return cookieValue ? JSON.parse(cookieValue).distinct_id : "placeholder";
}

export async function captureServerEvent(
  eventName: AnalyticsEventName,
  properties: Record<string, string | number | boolean>
) {
  if (isLocalhost) {
    logger.info(`Skipping analytics capture for event ${eventName}, reason: localhost`);
    return;
  }
  if (!hasPosthogKeys) return;

  try {
    const distinctId = await getDistinctId();

    const posthog = getPostHogServer();
    if (!posthog) return;

    posthog?.capture({
      distinctId,
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Silently fail analytics if there's an error (e.g., cookie parsing issues)
    logger.error("Analytics capture failed:", error);
  }
}

export async function captureServerError(error: Error) {
  if (isLocalhost) {
    logger.info(`Skipping analytics capture for error ${error.message}, reason: localhost`);
    return;
  }
  if (!hasPosthogKeys) return;
  try {
    const distinctId = await getDistinctId();

    const posthog = getPostHogServer();
    if (!posthog) return;

    logger.error(error, error.message);
    await posthog?.captureException(error, distinctId, {
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Silently fail analytics if there's an error (e.g., cookie parsing issues)
    logger.error("Error capturing error event:", error);
  }
}
