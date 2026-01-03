import { createClient } from "@/utils/supabase/supabase-server-client";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export type TweetsWithComments = Database["public"]["Views"]["tweets_with_comments_view"]["Row"];
export type Tweet = Database["public"]["Tables"]["tweets"]["Row"];
export type Comment = Database["public"]["Tables"]["tweet_comments"]["Row"];

async function getTweetsForTimeline(
  dbClient?: SupabaseClient<Database>
): Promise<TweetsWithComments[]> {
  const db = dbClient || (await createClient());
  const { data, error } = await db
    .from("tweets_with_comments_view")
    .select("*")
    .order("tweet_created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function getTweetsForUser(
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<TweetsWithComments[]> {
  const db = dbClient || (await createClient());
  const { data, error } = await db
    .from("tweets_with_comments_view")
    .select("*")
    .eq("tweet_user_id", userId)
    .order("tweet_created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function createTweet(
  tweetText: string,
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<Tweet> {
  const db = dbClient || (await createClient());

  const { error, data } = await db
    .from("tweets")
    .insert([{ tweet_text: tweetText, user_id: userId }])
    .select()
    .single();

  if (error || !data) {
    throw error;
  }

  return data;
}

async function deleteTweet(tweetId: string, dbClient?: SupabaseClient<Database>): Promise<Tweet> {
  const db = dbClient || (await createClient());
  const { error, data } = await db.from("tweets").delete().eq("id", tweetId).select().single();

  if (error || !data) {
    throw error;
  }

  return data;
}

async function updateTweet(
  tweetId: string,
  tweetText: string,
  dbClient?: SupabaseClient<Database>
): Promise<Tweet> {
  const db = dbClient || (await createClient());
  const { error, data } = await db
    .from("tweets")
    .update({ tweet_text: tweetText })
    .eq("id", tweetId)
    .select()
    .single();

  if (error || !data) {
    throw error;
  }

  return data;
}

async function createComment(
  commentText: string,
  tweetId: string,
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<Comment> {
  const db = dbClient || (await createClient());
  const { error, data } = await db
    .from("tweet_comments")
    .insert([
      {
        comment_text: commentText,
        tweet_id: tweetId,
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    throw error;
  }

  return data;
}

async function deleteComment(
  commentId: string,
  dbClient?: SupabaseClient<Database>
): Promise<Comment> {
  const db = dbClient || (await createClient());
  const { error, data } = await db
    .from("tweet_comments")
    .delete()
    .eq("id", commentId)
    .select()
    .single();

  if (error || !data) {
    throw error;
  }

  return data;
}

export const tweetsDb = {
  getTweetsForTimeline,
  getTweetsForUser,
  createTweet,
  deleteTweet,
  updateTweet,
  createComment,
  deleteComment,
};
