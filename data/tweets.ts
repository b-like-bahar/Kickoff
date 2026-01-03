"use server";

import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { db } from "@/db";
import { tryCatch } from "@/utils/global-utils";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { logger } from "@/utils/logger";

export const getTweetsForTimeline = async (dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.tweets.getTweetsForTimeline(dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const getTweetsForUser = async (userId: string, dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.tweets.getTweetsForUser(userId, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const createTweet = async (tweetText: string, _dbClient?: SupabaseClient<Database>) => {
  const dbClient = _dbClient || (await createClient());
  const {
    data: { user },
  } = await dbClient.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await tryCatch(db.tweets.createTweet(tweetText, user?.id, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const deleteTweet = async (tweetId: string, dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.tweets.deleteTweet(tweetId, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const updateTweet = async (
  tweetId: string,
  tweetText: string,
  dbClient?: SupabaseClient<Database>
) => {
  const { data, error } = await tryCatch(db.tweets.updateTweet(tweetId, tweetText, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const createComment = async (
  commentText: string,
  tweetId: string,
  userId: string,
  dbClient?: SupabaseClient<Database>
) => {
  const { data, error } = await tryCatch(
    db.tweets.createComment(commentText, tweetId, userId, dbClient)
  );
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const deleteComment = async (commentId: string, dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.tweets.deleteComment(commentId, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};
