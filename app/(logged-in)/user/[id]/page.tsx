import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading2, Text } from "@/components/ui/typography";
import { UserInfo } from "@/app/(logged-in)/timeline/components/user-info";
import TweetComments from "@/app/(logged-in)/timeline/components/tweet-comments";
import CreateCommentDialog from "@/app/(logged-in)/timeline/components/create-comment-dialog";
import DeleteTweetButton from "@/app/(logged-in)/timeline/components/delete-tweet-button";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { Database } from "@/types/supabase";
import { createPageMetadata, createAuthenticatedPageMetadata } from "@/utils/seo-utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUserWithProfile, getProfileByUserId } from "@/data/user";
import { getTweetsForUser } from "@/data/tweets";
import { getAvatarUrl } from "@/utils/client-utils";

// Force dynamic rendering because this page uses cookies for authentication
// via getCurrentUserWithProfile() which calls createClient() that accesses cookies
export const dynamic = "force-dynamic";

type TweetsWithComments = Database["public"]["Views"]["tweets_with_comments_view"]["Row"];

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dbClient = await createClient();

  const profile = await getProfileByUserId(id, dbClient);

  if (!profile) {
    // Return default metadata for not found case
    return createPageMetadata("userProfile");
  }

  // Create personalized metadata with user's information
  const userEmail = profile.email || "User";
  const userName = userEmail.split("@")[0]; // Extract username from email

  return createAuthenticatedPageMetadata(
    `${userName}'s Profile`,
    `View ${userName}'s profile and tweets. See their latest posts and activity.`
  );
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const dbClient = await createClient();
  const { user } = await getCurrentUserWithProfile(dbClient);
  const profile = await getProfileByUserId(id, dbClient);
  if (!profile) return notFound();
  const userTweets = await getTweetsForUser(id, dbClient);

  // Throw an error if we fail to fetch data. This will trigger the error page.
  if (!user || !profile || !userTweets) throw new Error("Failed to fetch user data");

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Main content area - tweets */}
        <div className="flex-1">
          <div className="space-y-4">
            {userTweets.length === 0 ? (
              <Card className="shadow-md border border-border/50">
                <CardContent className="p-8 text-center">
                  <Text variant="muted">No tweets yet</Text>
                </CardContent>
              </Card>
            ) : (
              userTweets.map((tweet: TweetsWithComments) => (
                <Card
                  key={tweet.tweet_id}
                  className="shadow-md border border-border/50 hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="p-4">
                    {/* Tweet Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <UserInfo
                          avatar={getAvatarUrl(tweet.tweet_author_avatar)}
                          name={tweet.tweet_author_email || "User"}
                          testId="tweet-author-avatar"
                        />
                        <Text size="sm" variant="muted">
                          {tweet.tweet_created_at
                            ? new Date(tweet.tweet_created_at).toLocaleString()
                            : ""}
                        </Text>
                      </div>
                      {user.id === tweet.tweet_user_id && (
                        <DeleteTweetButton
                          tweetId={tweet.tweet_id!}
                          tweetUserId={tweet.tweet_user_id!}
                          currentUserId={user.id}
                        />
                      )}
                    </div>

                    {/* Tweet Content */}
                    <div className="mb-2">
                      <Text className="text-lg leading-relaxed">{tweet.tweet_text}</Text>
                    </div>

                    {/* Tweet Actions */}
                    <div className="flex items-center justify-between py-2 border-t border-border/30">
                      <Text size="sm" variant="muted" className="font-medium">
                        {tweet.comment_count} comments
                      </Text>
                      {user.id === id && (
                        <CreateCommentDialog
                          tweetId={tweet.tweet_id!}
                          userId={user.id}
                          profile={profile}
                        />
                      )}
                    </div>

                    {/* Comments Section */}
                    {tweet.comments &&
                      Array.isArray(tweet.comments) &&
                      tweet.comments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/30 space-y-2">
                          <Text size="sm" variant="muted" className="font-medium mb-1">
                            Comments
                          </Text>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {tweet.comments.map((comment: any) => (
                            <TweetComments
                              key={comment.id}
                              comment={{
                                id: comment.id,
                                comment_text: comment.comment_text,
                                user_id: comment.user_id,
                                user_email: comment.user_email,
                                user_avatar: comment.user_avatar,
                              }}
                              currentUserId={user.id}
                            />
                          ))}
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar with user info */}
        <div className="lg:w-1/3 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            <Card className="shadow-md border border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Heading2>Profile</Heading2>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <UserInfo
                    avatar={getAvatarUrl(profile.avatar_url)}
                    name={profile.email || "User"}
                    username={profile.email || "user@example.com"}
                    testId="profile-avatar"
                  />

                  <div>
                    <Text className="font-semibold mb-1">Email:</Text>
                    <Text variant="muted">{profile.email || "No email available"}</Text>
                  </div>

                  <div>
                    <Text className="font-semibold mb-1">Member since:</Text>
                    <Text variant="muted">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "Unknown"}
                    </Text>
                  </div>

                  <div>
                    <Text className="font-semibold mb-1">Tweets:</Text>
                    <Text variant="muted">{userTweets.length}</Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
