import { Metadata } from "next";
import { createClient } from "@/utils/supabase/supabase-server-client";
import AllUsersCard from "@/app/(logged-in)/timeline/components/all-users-card";
import CreateTweetCard from "@/app/(logged-in)/timeline/components/create-tweet-card";
import TweetComments from "@/app/(logged-in)/timeline/components/tweet-comments";
import CreateCommentDialog from "@/app/(logged-in)/timeline/components/create-comment-dialog";
import DeleteTweetButton from "@/app/(logged-in)/timeline/components/delete-tweet-button";
import { UserInfo } from "@/app/(logged-in)/timeline/components/user-info";
import { Card, CardContent } from "@/components/ui/card";
import { Heading2, Text } from "@/components/ui/typography";
import { getCurrentUserWithProfile, getAllProfiles } from "@/data/user";
import { getTweetsForTimeline } from "@/data/tweets";
import { createPageMetadata } from "@/utils/seo-utils";
import { getAvatarUrl } from "@/utils/client-utils";

// Force dynamic rendering because this page uses cookies for authentication
// via getCurrentUserWithProfile() which calls createClient() that accesses cookies
export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata("timeline");

export default async function TimelinePage() {
  const dbClient = await createClient();
  const { user, profile } = await getCurrentUserWithProfile(dbClient);
  const tweets = await getTweetsForTimeline(dbClient);
  const allProfiles = await getAllProfiles(dbClient);

  // Throw an error if we fail to fetch data. This will trigger the error page.
  if (!user || !tweets || !allProfiles)
    throw new Error("Failed to fetch required data for timeline.");

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Content area with sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Main content area - takes up most of the screen */}
        <div className="flex-1">
          <Heading2>Timeline</Heading2>
          <CreateTweetCard profile={profile} />
          <div className="space-y-4 mt-8" data-testid="tweets-wrapper">
            {tweets.map(tweet => (
              <Card
                key={tweet.tweet_id}
                className="shadow-md border border-border/50 hover:shadow-lg transition-shadow duration-200"
                data-testid="tweet-container"
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
                    <DeleteTweetButton
                      tweetId={tweet.tweet_id!}
                      tweetUserId={tweet.tweet_user_id!}
                      currentUserId={user.id}
                    />
                  </div>

                  {/* Tweet Content */}
                  <div className="mb-2">
                    <Text className="text-lg leading-relaxed">{tweet.tweet_text}</Text>
                  </div>

                  {/* Tweet Actions */}
                  <div className="flex items-center justify-between py-2 border-t border-border/30">
                    <Text
                      size="sm"
                      variant="muted"
                      className="font-medium"
                      data-testid="comment-count"
                    >
                      {tweet.comment_count} comments
                    </Text>
                    <CreateCommentDialog
                      tweetId={tweet.tweet_id!}
                      userId={user.id}
                      profile={profile}
                    />
                  </div>

                  {/* Comments Section */}
                  {tweet.comments && Array.isArray(tweet.comments) && tweet.comments.length > 0 && (
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
            ))}
          </div>
        </div>

        {/* Sidebar with Who to Follow card */}
        <div className="lg:w-1/3 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            <AllUsersCard currentUserId={user.id} allProfiles={allProfiles} />
          </div>
        </div>
      </div>
    </div>
  );
}
