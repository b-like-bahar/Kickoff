"use server";

import { ActionResponse, formatActionErrorMessage } from "@/utils/actions-utils";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/constants";
import { tryCatch } from "@/utils/global-utils";
import { Comment, Tweet } from "@/db/db-tweets";
import { Profile } from "@/db/db-users";
import { createTweet, deleteComment, createComment, deleteTweet } from "@/data/tweets";
import { getAllProfiles } from "@/data/user";
import { tweetFormSchema, commentFormSchema } from "@/utils/validators";
import { flattenValidationErrors } from "@/utils/server-utils";
import { captureServerEvent, ANALYTICS_EVENTS, captureServerError } from "@/utils/posthog-server";

export async function createTweetAction(formData: FormData): ActionResponse<Tweet> {
  const validatedFields = tweetFormSchema.safeParse({
    tweet_text: formData.get("tweet_text"),
  });

  if (!validatedFields.success) {
    await captureServerError(new Error("Tweet creation failed"));
    return {
      data: null,
      error: flattenValidationErrors(validatedFields.error),
    };
  }

  const { error, data: tweet } = await tryCatch(createTweet(validatedFields.data.tweet_text));

  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  captureServerEvent(ANALYTICS_EVENTS.TWEET_CREATED, {
    userId: tweet.user_id,
    tweetId: tweet.id,
  });

  revalidatePath(routes.protectedRoutes.timeline);
  return {
    data: tweet,
    error: null,
  };
}

export async function getAllProfilesAction(): ActionResponse<Profile[]> {
  const { error, data: profiles } = await tryCatch(getAllProfiles());

  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  return {
    data: profiles,
    error: null,
  };
}

export async function deleteCommentAction(formData: FormData): ActionResponse<Comment> {
  const commentId = formData.get("commentId");
  if (!commentId || typeof commentId !== "string" || commentId.trim() === "") {
    await captureServerError(new Error("Invalid comment ID provided when deleting comment"));
    return {
      data: null,
      error: "Invalid comment ID provided",
    };
  }

  const { error, data: comment } = await tryCatch(deleteComment(commentId));

  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  captureServerEvent(ANALYTICS_EVENTS.COMMENT_DELETED, {
    userId: comment.user_id,
    commentId: comment.id,
    tweetId: comment.tweet_id,
  });

  revalidatePath(routes.protectedRoutes.timeline);
  return {
    data: comment,
    error: null,
  };
}

export async function createCommentAction(formData: FormData): ActionResponse<Comment> {
  const validatedFields = commentFormSchema.safeParse({
    comment_text: formData.get("comment_text"),
  });

  if (!validatedFields.success) {
    await captureServerError(new Error("Comment creation failed due to validation errors"));
    return {
      data: null,
      error: flattenValidationErrors(validatedFields.error),
    };
  }

  const tweetId = formData.get("tweetId");
  const userId = formData.get("userId");

  if (!tweetId || typeof tweetId !== "string" || tweetId.trim() === "") {
    await captureServerError(new Error("Invalid tweet ID provided when creating comment"));
    return {
      data: null,
      error: "Invalid tweet ID provided",
    };
  }

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    await captureServerError(new Error("Invalid user ID provided when creating comment"));
    return {
      data: null,
      error: "Invalid user ID provided",
    };
  }

  const { error, data: comment } = await tryCatch(
    createComment(validatedFields.data.comment_text, tweetId, userId)
  );

  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  captureServerEvent(ANALYTICS_EVENTS.COMMENT_CREATED, {
    userId: comment.user_id,
    commentId: comment.id,
    tweetId: comment.tweet_id,
  });

  revalidatePath(routes.protectedRoutes.timeline);
  return {
    data: comment,
    error: null,
  };
}

export async function deleteTweetAction(formData: FormData): ActionResponse<Tweet> {
  const tweetId = formData.get("tweetId");
  if (!tweetId || typeof tweetId !== "string" || tweetId.trim() === "") {
    await captureServerError(new Error("Invalid tweet ID provided when deleting tweet"));
    return {
      data: null,
      error: "Invalid tweet ID provided",
    };
  }

  const { error, data: tweet } = await tryCatch(deleteTweet(tweetId));

  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  captureServerEvent(ANALYTICS_EVENTS.TWEET_DELETED, {
    userId: tweet.user_id,
    tweetId: tweet.id,
  });

  revalidatePath(routes.protectedRoutes.timeline);
  return {
    data: tweet,
    error: null,
  };
}
