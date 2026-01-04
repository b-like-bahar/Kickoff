"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tweetFormSchema, type TweetFormType } from "@/utils/validators";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { UserInfo } from "@/app/(logged-in)/timeline/components/user-info";
import { useTransition } from "react";
import { createTweetAction } from "@/app/(logged-in)/timeline/timeline-actions";
import { toast } from "@/utils/toast";
import { Database } from "@/types/supabase";
import { getAvatarUrl } from "@/utils/client-utils";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function CreateTweetCard({ profile }: { profile: Profile }) {
  const [pending, startTransaction] = useTransition();

  const form = useForm<TweetFormType>({
    resolver: zodResolver(tweetFormSchema),
    defaultValues: {
      tweet_text: "",
    },
  });

  const tweetText = useWatch({ control: form.control, name: "tweet_text" });
  const characterCount = 280 - (tweetText?.length || 0);

  const onSubmit = async (data: TweetFormType) => {
    const formData = new FormData();
    formData.append("tweet_text", data.tweet_text);

    startTransaction(async () => {
      const { error } = await createTweetAction(formData);
      if (error) {
        toast({
          type: "error",
          message: error,
        });
      } else {
        form.reset();
        toast({
          type: "success",
          message: "Tweet created successfully",
        });
      }
    });
  };

  return (
    <Card
      className="shadow-lg border-2 border-primary/10 bg-gradient-to-br from-background to-muted/20"
      data-testid="tweet-create-card"
    >
      <CardContent className="p-4">
        <Form {...form}>
          <form
            onSubmit={event => {
              void form.handleSubmit(onSubmit)(event);
            }}
          >
            <div className="flex">
              <UserInfo
                avatar={getAvatarUrl(profile.avatar_url)}
                name={profile.email || "User"}
                showOnlyAvatar
                className="mt-1"
                testId="tweet-create-author-avatar"
              />
              <FormField
                control={form.control}
                name="tweet_text"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="What's happening?"
                        className="min-h-[100px] resize-none shadow-none border-0 focus-visible:ring-0 text-lg placeholder:text-muted-foreground/70"
                        {...field}
                        onChange={e => {
                          const text = e.target.value;
                          if (text.length <= 280) {
                            field.onChange(text);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/50 mt-2">
              <Text size="sm" variant="muted" className="font-medium">
                {characterCount} characters remaining
              </Text>
              <Button
                type="submit"
                disabled={characterCount === 0 || characterCount === 280 || pending}
                className="px-6 py-2 font-semibold"
              >
                {pending ? "Posting..." : "Tweet"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
