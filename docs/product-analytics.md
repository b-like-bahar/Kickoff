# Product Analytics with PostHog

Product analytics helps you understand how users interact with your application at a granular level. Unlike web analytics (which provides high-level website metrics), product analytics focuses on tracking identified and anonymous users and their specific interactions with your product features.

## What You Can Do

- **Build custom dashboards** to track your most important metrics
- **Analyze user behavior patterns** and identify trends
- **Track user onboarding funnels** to see where people drop off
- **Measure feature engagement** and user retention
- **Understand user journeys** through your product

## Our PostHog Integration

This project uses [PostHog](https://posthog.com/) for comprehensive product analytics with server-side tracking and automatic user identification.

**Why Server-Side?** All analytics are captured server-side to avoid client-side tracking issues. Client-side analytics would require a reverse proxy setup to handle CORS and cookie management properly. Server-side tracking ensures reliable data collection without these complications.

## Analytics Events

Our implementation covers all major user interactions:

### Authentication Events

```typescript
USER_SIGNED_UP: {
  signupMethod: "email";
}
USER_SIGNED_IN: {
  signinMethod: "email";
}
GOOGLE_AUTH_SUCCESS: {
  authProvider: "google";
}
EMAIL_CONFIRMED: {
  confirmationType: "signup";
}
```

### Content Events

```typescript
TWEET_CREATED: { userId: "user-uuid", tweetId: "tweet-uuid" }
COMMENT_CREATED: { userId: "user-uuid", commentId: "comment-uuid", tweetId: "tweet-uuid" }
TWEET_DELETED: { userId: "user-uuid", tweetId: "tweet-uuid" }
COMMENT_DELETED: { userId: "user-uuid", commentId: "comment-uuid", tweetId: "tweet-uuid" }
```

### Page Views

```typescript
TIMELINE_VIEWED: { userId: "user-uuid", profilesCount: 25 }
USER_PROFILE_VIEWED: { viewerUserId: "viewer-uuid", viewedUserId: "profile-uuid", isOwnProfile: false }
SETTINGS_VIEWED: { userId: "user-uuid" }
```

## Implementation

### Server Actions

```typescript
import { captureServerEvent, ANALYTICS_EVENTS } from "@/utils/posthog-server";

export async function createTweetAction(formData: FormData) {
  // ... business logic ...

  captureServerEvent(ANALYTICS_EVENTS.TWEET_CREATED, {
    userId: tweet.user_id,
    tweetId: tweet.id,
  });

  return { data: tweet, error: null };
}
```

### Page Components

```typescript
export default async function TimelinePage() {
  // ... data fetching ...

  await captureServerEvent(ANALYTICS_EVENTS.TIMELINE_VIEWED, {
    userId: user.id,
    profilesCount: allProfiles.length
  });

  return (/* JSX */);
}
```

## Setup

1. **Environment Variables** (`.env`):

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

2. **Create PostHog project** and copy your API key
3. **Analytics are automatically disabled** in localhost environments

## Key Metrics to Track

- **User Acquisition**: Sign-up completion rates, email confirmation rates
- **Engagement**: Tweet/comment creation patterns, page view frequency
- **Retention**: User activity over time, feature adoption rates
- **User Journey**: Landing page → Auth → Timeline → Profile creation

## Best Practices

- Use consistent, descriptive event names
- Include relevant context without over-tracking
- Analytics failures should never break user experience
- Focus on actionable metrics that drive product decisions

For more advanced features, check out the [PostHog documentation](https://posthog.com/docs).
